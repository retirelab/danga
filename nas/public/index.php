<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
if ($authenticated) { $_SESSION['last_seen']=time(); require __DIR__.'/app-shell.php'; exit; }
?><!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>사내용 단가계산기 · 로그인</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f1f5f9;font-family:system-ui,sans-serif;color:#1e293b}main{width:min(92vw,390px);padding:32px;background:white;border-radius:20px;box-shadow:0 12px 40px #0f172a12}h1{font-size:24px}p{color:#64748b;line-height:1.6}input{width:100%;padding:16px;text-align:center;font-size:30px;letter-spacing:12px;border:1px solid #cbd5e1;border-radius:10px}button{width:100%;margin-top:16px;padding:14px;background:#2563eb;border:0;border-radius:10px;color:white;font-weight:bold;font-size:16px}button:disabled{opacity:.5}#error{color:#dc2626;min-height:24px}small{color:#94a3b8}</style></head>
<body><main><h1>사내용 단가계산기</h1><p>공용 비밀번호 4자리를 입력해 주세요.</p>
<form id="login"><label for="pin">비밀번호</label><input id="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" minlength="4" maxlength="4" autocomplete="off" required autofocus><button id="submit">잠금 해제</button></form>
<p id="error" role="alert"></p><small>v0.1.0 · 5회 실패 시 15분간 잠금</small></main><script src="login.js"></script></body></html>
