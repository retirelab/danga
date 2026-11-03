<?php
declare(strict_types=1);
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
?><!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>단가표 원본</title><link rel="stylesheet" href="pdf-viewer.css"></head><body>
<header><strong id="title">단가표 원본</strong><nav aria-label="PDF 보기"><button id="prev" aria-label="이전 페이지">◀</button><label><input id="page" type="number" min="1" value="1" aria-label="페이지"> / <span id="total">-</span></label><button id="next" aria-label="다음 페이지">▶</button><button id="smaller" aria-label="축소">−</button><span id="zoom">100%</span><button id="larger" aria-label="확대">＋</button><button id="fit">화면 맞춤</button><button id="actual">100%</button></nav></header>
<p id="status" role="status">계산기에서 원본 PDF를 선택해 주세요.</p><main id="paper"><canvas id="canvas" aria-label="원본 PDF 페이지"></canvas></main><script type="module" src="pdf-viewer.js"></script></body></html>
