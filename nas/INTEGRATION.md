# GitHub 계산기 + NAS 비공개 단가표 / PDF — v0.2.0

접속 주소는 https://retirelab.github.io/danga/ 를 유지합니다.
공개 계산기의 `비공개 단가표 · PDF` 버튼을 누르면 NAS의 `widget.php`를 대화상자 안에 표시합니다.
PIN, 인증 토큰, 전체 카탈로그와 PDF는 NAS 프레임 안에서만 처리합니다.
GitHub에는 사용자가 확인하고 선택한 한 항목만 postMessage로 전달합니다.
받는 쪽은 NAS origin과 해당 iframe window를 모두 확인합니다.

## NAS 업데이트

기존 PHP 8.2 프로필, HTTPS 포털, config.php와 권한은 그대로 사용합니다.
`public/`의 업데이트 파일을 `/volume1/web/danga/`에 복사합니다.
`widget.php`, `widget.js`, `widget.css`, `service.php`, `pin-auth.php`, `bootstrap.php`, `api.php`가 필요합니다.
서비스 주소는 기본 `https://danga.onsnas83.diskstation.me`이며 바꿀 때 config.php에 `service_origin`을 지정합니다.
외부 출처의 API 직접 호출은 허용하지 않습니다. CORS 허용이나 제3자 쿠키 설정이 필요하지 않습니다.

비공개 폴더:

```
/volume1/danga-private/
  config.php       기존 파일 유지
  catalog.json     기존 데이터 유지
  documents.json   원본 PDF 등록 목록
  pdfs/            실제 원본 PDF (http 그룹 읽기)
  state/           세션, 실패 기록, 토큰 (http 그룹 쓰기)
```

원본 PDF와 documents.json, 실제 catalog.json은 GitHub에 커밋하지 않습니다.
documents.example.json은 구조 예시만 제공하며 실제 해시로 바꾸어야 합니다.
원본은 인증 후만 제공하고 SHA-256이 등록값과 일치해야 열립니다.
이 배포에는 PDF 내용에서 자동 추출한 실제 가격 데이터는 넣지 않습니다.
원본 열람은 가능하며 실제 검색 가격은 추출·대조 검증 뒤 별도로 등록합니다.

## 원본과 검색 행 연결

기존 행 필드에 다음을 추가합니다:

- `document_id`: documents.json의 id
- `source_page`: PDF 파일 기준 1부터 시작하는 페이지 번호 (인쇄 쪽수와 다를 수 있음)
- `printed_page`: 선택적 인쇄 쪽수 문자열
- `source_sha256`: 연결한 PDF의 SHA-256
- `verified: true`: 관리자 추출·대조 검증 후에만 지정

문서의 파일명은 pdfs/ 아래의 상대 파일명입니다. 경로 이탈과 심볼릭 링크 이탈을 거부합니다.
정가/매입가, VAT 별도, 원 단위 정수만 허용합니다. 문의·단종·미검증·원본 미연결 행은 적용할 수 없습니다.
최종 적용 직전 서버가 항목 ID, 개정, 가격, 원본 해시를 다시 검사합니다.
GitHub에서 이전 업체 할인계수를 1로 초기화합니다. 선택 가격은 영구 저장하지 않습니다.

## 로그인과 PDF 표시

임베드용 토큰은 NAS 프레임 메모리에서만 보관하며 URL/localStorage에 넣지 않습니다.
30분 요청 없음 / 최대 8시간 후 만료하며 PIN 해시 변경과 로그아웃으로 무효화됩니다.
전체 로그인 5회 실패/15분 잠금은 기존 NAS 앱과 공유합니다.
인증 후 PDF를 받아 Blob URL로 표시하고 창 닫기·잠금 때 제거합니다.
PDF 팝업은 GitHub 모달 안에 있으며 전체 문서, 페이지 입력, 새 창 보기와 대조 확인을 제공합니다.
브라우저 내장 PDF 뷰어에 따라 #page 이동 지원이 다릅니다. 지원하지 않는 브라우저는 자체 페이지 도구나 새 창을 사용합니다.
다운로드된 문서/이미 열린 원본의 복사본까지 원격 회수할 수는 없습니다.

## 검증

```
python3 tests/integration.py /path/to/php
python3 tests/service.py /path/to/php
node tests/bridge.cjs
```

기존 쿠키 앱 24개와 임베드/PDF API 31개 검사(인증/공유 잠금/만료/해시/경로/가격 변경)를 통과했습니다.
NAS 운영 서버 업로드와 실제 브라우저의 PDF 렌더링은 배포 후 확인해야 합니다.
