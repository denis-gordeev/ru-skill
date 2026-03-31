# ru-skill

![ru-skill thumbnail](docs/assets/k-skill-thumbnail.png)

`ru-skill` - это репозиторий навыков для LLM, который приводится в соответствие с российскими и русскоязычными сценариями. Сейчас в нём ещё лежат унаследованные пакеты и документы из `k-skill`, завязанные на корейские сервисы, но верхнеуровневая документация, метаданные и автоматизация уже переводятся на базовую русскоязычную модель.

Базовые принципы простые.

- Сначала используем публичные пакеты, официальные веб-интерфейсы и бесплатные API, которые агент может вызвать напрямую.
- Прокси добавляем только когда это действительно нужно, без лишнего API-слоя на стороне клиента.
- Документацию, релизные метаданные и автоматизацию держим в одном репозитории.

## Текущее состояние

Репозиторий ещё не полностью перенесён под российские реалии. Существенная часть опубликованных workspace-пакетов - это старые интеграции с корейскими сервисами, а переход начинается с корневой документации, релизных метаданных и общих правил сопровождения.

Поэтому этот README одновременно описывает две вещи.

- Где находятся уже работающие legacy-пакеты и их документация
- В каком направлении репозиторий переводится для российских и русскоязычных пользователей

## Что сейчас доступно

| 할 수 있는 일 | 설명 | 인증/시크릿 | 문서 |
| --- | --- | --- | --- |
| SRT 예매 | 열차 조회, 예약, 예약 확인, 취소 | 필요 | [SRT 예매 가이드](docs/features/srt-booking.md) |
| KTX 예매 | Dynapath anti-bot 대응 helper 로 KTX/Korail 열차 조회, 예약, 예약 확인, 취소 | 필요 | [KTX 예매 가이드](docs/features/ktx-booking.md) |
| 카카오톡 Mac CLI | macOS에서 kakaocli로 대화 조회, 검색, 테스트 전송, 확인 후 실제 전송 | 불필요 | [카카오톡 Mac CLI 가이드](docs/features/kakaotalk-mac.md) |
| 서울 지하철 도착정보 조회 | 역 기준 실시간 도착 예정 열차 확인 | 필요 | [서울 지하철 도착정보 가이드](docs/features/seoul-subway-arrival.md) |
| 사용자 위치 미세먼지 조회 | `k-skill-proxy` 로 현재 위치 또는 지역 fallback 기준 PM10/PM2.5 확인 | 불필요 | [사용자 위치 미세먼지 조회 가이드](docs/features/fine-dust-location.md) |
| KBO 경기 결과 조회 | 날짜별 경기 일정, 결과, 팀별 필터링 | 불필요 | [KBO 결과 가이드](docs/features/kbo-results.md) |
| K리그 경기 결과 조회 | 날짜별 K리그1/K리그2 경기 결과, 팀별 필터링, 현재 순위 확인 | 불필요 | [K리그 결과 가이드](docs/features/kleague-results.md) |
| 토스증권 조회 | `tossctl` 기반 계좌 요약, 포트폴리오, 시세, 주문내역, 관심종목 조회 | 필요 | [토스증권 조회 가이드](docs/features/toss-securities.md) |
| 로또 당첨 확인 | 최신 회차, 특정 회차, 번호 대조 | 불필요 | [로또 결과 가이드](docs/features/lotto-results.md) |
| HWP 문서 처리 | `.hwp` → JSON/Markdown/HTML 변환, 이미지 추출, 배치 처리, Windows 직접 제어 선택 | 불필요 | [HWP 문서 처리 가이드](docs/features/hwp.md) |
| 근처 블루리본 맛집 | 현재 위치를 먼저 확인한 뒤 블루리본 서베이 공식 표면으로 근처 블루리본 맛집 검색 | 불필요 | [근처 블루리본 맛집 가이드](docs/features/blue-ribbon-nearby.md) |
| 근처 술집 조회 | 현재 위치(서울역/강남/사당 등)를 먼저 확인한 뒤 카카오맵 기준으로 영업 상태·메뉴·좌석·전화번호가 포함된 술집 조회 | 불필요 | [근처 술집 조회 가이드](docs/features/kakao-bar-nearby.md) |
| 우편번호 검색 | 주소 키워드로 공식 우체국 우편번호 조회 | 불필요 | [우편번호 검색 가이드](docs/features/zipcode-search.md) |
| 다이소 상품 조회 | 다이소몰 공식 매장/상품/재고 표면으로 특정 매장의 상품 재고 확인 | 불필요 | [다이소 상품 조회 가이드](docs/features/daiso-product-search.md) |
| 택배 배송조회 | CJ대한통운·우체국 공식 표면으로 배송 상태를 조회하고, carrier adapter 규칙으로 추가 택배사 확장을 준비 | 불필요 | [택배 배송조회 가이드](docs/features/delivery-tracking.md) |

Все перечисленные выше функции пока остаются в основном legacy-набором корейских сценариев. Они сохранены, чтобы не ломать существующие рабочие потоки, пока репозиторий переориентируется на русскоязычное использование.

## Текущие пакеты

| 패키지 | 설명 | 상태 |
| --- | --- | --- |
| `k-lotto` | 한국 로또 결과 조회 패키지 | 레거시 |
| `daiso-product-search` | 다이소 매장/상품/재고 조회 | 레거시 |
| `blue-ribbon-nearby` | 블루리본 맛집 조회 | 레거시 |
| `kakao-bar-nearby` | 카카오맵 기반 근처 술집 조회 | 레거시 |
| `kleague-results` | K리그 경기/순위 조회 | 레거시 |
| `toss-securities` | 토스증권 읽기 전용 래퍼 | 레거시 |
| `k-skill-proxy` | 무료 API용 프록시 서버 베이스 | 유지 |

## Документация

| 문서 | 설명 |
| --- | --- |
| [설치 방법](docs/install.md) | 현재 스킬 설치 및 로컬 테스트 흐름 |
| [공통 설정 가이드](docs/setup.md) | 시크릿/환경변수 준비 방식 |
| [보안/시크릿 정책](docs/security-and-secrets.md) | 시크릿 저장 원칙과 금지 패턴 |
| [프록시 서버 가이드](docs/features/k-skill-proxy.md) | 무료 API 프록시 운영 방식 |
| [릴리스/배포 가이드](docs/releasing.md) | Changesets, release-please, trusted publishing |
| [로드맵](docs/roadmap.md) | 러시아/러시아어 현실 기준의 다음 전환 후보 |
| [출처/참고 표면](docs/sources.md) | 설계 시 참고한 공개 라이브러리와 공식 문서 |

## Быстрые ссылки на legacy-функции

- [SRT 예매](docs/features/srt-booking.md)
- [KTX 예매](docs/features/ktx-booking.md)
- [카카오톡 Mac CLI](docs/features/kakaotalk-mac.md)
- [서울 지하철 도착정보 조회](docs/features/seoul-subway-arrival.md)
- [사용자 위치 미세먼지 조회](docs/features/fine-dust-location.md)
- [KBO 경기 결과 조회](docs/features/kbo-results.md)
- [K리그 경기 결과 조회](docs/features/kleague-results.md)
- [토스증권 조회 가이드](docs/features/toss-securities.md)
- [로또 당첨 확인](docs/features/lotto-results.md)
- [HWP 문서 처리](docs/features/hwp.md)
- [근처 블루리본 맛집 가이드](docs/features/blue-ribbon-nearby.md)
- [근처 술집 조회 가이드](docs/features/kakao-bar-nearby.md)
- [우편번호 검색](docs/features/zipcode-search.md)
- [다이소 상품 조회](docs/features/daiso-product-search.md)
- [택배 배송조회](docs/features/delivery-tracking.md)

## С чего начать

1. Прочитайте [설치 방법](docs/install.md) и установите только те навыки, которые реально нужны.
2. Если используете legacy-функции из `k-skill`, сначала проверьте [공통 설정 가이드](docs/setup.md) и [보안/시크릿 정책](docs/security-and-secrets.md).
3. Область дальнейшего перехода на российские сценарии зафиксирована в [로드맵](docs/roadmap.md).
4. При изменении релизных настроек и метаданных соблюдайте [릴리스/배포 가이드](docs/releasing.md) и правила Changesets.

## Примечания

- GitHub-репозиторий: `denis-gordeev/ru-skill`.
- Отдельный issue tracker не используется; работа ведётся через PR.
- Действия вроде запроса на GitHub star допустимы только при явном согласии пользователя.
