<?php
declare(strict_types=1);
// Shared by cookie and embedded clients; a new browser cannot reset failures.
function verifyPin(string $pin): void {
    global $stateDir, $config;
    $handle = fopen($stateDir . '/login-attempts.json', 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) setupError();
    $state = json_decode(stream_get_contents($handle), true);
    if (!is_array($state)) $state = ['attempts'=>[], 'blocked_until'=>0];
    $now = time();
    if (($state['blocked_until'] ?? 0) > $now) {
        header('Retry-After: ' . ($state['blocked_until'] - $now));
        flock($handle, LOCK_UN); fclose($handle);
        reply(['error'=>'반복 입력으로 잠겼습니다. 15분 후 다시 시도해 주세요.'],429);
    }
    $ok = preg_match('/^[0-9]{4}$/D', $pin) && password_verify($pin, $config['pin_hash']);
    $attempts = array_values(array_filter($state['attempts'] ?? [], fn($t)=>is_int($t) && $t>$now-900));
    if (!$ok) $attempts[]=$now;
    $state = ['attempts'=>$ok ? [] : $attempts,'blocked_until'=>!$ok && count($attempts)>=5 ? $now+900 : 0];
    rewind($handle); ftruncate($handle,0); fwrite($handle,json_encode($state)); fflush($handle);
    flock($handle,LOCK_UN); fclose($handle);
    if (!$ok) reply(['error'=>count($attempts)>=5 ? '5회 입력 실패로 15분간 잠겼습니다.' : '비밀번호가 일치하지 않습니다.'],count($attempts)>=5 ? 429 : 401);
}
