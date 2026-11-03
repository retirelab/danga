# v0.2.0: GitHub 계산기와 NAS 단가표/PDF 연동

현재 구조와 업데이트 방법은 [INTEGRATION.md](INTEGRATION.md)를 참조하세요. 아래는 기존 v0.1.0 단독 NAS 앱의 설치 기록입니다.

# 사내용 단가계산기 — Synology 초기 버전 0.1.0

기존 공개 계산기와 분리한 NAS 전용 앱입니다. 아이디 없이 공용 숫자 4자리로 로그인합니다.
실제 단가표·원본 PDF·비밀번호·인증 해시는 이 저장소와 설치 ZIP에 포함하지 않습니다.
포함된 가격은 가상 예시이며 실제 견적에 사용하면 안 됩니다.

## 현재 동작

- 공용 PIN 서버 검증, 5회 실패 시 전체 로그인 15분 잠금(쿠키·IP 변경으로 우회 불가)
- HTTPS 전용, HttpOnly/SameSite 쿠키, CSRF 검사, 로그인 시 세션 ID 변경
- 서버 요청 기준 30분 미사용 / 최대 8시간 세션, PIN 해시 변경 시 기존 세션 거부
- 화면은 30분 후 다시 로그인하도록 이동하며 가격을 브라우저 영구 저장소에 저장하지 않음
- 서버 권한 확인 후 JSON 조회 → 업체/모델/사양 검색 → 가격 선택 → 기존 계산기 적용
- 가격 클릭 시 이전 업체의 할인조건을 초기화하고 매입조건 확인 안내
- `inquiry`/`unavailable` 항목은 계산 적용 금지, 모든 가격은 KRW 원 단위 정수·VAT 별도
- React를 NAS에서 직접 제공. 외부 CDN·폰트·분석 도구를 호출하지 않음

공용 PIN만 사용하므로 두 사람의 행위를 개별 식별하지 않습니다. 전역 잠금은 외부인의 반복 실패로 두 사용자 모두 잠길 수 있습니다. 4자리 PIN은 강한 인증이 아니며 NAS 방화벽/VPN으로 접속 범위를 줄일수록 좋습니다.

## NAS 설치 배치

기존 만화 뷰어 폴더와 설정을 덮어쓰지 마세요.

```text
/volume1/web/danga/              ← public/ 안의 파일만 복사
/volume1/danga-private/
    config.php                  ← NAS에서 생성하는 비밀번호 해시
    catalog.json                ← 검증된 실제 가격 데이터
    state/                      ← PHP가 생성하는 세션·실패 기록
```

1. Web Station에 기존과 같이 PHP 8.2 웹 서비스를 추가합니다. 문서 루트는 `/volume1/web/danga`입니다.
2. 기존 만화 뷰어를 유지하려면 **다른 호스트 이름 또는 별도 HTTPS 포털**을 배정합니다. 구체적 주소는 기존 포털 설정을 확인한 뒤 결정합니다. DSM 관리 포트는 사용하지 않습니다.
3. `/volume1/danga-private`를 생성합니다. 이 폴더를 웹 포털·공유 링크로 공개하지 마세요. document root 바깥이어야 합니다.
4. `tools/make-config.php`를 NAS의 웹 공개 폴더 밖에 복사합니다. NAS 터미널에서 PHP 8.2 CLI 실행 파일로 아래 도구를 실행하고 PIN을 입력합니다. 환경에 따라 `php` 대신 PHP 8.2의 실제 실행 파일 경로가 필요합니다.

   ```sh
   php make-config.php /volume1/danga-private
   ```

   도구는 기존 config를 덮어쓰지 않습니다. PIN은 명령 인수나 Git에 넣지 않습니다. 비밀번호 해시만 config에 저장합니다.
5. DSM 권한에서 Web Station PHP 실행 사용자에게 비공개 폴더의 탐색 권한, config/catalog 읽기 권한, state 폴더 쓰기 권한을 부여합니다. 다른 일반 사용자에게 이 폴더를 공유하지 마세요. 전체 사용자 쓰기 권한은 주지 않습니다.
6. 우선 `private-template/catalog.example.json`을 비공개 폴더의 `catalog.json`으로 복사해 기능을 확인합니다. 실제 가격표 등록 전에는 가상 예시입니다.
7. HTTPS 주소에 접속해 PIN 로그인, 검색, 가격 적용, 잠금을 확인합니다. 사무실 PC와 휴대폰에서 각각 확인합니다.

기본 경로를 바꾸려면 PHP 서비스 환경변수 `DANGA_PRIVATE_DIR`을 지정합니다.
실제 NAS에서는 `allow_http_local_test`를 **false**로 유지합니다. HTTPS 판정은 PHP의 `HTTPS` 변수만 신뢰하므로 리버스 프록시를 추가하면 실제 TLS 전달 설정을 확인해야 합니다.
PHP 패키지의 open_basedir 제한이 있다면 비공개 폴더 접근을 허용해야 합니다. 오류가 나도 가격표를 공개 폴더로 옮기지 마세요.

## JSON 규칙

샘플 파일을 참조하세요. `schema_version: 1`, `items` 배열과 고유 `id`를 사용합니다.
`maker`, `category`, `model`, `spec`, `price_krw`, `currency`, `vat`, `price_type`, `status`, `effective_date`, `source_page`를 보관합니다.

- 천 원 단위 문서는 **추출 시 1,000을 곱한 원 단위**로 저장
- 동일 모델이라도 동력·재질·모터 포함 여부·시스템 종류·펌프 대수가 다르면 별도 행과 ID
- `price_type: list` → 공장도가/정가로 입력, `purchase` → 매입가 직접 적용
- `status: inquiry` 또는 `unavailable` → 가격 null, 클릭 불가
- 실제 데이터 등록 시 `demo: false`와 개정일을 설정
- 업체별 매입조건은 현재 수동 프리셋으로 확인. 제품군별 자동 할인 매핑은 다음 단계

부가세 포함 자료는 기준을 확인하여 변환한 뒤 등록합니다. 기본 가격 기준을 추측해 자동 적용하지 않습니다.

## 설치 확인 항목

- 미로그인 상태의 `api.php?action=catalog`는 401, 가격 미출력
- JSON/PDF에 접근하는 공개 URL 없음
- 틀린 PIN 5회 후 새 브라우저에서도 잠금 유지
- 로그아웃 후 데이터 요청 거절
- 다른 업체로 전환 시 기존 업체 할인율 자동 적용 없음
- HTTPS 세션 쿠키가 Secure/HttpOnly/SameSite=Strict인지 확인
- 브라우저 개발 도구 Network에서 제3자 요청·가격 캐시가 없는지 확인

이 초기 버전에는 실제 단가표 추출 결과, PDF 보기, 관리자 업로드 화면, NAS 자동 배포를 포함하지 않습니다. 원본 PDF는 추후에도 비공개 폴더에 두고 인증된 요청으로만 제공해야 합니다.

## 개발/검증

NAS에는 빌드 도구가 필요 없습니다. 배포할 `public/app.js`는 미리 컴파일되어 있습니다.
소스를 수정하면 Babel standalone 7.23.2를 로컬 빌드용으로 받아 `node tools/compile.cjs /path/to/babel.min.js`를 실행합니다.
브라우저에서는 Babel이나 외부 CDN을 사용하지 않습니다. vendor/에는 MIT 라이선스 React/ReactDOM 18.2.0을 포함합니다.

```sh
python3 tests/integration.py /path/to/php
```

테스트는 임시 폴더와 가상 데이터만 사용합니다. 운영 NAS 접근은 필요하지 않습니다.
