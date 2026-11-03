<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
$action = $_GET['action'] ?? '';
if ($action === 'status') {
    if ($authenticated) $_SESSION['last_seen'] = time();
    reply(['authenticated'=>$authenticated,'csrf'=>$_SESSION['csrf']]);
}
if ($action === 'login') {
    requirePost();
    $body = json_decode(file_get_contents('php://input', false, null, 0, 1024), true);
    $pin = is_array($body) && is_string($body['pin'] ?? null) ? $body['pin'] : '';
    require_once __DIR__ . '/pin-auth.php';
    verifyPin($pin);
    $now = time();
    session_regenerate_id(true);
    $_SESSION = ['csrf'=>bin2hex(random_bytes(32)), 'authenticated'=>true,'created'=>$now,'last_seen'=>$now,'pin_version'=>hash('sha256',$config['pin_hash'])];
    reply(['ok'=>true]);
}
if ($action === 'logout') {
    requirePost();
    $_SESSION = []; session_destroy();
    setcookie(session_name(),'', ['expires'=>time()-3600,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Strict']);
    reply(['ok'=>true]);
}
requireAuth();
if ($action !== 'catalog') reply(['error'=>'찾을 수 없는 기능입니다.'],404);
if ($_SERVER['REQUEST_METHOD'] !== 'GET') reply(['error'=>'허용되지 않은 요청입니다.'],405);
$path = realpath($private . '/catalog.json');
if (!$path || !str_starts_with($path,$private . DIRECTORY_SEPARATOR)) reply(['error'=>'등록된 단가표가 없습니다.'],404);
try {
    $catalog = json_decode(file_get_contents($path),true,512,JSON_THROW_ON_ERROR);
    if (!is_array($catalog) || ($catalog['schema_version'] ?? 0)!==1 || !is_array($catalog['items'] ?? null)) throw new RuntimeException();
    $ids=[];
    foreach($catalog['items'] as $item) {
        if (!is_array($item) || !is_string($item['id'] ?? null) || isset($ids[$item['id']]) || !is_string($item['maker'] ?? null) || !is_string($item['model'] ?? null)
            || !in_array($item['price_type'] ?? '', ['list','purchase'],true) || ($item['currency'] ?? '')!=='KRW' || ($item['vat'] ?? '')!=='excluded'
            || !in_array($item['status'] ?? '', ['available','inquiry','unavailable'],true)
            || (($item['status'] ?? '')==='available' && (!is_int($item['price_krw'] ?? null) || $item['price_krw'] <= 0))) throw new RuntimeException();
        $ids[$item['id']]=true;
    }
    reply($catalog);
} catch(Throwable $e) { reply(['error'=>'단가표 형식을 확인해 주세요. 가격은 원 단위 정수로 등록해야 합니다.'],503); }
