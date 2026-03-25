# k-skill

한국 서비스와 한국 생활 맥락에 맞춰 바로 쓸 수 있는 에이전트 스킬 모음집입니다.

## 어떤 걸 할 수 있나

| 할 수 있는 일 | 설명 | 인증/시크릿 | 문서 |
| --- | --- | --- | --- |
| SRT 예매 | 열차 조회, 예약, 예약 확인, 취소 | 필요 | [SRT 예매 가이드](docs/features/srt-booking.md) |
| KTX 예매 | KTX/Korail 열차 조회, 예약, 예약 확인, 취소 | 필요 | [KTX 예매 가이드](docs/features/ktx-booking.md) |
| 서울 지하철 도착정보 조회 | 역 기준 실시간 도착 예정 열차 확인 | 필요 | [서울 지하철 도착정보 가이드](docs/features/seoul-subway-arrival.md) |
| KBO 경기 결과 조회 | 날짜별 경기 일정, 결과, 팀별 필터링 | 불필요 | [KBO 결과 가이드](docs/features/kbo-results.md) |
| 로또 당첨 확인 | 최신 회차, 특정 회차, 번호 대조 | 불필요 | [로또 결과 가이드](docs/features/lotto-results.md) |

## 처음 시작하는 순서

1. [설치 방법](docs/install.md)부터 보고 필요한 스킬만 설치합니다.
2. SRT/KTX/서울 지하철처럼 인증이 필요한 기능을 쓸 거라면 [공통 설정 가이드](docs/setup.md)를 먼저 따라갑니다.
3. 시크릿을 안전하게 관리하려면 [보안/시크릿 정책](docs/security-and-secrets.md)을 확인합니다.
4. 각 기능 문서를 열어 입력값, 예시, 제한사항을 확인합니다.

## 문서

| 문서 | 설명 |
| --- | --- |
| [설치 방법](docs/install.md) | 패키지 설치, 선택 설치, 로컬 테스트 방법 |
| [공통 설정 가이드](docs/setup.md) | `sops + age` 설치, age key 생성, 공통 secrets 파일 준비 |
| [보안/시크릿 정책](docs/security-and-secrets.md) | 인증 정보 저장 원칙, 금지 패턴, 표준 환경변수 이름 |
| [로드맵](docs/roadmap.md) | 현재 포함 기능과 다음 후보 |
| [출처/참고 표면](docs/sources.md) | 설계 시 참고한 공개 라이브러리와 공식 문서 |

## 포함된 기능

- [SRT 예매](docs/features/srt-booking.md)
- [KTX 예매](docs/features/ktx-booking.md)
- [서울 지하철 도착정보 조회](docs/features/seoul-subway-arrival.md)
- [KBO 경기 결과 조회](docs/features/kbo-results.md)
- [로또 당첨 확인](docs/features/lotto-results.md)

인증이 필요한 기능은 모두 [공통 설정 가이드](docs/setup.md)를 먼저 보는 것을 기준으로 합니다.
