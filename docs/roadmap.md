# Roadmap

## Цель миграции

`ru-skill` должен перестать быть просто переносом активов `k-skill` и стать рабочим набором навыков для российских и русскоязычных пользователей. Практический критерий успеха: в репозитории должны появляться новые русскоязычные навыки, а legacy-пакеты должны быть явно отделены от нового позиционирования в документации, релизах и матрице пакетов.

## Статус на 2026-06-01

- Английские заголовки секций во всех 6 target SKILL.md с английскими заголовками переведены на русский и приведены к единой схеме (`Что делает навык`, `Когда использовать`, `Предварительные условия`, `Входные данные`, `Рабочий процесс`, `Критерии завершения`, `Возможные ошибки`, `Примечания`).
- Нестандартные русские формулировки в `yandex-rasp/SKILL.md` и `yandex-market-search/SKILL.md` нормализованы к той же схеме.
- Последние Korean фрагменты в feature docs переведены: `근처 술집 조회` → `Поиск баров поблизости`, `K리그 결과 조회` → `Результаты K League`.
- Doc-regression тесты обновлены под новые заголовки и переводы.
- Последний слой user-facing Korean в source code и docs устранён: форматирование призов `k-lotto` (`원` → `вон`, locale `ru-RU`) и примеры CLI-запросов `kakaotalk-mac` переведены на русский.
- Аудит подтверждает: весь оставшийся Korean — domain-inherent (API parameters, location names, fixture data, regex patterns); новых user-facing Korean фрагментов для перевода нет.
- Skill-level copy audit завершён: 7 мест, где legacy-контекст описывался как operational default, исправлены на backward-compatible fallback (`delivery-tracking`, `toss-securities`, `hwp`, `blue-ribbon-nearby`, `ktx-booking`).
- Doc-regression расширен на 4 legacy-навыка с workflow/content assertions: `seoul-subway-arrival`, `kbo-results`, `lotto-results`, `srt-booking`.
- User-facing Korean labels в source code переведены на русский: статусы матчей (`kleague-results`), подсказки вместимости (`kakao-bar-nearby`), лотерейные метки (`k-lotto`), сообщения об ошибках (`blue-ribbon-nearby`).
- User-facing Korean текст в feature docs, SKILL.md и package README дополнительно русифицирован: `kakao-bar-nearby`, `blue-ribbon-nearby`, `kleague-results`, `zipcode-search`, `hwp`, `ktx-booking`, `kakaotalk-mac`.
- Doc-regression расширен на все 13 target-навыков: `moex-shares`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `osm-nearby` добавлены в этом раунде.
- Следующий слой legacy feature/skill drift закрыт: `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby`, `kleague-results`, `srt-booking` и `ktx-booking` теперь явно публикуют `## Boundary note` и подтверждённые replacement boundaries.
- Doc-regression расширен и на этот слой, чтобы nearby, marketplace, football и legacy railway replacement copy не расходился между `docs/features/*` и `*/SKILL.md`.
- Корневой README, install/setup/releasing-документы уже переводятся на русскоязычную терминологию.
- В рабочем дереве всё ещё остаются legacy-пакеты и feature-гайды с корейским контекстом.
- GitHub Issues отключены, поэтому живой backlog ведётся в `TODO.md` и через PR.
- Собран отдельный brand inventory по поверхностям, где ещё жёстко торчит `k-skill`.
- В качестве первого нового источника выбран официальный XML-сервис курсов валют Банка России.
- Добавлен первый новый русскоязычный skill/package: `cbr-rates` поверх официального XML Банка России.
- Добавлен второй новый русскоязычный skill/package: `moex-shares` поверх публичного ISS API Московской биржи.
- Добавлен третий новый русскоязычный skill/package: `postcalc-postcodes` поверх публичных страниц `Postcalc` для отделений и индексов Почты России.
- Добавлен четвёртый новый русскоязычный skill/package: `hh-vacancies` поверх публичного API `hh.ru` для поиска вакансий и карточек вакансий.
- Добавлен пятый новый русскоязычный skill/package: `stoloto-lotto` поверх публичных страниц архива Столото для результатов лотерей.
- Добавлен шестой новый русскоязычный skill/package: `kinopoisk-search` поверх публичных страниц Кинопоиска для поиска фильмов и карточек фильмов.
- Добавлен седьмой новый русскоязычный skill/package: `mchs-storm-warnings` поверх официальных региональных страниц МЧС России с экстренными предупреждениями.
- Добавлен восьмой новый русскоязычный skill/package: `pravo-documents` поверх официального API `pravo.gov.ru` для поиска и карточек правовых документов.
- Добавлен девятый новый русскоязычный skill/package: `yandex-rasp` поверх API Яндекс.Расписаний для поиска станций, расписаний и маршрутов.
- Добавлен десятый новый русскоязычный skill/package: `rpl-results` поверх championat.com для турнирной таблицы и результатов матчей РПЛ.
- Добавлен одиннадцатый новый русскоязычный skill/package: `yandex-market-search` поверх серверно отрендеренных страниц Яндекс Маркета для поиска товаров и карточек товаров.
- Добавлен двенадцатый новый русскоязычный skill/package: `osm-nearby` поверх публичного Overpass API OpenStreetMap для поиска ближайших заведений.
- Добавлен тринадцатый новый русскоязычный skill/package: `zoon-nearby` поверх публичных страниц Zoon.ru для поиска ближайших заведений с рейтингами и контактами.
- `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы не только по install-flow, но и по следующему продуктовому приоритету: booking-replacements и release hygiene.
- Отдельно проведён release-hygiene раунд: inventory `.changeset/` подтверждён, а верхнеуровневые документы очищены от устаревших релизных ярлыков и сводок расстояния ветки как от неустойчивого статуса.
- Проведён research-first раунд по booking replacement; decision matrix вынесен в `docs/booking-replacements.md`, а replacement boundary зафиксирован отдельно от release-hygiene.
- Legacy railway docs выровнены с этим boundary: `srt-booking` и `ktx-booking` явно сохранены как backward-compatible корейские сценарии, а не как template для новых российских write-интеграций.
- Milestone 5 закрыт документно: `yandex-rasp` признан достаточным stable baseline для railway discovery, а отдельный handoff-skill не даёт новой устойчивой API-функции без скатывания в checkout automation.
- Railway replacement выведен из активного implementation backlog; `remaining legacy-only matrix` для `seoul-subway-arrival` и `toss-securities` уже доведена до одинакового статуса в README, roadmap и install-flow.
- `k-skill-proxy` теперь синхронно маркируется как `transition`-слой в верхнеуровневых user-facing документах, а не как неявно "активный" продуктовый трек.
- User-facing guides для `delivery-tracking`, `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy` дополнены boundary notes, чтобы legacy/transition сценарии не выглядели как скрытый target-backlog.
- `fine-dust-location`, `docs/setup.md`, `docs/security-and-secrets.md` и `packages/k-skill-proxy/README.md` теперь тоже держат единый `ru-skill`-first credential order и не продвигают published proxy endpoint как новый target-default.
- Doc-regression расширен до `fine-dust-location` и package-level proxy docs: проверяется boundary note, порядок `~/.config/ru-skill/secrets.env` -> `~/.config/k-skill/secrets.env` и то, что `KSKILL_PROXY_BASE_URL` описан как override, а не как обязательный секрет.
- `examples/secrets.env.example`, setup-skills и `scripts/check-setup.sh` теперь тоже выровнены с этой моделью: `KSKILL_PROXY_BASE_URL` не входит в минимальный secrets-template и везде подан как optional endpoint override, а не как обязательный credential.
- Doc-regression расширен на secrets template и setup helper-docs, чтобы distinction между optional override и реальными секретами не терялась вне верхнеуровневых документов.
- Следующий package-level drift тоже закрыт: README у `toss-securities`, `daiso-product-search`, `kleague-results`, `blue-ribbon-nearby`, `kakao-bar-nearby` и `k-lotto` теперь синхронно фиксируют `legacy-only` статус и уже подтверждённые российские replacements там, где они существуют.
- Doc-regression расширен ещё на этот слой package README, чтобы migration-boundary не держалась только на feature guides и верхнеуровневых документах.
- Setup/runtime drift тоже закрыт на skill-level: даже legacy alias `k-skill-setup` теперь использует `~/.config/ru-skill/bin` и `~/.config/ru-skill/logs` как operational default для update-check automation, а `~/.config/k-skill/*` остаётся только fallback-контуром совместимости.
- Doc-regression расширен на setup runtime-artifacts, чтобы `k-skill`-prefixed bin/log directories не возвращались в документацию как основной рабочий путь.
- Следующий skill-level drift тоже закрыт: `fine-dust-location`, `srt-booking` и `ktx-booking` теперь синхронно маркируют legacy/transition boundary, используют `ru-skill`-first credential order и не подают proxy override или railway legacy flow как активный target-default.
- Doc-regression расширен на этот skill-level слой, чтобы railway/fine-dust copy не возвращала скрытый target-backlog, legacy endpoint defaults или `k-skill`-first credential порядок.
- Ещё один skill-only drift тоже закрыт: `kakaotalk-mac`, `kbo-results`, `lotto-results` и `zipcode-search` теперь синхронно помечают `legacy-only` boundary и больше не выглядят как активные target-кандидаты.
- Doc-regression расширен на эти skill-only guides и соответствующие `SKILL.md`, чтобы confirmed replacements и compatibility-role удерживались и в user-facing, и в agent-facing документации.
- Helper/runtime cleanup теперь закрыт и на следующем user-facing слое: `fine-dust-location`, `seoul-subway-arrival`, `srt-booking` и `ktx-booking` дополнительно страхуются тестами на `ru-skill`-first secrets order, runtime/secrets semantics и replacement boundary.
- Приоритет после этого сместился с helper/runtime docs/scripts на добор русификации оставшихся legacy feature-docs и на дальнейшее расширение doc-regression именно по user-facing guides, а не только по `SKILL.md` и setup/proxy helper surfaces.
- Milestone 4 переведён в зафиксированное состояние по документной части: legacy-пакеты размечены, матрица замен актуализирована, публичная документация не продвигает корейские сценарии как основной путь.
- В качестве третьего источника вне финансового домена выбран `Postcalc` как read-only справочник индексов и отделений на базе эталонного справочника Почты России.
- В качестве четвёртого источника вне финансов и логистики выбран публичный API `hh.ru` как базовый read-only сценарий вакансий и регионов.
- Для setup и helper-скриптов уже внедрён dual-path secrets: `~/.config/ru-skill/secrets.env` с fallback на `~/.config/k-skill/secrets.env`.
- Добавлен compatibility alias `ru-skill-setup`, чтобы новый setup-поток не продвигал legacy-имя `k-skill-setup` как основной сценарий.
- Верхнеуровневые документы `README.md`, `TODO.md`, `docs/install.md` и `docs/roadmap.md` дополнительно синхронизированы регрессионными тестами, чтобы новые target-навыки не выпадали из install-flow.

## Уже выпущенные target-навыки

- Навык по курсам валют Банка России
- Навык по акциям Московской биржи
- Навык по индексам и отделениям Почты России через Postcalc
- Навык по поиску вакансий и карточкам вакансий через hh.ru
- Навык по результатам лотерей Столото
- Навык по поиску фильмов и карточкам фильмов через Кинопоиск
- Навык по официальным предупреждениям МЧС России
- Навык по официальным правовым документам через pravo.gov.ru
- Навык по расписаниям транспорта через Яндекс.Расписания
- Навык по результатам РПЛ и футбольным сводкам через championat.com
- Навык по поиску товаров и карточкам товаров через Яндекс Маркет
- Навык поиска ближайших заведений через OSM Overpass API
- Навык поиска ближайших заведений через Zoon.ru

## Сохраняемые legacy и utility-навыки

- Поиск почтовых индексов
- Навык с результатами K League
- Навык для отслеживания доставки
- Навык для Toss Securities
- Навык по проверке fine dust по местоположению
- Навык поиска nearby-ресторанов Blue Ribbon
- Навык поиска nearby-баров
- Навык поиска товаров Daiso

## Migration milestones

### Milestone 1. Русификация верхнего уровня

Цель: убрать смешение русских и корейских заголовков в корневой документации и сделать репозиторий понятным без знания legacy-контекста.

Критерии готовности:

- `README.md`, `docs/install.md`, `docs/setup.md`, `docs/releasing.md`, `docs/roadmap.md` используют единую русскоязычную терминологию.
- Placeholder-команды установки заменены на безопасные примеры с `denis-gordeev/ru-skill`.
- `TODO.md` ведётся как живой task list для следующих automation round.

Статус: завершён.

### Milestone 2. Legacy inventory и новое позиционирование

Цель: развести то, что остаётся ради обратной совместимости, и то, что считается целевым развитием `ru-skill`.

Критерии готовности:

- Для каждого workspace-пакета определён статус: `legacy`, `transition` или `target`.
- Выявлены package/skill-имена, которые нельзя быстро переименовать из-за совместимости, и задокументирован план их обвязки брендом `ru-skill`.
- README и roadmap явно показывают, какие пакеты не являются целевым продуктовым направлением.
- Инвентарь зафиксирован в `docs/brand-inventory.md`.

Статус: завершён.

### Milestone 3. Первый русскоязычный навык

Цель: добавить новый сценарий поверх публичного API или официального веб-интерфейса, не завязанный на корейские сервисы.

Критерии готовности:

- Есть выбранный источник в `docs/sources.md`.
- Есть рабочий skill/package или документированный skill-only workflow.
- Есть README/feature-guide, тесты или fixture-based проверка.
- Навык можно установить из репозитория по той же схеме, что и текущие skills.

Статус: завершён.

### Milestone 4. Управляемое сворачивание legacy

Цель: сократить долю legacy-функций в публичной коммуникации, не ломая существующие потоки.

Критерии готовности:

- Для каждого legacy-пакета решено: оставить как есть, вынести отдельно или заменить русскоязычным аналогом.
- Новые релизы и документация не продвигают legacy-пакеты как основной сценарий репозитория.
- Матрица замен поддерживается в roadmap и TODO.
- Все legacy SKILL.md файлы переведены на русский язык для единообразия документации.

Статус: завершён по документации и migration-governance. Legacy-пакеты сохранены ради совместимости, но документно отделены от target-линейки; незакрытые product gaps вынесены в следующий milestone.

### Milestone 5. Booking replacements и release hygiene

Цель: не просто держать legacy-booking навыки как исторический хвост, а либо найти жизнеспособные российские замены, либо явно зафиксировать, что замена невозможна без авторизации и закрытых API.

Критерии готовности:

- Исследованы минимум два кандидата для замены `srt-booking` и `ktx-booking`: официальный РЖД поток и один агрегаторный read-only сценарий.
- В roadmap и TODO нет устаревших статусов round-summary, которые противоречат фактическому состоянию репозитория.
- Changeset/release backlog приведён в состояние, из которого можно делать следующий publish round без ручной археологии по старым summary.

Статус: завершён; release-hygiene подзадача закрыта, booking-research проведён документно, legacy railway docs выровнены с replacement boundary, а отдельный read-only/handoff skill сверх `yandex-rasp` признан нецелесообразным.

Текущее решение по направлению:

- Полноценный `rzd-booking` не идёт в MVP, пока не подтверждён устойчивый официальный интерфейс без checkout automation, логина и brittle anti-bot обходов.
- `tutu.ru` и Яндекс Путешествия фиксируются как кандидаты на read-only/handoff сценарий, а не как подтверждённые public booking API.
- Базовый railway-discovery сценарий уже покрывается `yandex-rasp`; отдельный target-пакет не открывается, пока он не добавляет устойчивую API-функцию, а не thin-wrapper над внешним checkout.
- Критерий закрытия milestone вынесен в [отдельный документ по booking replacements](booking-replacements.md).

## Legacy packages и целевые замены

| Пакет | Текущий статус | Что делает сейчас | Целевая замена или направление | Статус замены |
| --- | --- | --- | --- | --- |
| `cbr-rates` | `target` | Официальные курсы валют Банка России | Базовый read-only финансовый навык для российской ветки репозитория | Реализован |
| `moex-shares` | `target` | Публичные метаданные и delayed-цены акций Московской биржи | Базовый read-only навык по российскому фондовому рынку | Реализован |
| `postcalc-postcodes` | `target` | Read-only-сводки по индексам и отделениям через публичные страницы Postcalc | Базовый навык по почтовым индексам и отделениям Почты России | Реализован |
| `hh-vacancies` | `target` | Read-only поиск вакансий, карточки вакансий и lookup регионов через публичный API hh.ru | Базовый навык по российскому рынку труда и русскоязычному job-search сценарию | Реализован |
| `stoloto-lotto` | `target` | Публичные результаты лотерей Столото через архивные страницы | Базовый read-only навык по российским публичным результатам лотерей, замена `k-lotto` | Реализован |
| `kinopoisk-search` | `target` | Read-only поиск фильмов и карточек фильмов через публичные страницы Кинопоиска | Базовый навык по российскому кино и развлекательному контенту | Реализован |
| `mchs-storm-warnings` | `target` | Официальные экстренные предупреждения МЧС по региональным страницам | Базовый навык по публичной безопасности и погодным рискам для российских регионов | Реализован |
| `pravo-documents` | `target` | Поиск и карточки официальных правовых документов через API pravo.gov.ru | Базовый навык по справочному праву и официальным документам | Реализован |
| `yandex-rasp` | `target` | Расписания транспорта (электрички, поезда, автобусы, авиарейсы) через API Яндекс.Расписаний | Базовый навык по расписаниям транспорта и городским сервисам, замена корейского транспорта | Реализован |
| `rpl-results` | `target` | Турнирная таблица и результаты матчей Российской Премьер-Лиги через championat.com | Базовый навык по российскому спорту и футбольным сводкам, замена `kleague-results` | Реализован |
| `yandex-market-search` | `target` | Поиск товаров и карточки товаров через серверно отрендеренные страницы Яндекс Маркета | Базовый навык по российским маркетплейсам и read-only shopping discovery, замена `daiso-product-search` | Реализован |
| `k-lotto` | `legacy` | Результаты корейской лотереи | Заменён на `stoloto-lotto` — российские публичные результаты лотерей | Заменён |
| `kleague-results` | `legacy` | K League расписание и таблица | Заменён на `rpl-results` — российские спортивные сводки через championat.com | Заменён |
| `daiso-product-search` | `legacy` | Товары и остатки Daiso | Заменён на `yandex-market-search` — российский marketplace discovery через Яндекс Маркет | Заменён |
| `blue-ribbon-nearby` | `legacy` | Ближайшие рестораны Blue Ribbon | Заменён на `osm-nearby` и `zoon-nearby` — бесплатный поиск ближайших заведений через OpenStreetMap и Zoon.ru | Заменён |
| `kakao-bar-nearby` | `legacy` | Бары рядом через Kakao Map | Заменён на `osm-nearby` и `zoon-nearby` — бесплатный поиск ближайших заведений через OpenStreetMap и Zoon.ru | Заменён |
| `toss-securities` | `legacy` | Read-only-обёртка над `tossctl` | Прямой российский replacement не подтверждён; рыночные read-only сводки уже покрывает `moex-shares` | Закрыто документно; legacy-only |
| `srt-booking` | `legacy` | Бронирование поездов SRT | `yandex-rasp` как read-only база + ручной внешний handoff без автоматизации оплаты | Закрыто документно; новый target-пакет не открывается |
| `ktx-booking` | `legacy` | Бронирование поездов KTX/Korail | Объединён с заменой `srt-booking` — read-only discovery и ручной внешний handoff вместо прямой оплаты | Закрыто документно; новый target-пакет не открывается |
| `seoul-subway-arrival` | `legacy` | Прибытие поездов метро Сеула | Прямой российский replacement не подтверждён; публичные источники дают только низкоценные статические справочники | Закрыто документно; legacy-only |
| `k-skill-proxy` | `transition` | Узкий прокси для бесплатных API | Сохранить как инфраструктурную базу и добавить русскоязычные adapter'ы | Сохраняется |
| `hwp`-документация и tooling | `target-supporting` | Обработка HWP-документов | Сохранить как отдельную полезную утилиту вне темы российской локализации | Сохраняется |

## Приоритеты следующих раундов

1. Railway replacement закрыт документно: `yandex-rasp` остаётся конечной read-only границей, а checkout automation не идёт в новый target-backlog без подтверждённого публичного API.
2. Fine-dust/proxy secrets-template drift, skill-only drift, legacy feature/skill drift, helper/runtime cleanup, skill-level copy audit, полная русификация user-facing Korean и doc-regression workflow assertions для всех legacy skills уже закрыты; doc-regression покрывает все 13 target-навыков и все legacy-навыки с boundary + workflow/content assertions; user-facing Korean полностью устранён.
3. Runtime/secrets regression для `fine-dust-location`, `seoul-subway-arrival`, `srt-booking` и `ktx-booking` уже добавлен; workflow/content assertions для `seoul-subway-arrival`, `kbo-results`, `lotto-results` и `srt-booking` тоже добавлены.
4. Если для очередного legacy-gap нет устойчивого public source, закрывать его документно, а не открывать forced implementation backlog.
5. Держать в CI синхрон верхнеуровневой документации не только по install-flow, но и по package-status matrix, boundary notes, package README и отсутствию устаревшей release-археологии в README/roadmap.
6. Подбирать только такие новые российские replacement-сценарии, которые реально можно поддерживать без логина, приватных токенов и brittle anti-bot обходов.
