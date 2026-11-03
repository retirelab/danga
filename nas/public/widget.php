<?php
declare(strict_types=1);
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-src blob:; object-src blob:; img-src 'self' data:; frame-ancestors 'self' https://retirelab.github.io; base-uri 'none'; form-action 'self'");
?><!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>비공개 단가표 · 원본 PDF</title><link rel="stylesheet" href="widget.css"></head>
<body><main>
<header><div><h1>비공개 단가표 · 원본 PDF</h1><p>모델·동력·재질·모터 포함 여부와 적용일을 원본으로 대조하세요.</p></div><button id="lock" hidden>잠금</button></header>
<p id="error" role="alert"></p>
<form id="login"><label for="pin">공용 비밀번호 4자리</label><input id="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" required><button>잠금 해제</button><p>5회 실패 시 15분 잠금 · 메인 계산기 탭을 닫거나 잠금을 누르면 다시 인증합니다.</p></form>
<section id="catalog" hidden><p id="demo"></p><section class="toolbar"><label>업체<select id="maker"><option value="">전체 업체</option></select></label><label class="grow">모델·사양 검색<input id="query" type="search" placeholder="모델명, kW, 재질 등"></label></section>
<details open><summary>원본 단가표 전체 보기</summary><div id="documents"></div></details><p id="count" role="status"></p><div id="results"></div></section>
</main>
<dialog id="pdfDialog" aria-labelledby="pdfTitle"><header><div><h2 id="pdfTitle">원본 PDF</h2><p id="pdfMeta"></p></div><button id="pdfClose">닫기</button></header><div class="toolbar"><label>PDF 페이지<input id="page" type="number" min="1" value="1"></label><button id="jump">이동</button><a id="pdfNew" target="_blank" rel="noopener">새 창으로 보기</a></div><p>표의 단위·부가세·동력·재질·포함 품목을 확인하세요. 브라우저가 페이지 이동을 지원하지 않으면 PDF 도구에서 직접 이동하세요.</p><iframe id="pdfFrame" title="원본 단가표 PDF"></iframe><label id="confirmLabel"><input id="confirmed" type="checkbox"> 원본 PDF의 모델·사양·금액·단위·적용일을 대조했습니다.</label><button id="apply" disabled>확인한 가격을 계산기에 적용</button></dialog>
<script src="widget.js"></script></body></html>
