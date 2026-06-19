# Дорожная карта

## Цель миграции

`ru-skill` должен перестать быть просто переносом активов `k-skill` и стать рабочим набором навыков для российских и русскоязычных пользователей. Практический критерий успеха: в репозитории должны появляться новые русскоязычные навыки, а устаревшие пакеты должны быть явно отделены от нового позиционирования в документации, релизах и матрице пакетов.

## Статус на 2026-06-18 (раунд 57)

- Устранён следующий слой English jargon в user-facing surfaces: `regex-` → `регулярные выражения` (5 файлов), `backlog` → `перечень задач` (6 файлов), `target-*` → `целев*` (20+ вхождений), `transition-*` → `переходн*` (5 файлов), `legacy-*` compounds → `устаревш*` (40+ вхождений), `free` → `бесплатный`, `optional` → `опционально`, `Nearby-поиск` → `Поиск ближайших`, `Nearby JSON` → `JSON ресторанов поблизости`, `public-source` → `на публичных источниках`, `fetch для тестов` → `запросов для тестов`, `migration-пунктов/plan` → `пунктов миграции/план миграции`, `backward-compatible` → `обратно совместимые`, `boundary` → `границей`, `distinction` → `различие`, `replacement` → `замена`, секционные заголовки русифицированы.
- Doc-regression расширен: добавлены 7 новых тестов на отсутствие English jargon и наличие русских эквивалентов.
- Полный `npm run ci` проходит.

## Статус на 2026-06-17 (раунд 55)

- Устранён следующий слой English jargon в user-facing surfaces: `side effects` → `действия с побочными эффектами` (srt-booking/SKILL.md, kakaotalk-mac/SKILL.md), `holdings` → `позиций` (toss-securities/SKILL.md), `pixel-perfect` → `точную` (hh-vacancies/SKILL.md), `watchlist` → `список наблюдения` (docs/features/toss-securities.md), `waitlist` → `лист ожидания` (docs/features/ktx-booking.md), `scope` → `область действия` (yandex-market-search/SKILL.md, docs/features/ktx-booking.md), `inline-характеристики` → `встроенные характеристики` (yandex-market-search SKILL.md и feature doc), `canonical` → `канонический` (yandex-market-search), `merchant-level` → `со стороны продавца` (docs/features/yandex-market-search.md), `anchor-точка` → `опорная точка` (docs/features/kakao-bar-nearby.md), `slug` → `идентификатор категории` (zoon-nearby/SKILL.md, packages/stoloto-lotto/README.md), `ingress` → `входной прокси` (docs/features/k-skill-proxy.md), `extraction` → `извлечение изображений` (docs/features/hwp.md), `flow` → `потоки` (packages/daiso-product-search/README.md), `dry-run` → `пробный запуск` (kakaotalk-mac/SKILL.md), `harvest, inspect` → `сбор данных, проверка` (kakaotalk-mac/SKILL.md), `shorthand` → `сокращение` (docs/features/osm-nearby.md).
- Переведены оставшиеся жаргонизмы в тестовых файлах: `HTML-фикстура` → `эталонный HTML`, `фикстуры` → `эталонные данные`, `канонические слаги` → `канонические идентификаторы`.
- Doc-regression расширен: добавлены 17 новых тестов на отсутствие English jargon и наличие русских эквивалентов.
- Полный `npm run ci` проходит.

## Статус на 2026-06-17 (раунд 56)

- Устранён следующий слой English jargon в user-facing surfaces: `alias` → `псевдоним` (setup SKILL.md, docs/install.md, README.md, docs/roadmap.md, docs/brand-inventory.md), `setup-alias` → `псевдоним настройки`, `post-install` → `после установки`, `shared secrets` → `общие секреты`, `feature-specific` → `для отдельных функций`, `setup-навык` → `навык настройки`, `setup-поток` → `поток настройки`, `product card page` → `страница карточки товара`, `Raw JSON` → `Необработанный JSON`, `Legacy alias` → `Устаревший псевдоним`, `compatibility alias` → `псевдоним совместимости`.
- Doc-regression расширен: добавлены 3 новых теста на отсутствие English jargon и наличие русских эквивалентов.
- Полный `npm run ci` проходит.

## Статус на 2026-06-16 (раунд 54)

- Устранён следующий слой English jargon в user-facing surfaces: `proxy` → `прокси` (~25 вхождений в docs, SKILL.md, setup docs), `workflow` → `процесс/сценарий` (docs/releasing.md, AGENTS.md, python-packages/README.md, docs/features/zipcode-search.md, docs/install.md, docs/roadmap.md), `batch` → `пакетная обработка/пакетных задач` (docs/features/hwp.md), `plan` → `план` (docs/brand-inventory.md).
- Переведены английские h1-заголовки в 2 SKILL.md: `# KakaoTalk Mac CLI` → `# CLI для KakaoTalk на macOS`, `# Toss Securities` → `# Брокерские данные Toss Securities`.
- Переведены английские подзаголовки в docs/features/rpl-results.md: `### Standings (турнирная таблица)` → `### Турнирная таблица`, `### Match results (результаты матчей)` → `### Результаты матчей`.
- Doc-regression расширен: добавлены 6 новых тестов на отсутствие English jargon и наличие русских эквивалентов.
- Полный `npm run ci` проходит.

## Статус на 2026-06-16 (раунд 53)

- Устранён следующий слой English jargon в user-facing surfaces: `Anti-bot` → `Антибот` (zoon-nearby SKILL.md и docs), `retry policy` → `политика повторных попыток` (delivery-tracking), `retry-циклы` → `циклы повторных попыток` (srt-booking), `timeout` → `тайм-аут` (zipcode-search), `tracking query` → `отслеживающих параметров запроса` (yandex-market-search), `runtime-проверки` → `проверки времени выполнения`, `runtime-artifacts` → `артефакты выполнения` (setup SKILL.md), `bot-generated` → `сгенерированного ботом` (AGENTS.md, docs/releasing.md), `helpers` → `вспомогательные утилиты` (docs/brand-inventory.md), `helper` → `вспомогательный скрипт` (README.md), `live-обновления` → `обновления в реальном времени` (docs/sources.md).
- Устранён English jargon в тестовых файлах: `payload` → `данные`, `live-запросы` → `запросы в реальном времени` (kleague-results), `upstream-ответы` → `вышестоящие ответы` (k-skill-proxy).
- Doc-regression расширен: добавлены 3 новых теста на отсутствие English jargon и наличие русских эквивалентов.
- Полный `npm run ci` проходит.

## Статус на 2026-06-15 (раунд 51)

- Устранён следующий слой English jargon в user-facing surfaces: `endpoint` → `эндпоинт` (AGENTS.md, docs/setup.md, docs/security-and-secrets.md, docs/brand-inventory.md, docs/sources.md), `anti-bot` → `антибот` (README.md, docs/booking-replacements.md, docs/features/ktx-booking.md, ktx-booking/SKILL.md, packages/zoon-nearby/README.md, docs/features/zoon-nearby.md, docs/sources.md, docs/roadmap.md, TODO.md), `proxy endpoint` → `прокси-эндпоинт` (docs/setup.md, docs/security-and-secrets.md), `credential` → `учётные данные` (docs/setup.md), `scaffold` → `каркас/каркасная заготовка` (AGENTS.md, docs/releasing.md, python-packages/README.md).
- Устранён English jargon в тестовых файлах: `unexpected url/URL` → `неожиданный URL` (3 файла), `upstream-payload` → `вышестоящий ответ`, `мок-запрос` → `имитированный запрос` (2 файла), `upstream` → `вышестоящего API`, `fallback` → `запасной вариант` (mock data), `direct lookup should not run` → `прямой поиск не должен выполняться`.
- Устранён English jargon в helper-скриптах, changeset-сводках и docs/sources.md: `fallback-поиск` → `резервный поиск`, `fixture-тесты` → `тесты на эталонных данных`, `export-ссылки` → `экспорт-ссылки`, `production` → `промышленного использования`, `CSR` → `клиентский рендеринг (CSR)`, `supplementary` → `дополнительный`.
- Doc-regression расширен: добавлены 4 новых теста на отсутствие English jargon в user-facing surfaces, тестовых файлах и описаниях тестов.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-14 (раунд 49)

- Переведены на русский английские сообщения об ошибках в имитированных ответах тестов: `Unexpected mocked URL` → `Неожиданный имитированный URL` (8 файлов), `provider should not be called` → `провайдер не должен вызываться` (1 файл).
- Добавлены русские ключевые слова (keywords) во все 13 target package.json для обнаружения русскоязычными пользователями npm.
- Doc-regression расширен: добавлены тесты на отсутствие английских сообщений в имитированных ответах тестов и на наличие русских keywords в target package.json.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-12

- Переведены на русский все оставшиеся английские assert-сообщения в `scripts/skill-docs.test.js` (~107 сообщений).
- Переведены на русский английские h1-заголовки в верхнеуровневых документах: `# Brand Inventory` → `# Инвентарь бренда`, `# Sources` → `# Источники`, `# Roadmap` → `# Дорожная карта`.
- Устранён оставшийся English jargon в feature docs: `production`, `live-проверке`, `live-вёрстку`, `live-данные`, `export`, `discovery` → русские аналоги.
- Doc-regression расширен на русские h1-заголовки и отсутствие English jargon в feature docs.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-11

- Улучшен навык `mchs-storm-warnings`: добавлены 30+ разговорных сокращений и псевдонимов российских регионов (`"Удмуртия"`, `"Башкирия"`, `"Питер"`, `"Подмосковье"` и др.); нечёткий поиск защищён от тривиально коротких запросов; добавлен тайм-аут сетевых запросов (15 с).
- Переведены на русский все английские описания тестов в 19 файлах `packages/*/test/*.js` (~140 строк); описания тестов `mchs-storm-warnings` были уже переведены ранее, теперь все остальные пакеты тоже.
- Переведены английские значения `lookup_mode` в `scripts/fine_dust.py`: `"coordinates"` → `"координаты"`, `"fallback"` → `"запасной вариант"`.
- Doc-regression расширен на новые возможности MCHS и русские описания тестов.
- Аудит подтверждает: оставшийся English в `packages/*/test/` — только имена тестов в `scripts/skill-docs.test.js` и Python-тестах; оставшийся English в source code — только code identifiers и domain-inherent термины.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-10

- Закрыт следующий слой English jargon в source code, SKILL.md, feature docs и top-level docs: `lookup` → `поиск`, `real-time` → `в реальном времени`, `nearby` → `ближайших`, `Sold out` → `Места распроданы`, `Write-операции` → `Операции записи`, `aggressive polling` → `агрессивного опроса`, `HTML scraping/crawling` → `HTML-парсинг`, `prominently` → `выделяется`.
- Переведены на русский все оставшиеся английские JSDoc и комментарии в source code: `kinopoisk-search/src/index.js`, `yandex-market-search/src/parse.js`, `yandex-rasp/src/index.js`, `kinopoisk-search/src/parse.js`.
- Переведены на русский 2 SKILL.md h1-заголовка: `# Fine Dust по местоположению` → `# Мелкая пыль по местоположению`, `# Blue Ribbon Nearby` → `# Рестораны Blue Ribbon поблизости`.
- Doc-regression расширен на этот слой: добавлены тесты на отсутствие `lookup`, `real-time`, `nearby endpoint`, `Sold out`, `Write-операции`, `aggressive polling`, `HTML scraping/crawling`, `prominently`, английских JSDoc и `/* ignore */`.
- Аудит подтверждает: оставшийся English в source code — только code identifiers и domain-inherent термины; оставшийся English в документации — только link labels к документам и навыкам с английскими именами.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-09

- Переведены на русский все английские комментарии и JSDoc в исходном коде всех target-пакетов: `mchs-storm-warnings`, `rpl-results`, `kinopoisk-search`, `stoloto-lotto`, `zoon-nearby`, `osm-nearby`, `pravo-documents`, `yandex-rasp`, а также в legacy-пакетах `kakao-bar-nearby` и `k-skill-proxy`.
- Переведены на русский все английские описания тестов в `packages/mchs-storm-warnings/test/index.test.js`.
- Добавлена doc-regression проверка на русские сообщения об ошибках в `mchs-storm-warnings`.
- Аудит подтверждает: оставшийся English в `packages/*/src/` — только code identifiers и domain-inherent термины.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-06

- Закрыт следующий узкий слой English jargon в shell/infrastructure surfaces: `scripts/check-setup.sh` и `scripts/validate-skills.sh` теперь используют русские user-facing сообщения вместо `missing`, `insecure`, `next steps`, `skill layout looks valid` и других англоязычных helper-status форм.
- `scripts/run-k-skill-proxy.sh` повторно проверен как немой launcher без user-facing drift; `ru-skill`-first порядок secrets и legacy fallback в нём сохранён.
- Doc-regression расширен на shell/infrastructure surfaces: тесты страхуют русские статусы и ошибки в `scripts/check-setup.sh` и `scripts/validate-skills.sh`, а также не дают вернуть старые английские формулировки.
- Полный `npm test` и `validate-skills` должны подтверждать этот слой синхронизации.

## Статус на 2026-06-05

- Закрыт следующий мелкий слой mixed-language drift в repo-governance и publish surfaces: `packages/zoon-nearby/README.md` переведён с `## Обзор` на каноничный заголовок `## Что делает навык`, `AGENTS.md` русифицирован, а оставшиеся `fixture-based` формулировки в `.changeset/fair-steaks-pretend.md` и `.changeset/moex-shares.md` переведены на русский.
- Doc-regression расширен на эти поверхности: тесты теперь страхуют отсутствие `## Обзор` в `packages/zoon-nearby/README.md`, `Default posture: public read-only endpoint` в `AGENTS.md` и `fixture-based` в changeset-сводках.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-03

- Закрыт следующий слой English drift в docs/roadmap.md: `Migration milestones` → `Вехи миграции`, `Milestone N` → `Веха N`, `Legacy packages` → `Legacy-пакеты`.
- Устранён English jargon в docs/features/osm-nearby.md: `free/no-key` → `бесплатное решение без API-ключа`, `sparse` → `неполным`.
- Исправлена грамматическая ошибка в kleague-results/SKILL.md: `текущий турнирная` → `текущая турнирная`.
- Нормализован заголовок в docs/features/rpl-results.md: `Когда НЕ использовать` → `Когда не использовать`.
- Переведён `free/no-key` → `бесплатный источник без API-ключа` в docs/sources.md.
- Doc-regression расширен на roadmap milestone headings и osm-nearby English jargon.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.

## Статус на 2026-06-02

- Закрыт следующий слой mixed-language drift в release/publish surfaces: все 7 английских changeset-сводок (`.changeset/zoon-nearby-add.md`, `osm-nearby-add.md`, `rpl-results.md`, `pravo-documents.md`, `stoloto-lotto.md`, `kinopoisk-search.md`, `clever-dingos-think.md`) переведены на русский, чтобы publish-summary copy не отставала от README и package metadata.
- Переведены на русский все 5 оставшихся английских SKILL.md frontmatter `description` (toss-securities, srt-booking, seoul-subway-arrival, ktx-booking, delivery-tracking) и устранена смешанная description в blue-ribbon-nearby.
- Добавлен frontmatter в `packages/osm-nearby/SKILL.md`.
- Doc-regression расширен на changeset summaries и SKILL.md frontmatter descriptions: тесты теперь страхуют русские формулировки на этих publish surfaces.
- Закрыт следующий слой mixed-language drift в transition/setup surfaces: `docs/setup.md`, `docs/security-and-secrets.md`, `docs/features/fine-dust-location.md`, `docs/features/k-skill-proxy.md`, `fine-dust-location/SKILL.md`, оба setup-skill, `examples/secrets.env.example` и `packages/k-skill-proxy/README.md` выровнены по русской терминологии для резервных путей, переопределения адреса и слоя совместимости.
- Все 20 workspace `package.json` descriptions переведены на русский и синхронизированы с текущим target/legacy/transition позиционированием, так что publish metadata не расходится с верхнеуровневой документацией.
- Doc-regression дополнительно страхует этот слой: тесты проверяют новые русские формулировки вокруг `KSKILL_PROXY_BASE_URL`, `AIR_KOREA_OPEN_API_KEY` и descriptions publishable workspace-пакетов.
- Полный `npm test` и `validate-skills` проходят после этой синхронизации.
- Закрыт следующий слой mixed-language drift в legacy package README и feature guides: boundary/product copy на обновлённых surfaces переведён на русский без изменения code identifiers и статус-маркеров `legacy-only` / `transition`.
- Английский заголовок `## Live smoke snapshot` убран из legacy package README с проверенными smoke-примерами; на этих surfaces теперь используется `## Проверенный проверочный пример`.
- Doc-regression дополнительно страхует touched legacy surfaces от возврата `backward compatibility`, `reference flow`, `target-backlog`, `public-source replacement` и `adapter-based tracking flow`.
- Полный `npm test` проходит: doc-regression зелёный, workspace-тесты и `validate-skills` подтверждают, что документная русификация не сломала publishable пакеты и skill layout.
- Переведён `## Boundary note` → `## Граничное примечание` во всех 31 файле (15 SKILL.md, 16 docs/features/*.md).
- Переведены английские h1-заголовки в 9 target SKILL.md на русский.
- Переведены английские h1-заголовки в 4 docs/features на русский.
- Переведены на русский все 10 target package README: описания, секционные заголовки и содержимое.
- Переведены на русский frontmatter `description` в 8 target SKILL.md.
- Нормализованы неканоничные заголовки в package README: `Что умеет` → `Что делает навык`, `Что не умеет` → `Ограничения`, `Готово, когда` → `Критерии завершения`.
- Все 17 SKILL.md с неканоничными заголовками нормализованы к единой схеме (`Что делает навык`, `Предварительные условия`, `Критерии завершения`, `Возможные ошибки`); устранены варианты `Что делает этот навык`, `Что умеет`, `Предварительные требования`, `Считается выполненным, когда`, `Режимы сбоев`, `Необходимые входные данные`, `Готово, когда`.
- Все 29 feature docs в `docs/features/` нормализованы к каноничной heading scheme; устранены `Что умеет этот сценарий`, `Что нужно заранее`, `Базовый поток`, `Базовый сценарий`, `Обзор`, `Входы`, `Как это работает`, `Требования`, `Что можно сделать`.
- `packages/osm-nearby/SKILL.md` полностью перестроен под каноничную схему target-навыка.
- Устранены 10 Chinese character артефактов в user-facing документации: `整理` → `структурировать` (7 мест), `布尔` → `булевый` (1 место), `实时` → `real-time` (1 место), `返回` → `вернуть` (1 место).
- Doc-regression расширен: добавлены тесты на каноничность heading scheme во всех SKILL.md и feature docs, а также на отсутствие Chinese character артефактов.
- Английские заголовки секций во всех 6 target SKILL.md с английскими заголовками переведены на русский и приведены к единой схеме (`Что делает навык`, `Когда использовать`, `Предварительные условия`, `Входные данные`, `Рабочий процесс`, `Критерии завершения`, `Возможные ошибки`, `Примечания`).
- Нестандартные русские формулировки в `yandex-rasp/SKILL.md` и `yandex-market-search/SKILL.md` нормализованы к той же схеме.
- Последние Korean фрагменты в feature docs переведены: `근처 술집 조회` → `Поиск баров поблизости`, `K리그 결과 조회` → `Результаты K League`.
- Doc-regression тесты обновлены под новые заголовки и переводы.
- `ru-skill-setup` переведён на русские заголовки (`Назначение`, `Порядок разрешения учётных данных`, `Стандартный сценарий`, `Совместимость`) и больше не выбивается как preferred setup-skill с английскими секциями.
- `k-skill-setup` выровнен с тем же верхнеуровневым heading scheme: устаревший псевдоним теперь тоже использует `Назначение`, `Порядок разрешения учётных данных`, `Стандартный сценарий`, `Совместимость`, а прежние отдельные top-level секции (`Установка`, `Шаги настройки`, `Контрольный список завершения`) убраны под вложенные подразделы без изменения сценария.
- `zoon-nearby/SKILL.md` и `packages/zoon-nearby/SKILL.md` приведены к target-канону русских секций; дополнительный nearby-источник больше не выбивается как отдельный стиль документации.
- `docs/features/zoon-nearby.md` и `packages/zoon-nearby/README.md` очищены от случайного mixed-language артефакта `可以直接`; doc-regression теперь страхует не только Korean-boundary, но и отсутствие такого user-facing drift в Zoon surfaces, а package README использует каноничный заголовок `## Что делает навык`.
- `TODO.md` переведён на top-block governance: актуальными считаются верхние planning-блоки, а исторические `Новые пункты плана` очищены от активных unchecked-пунктов.
- Doc-regression дополнительно страхует preferred setup-heading scheme и то, что живой backlog остаётся только в верхнем plan block `TODO.md`.
- Последний слой user-facing Korean в source code и docs устранён: форматирование призов `k-lotto` (`원` → `вон`, locale `ru-RU`) и примеры CLI-запросов `kakaotalk-mac` переведены на русский.
- Аудит подтверждает: весь оставшийся Korean — domain-inherent (API parameters, location names, fixture data, regex patterns); новых user-facing Korean фрагментов для перевода нет.
- Skill-level copy audit завершён: 7 мест, где legacy-контекст описывался как рабочее значение по умолчанию, исправлены на обратно совместимый запасной вариант (`delivery-tracking`, `toss-securities`, `hwp`, `blue-ribbon-nearby`, `ktx-booking`).
- Doc-regression расширен на 4 legacy-навыка с проверками сценария и содержимого: `seoul-subway-arrival`, `kbo-results`, `lotto-results`, `srt-booking`.
- User-facing Korean labels в source code переведены на русский: статусы матчей (`kleague-results`), подсказки вместимости (`kakao-bar-nearby`), лотерейные метки (`k-lotto`), сообщения об ошибках (`blue-ribbon-nearby`).
- User-facing Korean текст в feature docs, SKILL.md и package README дополнительно русифицирован: `kakao-bar-nearby`, `blue-ribbon-nearby`, `kleague-results`, `zipcode-search`, `hwp`, `ktx-booking`, `kakaotalk-mac`.
- Doc-regression расширен на все 13 target-навыков: `moex-shares`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `osm-nearby` добавлены в этом раунде.
- Следующий слой legacy feature/skill drift закрыт: `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby`, `kleague-results`, `srt-booking` и `ktx-booking` теперь явно публикуют `## Граничное примечание` и подтверждённые границы замен.
- Doc-regression расширен и на этот слой, чтобы nearby, marketplace, football и legacy railway replacement copy не расходился между `docs/features/*` и `*/SKILL.md`.
- Корневой README, install/setup/releasing-документы уже переводятся на русскоязычную терминологию.
- В рабочем дереве по-прежнему остаются legacy-пакеты и domain-inherent Korean фрагменты (API parameters, location names, fixture data, regex patterns), но user-facing Korean copy уже устранён.
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
- Проведён раунд исследования перед реализацией по booking replacement; матрица решений вынесен в `docs/booking-replacements.md`, а граница замен зафиксирован отдельно от release-hygiene.
- Документация устаревших железнодорожных навыков выровнена с этой границей: `srt-booking` и `ktx-booking` явно сохранены как обратно совместимые корейские сценарии, а не как шаблон для новых российских интеграций на запись.
- Milestone 5 закрыт документно: `yandex-rasp` признан достаточным стабильной основой для railway discovery, а отдельный навык-перенаправление не даёт новой устойчивой API-функции без скатывания в автоматизацию оформления заказа.
- Railway replacement выведен из активного перечня задач по реализации; оставшаяся матрица устаревших пакетов для `seoul-subway-arrival` и `toss-securities` уже доведена до одинакового статуса в README, roadmap и install-flow.
- `k-skill-proxy` теперь синхронно маркируется как переходной слой в верхнеуровневых user-facing документах, а не как неявно "активный" продуктовый трек.
- User-facing guides для `delivery-tracking`, `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy` дополнены граничными примечаниями, чтобы устаревшие/переходные сценарии не выглядели как скрытый целевой перечень задач.
- `fine-dust-location`, `docs/setup.md`, `docs/security-and-secrets.md` и `packages/k-skill-proxy/README.md` теперь тоже держат единый `ru-skill`-first порядок учётных данных и не продвигают опубликованный прокси-эндпоинт как новый целевой по умолчанию.
- Doc-regression расширен до `fine-dust-location` и package-level proxy docs: проверяется граничное примечание, порядок `~/.config/ru-skill/secrets.env` -> `~/.config/k-skill/secrets.env` и то, что `KSKILL_PROXY_BASE_URL` описан как override, а не как обязательный секрет.
- `examples/secrets.env.example`, setup-skills и `scripts/check-setup.sh` теперь тоже выровнены с этой моделью: `KSKILL_PROXY_BASE_URL` не входит в минимальный шаблон секретов и везде подан как необязательное переопределение эндпоинта, а не как обязательные учётные данные.
- Doc-regression расширен на шаблон секретов и вспомогательные документы настройки, чтобы различие между необязательным переопределением и реальными секретами не терялось вне верхнеуровневых документов.
- Следующий package-level drift тоже закрыт: README у `toss-securities`, `daiso-product-search`, `kleague-results`, `blue-ribbon-nearby`, `kakao-bar-nearby` и `k-lotto` теперь синхронно фиксируют `legacy-only` статус и уже подтверждённые российские replacements там, где они существуют.
- Doc-regression расширен ещё на этот слой package README, чтобы граница миграции не держалась только на feature guides и верхнеуровневых документах.
- Setup/runtime drift тоже закрыт на skill-level: даже устаревший псевдоним `k-skill-setup` теперь использует `~/.config/ru-skill/bin` и `~/.config/ru-skill/logs` как рабочее значение по умолчанию для update-check automation, а `~/.config/k-skill/*` остаётся только запасным контуром совместимости.
- Doc-regression расширен на setup runtime-artifacts, чтобы `k-skill`-prefixed bin/log directories не возвращались в документацию как основной рабочий путь.
- Следующий skill-level drift тоже закрыт: `fine-dust-location`, `srt-booking` и `ktx-booking` теперь синхронно маркируют устаревшую/переходную границу, используют `ru-skill`-first порядок учётных данных и не подают переопределение прокси или устаревший железнодорожный сценарий как активный целевой по умолчанию.
- Doc-regression расширен на этот skill-level слой, чтобы railway/fine-dust copy не возвращала скрытый целевой перечень задач, legacy endpoint defaults или `k-skill`-first порядок учётных данных.
- Ещё один skill-only drift тоже закрыт: `kakaotalk-mac`, `kbo-results`, `lotto-results` и `zipcode-search` теперь синхронно помечают `legacy-only` границу и больше не выглядят как активные целевые кандидаты.
- Doc-regression расширен на эти skill-only guides и соответствующие `SKILL.md`, чтобы confirmed replacements и compatibility-role удерживались и в user-facing, и в agent-facing документации.
- Helper/runtime cleanup теперь закрыт и на следующем user-facing слое: `fine-dust-location`, `seoul-subway-arrival`, `srt-booking` и `ktx-booking` дополнительно страхуются тестами на `ru-skill`-first secrets order, runtime/secrets semantics и replacement boundary.
- Приоритет после этого сместился с helper/runtime docs/scripts на добор русификации оставшихся legacy feature-docs и на дальнейшее расширение doc-regression именно по user-facing guides, а не только по `SKILL.md` и setup/proxy helper surfaces.
- Milestone 4 переведён в зафиксированное состояние по документной части: legacy-пакеты размечены, матрица замен актуализирована, публичная документация не продвигает корейские сценарии как основной путь.
- В качестве третьего источника вне финансового домена выбран `Postcalc` как справочник только для чтения индексов и отделений на базе эталонного справочника Почты России.
- В качестве четвёртого источника вне финансов и логистики выбран публичный API `hh.ru` как базовый сценарий только для чтения вакансий и регионов.
- Для setup и helper-скриптов уже внедрён dual-path secrets: `~/.config/ru-skill/secrets.env` с fallback на `~/.config/k-skill/secrets.env`.
- Добавлен псевдоним совместимости `ru-skill-setup`, чтобы новый поток настройки не продвигал legacy-имя `k-skill-setup` как основной сценарий.
- Верхнеуровневые документы `README.md`, `TODO.md`, `docs/install.md` и `docs/roadmap.md` дополнительно синхронизированы регрессионными тестами, чтобы новые target-навыки не выпадали из install-flow.

## Уже выпущенные целевые навыки

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
- Навык по проверке мелкой пыли по местоположению
- Навык поиска ближайших ресторанов Blue Ribbon
- Навык поиска ближайших баров
- Навык поиска товаров Daiso

## Вехи миграции

### Веха 1. Русификация верхнего уровня

Цель: убрать смешение русских и корейских заголовков в корневой документации и сделать репозиторий понятным без знания устаревшего контекста.

Критерии готовности:

- `README.md`, `docs/install.md`, `docs/setup.md`, `docs/releasing.md`, `docs/roadmap.md` используют единую русскоязычную терминологию.
- Placeholder-команды установки заменены на безопасные примеры с `denis-gordeev/ru-skill`.
- `TODO.md` ведётся как живой task list для следующих automation round.

Статус: завершён.

### Веха 2. Legacy inventory и новое позиционирование

Цель: развести то, что остаётся ради обратной совместимости, и то, что считается целевым развитием `ru-skill`.

Критерии готовности:

- Для каждого workspace-пакета определён статус: `legacy`, `transition` или `target`.
- Выявлены package/skill-имена, которые нельзя быстро переименовать из-за совместимости, и задокументирован план их обвязки брендом `ru-skill`.
- README и roadmap явно показывают, какие пакеты не являются целевым продуктовым направлением.
- Инвентарь зафиксирован в `docs/brand-inventory.md`.

Статус: завершён.

### Веха 3. Первый русскоязычный навык

Цель: добавить новый сценарий поверх публичного API или официального веб-интерфейса, не завязанный на корейские сервисы.

Критерии готовности:

- Есть выбранный источник в `docs/sources.md`.
- Есть рабочий skill/package или документированный skill-only сценарий.
- Есть README/feature-guide, тесты или проверка на основе эталонных данных.
- Навык можно установить из репозитория по той же схеме, что и текущие skills.

Статус: завершён.

### Веха 4. Управляемое сворачивание legacy

Цель: сократить долю устаревших функций в публичной коммуникации, не ломая существующие потоки.

Критерии готовности:

- Для каждого устаревшего пакета решено: оставить как есть, вынести отдельно или заменить русскоязычным аналогом.
- Новые релизы и документация не продвигают устаревшие пакеты как основной сценарий репозитория.
- Матрица замен поддерживается в roadmap и TODO.
- Все legacy SKILL.md файлы переведены на русский язык для единообразия документации.

Статус: завершён по документации и управлению миграцией. Устаревшие пакеты сохранены ради совместимости, но документно отделены от целевой линейки; незакрытые пробелы вынесены в следующий milestone.

### Веха 5. Booking replacements и release hygiene

Цель: не просто держать устаревшие навыки бронирования как исторический хвост, а либо найти жизнеспособные российские замены, либо явно зафиксировать, что замена невозможна без авторизации и закрытых API.

Критерии готовности:

- Исследованы минимум два кандидата для замены `srt-booking` и `ktx-booking`: официальный РЖД поток и один агрегаторный сценарий только для чтения.
- В roadmap и TODO нет устаревших статусов round-summary, которые противоречат фактическому состоянию репозитория.
- Changeset/release backlog приведён в состояние, из которого можно делать следующий publish round без ручной археологии по старым summary.

Статус: завершён; release-hygiene подзадача закрыта, booking-research проведён документно, legacy railway docs выровнены с replacement boundary, а отдельный только для чтения/перенаправление skill сверх `yandex-rasp` признан нецелесообразным.

Текущее решение по направлению:

- Полноценный `rzd-booking` не идёт в MVP, пока не подтверждён устойчивый официальный интерфейс без автоматизации оформления заказа, логина и ненадёжных обходов антибота.
- `tutu.ru` и Яндекс Путешествия фиксируются как кандидаты на только для чтения/перенаправление сценарий, а не как подтверждённые public booking API.
- Базовый поиск железнодорожных маршрутов сценарий уже покрывается `yandex-rasp`; отдельный целевой пакет не открывается, пока он не добавляет устойчивую API-функцию, а не тонкую обёртку над внешним оформлением заказа.
- Критерий закрытия milestone вынесен в [отдельный документ по booking replacements](booking-replacements.md).

## Устаревшие пакеты и целевые замены

| Пакет | Текущий статус | Что делает сейчас | Целевая замена или направление | Статус замены |
| --- | --- | --- | --- | --- |
| `cbr-rates` | `target` | Официальные курсы валют Банка России | Базовый финансовый навык только для чтения для российской ветки репозитория | Реализован |
| `moex-shares` | `target` | Публичные метаданные и задержанные цены акций Московской биржи | Базовый навык только для чтения по российскому фондовому рынку | Реализован |
| `postcalc-postcodes` | `target` | Сводки только для чтения по индексам и отделениям через публичные страницы Postcalc | Базовый навык по почтовым индексам и отделениям Почты России | Реализован |
| `hh-vacancies` | `target` | Поиск вакансий только для чтения, карточки вакансий и поиск регионов через публичный API hh.ru | Базовый навык по российскому рынку труда и русскоязычному сценарию поиска работы | Реализован |
| `stoloto-lotto` | `target` | Публичные результаты лотерей Столото через архивные страницы | Базовый навык только для чтения по российским публичным результатам лотерей, замена `k-lotto` | Реализован |
| `kinopoisk-search` | `target` | Поиск фильмов только для чтения и карточек фильмов через публичные страницы Кинопоиска | Базовый навык по российскому кино и развлекательному контенту | Реализован |
| `mchs-storm-warnings` | `target` | Официальные экстренные предупреждения МЧС по региональным страницам | Базовый навык по публичной безопасности и погодным рискам для российских регионов | Реализован |
| `pravo-documents` | `target` | Поиск и карточки официальных правовых документов через API pravo.gov.ru | Базовый навык по справочному праву и официальным документам | Реализован |
| `yandex-rasp` | `target` | Расписания транспорта (электрички, поезда, автобусы, авиарейсы) через API Яндекс.Расписаний | Базовый навык по расписаниям транспорта и городским сервисам, замена корейского транспорта | Реализован |
| `rpl-results` | `target` | Турнирная таблица и результаты матчей Российской Премьер-Лиги через championat.com | Базовый навык по российскому спорту и футбольным сводкам, замена `kleague-results` | Реализован |
| `yandex-market-search` | `target` | Поиск товаров и карточки товаров через серверно отрендеренные страницы Яндекс Маркета | Базовый навык по российским маркетплейсам и поиск товаров только для чтения, замена `daiso-product-search` | Реализован |
| `k-lotto` | `legacy` | Результаты корейской лотереи | Заменён на `stoloto-lotto` — российские публичные результаты лотерей | Заменён |
| `kleague-results` | `legacy` | K League расписание и таблица | Заменён на `rpl-results` — российские спортивные сводки через championat.com | Заменён |
| `daiso-product-search` | `legacy` | Товары и остатки Daiso | Заменён на `yandex-market-search` — российское обнаружение на маркетплейсе через Яндекс Маркет | Заменён |
| `blue-ribbon-nearby` | `legacy` | Ближайшие рестораны Blue Ribbon | Заменён на `osm-nearby` и `zoon-nearby` — бесплатный поиск ближайших заведений через OpenStreetMap и Zoon.ru | Заменён |
| `kakao-bar-nearby` | `legacy` | Бары рядом через Kakao Map | Заменён на `osm-nearby` и `zoon-nearby` — бесплатный поиск ближайших заведений через OpenStreetMap и Zoon.ru | Заменён |
| `toss-securities` | `legacy` | Обёртка только для чтения над `tossctl` | Прямая российская замена не подтверждена; рыночные сводки только для чтения уже покрывает `moex-shares` | Закрыто документно; legacy-only |
| `srt-booking` | `legacy` | Бронирование поездов SRT | `yandex-rasp` как база только для чтения + ручное внешнее перенаправление без автоматизации оплаты | Закрыто документно; новый целевой пакет не открывается |
| `ktx-booking` | `legacy` | Бронирование поездов KTX/Korail | Объединён с заменой `srt-booking` — обнаружение только для чтения и ручное внешнее перенаправление вместо прямой оплаты | Закрыто документно; новый целевой пакет не открывается |
| `seoul-subway-arrival` | `legacy` | Прибытие поездов метро Сеула | Прямая российская замена не подтверждена; публичные источники дают только низкоценные статические справочники | Закрыто документно; legacy-only |
| `k-skill-proxy` | `transition` | Узкий прокси для бесплатных API | Сохранить как инфраструктурную базу и добавить русскоязычные адаптеры | Сохраняется |
| `hwp`-документация и tooling | `целевой-вспомогательный` | Обработка HWP-документов | Сохранить как отдельную полезную утилиту вне темы российской локализации | Сохраняется |

## Приоритеты следующих раундов

1. Railway replacement закрыт документно: `yandex-rasp` остаётся конечной границей только для чтения, а автоматизация оформления заказа не идёт в новый целевой перечень задач без подтверждённого публичного API.
2. Fine-dust/proxy secrets-template drift, skill-only drift, устаревшие feature/skill drift, helper/runtime cleanup, skill-level copy audit, полная русификация user-facing Korean, нормализация heading scheme во всех SKILL.md и feature docs и устранение Chinese character артефактов уже закрыты; doc-regression покрывает все 13 целевых навыков и все устаревшие навыки с проверками границ, сценария, содержимого, каноничной схемы заголовков и отсутствия смешанных языков.
3. Держать `TODO.md` источником правды через верхние planning-блоки; исторические round-секции сохранять как архив и не возвращать туда активные unchecked-пункты.
4. Если для очередного пробела в устаревших навыках нет устойчивого публичного источника, закрывать его документно, а не открывать принудительный перечень задач по реализации.
5. Держать в CI синхрон верхнеуровневой документации не только по install-flow, но и по package-status matrix, граничные примечания, package README, top-level TODO governance, heading scheme critical surfaces, transition/setup copy, package metadata descriptions и отсутствию устаревшей release-археологии в README/roadmap.
6. Крупный слой English jargon (`read-only`, `supplementary`, `fallback`, `baseline`, `fixture-based`, `handoff`, `checkout`, `write-`, `discovery`, `boundary`, `credential`, `endpoint override`, `target-backlog`, `compatibility-layer`, `backward-compatible`, `mutation`, `decision matrix`, `nearby-поиск`, `live smoke`, `operational default`, `delayed-`, `passthrough`, `self-hosted`, `production`, `live-`, `export`) устранён из user-facing документации, repo-governance и shell/infrastructure surfaces; английские assert-сообщения в тестах и h1-заголовки верхнеуровневых документов тоже русифицированы; английские сообщения в имитированных ответах тестов (`Unexpected mocked URL`, `provider should not be called`) переведены на русский; русские keywords добавлены во все 13 target package.json; следующий проход — по редким артефактам в npm script output и других непокрытых helper-поверхностях.
7. Подбирать только такие новые российские replacement-сценарии, которые реально можно поддерживать без логина, приватных токенов и ненадёжных обходов антибота.
