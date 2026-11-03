<?php
declare(strict_types=1);
define('DANGA_SERVICE', true);
require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/pin-auth.php';
// This API is called only by NAS-hosted widget.js. No CORS or third-party cookies.

$serviceOrigin = $config['service_origin'] ?? 'https://danga.onsnas83.diskstation.me';
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== $serviceOrigin) reply(['error'=>'허용되지 않은 출처입니다.'],403);
$action = $_GET['action'] ?? '';
$tokenDir=$stateDir.'/tokens';
if (!is_dir($tokenDir) && !mkdir($tokenDir,0700,true)) setupError();
if ($action==='login') {
    if ($_SERVER['REQUEST_METHOD']!=='POST' || ($_SERVER['HTTP_ORIGIN'] ?? '')!==$serviceOrigin || !str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) reply(['error'=>'허용되지 않은 요청입니다.'],403);
    $body=json_decode(file_get_contents('php://input',false,null,0,1024),true);
    verifyPin(is_array($body) && is_string($body['pin'] ?? null) ? $body['pin'] : '');
    $token=bin2hex(random_bytes(32));
    $record=['tab_session'=>true,'created'=>time(),'last_seen'=>time(),'version'=>hash('sha256',$config['pin_hash'])];
    if (file_put_contents($tokenDir.'/'.hash('sha256',$token).'.json',json_encode($record),LOCK_EX)===false) setupError();
    // Prune expired token records; never store the raw token on disk or in a URL.
    foreach (glob($tokenDir.'/*.json') ?: [] as $old) if (filemtime($old)<time()-28800) { $legacy=json_decode(file_get_contents($old),true); if(empty($legacy['tab_session'])) unlink($old); }
    reply(['token'=>$token,'tab_session'=>true]);
}
$authorization=$_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!preg_match('/^Bearer ([a-f0-9]{64})$/D',$authorization,$parts)) reply(['error'=>'단가표 잠금을 해제해 주세요.'],401);
$tokenFile=$tokenDir.'/'.hash('sha256',$parts[1]).'.json';
$handle=is_file($tokenFile) ? fopen($tokenFile,'r+') : false;
if (!$handle || !flock($handle,LOCK_EX)) reply(['error'=>'로그인이 만료되었습니다.'],401);
$record=json_decode(stream_get_contents($handle),true);
$valid=is_array($record) && (!empty($record['tab_session']) || (time()-($record['last_seen'] ?? 0)<1800 && time()-($record['created'] ?? 0)<28800)) && hash_equals($record['version'] ?? '',hash('sha256',$config['pin_hash']));
if (!$valid) {flock($handle,LOCK_UN);fclose($handle);unlink($tokenFile);reply(['error'=>'로그인이 만료되었습니다.'],401);}
if ($action==='logout') {
    if ($_SERVER['REQUEST_METHOD']!=='POST') reply(['error'=>'허용되지 않은 요청입니다.'],405);
    // Invalidate in place before removing, so concurrent readers see revocation.
    rewind($handle);ftruncate($handle,0);fflush($handle);flock($handle,LOCK_UN);fclose($handle);unlink($tokenFile);reply(['ok'=>true]);
}
$record['last_seen']=time();rewind($handle);ftruncate($handle,0);fwrite($handle,json_encode($record));fflush($handle);flock($handle,LOCK_UN);fclose($handle);
if ($_SERVER['REQUEST_METHOD']!=='GET') reply(['error'=>'허용되지 않은 요청입니다.'],405);
if ($action==='status') reply(['authenticated'=>true]);

function documents(): array {
    global $private;
    $path=realpath($private.'/documents.json');
    if (!$path) return [];
    if (!str_starts_with($path,$private.DIRECTORY_SEPARATOR)) throw new RuntimeException();
    $data=json_decode(file_get_contents($path),true,512,JSON_THROW_ON_ERROR);
    if (!is_array($data) || !is_array($data['documents'] ?? null)) throw new RuntimeException();
    $ids=[];
    foreach($data['documents'] as $doc) {
        if (!is_array($doc) || !preg_match('/^[a-zA-Z0-9_-]{1,80}$/D',$doc['id'] ?? '') || isset($ids[$doc['id']]) || !is_string($doc['title'] ?? null) || !is_string($doc['file'] ?? null) || !is_int($doc['pages'] ?? null) || $doc['pages']<1 || !preg_match('/^[a-f0-9]{64}$/D',$doc['sha256'] ?? '')) throw new RuntimeException();
        $ids[$doc['id']]=true;
    }
    return $data['documents'];
}
function catalogData(): array {
    global $private;
    $path=realpath($private.'/catalog.json');
    if (!$path || !str_starts_with($path,$private.DIRECTORY_SEPARATOR)) throw new RuntimeException();
    $data=json_decode(file_get_contents($path),true,512,JSON_THROW_ON_ERROR);
    if (!is_array($data) || ($data['schema_version'] ?? 0)!==1 || !is_array($data['items'] ?? null)) throw new RuntimeException();
    $ids=[];
    foreach($data['items'] as $i) {
        if (!is_array($i) || !is_string($i['id'] ?? null) || isset($ids[$i['id']]) || !is_string($i['maker'] ?? null) || !is_string($i['model'] ?? null) || !is_string($i['spec'] ?? null) || !in_array($i['price_type'] ?? '',['list','purchase'],true) || ($i['currency'] ?? '')!=='KRW' || ($i['vat'] ?? '')!=='excluded' || !in_array($i['status'] ?? '',['available','inquiry','unavailable'],true) || ($i['status']==='available' && (!is_int($i['price_krw'] ?? null) || $i['price_krw']<=0 || $i['price_krw']>9007199254740991))) throw new RuntimeException();
        $ids[$i['id']]=true;
    }
    return $data;
}
try {
    $docs=documents();
    $publicDocs=array_map(function($doc){unset($doc['file']);return $doc;},$docs);
    if ($action==='catalog') {
        $data=catalogData();$data['documents']=$publicDocs;reply($data);
    }
    if ($action==='pdf') {
        $id=$_GET['id'] ?? '';
        $doc=null;foreach($docs as $candidate) if($candidate['id']===$id) $doc=$candidate;
        if(!$doc) reply(['error'=>'등록되지 않은 PDF입니다.'],404);
        $pdfRoot=realpath($private.'/pdfs');$path=realpath($private.'/pdfs/'.$doc['file']);
        if(!$pdfRoot || !$path || !str_starts_with($pdfRoot,$private.DIRECTORY_SEPARATOR) || !str_starts_with($path,$pdfRoot.DIRECTORY_SEPARATOR) || !is_file($path) || strtolower(pathinfo($path,PATHINFO_EXTENSION))!=='pdf') reply(['error'=>'원본 PDF 파일을 확인해 주세요.'],404);
        // Prevent a replaced PDF from silently being used with an old catalog.
        if(!hash_equals($doc['sha256'],hash_file('sha256',$path))) reply(['error'=>'원본 PDF가 등록본과 다릅니다. 개정과 페이지 연결을 다시 확인해 주세요.'],409);
        $file=fopen($path,'rb');if(!$file || fread($file,5)!=='%PDF-') throw new RuntimeException();rewind($file);
        header('Content-Type: application/pdf');header('Content-Disposition: inline; filename="price-list.pdf"');header('Content-Length: '.filesize($path));fpassthru($file);fclose($file);exit;
    }
    if ($action==='select') {
        $data=catalogData();$item=null;foreach($data['items'] as $candidate) if($candidate['id']===($_GET['id'] ?? ''))$item=$candidate;
        if(!$item || $item['status']!=='available') reply(['error'=>'적용 가능한 가격이 아닙니다.'],409);
        $doc=null;foreach($docs as $candidate)if($candidate['id']===($item['document_id'] ?? ''))$doc=$candidate;
        if(!$doc || !is_int($item['source_page'] ?? null) || $item['source_page']<1 || $item['source_page']>$doc['pages'] || ($item['source_sha256'] ?? '')!==$doc['sha256']) reply(['error'=>'원본 페이지가 연결되지 않은 가격입니다.'],409);
        if(($_GET['revision'] ?? '')!==($data['revision'] ?? '') || ($_GET['price'] ?? '')!==(string)$item['price_krw']) reply(['error'=>'조회 후 단가표가 변경되었습니다. 다시 검색해 주세요.'],409);
        $path=realpath($private.'/pdfs/'.$doc['file']);$root=realpath($private.'/pdfs');
        if(!$root || !$path || !str_starts_with($root,$private.DIRECTORY_SEPARATOR) || !str_starts_with($path,$root.DIRECTORY_SEPARATOR) || !hash_equals($doc['sha256'],hash_file('sha256',$path))) reply(['error'=>'원본 PDF를 다시 확인해 주세요.'],409);
        $item['revision']=$data['revision'];$item['demo']=!empty($data['demo']);reply($item);
    }
    reply(['error'=>'찾을 수 없는 기능입니다.'],404);
} catch(Throwable $e) {reply(['error'=>'단가표·원본 PDF 등록 형식을 확인해 주세요.'],503);}
