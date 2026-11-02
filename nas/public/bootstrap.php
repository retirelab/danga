<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
header('X-Frame-Options: DENY');

function reply(array $body, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}
function setupError(): never { reply(['error'=>'NAS 비공개 폴더와 설정 파일을 먼저 설치해 주세요.'], 503); }
$private = realpath(getenv('DANGA_PRIVATE_DIR') ?: '/volume1/danga-private');
$webRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) ?: __DIR__;
if (!$private || $private === $webRoot || str_starts_with($private, $webRoot . DIRECTORY_SEPARATOR)) setupError();
if (!is_file($private . '/config.php')) setupError();
$config = require $private . '/config.php';
if (!is_array($config) || empty($config['pin_hash']) || strlen($config['pin_hash']) < 50) setupError();
$stateDir = $private . '/state';
if ((!is_dir($stateDir) && !mkdir($stateDir, 0700, true)) || !is_writable($stateDir)) setupError();
$sessionDir = $stateDir . '/sessions';
if (!is_dir($sessionDir) && !mkdir($sessionDir, 0700, true)) setupError();
$secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
// Never trust X-Forwarded-Proto from arbitrary clients. Configure HTTPS at Web Station.
if (!$secure && empty($config['allow_http_local_test'])) reply(['error'=>'HTTPS 주소로 접속해 주세요.'], 400);
ini_set('session.use_strict_mode','1');
ini_set('session.use_only_cookies','1');
ini_set('session.gc_maxlifetime', '28800');
session_save_path($sessionDir);
session_name('danga_session');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Strict']);
if (!session_start()) setupError();
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
$now = time();
$authenticated = !empty($_SESSION['authenticated'])
    && $now - ($_SESSION['last_seen'] ?? 0) < 1800
    && $now - ($_SESSION['created'] ?? 0) < 28800
    && hash_equals($_SESSION['pin_version'] ?? '', hash('sha256', $config['pin_hash']));
if (!$authenticated) unset($_SESSION['authenticated']);
function requireAuth(): void {
    global $authenticated;
    if (!$authenticated) reply(['error'=>'로그인이 필요하거나 만료되었습니다.'],401);
    $_SESSION['last_seen'] = time();
}
function requirePost(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(['error'=>'허용되지 않은 요청입니다.'],405);
    if (!hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) reply(['error'=>'요청 확인에 실패했습니다. 새로고침해 주세요.'],403);
}
