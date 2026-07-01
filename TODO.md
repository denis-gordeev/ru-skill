# TODO

Живой список задач для `ru-skill`. Обновляется по итогам каждого раунда автоматизации.

Исторические сводки раундов ниже сохраняются как журнал миграции. Источником актуального статуса считаются самые верхние блоки `Статус ...`, `Выполнено в этом раунде` и `Новые пункты плана`.

## Статус на 2026-07-01 (раунд 72)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английского жаргона и гибридов в верхнеуровневых документах: `skill/package` → `навык/пакет` (docs/roadmap.md ×14), `booking-research` → `исследование по заменам бронирования` (docs/roadmap.md), `update-check automation` → `автоматизация проверки обновлений` (docs/roadmap.md), `k-skill-prefixed bin/log directories` → `каталоги bin/log с префиксом k-skill` (docs/roadmap.md), `secrets order` → `порядок секретов` (docs/roadmap.md), `runtime/secrets semantics` → `семантика среды выполнения/секретов` (docs/roadmap.md), `replacement boundary` → `граница замен` (docs/roadmap.md), `skills` standalone → `навыки` (docs/roadmap.md), `skill-именам` → `именам навыков` (docs/brand-inventory.md), `Skill` заголовок таблицы → `Навык` (docs/brand-inventory.md), `workspace-пакеты` → `пакеты рабочего пространства` (docs/install.md), `npm-пакеты` → `пакеты npm` (docs/install.md, docs/releasing.md ×3), `skill-сценарии` → `сценарии навыков` (docs/install.md), `пользовательским skill` → `пользовательским навыком` (docs/install.md), `для railway` → `для железнодорожных маршрутов` (docs/booking-replacements.md), `public API` → `публичный API` (docs/booking-replacements.md).
- Устранён слой английского жаргона в SKILL.md prose: `env` → `переменные окружения` (srt-booking, ktx-booking, fine-dust-location), `GitHub star` → `отметка звездой на GitHub` (k-skill-setup ×5), `secrets file` → `файл секретов` (k-skill-setup), `secrets path` → `путь к секретам` (k-skill-setup, ru-skill-setup), `raw HTML` → `исходный HTML` (zipcode-search), `frontend вакансии` → `вакансии фронтенда` (hh-vacancies), `area id` → `идентификатор региона` (hh-vacancies), `latest` → `последний` (lotto-results), `export` → `экспорт` (kbo-results), `cookie` → `куки` (delivery-tracking), `ribbon` → удалено (blue-ribbon-nearby), `city/category поиск` → `поиск по городу/категории` (zoon-nearby ×2), `here-doc + Python one-liner` → `heredoc и однострочный скрипт на Python` (zipcode-search).
- Русифицированы значения `category` во вступительных метаданных всех 28 SKILL.md: `finance` → `финансы`, `utility` → `утилиты`, `location` → `местоположение`, `jobs` → `вакансии`, `marketplace` → `маркетплейс`, `public-safety` → `общественная-безопасность`, `legal-reference` → `правовая-справка`, `transport` → `транспорт`, `sports` → `спорт`, `food` → `еда`, `retail` → `розница`, `travel` → `путешествия`, `logistics` → `логистика`, `messaging` → `обмен-сообщениями`, `documents` → `документы`, `transit` → `транзит`, `local` → `местный`, `setup` → `настройка`.
- Исправлена грамматическая ошибка: `полный метаданные` → `полные метаданные` (docs/sources.md).
- Устранён крупный слой английских гибридов в исторических секциях TODO.md: `nearby-запросов` → `запросов поиска поблизости`, `nearby-поиска` → `поиска поблизости`, `railway сценар` → `железнодорожных сценари`, `railway/fine-dust` → `железнодорожных навыков и мелкой пыли`, `railway docs` → `железнодорожные документы`, `handoff-слой` → `слой перенаправления`, `checkout-поверхности` → `поверхности оформления заказа`, `cleanup` → `очистка/очистки`, `compounds` → `составных терминов`, `surfaces` → `поверхностей/поверхности`, `metadata` → `метаданные`, `frontmatter` → `вступительные метаданные`, `keywords` → `ключевые слова`, `locale` → `локаль`, `Korean` → `корейский`, `standalone` → `отдельно`, и др. (~110 замен).
- Документная регрессия расширена: добавлены проверки на русские формулировки и отсутствие английских гибридов в docs/roadmap.md, docs/install.md, docs/brand-inventory.md, docs/booking-replacements.md, docs/releasing.md, docs/sources.md, SKILL.md prose; обновлён раунд на 72.

## Выполнено в этом раунде (раунд 72)

- [x] `docs/roadmap.md`: `skill/package` → `навык/пакет` (14 вхождений), `booking-research` → `исследование по заменам бронирования`, `update-check automation` → `автоматизация проверки обновлений`, `k-skill-prefixed bin/log directories` → `каталоги bin/log с префиксом k-skill`, `secrets order` → `порядок секретов`, `runtime/secrets semantics` → `семантика среды выполнения/секретов`, `replacement boundary` → `граница замен`, `skills` standalone → `навыки`, `public booking API` → `публичный API бронирования`.
- [x] `docs/brand-inventory.md`: `skill-именам` → `именам навыков`, `Skill` → `Навык` в заголовке таблицы.
- [x] `docs/install.md`: `workspace-пакеты` → `пакеты рабочего пространства`, `npm-пакеты` → `пакеты npm` (2 вхождения), `skill-сценарии` → `сценарии навыков`, `пользовательским skill` → `пользовательским навыком`.
- [x] `docs/releasing.md`: `npm-пакеты` → `пакеты npm` (2 вхождения).
- [x] `docs/booking-replacements.md`: `для railway` → `для железнодорожных маршрутов`, `public API` → `публичный API`.
- [x] `docs/sources.md`: `полный метаданные` → `полные метаданные` (грамматика).
- [x] `srt-booking/SKILL.md`: `инжектировать как env` → `инжектировать как переменные окружения`, `Если env нет` → `Если переменных окружения нет`.
- [x] `ktx-booking/SKILL.md`: `Если env нет` → `Если переменных окружения нет`.
- [x] `fine-dust-location/SKILL.md`: `Если env пуст` → `Если переменные окружения пусты`.
- [x] `k-skill-setup/SKILL.md`: `GitHub star` → `отметка звездой на GitHub` (5 вхождений), `secrets file` → `файл секретов`, `secrets path` → `путь к секретам` (2 вхождения).
- [x] `ru-skill-setup/SKILL.md`: `secrets path` → `путь к секретам`.
- [x] `hh-vacancies/SKILL.md`: `frontend вакансии` → `вакансии фронтенда`, `area id` → `идентификатор региона`.
- [x] `zipcode-search/SKILL.md`: `raw HTML` → `исходный HTML`, `here-doc + Python one-liner` → `heredoc и однострочный скрипт на Python`.
- [x] `lotto-results/SKILL.md`: `latest` → `последний`.
- [x] `kbo-results/SKILL.md`: `export` → `экспорт`.
- [x] `delivery-tracking/SKILL.md`: `cookie` → `куки`.
- [x] `blue-ribbon-nearby/SKILL.md`: удалено `(ribbon)`.
- [x] `zoon-nearby/SKILL.md`, `packages/zoon-nearby/SKILL.md`: `city/category поиск` → `поиск по городу/категории`.
- [x] Все 28 SKILL.md: русифицированы значения `category` во вступительных метаданных.
- [x] `TODO.md`: устранён крупный слой английских гибридов в исторических секциях (~110 замен).
- [x] `scripts/skill-docs.test.js`: добавлены регрессии раунда 72; обновлён раунд на 72.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечнем задач.

## Новые пункты плана

- [ ] Продолжить аудит исторических секций `TODO.md` на оставшиеся гибриды (ещё остались `booking`, `discovery`, `handoff`, `boundary`, `helper`, `runtime`, `credential`, `override`, `fallback`, `copy`, `backlog`, `standalone`, `smoke` и др. в старых раундах).
- [ ] Провести аудит руководств по функциям (docs/features/*.md) на следующий слой гибридов.
- [ ] Рассмотреть русификацию YAML-ключей `metadata`, `locale`, `phase` во вступительных метаданных SKILL.md (если инструментально безопасно).

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой смешанной терминологии в верхнеуровневых документах: `setup` → `настройка` / `навык настройки`, `shell-скрипты` → `оболочковые скрипты`, `live-статус` → `оперативный статус`, `ru-skill-first` → `приоритетный для ru-skill`, `setup-skills` → `навыки настройки`, `runtime-artifacts` → `артефакты выполнения контура настройки`, `shell/infrastructure` → `поверхности оболочки и инфраструктуры`.
- Документная регрессия расширена: добавлены проверки на отсутствие этих гибридов в `README.md` и `docs/releasing.md`; верхнеуровневые документы синхронизированы на раунд 70.

## Выполнено в этом раунде (раунд 70)

- [x] `README.md`: русифицированы гибриды вокруг контура настройки, инфраструктуры и исторических сводок (`setup`, `shell-скрипты`, `live-статус`, `ru-skill-first`, `setup-skills`, `runtime-artifacts`, `shell/infrastructure`, `regex` в прозе).
- [x] `docs/releasing.md`: `Changesets` и `release-please` оставлены как точные идентификаторы инструментов, а окружающая русская формулировка упорядочена через `файлы .changeset`, `автоматизация .changeset` и `` `release-please` ``.
- [x] `docs/roadmap.md`: добавлен новый актуальный статус раунда 70 с синхронизацией текущего слоя работ.
- [x] `scripts/skill-docs.test.js`: добавлены регрессии против новых гибридных формулировок в верхнеуровневых документах.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечнем задач.

## Новые пункты плана

- [x] Продолжить такой же аудит уже по историческим секциям `TODO.md`, где ещё остались старые гибриды из ранних раундов.
- [x] Проверить верхнеуровневые документы на следующий слой смешения вокруг англоязычных имён инструментов и служебных меток релизного контура, не трогая кодовые идентификаторы.

## Статус на 2026-06-30 (раунд 69)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английского жаргона в пользовательских поверхностях: `canonical` → `канонический` (docs/sources.md), `inline` → `встроенные` (docs/sources.md), `Blue Ribbon nearby` → `ресторан Blue Ribbon поблизости` (blue-ribbon-nearby/SKILL.md), `zone` без обратных кавычек → `зоной` (blue-ribbon-nearby/SKILL.md), `zone-списка` → `списка зон` (docs/features/blue-ribbon-nearby.md), `Fastify-прокси` → `прокси на Fastify` (docs/features/k-skill-proxy.md, packages/k-skill-proxy/README.md, packages/k-skill-proxy/package.json), `устаревший кейс` → `устаревший сценарий` (packages/k-skill-proxy/README.md), `паттерн адаптера` → `шаблон адаптера` (delivery-tracking/SKILL.md), `паттерн` → `шаблон` (seoul-subway-arrival/SKILL.md).
- Документная регрессия расширена: добавлены 7 новых тестов на отсутствие английского жаргона (`canonical`, `inline`, `nearby` в критериях завершения, `zone` без перевода, `zone-списка`, `Fastify-прокси`, `кейс`) и наличие русских эквивалентов; обновлён раунд на 69.

## Выполнено в этом раунде (раунд 69)

- [x] docs/sources.md: `canonical` → `канонический`, `inline` → `встроенные`.
- [x] blue-ribbon-nearby/SKILL.md: `Blue Ribbon nearby` → `ресторан Blue Ribbon поблизости`, `официальным zone` → `официальной зоной`.
- [x] docs/features/blue-ribbon-nearby.md: `zone-списка` → `списка зон`.
- [x] docs/features/k-skill-proxy.md: `Fastify-прокси` → `прокси на Fastify`.
- [x] packages/k-skill-proxy/README.md: `Fastify-прокси` → `прокси на Fastify`, `устаревший кейс` → `устаревший сценарий`.
- [x] packages/k-skill-proxy/package.json: `Fastify-прокси` → `Прокси на Fastify` в description.
- [x] delivery-tracking/SKILL.md: `паттерн адаптера` → `шаблон адаптера`.
- [x] seoul-subway-arrival/SKILL.md: `паттерн` → `шаблон`.
- [x] `scripts/skill-docs.test.js`: добавлены 7 новых тестов на отсутствие английского жаргона и наличие русских эквивалентов; обновлён раунд на 69; обновлены существующие тесты (`кейс` → `сценарий`, `Fastify-прокси` → `прокси на Fastify`).
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечнем задач.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшегося английского жаргона в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-29 (раунд 68)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английского жаргона в пользовательских поверхностях: `API key` / `API ключ` без дефиса → `API-ключ` (docs/features/osm-nearby.md ×2, docs/features/fine-dust-location.md, docs/features/zoon-nearby.md, yandex-market-search/SKILL.md, packages/osm-nearby/SKILL.md ×3), `MChS` → `МЧС` (mchs-storm-warnings/SKILL.md), `accessibility-автоматизации` → `автоматизации специальных возможностей` (kakaotalk-mac/SKILL.md), `Реалтайм-подписки` → `Подписки в реальном времени` (docs/sources.md), `harvest действий` → `действий по сбору данных` (docs/features/kakaotalk-mac.md), `Target`/`Legacy`/`Transition` как английские ярлыки в прозе → русские эквиваленты (README.md ×4).
- Документная регрессия расширена: добавлены 5 новых тестов на отсутствие английского жаргона (`API key` без дефиса, `MChS` в русской прозе, `accessibility-автоматизации`, `Реалтайм-подписки`, `harvest действий`, английские `Target`/`Legacy`/`Transition` ярлыки) и наличие русских эквивалентов; обновлён раунд на 68.

## Выполнено в этом раунде (раунд 68)

- [x] docs/features/osm-nearby.md: `API ключ` → `API-ключ`, `API key` → `API-ключ`.
- [x] docs/features/fine-dust-location.md: `API key` → `API-ключ`.
- [x] docs/features/zoon-nearby.md: `API ключей` → `API-ключей`.
- [x] yandex-market-search/SKILL.md: `API key` → `API-ключа`.
- [x] packages/osm-nearby/SKILL.md: `API ключа` → `API-ключа` (3 вхождения).
- [x] mchs-storm-warnings/SKILL.md: `MChS` → `МЧС`.
- [x] kakaotalk-mac/SKILL.md: `accessibility-автоматизации` → `автоматизации специальных возможностей`.
- [x] docs/sources.md: `Реалтайм-подписки` → `Подписки в реальном времени`.
- [x] docs/features/kakaotalk-mac.md: `harvest действий` → `действий по сбору данных`.
- [x] README.md: `Target`/`Legacy`/`Transition` английские ярлыки → русские эквиваленты (4 вхождения).
- [x] `scripts/skill-docs.test.js`: добавлены 5 новых тестов на отсутствие английского жаргона и наличие русских эквивалентов; обновлён раунд на 68; обновлены существующие тесты.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечнем задач.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшегося английского жаргона в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-28 (раунд 67)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английского жаргона в пользовательских поверхностях: `Гайд` → `Руководство` (16 docs/features/*.md h1 заголовков, 30 ссылок в README.md, 4 ссылки в docs/setup.md), `skill-каталоги` → `каталоги навыков` (AGENTS.md), `home-install` → `сценариев домашней установки` (AGENTS.md), `symlink` → `символическую ссылку` (AGENTS.md), `secrets-файл` → `файл секретов` (docs/install.md), `secrets-шаблон` → `шаблон секретов` (docs/setup.md, docs/security-and-secrets.md), `skill-only` → `skill-сценарии` (docs/install.md), `runtime` → `среда выполнения` (docs/install.md), `мержится` → `вливается` (docs/releasing.md), `legacy` отдельно → `устаревший` (docs/features/srt-booking.md, ktx-booking.md, k-skill-proxy.md), `legacy-пакет` → `устаревший пакет` (packages/k-lotto/README.md), `Placeholder-команды` → `Шаблонные команды` (docs/roadmap.md), `workspace-пакета` → `пакета рабочего пространства` (docs/roadmap.md), `package/skill-имена` → `имена пакетов/навыков` (docs/roadmap.md), `tooling` → `инструментарий` (docs/roadmap.md), `Feature guides` → `руководства по функциям` (docs/brand-inventory.md), `референс` → `пример` (docs/features/k-skill-proxy.md), `official zone` → `официальная зона` (docs/features/blue-ribbon-nearby.md), `metro-источники` → `источники данных метро` (docs/features/seoul-subway-arrival.md), `raw-доступ` → `прямой доступ` (docs/features/fine-dust-location.md), `shell-обвязке` → `оболочковой обёртке` (docs/features/zipcode-search.md), `pack-артефакт` → `архивный артефакт` (docs/features/kleague-results.md), `harvest-подобных` → `подобных harvest` (docs/features/kakaotalk-mac.md), `Boolean-операторами` → `булевыми операторами` (docs/features/pravo-documents.md), `API key` → `API-ключ` (docs/sources.md, docs/features/osm-nearby.md, docs/features/seoul-subway-arrival.md), `Slug`/`Слаг` → `Идентификатор` (docs/features/stoloto-lotto.md, docs/features/zoon-nearby.md, packages/zoon-nearby/README.md), `railway` → `железнодорожный` (yandex-rasp/SKILL.md), `aisle` → `ряд` (daiso-product-search/SKILL.md), `UI-автоматизации` → `автоматизации интерфейса` (kakaotalk-mac/SKILL.md), `target-пакета` → `целевого пакета` (docs/booking-replacements.md), `логин` → `вход` (docs/features/toss-securities.md), `issue tracker` → `система отслеживания задач` (README.md), `npm script output` → `вывод npm-скриптов` (README.md), `OSM nearby` → `OSM поблизости` (README.md), `Fine dust` → `Мелкая пыль` (README.md), `postcode search` → `поиск почтовых индексов` (README.md), `Daiso product search` → `поиск товаров Daiso` (README.md), `delivery tracking` → `отслеживание доставки` (README.md), macOS permissions порядок → русский-первый (kakaotalk-mac/SKILL.md, docs/features/kakaotalk-mac.md), `фикстура` → `эталонный набор данных` (docs/sources.md), `help/default URL` → `справка/URL по умолчанию` (docs/brand-inventory.md), `workspace-пакетов` → `пакетов рабочего пространства` (docs/roadmap.md).
- macOS-разрешения переведены на порядок русский-первый: `Полный доступ к диску (Full Disk Access)` и `Универсальный доступ (Accessibility)`.
- Документная регрессия расширена: добавлены 11 новых тестов на отсутствие английского жаргона и наличие русских эквивалентов; обновлён раунд на 67.

## Выполнено в этом раунде (раунд 67)

- [x] 16 docs/features/*.md: `# Гайд по` → `# Руководство по` в h1-заголовках.
- [x] README.md: `[Гайд по` → `[Руководство по` в 30 ссылках; английские остатки в ссылках переведены.
- [x] docs/setup.md: `[Гайд по` → `[Руководство по` в 4 ссылках.
- [x] AGENTS.md: `skill-каталоги` → `каталоги навыков`, `home-install` → `сценариев домашней установки`, `symlink` → `символическую ссылку`.
- [x] docs/install.md: `secrets-файл` → `файл секретов`, `skill-only` → `skill-`, `runtime` → `среда выполнения`.
- [x] docs/setup.md и docs/security-and-secrets.md: `secrets-шаблон` → `шаблон секретов`.
- [x] docs/releasing.md: `мержится` → `вливается` (2 вхождения).
- [x] docs/features/srt-booking.md, ktx-booking.md: `legacy запасной вариант` → `устаревшем запасном варианте`.
- [x] docs/features/k-skill-proxy.md: `legacy AirKorea-поток` → `устаревший AirKorea-поток`, `референс` → `пример`.
- [x] docs/features/blue-ribbon-nearby.md: `official zone` → `официальная зона`.
- [x] docs/features/seoul-subway-arrival.md: `metro-источники` → `источники данных метро`, `API key` → `API-ключ`.
- [x] docs/features/fine-dust-location.md: `raw-доступ` → `прямой доступ`.
- [x] docs/features/zipcode-search.md: `shell-обвязке` → `оболочковой обёртке`.
- [x] docs/features/kleague-results.md: `pack-артефакт` → `архивный артефакт`.
- [x] docs/features/kakaotalk-mac.md: macOS permissions порядок → русский-первый, `harvest-подобных` → `подобных harvest`.
- [x] docs/features/pravo-documents.md: `Boolean-операторами` → `булевыми операторами`.
- [x] docs/features/osm-nearby.md: `API key` → `API-ключ`.
- [x] docs/features/toss-securities.md: `логин` → `вход` (3 вхождения).
- [x] docs/features/stoloto-lotto.md: `Slug` → `Идентификатор`.
- [x] docs/features/zoon-nearby.md: `Слаг` → `Идентификатор`.
- [x] packages/k-lotto/README.md: `legacy-пакет` → `устаревший пакет`.
- [x] packages/zoon-nearby/README.md: `Slug` → `Идентификатор`.
- [x] kakaotalk-mac/SKILL.md: macOS permissions русский-первый, `UI-автоматизации` → `автоматизации интерфейса`.
- [x] yandex-rasp/SKILL.md: `railway` → `железнодорожный`.
- [x] daiso-product-search/SKILL.md: `aisle` → `ряд`.
- [x] docs/sources.md: `API key` → `API-ключ` (4 вхождения), `фикстура` → `эталонный набор данных`.
- [x] docs/roadmap.md: `Placeholder-команды` → `Шаблонные команды`, `workspace-пакета` → `пакета рабочего пространства`, `package/skill-имена` → `имена пакетов/навыков`, `tooling` → `инструментарий`, `workspace-пакетов` → `пакетов рабочего пространства`.
- [x] docs/brand-inventory.md: `Feature guides` → `руководства по функциям`, `help/default URL` → `справка/URL по умолчанию`.
- [x] docs/booking-replacements.md: `target-пакета` → `целевого пакета`.
- [x] README.md: `issue tracker` → `система отслеживания задач`, `npm script output` → `вывод npm-скриптов`.
- [x] `scripts/skill-docs.test.js`: добавлены 11 новых тестов на отсутствие английского жаргона и наличие русских эквивалентов; обновлён раунд на 67; обновлены существующие тесты.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечнем задач.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшегося английского жаргона в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-26 (раунд 66)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английского жаргона в пользовательских поверхностях: `skill` отдельно → `навык` (docs/sources.md ×13), `public API` → `публичный API` (docs/sources.md), `fuzzy search` → `нечёткий поиск` (docs/sources.md), `websocket` → `веб-сокеты` (docs/sources.md), `Query-конструкциями` → `конструкциями запросов` (docs/sources.md), `merchant-facing` → `со стороны продавца` (docs/sources.md), `API keys` → `API-ключи` (docs/sources.md, docs/features/zoon-nearby.md), `regression-тесты` → `регрессионные тесты` (docs/sources.md), `skill-гайды` → `руководства по навыкам` (docs/sources.md), `setup` в заголовке → `настройка` (docs/install.md), `secrets-файл` → `файл секретов` (docs/security-and-secrets.md), `setup` в ссылке → `настройке` (docs/security-and-secrets.md), `package path` → `путь пакета` (AGENTS.md), `task list` → `перечень задач` (docs/roadmap.md), `automation round` → `раунд автоматизации` (docs/roadmap.md, TODO.md).
- Устранён следующий слой английского жаргона в исторических секциях TODO.md: `iteration backlog` → `перечень задач следующей итерации` (~22 вхождения), `legacy-gap` → `пробел в устаревших навыках` (4 вхождения), `public source` → `публичный источник` (4 вхождения), `forced implementation backlog` → `принудительный перечень задач по реализации` (4 вхождения), `target-пакет`/`target-package` → `целевой пакет` (~8 вхождений), `doc-governance` → `управление документацией`, `legacy guides` → `устаревшие руководства`, `governance gap` → `пробел в управлении`, `booking research` → `исследование бронирования`, `replacement boundary` → `граница замен`, `research-first` → `начиная с исследования`, `decision matrix` → `матрица решений`, `railway booking replacements` → `замены железнодорожного бронирования`, `release-hygiene` → `релиз-гигиена`, `premature implementation` → `преждевременная реализация`, `full booking automation` → `полная автоматизация бронирования`, `target-MVP` → `целевой минимальный рабочий вариант`, `official/public interface` → `официальный/публичный интерфейс`, `implementation backlog` → `перечень задач по реализации`, `fixture-based`/`fixture-first` → `на основе эталонных данных` (5 вхождений), `optional-override` → `необязательное переопределение`, `real-credential` → `реальные учётные данные`, `product gap` → `продуктовый пробел`, `implementation priority` → `приоритет реализации`, `implementation-направление` → `направление реализации`, `Milestone N` → `Веха N`, `handoff-skill` → `навык-перенаправление`, `handoff-сценарий` → `сценарий перенаправления`, `handoff-ценность` → `ценность перенаправления`, `research backlog` → `перечень задач по исследованию`, `railway backlog` → `железнодорожный перечень задач`, `railway replacement` → `замена железнодорожных навыков`, `replacement-а` → `замен`, `baseline` → `основа`, `automation round` → `раунд автоматизации`, `round summaries` → `сводки раундов`.
- Документная регрессия расширена: добавлены 7 новых тестов на отсутствие английского жаргона (`skill` отдельно, `public API`, `fuzzy search`, `websocket`, `Query-конструкциями`, `merchant-facing`, `API keys`, `regression-тесты`, `skill-гайды`, `setup` в заголовке, `secrets-файл`, `setup` в ссылке, `package path`, `task list`, `automation round`) и наличие русских эквивалентов; обновлён раунд на 66.

## Выполнено в этом раунде (раунд 66)

- [x] `docs/sources.md`: `skill` отдельно → `навык` (13 вхождений), `public API` → `публичный API`, `fuzzy search` → `нечёткий поиск`, `websocket` → `веб-сокеты`, `Query-конструкциями` → `конструкциями запросов`, `merchant-facing` → `со стороны продавца`, `API keys` → `API-ключи`, `regression-тесты` → `регрессионные тесты`, `skill-гайды` → `руководства по навыкам`.
- [x] `docs/install.md`: `setup` в заголовке → `настройка`.
- [x] `docs/security-and-secrets.md`: `secrets-файл` → `файл секретов`, `setup` в ссылке → `настройке`.
- [x] `docs/features/zoon-nearby.md`: `API keys` → `API-ключи`.
- [x] `AGENTS.md`: `package path` → `путь пакета`.
- [x] `docs/roadmap.md`: `task list` → `перечень задач`, `automation round` → `раундов автоматизации`.
- [x] `TODO.md`: `iteration backlog` → `перечень задач следующей итерации` (~22 вхождения), `automation round` → `раунд автоматизации`, `round summaries` → `сводки раундов`, и ~30 других английских жаргонизмов в исторических секциях → русские эквиваленты.
- [x] `scripts/skill-docs.test.js`: добавлены 7 новых тестов на отсутствие английского жаргона и наличие русских эквивалентов; обновлён раунд на 66.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечнем задач.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшегося английского жаргона в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-25 (раунд 64)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён крупный слой английского жаргона в исторических секциях README.md, docs/roadmap.md и TODO.md: `user-facing` → `пользовательский` / `пользовательская` / `пользовательские` (~50+ вхождений), `doc-regression` / `Doc-regression` → `документная регрессия` / `Документная регрессия` (~40+ вхождений), `heading scheme` → `схема заголовков` / `схеме заголовков` (~13 вхождений), `install-flow` → `поток установки` (5 вхождений), `publishable` → `публикуемый` / `публикуемых` (3 вхождения), `publish surfaces` → `поверхности публикации` (3 вхождения), `domain-inherent` → `обусловлен доменом` / `обусловленный доменом` (4 вхождения), `frontmatter` → `вступительные метаданные` (~8 вхождений), `skill-only` → `только навыков` (6 вхождений), `package-level` → `на уровне пакета` (4 вхождения), `source-level` → `на уровне исходного кода` (1 вхождение), `agent-facing` → `агентный` (1 вхождение), `inventory` → `реестр` (3 вхождения), `governance` / `repo-governance` → `управление` / `управление репозиторием` (3 вхождения), `launcher` → `загрузчик` (1 вхождение), `checklist-пункты` → `контрольные пункты` (1 вхождение), `copy` (жаргон) → `текст` / `аудит текста` (~5 вхождений), `English jargon` / `English drift` → `английский жаргон` / `англоязычный дрейф` (~20 вхождений), `Chinese character` → `китайских иероглифов` (6 вхождений), `mixed-language` → `смешанноязычный` (5 вхождений), `Railway replacement` → `Замена железнодорожных навыков` (3 вхождения), `booking replacement` → `замена бронирования` (2 вхождения), `backlog` → `перечень задач` (3 вхождения), `feature docs` / `feature guides` → `руководства по функциям` (~20 вхождений), `source code` → `исходный код` (~7 вхождений), `code identifiers` → `кодовые идентификаторы` (3 вхождения), `drift` составных терминов → `дрейф` составных терминов (~10 вхождений), `surfaces` отдельно → `поверхности` (~6 вхождений), `top-level docs` → `верхнеуровневые документы`, `top-block` → `управление через верхние блоки`, `round-секции` → `секции раундов`, `unchecked-пункты` → `неотмеченные пункты`, `plan block` → `блок плана`, `override` → `переопределение`, `replacement` → `замена` (5 вхождений), `Korean` отдельно → `корейский` (5 вхождений).
- `docs/roadmap.md`: Веха 5 заголовок переведён — `Booking replacements` → `Замены бронирования`.
- `scripts/skill-docs.test.js`: обновлён раунд на 64, обновлены тестовые утверждения под новые русские формулировки.

## Выполнено в этом раунде (раунд 64)

- [x] `README.md`, `docs/roadmap.md`, `TODO.md`: `user-facing` → `пользовательский` / `пользовательская` / `пользовательские` (~50+ вхождений).
- [x] `README.md`, `docs/roadmap.md`, `TODO.md`: `doc-regression` / `Doc-regression` → `документная регрессия` / `Документная регрессия` (~40+ вхождений).
- [x] `README.md`, `docs/roadmap.md`: `heading scheme` → `схема заголовков` / `схеме заголовков` (~13 вхождений).
- [x] `README.md`, `docs/roadmap.md`: `install-flow` → `поток установки` (5 вхождений).
- [x] `README.md`, `docs/roadmap.md`: `publishable` → `публикуемый` / `публикуемых` (3 вхождения).
- [x] `docs/roadmap.md`: `publish surfaces` → `поверхности публикации` (3 вхождения).
- [x] `README.md`, `docs/roadmap.md`: `domain-inherent` → `обусловлен доменом` / `обусловленный доменом` (4 вхождения).
- [x] `README.md`, `docs/roadmap.md`: `frontmatter` → `вступительные метаданные` (~8 вхождений).
- [x] `README.md`, `docs/roadmap.md`: `skill-only` → `только навыков` (6 вхождений).
- [x] `README.md`, `docs/roadmap.md`: `package-level` → `на уровне пакета` (4 вхождения).
- [x] `README.md`: `source-level` → `на уровне исходного кода`.
- [x] `docs/roadmap.md`: `agent-facing` → `агентный`.
- [x] `README.md`, `docs/roadmap.md`: `inventory` → `реестр` (3 вхождения).
- [x] `README.md`, `docs/roadmap.md`: `governance` / `repo-governance` → `управление` / `управление репозиторием`.
- [x] `docs/roadmap.md`: `launcher` → `загрузчик`.
- [x] `README.md`: `checklist-пункты` → `контрольные пункты`.
- [x] `README.md`, `docs/roadmap.md`: `copy` (жаргон) → `текст` / `аудит текста` (~5 вхождений).
- [x] `README.md`, `docs/roadmap.md`, `TODO.md`: `English jargon` / `English drift` → `английский жаргон` / `англоязычный дрейф` (~20 вхождений).
- [x] `README.md`, `docs/roadmap.md`: `Chinese character` → `китайских иероглифов` (6 вхождений).
- [x] `docs/roadmap.md`: `mixed-language` → `смешанноязычный` (5 вхождений).
- [x] `docs/roadmap.md`: `Railway replacement` → `Замена железнодорожных навыков`.
- [x] `docs/roadmap.md`: `booking replacement` → `замена бронирования`.
- [x] `README.md`, `docs/roadmap.md`, `TODO.md`: `backlog` → `перечень задач` (3 вхождения).
- [x] `README.md`, `docs/roadmap.md`: `feature docs` / `feature guides` → `руководства по функциям` (~20 вхождений).
- [x] `docs/roadmap.md`: `source code` → `исходный код` (~7 вхождений).
- [x] `docs/roadmap.md`: `code identifiers` → `кодовые идентификаторы`.
- [x] `docs/roadmap.md`: `drift` составных терминов → `дрейф` составных терминов (~10 вхождений).
- [x] `README.md`, `docs/roadmap.md`: `surfaces` отдельно → `поверхности` (~6 вхождений).
- [x] `docs/roadmap.md`: заголовок Вехи 5 `Booking replacements` → `Замены бронирования`.
- [x] `scripts/skill-docs.test.js`: обновлён раунд на 64, обновлены тестовые утверждения.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечнем задач.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшегося английского жаргона в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-24 (раунд 63)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английский жаргон в исторических секциях README.md и docs/roadmap.md: `roadmap` → `дорожная карта` / `дорожной карты` (12 вхождений в README.md, docs/roadmap.md, docs/brand-inventory.md), `target` / `target-` → `целевой` / `целев*` (23 вхождения в README.md и docs/roadmap.md), `edge-case` → `крайних случаев` (README.md), `fallback` → `запасной вариант` / `запасным вариантом` (docs/roadmap.md ×2), `legacy` отдельно → `устаревший` / `устаревшие` / `устаревших` (18 вхождений в README.md и docs/roadmap.md), `legacy-` составных терминов → `устаревш*` (5 вхождений в README.md и docs/roadmap.md), `metadata` → `метаданные` (docs/roadmap.md), `endpoint` → `эндпоинт` (docs/roadmap.md), `transition-навыки` → `переходные навыки` (README.md), `transition-boundary` → `граница перехода` (README.md), `migration-governance` → `управление миграцией` (README.md), `runtime-default` → `значение по умолчанию для выполнения` (README.md), `operational path` → `рабочий путь` (README.md), `setup-skill` → `навык настройки` (README.md ×2), `utility-пакетов` → `вспомогательных пакетов` (README.md), `legacy/transition` → `устаревшие/переходные` (README.md), `legacy defaults` → `устаревшие значения по умолчанию` (README.md), `transition/setup surfaces` → `переходные поверхности настройки` (README.md ×3), `mixed-language drift` → `смешанноязычный дрейф` (README.md ×2), `shell/infrastructure surfaces` → `поверхности оболочки/инфраструктуры` (README.md ×3), `publish metadata` → `метаданные публикации` (docs/roadmap.md), `coverage` → `охват` (README.md), `migration-boundary` → `граница миграции` (README.md), `utility workflows` → `вспомогательные сценарии` (README.md).
- Полный `npm run ci` проходит: 0 fail.

## Выполнено в этом раунде (раунд 63)

- [x] `README.md`: `roadmap` → `дорожная карта` / `дорожной карты` (5 вхождений вне обратных кавычек).
- [x] `docs/roadmap.md`: `roadmap` → `дорожная карта` / `дорожной карте` / `дорожной карты` (6 вхождений вне обратных кавычек).
- [x] `docs/brand-inventory.md`: `roadmap` → `дорожная карта` (1 вхождение).
- [x] `README.md`: `target` / `target-` → `целевой` / `целевых` / `целевые` / `целевого` / `целевому` (11 вхождений).
- [x] `docs/roadmap.md`: `target` / `target-` → `целевой` / `целевых` / `целевые` / `целевого` / `целевому` (12 вхождений).
- [x] `README.md`: `edge-case` → `крайних случаев`.
- [x] `docs/roadmap.md`: `fallback` → `запасной вариант` / `запасным вариантом` (2 вхождения вне обратных кавычек).
- [x] `docs/roadmap.md`: `publish metadata` → `метаданные публикации`.
- [x] `docs/roadmap.md`: `legacy endpoint defaults` → `устаревшие эндпоинты по умолчанию`.
- [x] `docs/roadmap.md`: `legacy fallback` → `устаревший запасной вариант`.
- [x] `README.md`: `legacy` отдельно → `устаревший` / `устаревшие` / `устаревших` (8 вхождений).
- [x] `docs/roadmap.md`: `legacy` отдельно → `устаревших` / `устаревший` / `устаревшее` (5 вхождений).
- [x] `README.md`: `legacy-пути` → `устаревшие пути`, `legacy-контекст` → `устаревший контекст`, `legacy-пакетах` → `устаревших пакетах`.
- [x] `README.md`: `transition-навыки` → `переходные навыки`, `transition-boundary` → `граница перехода`.
- [x] `README.md`: `migration-governance` → `управление миграцией`, `runtime-default` → `значение по умолчанию для выполнения`, `operational path` → `рабочий путь`.
- [x] `README.md`: `setup-skill` → `навык настройки`, `utility-пакетов` → `вспомогательных пакетов`, `utility workflows` → `вспомогательные сценарии`.
- [x] `README.md`: `mixed-language drift` → `смешанноязычный дрейф`, `shell/infrastructure surfaces` → `поверхности оболочки/инфраструктуры`, `coverage` → `охват`.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшегося английского жаргона в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-24 (раунд 62)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английский жаргон в пользовательских поверхностях: `MVP` → `минимальный рабочий вариант` (docs/sources.md ×10, yandex-market-search/SKILL.md, docs/booking-replacements.md), `secret vault`/`vault` → `хранилище секретов` (docs/setup.md, docs/security-and-secrets.md, k-skill-setup/SKILL.md, ru-skill-setup/SKILL.md, fine-dust-location/SKILL.md, seoul-subway-arrival/SKILL.md, srt-booking/SKILL.md, ktx-booking/SKILL.md, docs/features/ktx-booking.md, docs/features/srt-booking.md, docs/features/fine-dust-location.md, docs/features/seoul-subway-arrival.md), `legacy-only` → `устаревший без развития` (61 вхождение в 13 SKILL.md, 14 docs/features/*.md, 6 packages/*/README.md, docs/install.md), `ad-hoc` → `разовый` (moex-shares/SKILL.md, hh-vacancies/SKILL.md, postcalc-postcodes/SKILL.md), `provenance-метаданные` → `метаданные происхождения` (docs/releasing.md), `publish job` → `задача публикации` (python-packages/README.md ×2), `target-продуктом` → `целевым продуктом` (packages/k-skill-proxy/README.md), `Legacy эндпоинт` → `Устаревший эндпоинт` (packages/k-skill-proxy/README.md, docs/features/k-skill-proxy.md), `public API-сценарии` → `публичные API-сценарии` (docs/features/k-skill-proxy.md), `legacy эндпоинт` → `устаревший эндпоинт` (docs/features/k-skill-proxy.md), `plain dotenv` → `простой dotenv` (docs/security-and-secrets.md, k-skill-setup/SKILL.md), `текста на уровне навыков` → `тексте навыка` (fine-dust-location/SKILL.md), `amenity-типы` → `типы заведений` (packages/osm-nearby/SKILL.md ×2), `board id` → `идентификатор доски торгов` (moex-shares/SKILL.md), `lot size` → `размер лота` (moex-shares/SKILL.md), `board` → `доска торгов` (moex-shares/SKILL.md).
- Документная регрессия расширена: добавлены 12 новых тестов на отсутствие английский жаргон (`MVP`, `secret vault`/`vault`, `legacy-only`, `ad-hoc`, `provenance-метаданные`, `publish job`, `target-продукт`/`Legacy эндпоинт`/`public API-сценарии`, `lot size`/`board id`, `amenity-типы`, `plain dotenv`, `текста на уровне навыков`) и наличие русских эквивалентов; обновлён раунд на 62.

## Выполнено в этом раунде (раунд 62)

- [x] `docs/sources.md`: `MVP` → `минимальный рабочий вариант` (10 вхождений).
- [x] `yandex-market-search/SKILL.md`: `MVP` → `минимальный рабочий вариант`.
- [x] `docs/booking-replacements.md`: `MVP` → `минимальный рабочий вариант`.
- [x] `docs/setup.md`: `secret vault`/`vault` → `хранилище секретов` (5 вхождений).
- [x] `docs/security-and-secrets.md`: `secret vault`/`vault` → `хранилище секретов` (2 вхождения), `plain dotenv` → `простой dotenv`.
- [x] `k-skill-setup/SKILL.md`: `secret vault`/`vault` → `хранилище секретов` (6 вхождений), `plain dotenv` → `простой dotenv`.
- [x] `ru-skill-setup/SKILL.md`: `Secret vault` → `Хранилище секретов`.
- [x] `fine-dust-location/SKILL.md`: `secret vault` → `хранилище секретов`, `текста на уровне навыков` → `тексте навыка`.
- [x] `seoul-subway-arrival/SKILL.md`: `secret vault` → `хранилище секретов`.
- [x] `srt-booking/SKILL.md`: `secret vault`/`vault` → `хранилище секретов` (3 вхождения).
- [x] `ktx-booking/SKILL.md`: `secret vault`/`vault` → `хранилище секретов` (3 вхождения).
- [x] `docs/features/ktx-booking.md`: `secret vault`/`vault` → `хранилище секретов` (3 вхождения).
- [x] `docs/features/srt-booking.md`: `secret vault`/`vault` → `хранилище секретов` (3 вхождения).
- [x] `docs/features/fine-dust-location.md`: `secret vault`/`vault` → `хранилище секретов` (2 вхождения).
- [x] `docs/features/seoul-subway-arrival.md`: `secret vault`/`vault` → `хранилище секретов` (2 вхождения).
- [x] Все 13 SKILL.md, 14 docs/features/*.md, 6 packages/*/README.md, docs/install.md: `legacy-only` → `устаревший без развития` (61 вхождение).
- [x] `moex-shares/SKILL.md`: `ad-hoc` → `разовый`, `board id` → `идентификатор доски торгов`, `lot size` → `размер лота`, `board` → `доска торгов`.
- [x] `hh-vacancies/SKILL.md`: `ad-hoc` → `разовые`.
- [x] `postcalc-postcodes/SKILL.md`: `ad-hoc` → `разовый`.
- [x] `docs/releasing.md`: `provenance-метаданные` → `метаданные происхождения`.
- [x] `python-packages/README.md`: `publish job` → `задачу публикации`/`задача публикации` (2 вхождения).
- [x] `packages/k-skill-proxy/README.md`: `target-продуктом` → `целевым продуктом`, `Legacy эндпоинт` → `Устаревший эндпоинт`.
- [x] `docs/features/k-skill-proxy.md`: `public API-сценарии` → `публичные API-сценарии`, `legacy эндпоинт` → `устаревший эндпоинт`, `Legacy эндпоинт` → `Устаревший эндпоинт`.
- [x] `packages/osm-nearby/SKILL.md`: `amenity-типы` → `типы заведений`, `Типы amenity` → `Типы заведений`.
- [x] `scripts/skill-docs.test.js`: добавлены 12 новых тестов на отсутствие английский жаргон и наличие русских эквивалентов; обновлён раунд на 62; исправлены regex-паттерны для русского словоизменения.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшихся английский жаргон в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-19 (раунд 60)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английский жаргон в пользовательских поверхностях: `merge` → `слияния` (AGENTS.md, docs/releasing.md, docs/features/kleague-results.md), `package metadata` → `метаданные пакетов` (AGENTS.md, README.md, docs/releasing.md, docs/roadmap.md), `test fixture` → `тестовый эталон` (AGENTS.md), `release hygiene` → `релиз-гигиена` (README.md, docs/roadmap.md), `релиз-гигиена раунд` → `раунд релиз-гигиены` (README.md), `release-археологии` → `релиз-археологии` (README.md), `helper-docs` → `вспомогательных документов` (README.md), `smoke-примерами` → `проверочными примерами` (README.md), `npm/publish metadata` → `npm/publish-метаданные` (README.md), `helper/status формулировки` → `вспомогательные/status-формулировки` (README.md), `helper/runtime cleanup` → `вспомогательная/runtime-очистка` (README.md, docs/roadmap.md), `fixture data` → `эталонные данные` (README.md), `publish/release surfaces` → `публикации/релиз-поверхности` (README.md), `credential/proxy документам` → `учётных данных/прокси-документам` (README.md), `Python helper messages` → `вспомогательные сообщения Python` (README.md), `helper JS utilities` → `вспомогательные JS-утилиты` (README.md), `feature-guide` → `руководство по функции` (docs/roadmap.md), `release backlog` → `релизных задач` (docs/roadmap.md), `package metadata descriptions` → `метаданные пакетов (descriptions)` (docs/roadmap.md), `helper-поверхностях` → `вспомогательных поверхностях` (docs/roadmap.md), `release/процесс/package metadata` → `релиз/процесс/метаданные пакета` (docs/releasing.md).
- Добавлены отсутствующие h1-заголовки в 2 SKILL.md: `# Расписания Яндекс` (yandex-rasp/SKILL.md), `# Поиск на Яндекс Маркете` (yandex-market-search/SKILL.md).
- Документная регрессия расширена: добавлены 7 новых тестов на отсутствие английский жаргон (`merge`, `package metadata`, `test fixture`, `release hygiene`, `helper-docs`, `smoke-примерами`, `fixture data`, `credential/proxy`, `publish/release surfaces`, `feature-guide`, `release backlog`, `helper-поверхностях`) и наличие русских эквивалентов, а также тест на h1-заголовки в yandex-rasp/SKILL.md и yandex-market-search/SKILL.md; обновлён раунд на 60.

## Выполнено в этом раунде (раунд 60)

- [x] `AGENTS.md`: `merge сгенерированного ботом PR` → `слияния сгенерированного ботом PR`, `package metadata держите синхронными` → `метаданные пакетов держите синхронными`, `локальную test fixture внутри репозитория` → `локальный тестовый эталон внутри репозитория`.
- [x] `docs/releasing.md`: `после merge сгенерированного ботом PR` → `после слияния сгенерированного ботом PR`, `release/процесс/package metadata` → `релиз/процесс/метаданные пакета`.
- [x] `docs/features/kleague-results.md`: `после merge` → `после слияния`.
- [x] `README.md`: `release hygiene` → `релиз-гигиену`, `релиз-гигиена раунд` → `раунд релиз-гигиены`, `release-археологии` → `релиз-археологии`, `прокси helper-docs` → `прокси вспомогательных документов`, `setup helper-docs` → `вспомогательных документов настройки`, `smoke-примерами` → `проверочными примерами`, `npm/publish metadata` → `npm/publish-метаданные`, `package metadata: тесты` → `метаданные пакетов: тесты`, `helper/status формулировки` → `вспомогательные/status-формулировки`, `helper/runtime cleanup` → `вспомогательная/runtime-очистка`, `fixture data` → `эталонные данные`, `publish/release surfaces` → `публикации/релиз-поверхности`, `credential/proxy документам` → `учётных данных/прокси-документам`, `package metadata` → `метаданные пакетов` (2 вхождения), `Python helper messages` → `вспомогательные сообщения Python`, `helper JS utilities` → `вспомогательные JS-утилиты`.
- [x] `docs/roadmap.md`: `feature-guide` → `руководство по функции`, `release hygiene` → `релиз-гигиена`, `Changeset/release backlog` → `Перечень релизных задач/changeset`, `релиз-гигиена подзадача` → `подзадача релиз-гигиены`, `helper/runtime cleanup` → `вспомогательная/runtime-очистка`, `package metadata descriptions` → `метаданные пакетов (descriptions)`, `helper-поверхностях` → `вспомогательных поверхностях`.
- [x] `yandex-rasp/SKILL.md`: добавлен h1 `# Расписания Яндекс`.
- [x] `yandex-market-search/SKILL.md`: добавлен h1 `# Поиск на Яндекс Маркете`.
- [x] `scripts/skill-docs.test.js`: добавлены 7 новых тестов на отсутствие английский жаргон и наличие русских эквивалентов; обновлены тесты milestone 5 и раунд на 60.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана (раунд 60, перенесены в раунд 61)

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшихся английский жаргон в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-18 (раунд 58)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой `legacy-` составных терминов в пользовательских поверхностях: `legacy-резерв` → `устаревший резерв` (docs/setup.md, docs/security-and-secrets.md), `legacy-файл` → `устаревший файл` (docs/setup.md), `legacy-резерву` → `устаревшему резерву` (docs/setup.md), `legacy-навыков` → `устаревших навыков` (docs/sources.md ×2, docs/booking-replacements.md, docs/features/yandex-rasp.md), `legacy-пакета` → `устаревшего пакета` (docs/sources.md ×3), `legacy-сценария` → `устаревшего сценария` (docs/sources.md), `legacy-сценариев` → `устаревших сценариев` (docs/sources.md ×2, docs/features/k-skill-proxy.md), `legacy-документации` → `устаревшей документации` (docs/sources.md), `legacy-booking` → `устаревшего бронирования` / `устаревших навыков бронирования` (docs/booking-replacements.md, ktx-booking/SKILL.md, srt-booking/SKILL.md), `legacy-поверхностей` → `устаревших поверхностей` (docs/brand-inventory.md), `legacy-маркировка` → `маркировка устаревших` (docs/brand-inventory.md), `legacy-имя` → `устаревшее имя` (docs/install.md ×2, README.md, docs/brand-inventory.md), `legacy-пути` → `устаревшие пути` (docs/brand-inventory.md), `legacy-функции` → `устаревшие функции` (README.md), `legacy-пакетов` → `устаревших пакетов` (README.md), `legacy-контекста` → `устаревшего контекста` (docs/roadmap.md), `legacy-функций` → `устаревших функций` (docs/roadmap.md), `legacy-пакета/пакеты` → `устаревшего пакета/устаревшие пакеты` (docs/roadmap.md), `legacy-адаптер` → `устаревший адаптер` (docs/features/k-skill-proxy.md), `legacy-навыка` → `устаревшего навыка` (docs/features/yandex-market-search.md), `legacy-совместимый` → `обратно совместимый` (k-skill-setup/SKILL.md), `legacy-именем` → `устаревшим именем` (ru-skill-setup/SKILL.md), `legacy-сценарий` → `устаревший сценарий` (yandex-market-search/SKILL.md), `Legacy-источники` → `Устаревшие источники` (docs/sources.md), `Legacy` (заголовок) → `устаревших источников` (docs/sources.md).
- Устранён прочий английский жаргон: `adapter'ы` → `адаптеры` (docs/roadmap.md, docs/brand-inventory.md), `job-search` → `поиска работы` (docs/roadmap.md), `remaining guides` → `оставшиеся guides` (docs/brand-inventory.md), `Legacy-имя` → `Устаревшее имя` (docs/brand-inventory.md), `Legacy-путь` → `Устаревший путь` (docs/brand-inventory.md), `legacy вспомогательных скриптах` → `устаревших вспомогательных скриптах` (docs/brand-inventory.md).
- Документная регрессия расширена: добавлены 5 новых тестов на отсутствие `legacy-` составных терминов в пользовательской документации, feature docs, SKILL.md и README.md, а также на замену `adapter'ы`, `job-search` и `remaining`; обновлён существующий тест brand-inventory.md на `устаревших поверхностей` вместо `legacy-поверхностей`.
- Полный `npm run ci` проходит.

## Выполнено в этом раунде (раунд 58)

- [x] `docs/setup.md`: `legacy-резерв` → `устаревший резерв`, `legacy-файл` → `устаревший файл`, `legacy-резерву` → `устаревшему резерву`.
- [x] `docs/security-and-secrets.md`: `legacy-резерв` → `устаревший резерв`.
- [x] `docs/sources.md`: `legacy-навыков` → `устаревших навыков`, `legacy-пакета` → `устаревшего пакета` (3 вхождения), `legacy-сценария` → `устаревшего сценария`, `legacy-сценариев` → `устаревших сценариев` (2 вхождения), `legacy-документации` → `устаревшей документации`, `Legacy-источники` → `Устаревшие источники`, заголовок `Legacy` → `устаревших источников`.
- [x] `docs/booking-replacements.md`: `legacy-навыков` → `устаревших навыков`, `legacy-booking` → `устаревшего бронирования`.
- [x] `docs/brand-inventory.md`: `legacy-поверхностей` → `устаревших поверхностей`, `legacy-маркировка` → `маркировка устаревших`, `Legacy-имя` → `Устаревшее имя`, `Legacy-путь` → `Устаревший путь`, `adapter'ы` → `адаптеры`, `remaining guides` → `оставшиеся guides`, `legacy вспомогательных скриптах` → `устаревших вспомогательных скриптах`.
- [x] `docs/install.md`: `legacy-имя` → `устаревшее имя` (2 вхождения), `legacy npm-пакетов` → `устаревших npm-пакетов`.
- [x] `docs/features/yandex-rasp.md`: `legacy-навыков` → `устаревших навыков`.
- [x] `docs/features/k-skill-proxy.md`: `legacy-адаптер` → `устаревший адаптер`, `legacy-сценариев` → `устаревших сценариев`.
- [x] `docs/features/yandex-market-search.md`: `legacy-навыка` → `устаревшего навыка`.
- [x] `docs/roadmap.md`: `legacy-контекста` → `устаревшего контекста`, `legacy-функций` → `устаревших функций`, `legacy-пакета/пакеты` → `устаревшего пакета/устаревшие пакеты`, `legacy-booking` → `устаревших навыков бронирования`, `adapter'ы` → `адаптеры`, `job-search` → `поиска работы`.
- [x] `README.md`: `legacy-имя` → `устаревшее имя`, `legacy-функции` → `устаревшие функции`, `legacy-пакетов` → `устаревших пакетов`, `legacy-имя` → `устаревшее имя`.
- [x] `k-skill-setup/SKILL.md`: `legacy-совместимый` → `обратно совместимый`.
- [x] `ru-skill-setup/SKILL.md`: `legacy-именем` → `устаревшим именем`.
- [x] `yandex-market-search/SKILL.md`: `legacy-сценарий` → `устаревший сценарий`.
- [x] `yandex-rasp/SKILL.md`: `legacy-навыков` → `устаревших навыков`.
- [x] `ktx-booking/SKILL.md`: `legacy-booking` → `устаревших навыков бронирования`.
- [x] `srt-booking/SKILL.md`: `legacy-booking` → `устаревших навыков бронирования`.
- [x] `scripts/skill-docs.test.js`: добавлены 5 новых тестов на отсутствие `legacy-` составных терминов и наличие русских эквивалентов; обновлён тест brand-inventory.md; обновлён раунд на 58.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.
- [x] Продолжить русификацию оставшихся `legacy-*` составных терминов в исторических секциях docs/roadmap.md и README.md, если они ещё содержат английские гибридные термины.

## Статус на 2026-06-18 (раунд 57)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английский жаргон в пользовательских поверхностях: `alias` → `псевдоним` (ru-skill-setup/SKILL.md, k-skill-setup/SKILL.md, docs/install.md ×4, README.md ×5, docs/roadmap.md ×3, docs/brand-inventory.md ×2), `setup-alias` → `псевдоним настройки` (ru-skill-setup/SKILL.md), `post-install` → `после установки` (ru-skill-setup/SKILL.md), `shared secrets` → `общие секреты` (ru-skill-setup/SKILL.md), `feature-specific` → `для отдельных функций` (ru-skill-setup/SKILL.md), `setup-навык` → `навык настройки` (k-skill-setup/SKILL.md вступительные метаданные, ru-skill-setup/SKILL.md, k-skill-setup/SKILL.md), `setup-поток` → `поток настройки` (k-skill-setup/SKILL.md, ru-skill-setup/SKILL.md, docs/roadmap.md), `setup-flow` → `поток настройки` (README.md), `product card page` → `страница карточки товара` (yandex-market-search/SKILL.md), `Raw JSON` → `Необработанный JSON` (kbo-results/SKILL.md), `Legacy alias` → `Устаревший псевдоним` (ru-skill-setup/SKILL.md, k-skill-setup/SKILL.md), `compatibility alias` → `псевдоним совместимости` (docs/roadmap.md), `alias-слой` → `слой псевдонимов` (docs/brand-inventory.md).
- Документная регрессия расширена: добавлены 3 новых теста на отсутствие английский жаргон (`setup-alias`, `post-install`, `shared secrets`, `feature-specific`, `setup-навык`, `setup-поток`, `alias`, `product card page`, `Raw JSON`) и наличие русских эквивалентов.
- Полный `npm run ci` проходит: 0 fail.

## Выполнено в этом раунде (раунд 56)

- [x] `ru-skill-setup/SKILL.md`: `setup-alias` → `псевдоним настройки`, `post-install потока` → `потока после установки`, `shared secrets` → `общие секреты`, `feature-specific навыками` → `навыками для отдельных функций`, `Legacy alias` → `Устаревший псевдоним`, `setup-навыка` → `навыка настройки`, `setup-потоку` → `потоку настройки`.
- [x] `ru-skill-setup/SKILL.md` вступительные метаданные: `legacy alias` → `устаревший псевдоним`.
- [x] `k-skill-setup/SKILL.md` вступительные метаданные: `setup-навык` → `навык настройки`.
- [x] `k-skill-setup/SKILL.md`: `alias` → `псевдоним`, `setup-поток` → `поток настройки`, `Legacy alias` → `Устаревший псевдоним`, `setup-навыка` → `навыка настройки`, `legacy alias` → `устаревший псевдоним`.
- [x] `docs/install.md`: `alias` → `псевдоним` (4 вхождения).
- [x] `README.md`: `Setup-поток` → `Поток настройки`, `Legacy alias` → `Устаревший псевдоним` (2), `setup-flow` → `поток настройки`, `setup-alias` → `псевдоним настройки`, `alias` → `псевдоним`.
- [x] `docs/roadmap.md`: `setup-поток` → `поток настройки`, `legacy alias` → `устаревший псевдоним`, `compatibility alias` → `псевдоним совместимости`.
- [x] `docs/brand-inventory.md`: `Alias` → `Псевдоним`, `legacy alias` → `устаревший псевдоним`, `alias-слой` → `слой псевдонимов`.
- [x] `yandex-market-search/SKILL.md`: `product card page` → `страница карточки товара`.
- [x] `kbo-results/SKILL.md`: `Raw JSON` → `Необработанный JSON`.
- [x] `scripts/skill-docs.test.js`: добавлены 3 новых теста на отсутствие английский жаргон и наличие русских эквивалентов для поверхностей настройки, yandex-market-search и kbo-results; обновлён существующий тест `install.md` на `псевдоним` вместо `alias`.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-17 (раунд 55)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английский жаргон в пользовательских поверхностях: `side effects` → `действия с побочными эффектами` (srt-booking/SKILL.md ×3, kakaotalk-mac/SKILL.md), `holdings` → `позиций` (toss-securities/SKILL.md), `pixel-perfect` → `точную` (hh-vacancies/SKILL.md), `watchlist` → `список наблюдения` (docs/features/toss-securities.md), `waitlist` → `лист ожидания` (docs/features/ktx-booking.md ×2), `scope` → `область действия` (yandex-market-search/SKILL.md, docs/features/ktx-booking.md), `inline-характеристики` → `встроенные характеристики` (yandex-market-search/SKILL.md, docs/features/yandex-market-search.md ×2), `canonical` → `канонический` (yandex-market-search/SKILL.md, docs/features/yandex-market-search.md), `merchant-level` → `со стороны продавца` (docs/features/yandex-market-search.md), `anchor-точка` → `опорная точка` (docs/features/kakao-bar-nearby.md), `slug` → `идентификатор категории` (zoon-nearby/SKILL.md, packages/stoloto-lotto/README.md, packages/yandex-market-search/README.md), `ingress` → `входной прокси` (docs/features/k-skill-proxy.md), `extraction` → `извлечение изображений` (docs/features/hwp.md), `flow` → `потоки` (packages/daiso-product-search/README.md), `dry-run` → `пробный запуск` (kakaotalk-mac/SKILL.md), `harvest, inspect` → `сбор данных, проверка` (kakaotalk-mac/SKILL.md), `HTML-фикстура` → `эталонный HTML` (packages/rpl-results/test), `фикстуры` → `эталонные данные` (packages/k-lotto/test, packages/daiso-product-search/test), `канонические слаги` → `канонические идентификаторы` (packages/stoloto-lotto/test), `shorthand` → `сокращение` (docs/features/osm-nearby.md).
- Документная регрессия расширена: добавлены 17 новых тестов на отсутствие английский жаргон и наличие русских эквивалентов.
- Исправлены отставшие CI-тесты: обновлён раунд на 54, убран дублирующийся открытый пункт в TODO.md.

## Выполнено в этом раунде (раунд 55)

- [x] `srt-booking/SKILL.md`: `side effects` → `действия, изменяющие состояние` / `действие с побочными эффектами` (3 вхождения).
- [x] `kakaotalk-mac/SKILL.md`: `side effects` → `действия с побочными эффектами`, `harvest, inspect` → `сбор данных, проверка`, `dry-run` → `пробный запуск`.
- [x] `toss-securities/SKILL.md`: `holdings` → `позиций`.
- [x] `hh-vacancies/SKILL.md`: `pixel-perfect` → `точную`.
- [x] `docs/features/toss-securities.md`: `watchlist` → `список наблюдения`.
- [x] `docs/features/ktx-booking.md`: `waitlist` → `лист ожидания` (2 вхождения), `scope` → `область действия`.
- [x] `yandex-market-search/SKILL.md`: `inline-характеристикам` → `встроенным характеристикам`, `canonical URL` → `канонический URL`, `вне scope` → `вне области действия`.
- [x] `docs/features/yandex-market-search.md`: `inline-характеристикам` → `встроенным характеристикам`, `canonical` → `каноническим`, `top inline-характеристики` → `верхние встроенные характеристики`, `merchant-level сценарии` → `сценарии со стороны продавца`.
- [x] `docs/features/kakao-bar-nearby.md`: `anchor-точки` → `опорной точки`.
- [x] `zoon-nearby/SKILL.md`: `slug/структурой` → `идентификатором категории/структурой`.
- [x] `kbo-results/SKILL.md`: `inline-сниппете entry file` → `встроенном фрагменте файла входа`.
- [x] `packages/yandex-market-search/README.md`: `по slug и ID` → `по идентификатору категории (slug) и ID`.
- [x] `packages/stoloto-lotto/README.md`: `канонический slug` → `канонический идентификатор`, `канонических slug'ов` → `канонических идентификаторов`.
- [x] `packages/daiso-product-search/README.md`: `магазин/товар/наличие flow` → `потоки магазин/товар/наличие`.
- [x] `docs/features/osm-nearby.md`: `shorthand` → `сокращение`.
- [x] `docs/features/k-skill-proxy.md`: `ingress или tunnel` → `входной прокси или туннель`.
- [x] `docs/features/hwp.md`: `Для extraction:` → `Для извлечения изображений:`.
- [x] `packages/rpl-results/test/index.test.js`: `HTML-фикстуру` → `эталонный HTML` (2 вхождения), `на фикстурах` → `на эталонных данных`.
- [x] `packages/k-lotto/test/index.test.js`: `внедрённые фикстуры` → `внедрённые эталонные данные`.
- [x] `packages/daiso-product-search/test/index.test.js`: `внедрённые фикстуры fetch` → `внедрённые эталонные данные имитации fetch`.
- [x] `packages/stoloto-lotto/test/index.test.js`: `канонические слаги` → `канонические идентификаторы` (2 вхождения).
- [x] `scripts/skill-docs.test.js`: добавлены 17 новых тестов на отсутствие английский жаргон (`side effects`, `holdings`, `pixel-perfect`, `watchlist`, `waitlist`, `scope`, `inline-характеристики`, `canonical`, `merchant-level`, `anchor-точка`, `slug`, `ingress`, `extraction`, `flow`, `dry-run`, `фикстура/слаг`).
- [x] `scripts/skill-docs.test.js`: обновлён раунд на 54 в документной регрессии.
- [x] `TODO.md`: убран дублирующийся открытый пункт в историческом блоке плана.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-16 (раунд 54)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английский жаргон в пользовательских поверхностях: `proxy` → `прокси` (~25 вхождений в docs/features/fine-dust-location.md, fine-dust-location/SKILL.md, docs/features/yandex-market-search.md, docs/features/k-skill-proxy.md, docs/brand-inventory.md, docs/sources.md, docs/install.md, docs/setup.md, docs/security-and-secrets.md, k-skill-setup/SKILL.md), `workflow` → `процесс/сценарий` (docs/releasing.md, AGENTS.md, python-packages/README.md, docs/features/zipcode-search.md, docs/install.md, docs/roadmap.md), `batch` → `пакетная обработка/пакетных задач` (docs/features/hwp.md), `plan` → `план` (docs/brand-inventory.md), `Standings (турнирная таблица)` → `Турнирная таблица` (docs/features/rpl-results.md), `Match results (результаты матчей)` → `Результаты матчей` (docs/features/rpl-results.md).
- Переведены английские h1-заголовки в 2 SKILL.md: `# KakaoTalk Mac CLI` → `# CLI для KakaoTalk на macOS` (kakaotalk-mac/SKILL.md), `# Toss Securities` → `# Брокерские данные Toss Securities` (toss-securities/SKILL.md).
- Документная регрессия расширена: добавлены 6 новых тестов на отсутствие английский жаргон (`proxy`, `workflow`, `batch`, `plan`, `Standings/Match results`) и перевод h1 SKILL.md.
- Полный `npm run ci` проходит: 0 fail.

## Выполнено в этом раунде (раунд 54)

- [x] `docs/features/fine-dust-location.md`: `proxy` → `прокси` (7 вхождений).
- [x] `fine-dust-location/SKILL.md`: `proxy` → `прокси` (5 вхождений).
- [x] `docs/features/yandex-market-search.md`: `proxy` → `прокси`.
- [x] `docs/features/k-skill-proxy.md`: `proxy-адаптеры` → `прокси-адаптеры`.
- [x] `docs/brand-inventory.md`: `proxy-сценария` → `прокси-сценария`, `Практический plan` → `Практический план`.
- [x] `docs/sources.md`: `proxy` → `прокси` (5 вхождений).
- [x] `docs/install.md`: `proxy-слоя` → `прокси-слоя`, `skill-only workflow` → `skill-only сценарии`.
- [x] `docs/setup.md`: `совместимый proxy` → `совместимый прокси`.
- [x] `docs/security-and-secrets.md`: `совместимого proxy` → `совместимого прокси`.
- [x] `k-skill-setup/SKILL.md`: `совместимый proxy` → `совместимый прокси` (2 вхождения).
- [x] `docs/releasing.md`: `Workflow публикации` → `Процесс публикации` (2), `workflow должен` → `процесс должен`, `workflow остаётся` → `процесс остаётся`, `release/workflow/package` → `release/процесс/package`.
- [x] `AGENTS.md`: `workflow релиза Python` → `процесс релиза Python`, `workflow-файлы` → `файлы автоматизации`.
- [x] `python-packages/README.md`: `workflow release-please` → `процесс release-please`, `reusable workflow` → `повторно используемого процесса`, `top-level workflow` → `верхнеуровневом процессе`.
- [x] `docs/features/zipcode-search.md`: `ePost workflow` → `ePost-сценарий`.
- [x] `docs/roadmap.md`: `workflow` → `сценарий/процесс` (4 вхождения).
- [x] `docs/features/hwp.md`: `Для batch:` → `Для пакетной обработки:`, `batch-задач` → `пакетных задач`.
- [x] `kakaotalk-mac/SKILL.md`: h1 `# KakaoTalk Mac CLI` → `# CLI для KakaoTalk на macOS`.
- [x] `toss-securities/SKILL.md`: h1 `# Toss Securities` → `# Брокерские данные Toss Securities`.
- [x] `docs/features/rpl-results.md`: `### Standings (турнирная таблица)` → `### Турнирная таблица`, `### Match results (результаты матчей)` → `### Результаты матчей`.
- [x] `README.md`: `workflow/content assertions` → `проверки сценария и содержимого` (2), `proxy endpoint` → `прокси-эндпоинт`, `proxy helper-docs` → `прокси helper-docs`.
- [x] `scripts/skill-docs.test.js`: добавлены 6 новых тестов на отсутствие английский жаргон (`proxy`, `workflow`, `batch`, `plan`, `Standings/Match results`) и перевод h1 SKILL.md; обновлён существующий тест на `совместимый прокси`.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-16 (раунд 53)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Устранён следующий слой английский жаргон в пользовательских поверхностях: `replacement` → `замена` (7 SKILL.md), `backlog` → `перечень задач` (6 feature docs/SKILL.md, docs/install.md, docs/booking-replacements.md), `railway flow` → `железнодорожный сценарий` (srt-booking/SKILL.md, ktx-booking/SKILL.md, docs/features/ktx-booking.md, docs/features/srt-booking.md), `report эндпоинт` → `отчётный эндпоинт` (fine-dust-location/SKILL.md ×4), `legacy naming` → `устаревшее именование` (fine-dust-location/SKILL.md, docs/features/fine-dust-location.md), `carrier adapter` → `адаптер перевозчика` (docs/features/delivery-tracking.md), `adapter fields` → `поля адаптера` (docs/features/delivery-tracking.md), `carrier id` → `идентификатор перевозчика`, `validator` → `валидатор`, `entrypoint` → `точка входа`, `transport` → `транспорт`, `parser` → `парсер`, `status map` → `таблица статусов` (delivery-tracking/SKILL.md, docs/features/delivery-tracking.md), `product boundary` → `продуктовая граница` (docs/features/ktx-booking.md, docs/features/srt-booking.md), `automation reference` → `эталон автоматизации`, `target-messaging` → `целевое направление обмена сообщениями`, `booking API` → `API бронирования`, `legacy replacement` → `замена legacy-навыков` (yandex-rasp/SKILL.md), `free API` → `бесплатные API` (delivery-tracking/SKILL.md), `research` → `исследование` (docs/sources.md), `замена железнодорожных навыков` → `замена железнодорожных навыков` (docs/sources.md), `replacement-gap` → `пробел в замене` (docs/sources.md), `antibot flow` → `антибот-поток`, `antibot challenge` → `антибот-проверка` (docs/sources.md), `open data` → `открытые данные` (docs/sources.md), `legacy-compatible` → `обратно совместимое`, `transition-layer` → `переходный слой`, `Dual-path` → `Двойной путь`, `proxy naming` → `именование прокси` (docs/brand-inventory.md), `install-flow` → `поток установки` (docs/install.md), `watchlist` → `список наблюдения` (README.md), `backward-compatible` → `обратно совместимые` (README.md), `перечень задач по реализации` → `перечень задач по реализации` (README.md), `booking source` → `источник бронирования` (README.md), `travel inventory` → `база туристических данных` (docs/booking-replacements.md), `train-booking` → `бронирование поездов` (docs/booking-replacements.md), `downstream` → `нисходящий поток` (zipcode-search/SKILL.md, docs/features/zipcode-search.md), `data-source` → `источник данных` (docs/features/fine-dust-location.md), `SSR-страницы` / `SSR-вёрстка` → `серверно отрендеренные страницы (SSR)` / `серверно отрендеренная вёрстка (SSR)` (zoon-nearby SKILL.md ×2, packages/zoon-nearby SKILL.md ×2, packages/zoon-nearby/README.md ×2, docs/features/zoon-nearby.md ×2, docs/features/yandex-market-search.md).
- Документная регрессия расширена: добавлены 8 новых тестов на отсутствие английский жаргон (`replacement`, `backlog`, `railway flow`, `product boundary`, `entrypoint`, `status map`, `carrier adapter`, `adapter fields`, `report эндпоинт`, `legacy naming`, `research`, `замена железнодорожных навыков`, `antibot flow`, `antibot challenge`, `open data`, `legacy-compatible`, `transition-layer`, `Dual-path`, `watchlist`, `backward-compatible`, `перечень задач по реализации`, `booking source`, `SSR-страницы`, `SSR-вёрстка`) в пользовательских поверхностях и наличие русских эквивалентов.
- Полный `npm run ci` проходит: 0 fail.

## Выполнено в этом раунде (раунд 53)

- [x] `srt-booking/SKILL.md`: `railway flow` → `железнодорожный сценарий`.
- [x] `ktx-booking/SKILL.md`: `railway flow` → `железнодорожный сценарий`.
- [x] `blue-ribbon-nearby/SKILL.md`: `replacement` → `замена`.
- [x] `kakao-bar-nearby/SKILL.md`: `replacement` → `замена`.
- [x] `kleague-results/SKILL.md`: `replacement` → `замена`.
- [x] `daiso-product-search/SKILL.md`: `replacement` → `замена`.
- [x] `toss-securities/SKILL.md`: `replacement` → `замена`.
- [x] `delivery-tracking/SKILL.md`: `replacement` → `замена`, `free API` → `бесплатные API`, `backlog` → `перечень задач`, `carrier id` → `идентификатор перевозчика`, `validator` → `валидатор`, `entrypoint` → `точка входа`, `transport` → `транспорт`, `parser` → `парсер`, `status map` → `таблица статусов`.
- [x] `fine-dust-location/SKILL.md`: `report эндпоинт` → `отчётный эндпоинт` (4 вхождения), `legacy naming` → `устаревшее именование`.
- [x] `yandex-rasp/SKILL.md`: `booking API` → `API бронирования`, `legacy replacement` → `замена legacy-навыков`.
- [x] `kakaotalk-mac/SKILL.md`: `automation reference` → `эталон автоматизации`, `target-messaging` → `целевое направление обмена сообщениями`, `backlog` → `перечень задач`.
- [x] `docs/features/delivery-tracking.md`: `carrier adapter` → `адаптер перевозчика`, `adapter fields` → `поля адаптера`, `validator` → `валидатор`, `entrypoint` → `точка входа`, `transport` → `транспорт`, `parser` → `парсер`, `status map` → `таблица статусов`, `backlog` → `перечень задач`.
- [x] `docs/features/ktx-booking.md`: `flow` → `железнодорожный сценарий`, `product boundary` → `продуктовая граница`, `replacement` → `замена`.
- [x] `docs/features/srt-booking.md`: `flow` → `железнодорожный сценарий`, `product boundary` → `продуктовая граница`, `replacement` → `замена`.
- [x] `docs/features/seoul-subway-arrival.md`: `backlog` → `перечень задач`.
- [x] `docs/features/kbo-results.md`: `backlog` → `перечень задач`.
- [x] `docs/features/kakao-bar-nearby.md`: `backlog` → `перечень задач`.
- [x] `docs/features/zipcode-search.md`: `downstream` → `нисходящий поток`.
- [x] `zipcode-search/SKILL.md`: `downstream` → `нисходящий поток`.
- [x] `docs/features/fine-dust-location.md`: `legacy naming` → `устаревшее именование`, `data-source` → `источник данных`.
- [x] `docs/sources.md`: `research` → `исследование`, `замена железнодорожных навыков` → `замена железнодорожных навыков`, `replacement-gap` → `пробел в замене`, `antibot flow` → `антибот-поток`, `antibot challenge` → `антибот-проверка`, `open data` → `открытые данные`, `SSR-поверхность` → `серверно отрендеренная поверхность (SSR)`, `SSR-страницы` → `серверно отрендеренные страницы (SSR)`.
- [x] `docs/brand-inventory.md`: `legacy-compatible` → `обратно совместимое`, `transition-layer` → `переходный слой`, `Dual-path` → `Двойной путь`, `proxy naming` → `именование прокси`.
- [x] `docs/install.md`: `backlog` → `перечень задач`, `install-flow` → `поток установки`.
- [x] `docs/booking-replacements.md`: `travel inventory` → `база туристических данных`, `train-booking` → `бронирование поездов`, `backlog` → `перечень задач`.
- [x] `README.md`: `watchlist` → `список наблюдения`, `backward-compatible` → `обратно совместимые`, `перечень задач по реализации` → `перечень задач по реализации`, `booking source` → `источник бронирования`.
- [x] Нормализована SSR-терминология: `SSR-страницы` / `SSR-вёрстка` → `серверно отрендеренные страницы (SSR)` / `серверно отрендеренная вёрстка (SSR)` во всех zoon-nearby SKILL.md/README.md и yandex-market-search feature doc.
- [x] `scripts/skill-docs.test.js`: добавлены 8 новых тестов на отсутствие английский жаргон и наличие русских эквивалентов; обновлены существующие тесты на новые русские термины.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Выполнено в этом раунде (раунд 51)

- [x] `AGENTS.md`: `endpoint` → `эндпоинт`, `proxy-auth` → `авторизации прокси`, `scaffold-заготовкой` → `каркасной заготовкой`.
- [x] `docs/setup.md`: `proxy endpoint` → `прокси-эндпоинт`, `credential` → `учётные данные`, `endpoint` → `эндпоинта`.
- [x] `docs/security-and-secrets.md`: `proxy endpoint` → `прокси-эндпоинт`.
- [x] `docs/brand-inventory.md`: `legacy endpoint` → `устаревший эндпоинт`.
- [x] `docs/sources.md`: `endpoint` → `эндпоинт` (2 вхождения), `anti-bot` → `антибота` (2 вхождения), `export-ссылки` → `экспорт-ссылки`, `production` → `промышленного использования`, `CSR` → `клиентский рендеринг (CSR)`, `Lookup региона` → `Поиск региона`.
- [x] `docs/releasing.md`: `scaffold-only` → `каркасной заготовкой`.
- [x] `python-packages/README.md`: `Python package release scaffold` → `Каркас релиза Python-пакета`.
- [x] `README.md`: `anti-bot` → `антибота` (2 вхождения).
- [x] `docs/booking-replacements.md`: `anti-bot` → `антибота`.
- [x] `docs/features/ktx-booking.md`: `anti-bot` → `антибота` (2 вхождения).
- [x] `ktx-booking/SKILL.md`: `anti-bot` → `антибота` (3 вхождения).
- [x] `packages/zoon-nearby/README.md`: `anti-bot` → `антибота`.
- [x] `docs/features/zoon-nearby.md`: `anti-bot` → `антибота`.
- [x] `docs/roadmap.md`: `anti-bot` → `антибота` (2 вхождения).
- [x] `packages/kleague-results/test/index.test.js`: `unexpected url` → `неожиданный URL`.
- [x] `packages/kakao-bar-nearby/test/index.test.js`: `unexpected url` → `неожиданный URL` (4 вхождения).
- [x] `packages/k-skill-proxy/test/airkorea.test.js`: `unexpected URL` → `неожиданный URL` (3 вхождения).
- [x] `packages/k-skill-proxy/test/server.test.js`: `upstream` → `вышестоящего API`, `fallback` → `запасной вариант` (mock data).
- [x] `packages/blue-ribbon-nearby/test/index.test.js`: `upstream-payload` → `вышестоящий ответ`.
- [x] `packages/rpl-results/test/index.test.js`: `мок-запрос` → `имитированный запрос` (3 вхождения).
- [x] `packages/yandex-market-search/test/index.test.js`: `мок-запрос` → `имитированный запрос` (2 вхождения).
- [x] `scripts/fine_dust.py`: `fallback-поиск` → `резервный поиск`.
- [x] `scripts/test_fine_dust.py`: `direct lookup should not run` → `прямой поиск не должен выполняться`.
- [x] `.changeset/kinopoisk-search.md`: `fixture-тесты` → `тесты на эталонных данных`.
- [x] `yandex-market-search/SKILL.md`: `CSR` → `клиентский рендеринг (CSR)`.
- [x] `TODO.md`: `supplementary` → `дополнительный` (3 вхождения), `anti-bot` → `антибота` (3 вхождения).
- [x] `scripts/skill-docs.test.js`: обновлены регрессии на `прокси-эндпоинт` и `антибота`; добавлены 4 новых теста на отсутствие английский жаргон в пользовательских поверхностях, тестовых файлах и описаниях тестов.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-14 (раунд 49)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Переведены на русский английские сообщения об ошибках в имитированных ответах тестов: `Unexpected mocked URL` → `Неожиданный имитированный URL` (8 файлов), `Unexpected mocked date_req` → `Неожиданный имитированный date_req` (1 файл), `provider should not be called` → `провайдер не должен вызываться` (1 файл).
- Добавлены русские ключевые слова во все 13 target package.json для обнаружения русскоязычными пользователями npm.
- Исправлен отставший regression-тест: `daiso-product-search` description обновлён с `pickup-остатков` на `остатков для самовывоза`; `blue-ribbon-nearby` assertion обновлён с `endpoint` на `эндпоинт`.
- Документная регрессия расширена: добавлены тесты на отсутствие английских сообщений в имитированных ответах тестов и на наличие русских ключевых слов в target package.json.
- Полный `npm test` проходит: 145 pass / 0 fail / 1 skipped.

## Выполнено в этом раунде (раунд 49)

- [x] `packages/kinopoisk-search/test/index.test.js`: `Unexpected mocked URL` → `Неожиданный имитированный URL`.
- [x] `packages/stoloto-lotto/test/index.test.js`: `Unexpected mocked URL` → `Неожиданный имитированный URL`.
- [x] `packages/pravo-documents/test/index.test.js`: `Unexpected mocked URL` → `Неожиданный имитированный URL`.
- [x] `packages/hh-vacancies/test/index.test.js`: `Unexpected mocked URL` → `Неожиданный имитированный URL`.
- [x] `packages/postcalc-postcodes/test/index.test.js`: `Unexpected mocked URL` → `Неожиданный имитированный URL`.
- [x] `packages/moex-shares/test/index.test.js`: `Unexpected mocked URL` → `Неожиданный имитированный URL`.
- [x] `packages/cbr-rates/test/index.test.js`: `Unexpected mocked date_req` → `Неожиданный имитированный date_req`.
- [x] `packages/mchs-storm-warnings/test/index.test.js`: `Unexpected mocked URL` → `Неожиданный имитированный URL`.
- [x] `packages/k-skill-proxy/test/server.test.js`: `provider should not be called` → `провайдер не должен вызываться`.
- [x] Добавлены русские ключевые слова во все 13 target package.json (`cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`).
- [x] `scripts/skill-docs.test.js`: добавлена регрессия на отсутствие английских сообщений в имитированных ответах тестов и на наличие русских ключевых слов в target package.json.
- [x] `scripts/skill-docs.test.js`: исправлен отставший regression-тест `daiso-product-search` description и `blue-ribbon-nearby` endpoint-assertion.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана (раунд 49)

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-12 (раунд 48)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Переведены на русский все оставшиеся английские assert-сообщения в `scripts/skill-docs.test.js` (~107 сообщений: `"expected X to exist"`, `"must not X"`, `"must keep X"`, `"should stay X"` и др.).
- Переведены на русский английские h1-заголовки в верхнеуровневых документах: `# Brand Inventory` → `# Инвентарь бренда`, `# Sources` → `# Источники`, `# Roadmap` → `# Дорожная карта`.
- Устранён оставшийся английский жаргон в feature docs: `production` → `промышленного использования`, `live-проверке` → `проверке в реальном времени`, `live-вёрстку` → `актуальную вёрстку`, `live-данные` → `данные в реальном времени`, `export` → `экспорт`, `discovery` → `обнаружение`.
- Документная регрессия расширена: добавлены тесты на русские h1-заголовки в верхнеуровневых документах и отсутствие английский жаргон (`production`, `live-`, `discovery`, `export`) в feature docs.
- Полный `npm test` проходит: 143 pass / 0 fail / 1 skipped.

## Выполнено в этом раунде (раунд 48)

- [x] `scripts/skill-docs.test.js`: переведены на русский ~107 assert-сообщений (внутренние сообщения ошибок assert.ok/assert.equal/assert.match/assert.doesNotMatch/assert.deepEqual).
- [x] `docs/brand-inventory.md`: h1 `# Brand Inventory` → `# Инвентарь бренда`.
- [x] `docs/sources.md`: h1 `# Sources` → `# Источники`.
- [x] `docs/roadmap.md`: h1 `# Roadmap` → `# Дорожная карта`.
- [x] `docs/features/osm-nearby.md`: `## Альтернативы для production` → `## Альтернативы для промышленного использования`.
- [x] `docs/features/daiso-product-search.md`: `## Заметка по live-проверке` → `## Заметка по проверке в реальном времени`.
- [x] `docs/features/postcalc-postcodes.md`: `live-вёрстку` → `актуальную вёрстку`.
- [x] `docs/features/seoul-subway-arrival.md`: `live-данные` → `данные в реальном времени`.
- [x] `docs/features/kbo-results.md`: `export` → `экспорт`.
- [x] `docs/features/yandex-rasp.md`: `discovery` → `обнаружение`.
- [x] `scripts/skill-docs.test.js`: добавлена регрессия на русские h1-заголовки в верхнеуровневых документах и отсутствие английский жаргон в feature docs.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-11 (раунд 46)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился — переделать всё под российские / русскоязычные реалии.
- Улучшен навык `mchs-storm-warnings`: добавлены разговорные сокращения и псевдонимы регионов (`"Удмуртия"`, `"Башкирия"`, `"Чувашия"`, `"Питер"`, `"СПб"`, `"Подмосковье"`, `"Чукотка"`, `"Кузбасс"`, `"Тюмень"` и другие 30+ алиасов); нечёткий поиск защищён от тривиально коротких и бессмысленных запросов (`"ия"`, `"ская"`, `"Республика"`, `"область"`); добавлен тайм-аут сетевых запросов через `AbortController` (15 с); добавлены тесты граничных случаев.
- Переведены на русский все английские описания тестов в 19 файлах `packages/*/test/*.js` (~140 строк): `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `yandex-rasp`, `zoon-nearby`, `blue-ribbon-nearby`, `daiso-product-search`, `k-lotto`, `kakao-bar-nearby`, `kleague-results`, `toss-securities`, `k-skill-proxy`.
- Переведены английские значения `lookup_mode` в `scripts/fine_dust.py`: `"coordinates"` → `"координаты"`, `"fallback"` → `"запасной вариант"` (синхронизировано с Node.js `airkorea.js`).
- Документная регрессия расширена: добавлены тесты на разговорные сокращения регионов МЧС, защиту от тривиальных запросов, тайм-аут запросов и граничные случаи парсинга.
- Полный `npm test` проходит: 135+ pass / 0 fail / 1 skipped.

## Выполнено в этом раунде (раунд 46)

- [x] `packages/mchs-storm-warnings/src/regions.js`: добавлена таблица `ALIASES` с 30+ разговорными сокращениями российских регионов; нечёткий поиск переведён на скоринг с порогом 0.4 и защитой от тривиальных суффиксов (`Республика`, `область`, `край`, `АО`, `г.`).
- [x] `packages/mchs-storm-warnings/src/index.js`: добавлен тайм-аут 15 с на сетевые запросы через `AbortController`; русское сообщение об истечении тайм-аута.
- [x] `packages/mchs-storm-warnings/test/index.test.js`: добавлены тесты на разговорные сокращения (16 алиасов), тривиальные запросы (5 случаев), граничные случаи `normalizeRussianDateTime`, валидацию `buildWarningsIndexUrl`/`buildWarningUrl`.
- [x] `packages/mchs-storm-warnings/README.md`: обновлено описание `lookupRegion` с упоминанием разговорных сокращений; исправлено «85+» → «85» субъектов.
- [x] `mchs-storm-warnings/SKILL.md`: добавлены примеры разговорных сокращений; исправлено «85+» → «85».
- [x] `docs/features/mchs-storm-warnings.md`: обновлён текст про `lookupRegion`; исправлено «85+» → «85».
- [x] Переведены на русский описания тестов в 19 файлах `packages/*/test/*.js` (~140 описаний `test()` и `describe()`).
- [x] `scripts/fine_dust.py`: переведены значения `lookup_mode` с `"coordinates"`/`"fallback"` на `"координаты"`/`"запасной вариант"`.
- [x] `scripts/test_fine_dust.py`: обновлены ожидания тестов на русские значения `lookup_mode`.
- [x] `scripts/skill-docs.test.js`: добавлена регрессия на русские значения `lookup_mode` в `fine_dust.py`.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Расширить документной регрессии coverage на английские описания тестов в `scripts/skill-docs.test.js` и Python-тестах (`test_fine_dust.py`, `test_ktx_booking.py`), чтобы предотвратить возврат английских описаний тестов.

## Статус на 2026-06-10 (раунд 45)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой английский жаргон в source code, SKILL.md, feature docs и top-level docs: `lookup` → `поиск` (hh-vacancies, yandex-rasp, docs/sources.md, docs/roadmap.md), `real-time` → `в реальном времени` (moex-shares, fine-dust-location, seoul-subway-arrival, docs/sources.md), `nearby` → `ближайших` (blue-ribbon-nearby, docs/roadmap.md), `Sold out` → `Места распроданы` (srt-booking), `Write-операции` → `Операции записи` (yandex-market-search), `aggressive polling` → `агрессивного опроса` (srt-booking), `HTML scraping/crawling` → `HTML-парсинг` (kleague-results).
- Переведены на русский все оставшиеся английские JSDoc и комментарии в source code: `kinopoisk-search/src/index.js` (4 JSDoc блока + 2 @param), `yandex-market-search/src/parse.js` (1 файловый JSDoc), `yandex-rasp/src/index.js` (`/* ignore */` → `/* пропустить */`), `kinopoisk-search/src/parse.js` (`prominently` → `выделяется`).
- Переведены на русский h1-заголовки в 2 SKILL.md: `# Fine Dust по местоположению` → `# Мелкая пыль по местоположению`, `# Blue Ribbon Nearby` → `# Рестораны Blue Ribbon поблизости`.
- Исправлен changelog entry в README.md: `实时 → real-time` → `实时 → в реальном времени`.
- Документная регрессия расширена на этот слой: добавлены тесты на отсутствие `lookup`, `real-time`, `nearby endpoint`, `Sold out`, `Write-операции`, `aggressive polling`, `HTML scraping/crawling`, `prominently`, английских JSDoc и `/* ignore */` в затронутых поверхностях.
- Аудит подтверждает: оставшийся английский в исходном коде — только кодовые идентификаторы и обусловленные доменом термины; оставшийся английский в документации — только метки ссылок к документам и навыкам с английскими именами.
- Полный `npm test` проходит: 137 pass / 0 fail / 1 skipped.

## Выполнено в этом раунде (раунд 45)

- [x] `packages/kinopoisk-search/src/index.js`: переведены на русский 4 JSDoc блока и 2 @param описания (`Build URL for a film page` → `Построить URL страницы фильма` и т.д.).
- [x] `packages/kinopoisk-search/src/parse.js`: устранён английский `prominently` в комментарии → `выделяется`.
- [x] `packages/yandex-market-search/src/parse.js`: переведён на русский файловый JSDoc (`HTML parsing utilities` → `Утилиты парсинга HTML`).
- [x] `packages/yandex-rasp/src/index.js`: переведён комментарий `/* ignore */` → `/* пропустить */`.
- [x] `fine-dust-location/SKILL.md`: переведён h1 `# Fine Dust по местоположению` → `# Мелкая пыль по местоположению`.
- [x] `blue-ribbon-nearby/SKILL.md`: переведён h1 `# Blue Ribbon Nearby` → `# Рестораны Blue Ribbon поблизости`; `nearby рестораны` → `ближайшие рестораны`; `nearby endpoint` → `endpoint поиска ближайших`.
- [x] `yandex-rasp/SKILL.md`: `lookup станции` → `поиск станции`.
- [x] `hh-vacancies/SKILL.md`: `lookup area` → `поиск региона`.
- [x] `yandex-market-search/SKILL.md`: `Write-операции` → `Операции записи`.
- [x] `srt-booking/SKILL.md`: `Sold out` → `Места распроданы`; `aggressive polling` → `агрессивного опроса`.
- [x] `moex-shares/SKILL.md`: `а не real-time` → `а не в реальном времени`.
- [x] `seoul-subway-arrival/SKILL.md`: `real-time metro replacement` → `навык метро реального времени`.
- [x] `docs/features/hh-vacancies.md`: `lookup'а региона` → `поиск региона`; `## Пример: lookup региона` → `## Пример: поиск региона`.
- [x] `docs/features/fine-dust-location.md`: `значения real-time` → `значения поступают в реальном времени`.
- [x] `docs/features/seoul-subway-arrival.md`: `сопоставимого real-time API` → `сопоставимого API реального времени`; `Данные real-time` → `Данные поступают в реальном времени`.
- [x] `docs/features/srt-booking.md`: `sold out` → `распродаже мест`.
- [x] `docs/features/kleague-results.md`: `HTML scraping` → `HTML-парсинг`.
- [x] `docs/roadmap.md`: `nearby-ресторанов` → `ближайших ресторанов`; `nearby-баров` → `ближайших баров`; `lookup регионов` → `поиск регионов`.
- [x] `docs/sources.md`: `area lookup` → `поиск региона`; `lookup региона` → `поиск региона`; `real-time прибытие метро` → `API прибытия метро в реальном времени`; `Seoul real-time subway arrival API` → `Сеул API метро реального времени`; `Korea Post postcode lookup` → `Korea Post поиск почтовых индексов`.
- [x] `README.md`: `lookup регионов` → `поиск регионов`; `Поиск ресторанов Blue Ribbon nearby` → `Поиск ближайших ресторанов Blue Ribbon`; `实时 → real-time` → `实时 → в реальном времени`.
- [x] `packages/kleague-results/README.md`: `HTML scraping` → `HTML-парсинг`; `HTML crawling` → `HTML-парсинг`.
- [x] `scripts/skill-docs.test.js`: обновлены существующие тесты (roadmap nearby/lookup assertions); добавлены 4 новых теста на отсутствие английский жаргон в source code, SKILL.md, feature docs и top-level docs.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Продолжить расширять документной регрессии coverage на оставшиеся JS/Python исходные поверхности по мере их обнаружения.
- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-09 (раунд 44)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Переведены на русский все английские комментарии и JSDoc в исходном коде всех целевой пакетов: `mchs-storm-warnings`, `rpl-results`, `kinopoisk-search`, `stoloto-lotto`, `zoon-nearby`, `osm-nearby`, `pravo-documents`, `yandex-rasp`, а также в legacy-пакетах `kakao-bar-nearby` и `k-skill-proxy`.
- Переведены на русский все английские описания тестов в `packages/mchs-storm-warnings/test/index.test.js`.
- Добавлена документной регрессии проверка на русские сообщения об ошибках в `mchs-storm-warnings` (`page должен быть целым числом`, `warningPathOrId должен быть непустой строкой`, `Запрос к МЧС не удался`, `regionHost должен быть региональным хостом МЧС`), а также запрет на возврат английских эквивалентов.
- Аудит исходного кода подтверждает: все английские комментарии и JSDoc в пакетах `packages/*/src/` переведены на русский; оставшийся английский — только кодовые идентификаторы и обусловленные доменом термины.

## Выполнено в этом раунде (раунд 44)

- [x] `packages/mchs-storm-warnings/src/regions.js`: переведены на русский все английские JSDoc-описания и встроенные комментарии (6 комментариев + 7 строк JSDoc).
- [x] `packages/mchs-storm-warnings/test/index.test.js`: переведены на русский все 12 английских описаний тестов и 1 встроенный комментарий.
- [x] `packages/rpl-results/src/parse.js` и `src/index.js`: переведены на русский все английские JSDoc и встроенные комментарии (9 комментариев + 6 строк JSDoc в parse.js, 3 JSDoc в index.js).
- [x] `packages/kinopoisk-search/src/parse.js`: переведены на русский все английские JSDoc и встроенные комментарии (13 комментариев + 2 строки JSDoc).
- [x] `packages/stoloto-lotto/src/parse.js` и `src/index.js`: переведены на русский все английские JSDoc и встроенные комментарии (12 комментариев + 4 JSDoc в parse.js, 2 комментария + 3 JSDoc в index.js).
- [x] `packages/zoon-nearby/src/parse.js` и `src/index.js`: переведены на русский все английские JSDoc и встроенные комментарии (10 комментариев + 5 JSDoc в parse.js, 1 комментарий + 6 JSDoc в index.js).
- [x] `packages/osm-nearby/src/index.js` и `src/query.js`: переведены на русский все английские JSDoc (5 в index.js + 4 в query.js).
- [x] `packages/pravo-documents/src/parse.js` и `src/index.js`: переведены на русский все английские JSDoc (4 в parse.js + 3 в index.js).
- [x] `packages/yandex-rasp/src/parse.js` и `src/index.js`: переведены на русский все английские JSDoc и встроенные комментарии (5 JSDoc в parse.js + 3 JSDoc + 1 комментарий в index.js).
- [x] `packages/kakao-bar-nearby/src/index.js`: переведён на русский английский встроенный комментарий.
- [x] `packages/k-skill-proxy/src/airkorea.js`: переведён на русский английский встроенный комментарий.
- [x] `scripts/skill-docs.test.js`: добавлена регрессия на русские сообщения об ошибках в `mchs-storm-warnings`.
- [x] `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Продолжить расширять документной регрессии coverage на оставшиеся JS/Python исходные поверхности по мере их обнаружения.
- [x] Проводить периодический аудит пользовательских поверхностей при добавлении новых пакетов или изменении существующих.

## Статус на 2026-06-05 (раунд 40)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Настроен автоматический перевод CHANGELOG headings через `scripts/fix-changelog-headings.js`: `npm run version-packages` теперь вызывает `changeset version && node scripts/fix-changelog-headings.js`, что гарантирует русские заголовки (`### Крупные изменения`, `### Незначительные изменения`, `### Исправления`) вместо английских при будущих релизах.
- Русифицированы GitHub Actions workflow files: `release-npm.yml` → `name: Релиз npm-пакетов`, `release-python.yml` → `name: Релиз Python-пакетов`; step names, comments и echo messages переведены на русский.
- Документная регрессия расширена на GitHub Actions workflow files, version-packages script и fix-changelog-headings script: тесты страхуют русские workflow names, русские step names/comments, цепочку version-packages и покрытие всех стандартных английских CHANGELOG headings.

## Выполнено в этом раунде (раунд 40)

- [x] Создан `scripts/fix-changelog-headings.js`: автоматически заменяет `### Major Changes` → `### Крупные изменения`, `### Minor Changes` → `### Незначительные изменения`, `### Patch Changes` → `### Исправления` во всех CHANGELOG.md после `changeset version`.
- [x] `package.json`: `version-packages` обновлён на `changeset version && node scripts/fix-changelog-headings.js`.
- [x] `.github/workflows/release-npm.yml`: `name` → `Релиз npm-пакетов`, comment → `Предпочтительный путь...`, step name → `Создание релизного PR или публикация изменившихся пакетов`.
- [x] `.github/workflows/release-python.yml`: `name` → `Релиз Python-пакетов`, echo messages → русские, step name `Reminder` → `Напоминание`.
- [x] `scripts/skill-docs.test.js` расширен регрессиями: workflow names на русском, workflow step names и comments на русском, version-packages цепочка, fix-changelog-headings покрытие всех heading mappings.
- [x] `npm test` проходит: 122 pass / 0 fail / 1 skipped.

## Новые пункты плана

- [x] Проверить оставшиеся английский жаргон артефакты в `scripts/check-setup.sh`, `scripts/run-k-skill-proxy.sh` и других shell-скриптах, если они есть.
- [x] Расширить документной регрессии на shell-скрипты и другие поверхности инфраструктуры репозитория, не покрытые текущими регрессиями.

## Статус на 2026-06-05 (раунд 38)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт оставшийся слой английский жаргон в пользовательских docs: `Read-only` → `только для чтения` (11 target package README + docs/features + 5 changeset-сводок), `baseline` → `основа` (13 вхождений в docs/sources.md), `fallback` → `запасной вариант` (fine-dust-location/SKILL.md, docs/sources.md), `live smoke test` / `smoke test` → `проверочный тест` (delivery-tracking/SKILL.md, daiso-product-search.md), `checkout` → `оформление заказа` (yandex-rasp/SKILL.md), `delayed` → `задержанный` (docs/sources.md, docs/roadmap.md), `live-матчей` → `текущих матчей` (docs/features/rpl-results.md), `varies` → `варьируется` (docs/features/stoloto-lotto.md), `nearby-поиск` → `поиск ближайших` (docs/sources.md), `nearby-` prefix → `поиск ближайших` (4 package.json descriptions), `availability-страницы` → `страницы наличия` (docs/sources.md), `## Legacy reference block` → `## Справочный блок Legacy` (docs/sources.md).
- Документная регрессия обновлён: добавлены тесты на отсутствие `Read-only`, `baseline`, `fallback`, `live smoke test`, `delayed-`, `nearby-` prefix, `checkout` и других английский жаргон артефактов в пользовательских поверхностях.

## Выполнено в этом раунде (раунд 37)

- [x] Переведён `Read-only` → `только для чтения` во всех 11 target package README, docs/features/stoloto-lotto.md, docs/features/yandex-rasp.md и 5 changeset-сводках.
- [x] Переведён `baseline` → `основа` в docs/sources.md (13 вхождений).
- [x] Переведён `fallback` → `запасной вариант` в fine-dust-location/SKILL.md и docs/sources.md.
- [x] Переведён `live smoke test` / `smoke test` → `проверочный тест` в delivery-tracking/SKILL.md (3 вхождения) и daiso-product-search.md.
- [x] Переведён `checkout` → `оформление заказа` в yandex-rasp/SKILL.md.
- [x] Переведён `delayed` → `задержанный` в docs/sources.md; `delayed-цены` → `задержанные цены` в docs/roadmap.md.
- [x] Переведён `live-матчей` → `текущих матчей` в docs/features/rpl-results.md.
- [x] Переведён `varies` → `варьируется` в docs/features/stoloto-lotto.md (2 вхождения).
- [x] Переведён `nearby-поиск` → `поиск ближайших` и `availability-страницы` → `страницы наличия` в docs/sources.md.
- [x] Переведён `nearby-` prefix → `поиск ближайших` в 4 package.json descriptions (blue-ribbon-nearby, kakao-bar-nearby, osm-nearby, zoon-nearby).
- [x] Переведён `## Legacy reference block` → `## Справочный блок Legacy` в docs/sources.md.
- [x] `scripts/skill-docs.test.js` обновлён: добавлены регрессии на отсутствие английский жаргон в package README, docs/sources.md, docs/roadmap.md, delivery-tracking/SKILL.md, yandex-rasp/SKILL.md, fine-dust-location/SKILL.md, package.json descriptions и changeset summaries.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проверить оставшиеся английский жаргон артефакты в менее заметных поверхностях (legacy package README, SKILL.md, helper-скрипты) на предмет `live smoke`, `smoke test`, `read-only`, `fallback`, `baseline`, `checkout`, `delayed` и других мелких артефактов.
- [x] Аудит `## Проверочный пример` заголовков в legacy package README на предмет консистентности с новым названием (текущий статус: все 5 файлов используют `## Проверочный пример` — консистентно).
- [x] Проверить оставшиеся английский жаргон в README.md, docs/roadmap.md и docs/sources.md (в том числе `nearby-` в заголовках таблиц и описаниях навыков).

## Статус на 2026-06-03 (раунд 35)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой англоязычный дрейф в docs/roadmap.md: `Migration milestones` → `Вехи миграции`, `Веха N` → `Веха N`, `Legacy packages` → `Legacy-пакеты`.
- Устранён английский жаргон в docs/features/osm-nearby.md: `free/no-key` → `бесплатное решение без API-ключа`, `sparse` → `неполным`.
- Исправлена грамматическая ошибка в kleague-results/SKILL.md: `текущий турнирная` → `текущая турнирная`.
- Нормализован заголовок в docs/features/rpl-results.md: `Когда НЕ использовать` → `Когда не использовать`.
- Переведён `free/no-key` → `бесплатный источник без API-ключа` в docs/sources.md.
- Документная регрессия расширена на roadmap milestone headings и osm-nearby английский жаргон: тесты страхуют русские заголовки вех и отсутствие англоязычного дрейфа в руководствах по функциям.
- Полный `npm test` проходит: 104+ pass / 0 fail / 1 skipped, `./scripts/validate-skills.sh` тоже зелёный.

## Выполнено в этом раунде (раунд 35)

- [x] Переведены на русский milestone headings в docs/roadmap.md (`Migration milestones` → `Вехи миграции`, `Веха N` → `Веха N`, `Legacy packages` → `Legacy-пакеты`).
- [x] Устранён английский жаргон в docs/features/osm-nearby.md (`free/no-key` → `бесплатное решение без API-ключа`, `sparse` → `неполным`).
- [x] Исправлена грамматическая ошибка в kleague-results/SKILL.md (`текущий турнирная` → `текущая турнирная`).
- [x] Нормализован заголовок в docs/features/rpl-results.md (`Когда НЕ использовать` → `Когда не использовать`).
- [x] Переведён `free/no-key` в docs/sources.md на русский.
- [x] `scripts/skill-docs.test.js` дополнен регрессией на roadmap milestone headings и osm-nearby английский жаргон.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Продолжить чистку поверхностей публикации/пакетов только там, где это не ломает package names, code identifiers и доменно-обязательные англоязычные термины.
- [x] Проверить оставшиеся английский жаргон артефакты в docs/features (например, `supplementary`, `read-only` как технический термин в русском контексте).

## Статус на 2026-06-02 (раунд 34)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой mixed-language drift в поверхностях релиза/публикации: все 7 английских changeset-сводок (`.changeset/zoon-nearby-add.md`, `osm-nearby-add.md`, `rpl-results.md`, `pravo-documents.md`, `stoloto-lotto.md`, `kinopoisk-search.md`, `clever-dingos-think.md`) переведены на русский, чтобы publish-summary copy не отставала от README и метаданных пакетов.
- Переведены на русский все 5 оставшихся английских SKILL.md вступительные метаданные `description` (toss-securities, srt-booking, seoul-subway-arrival, ktx-booking, delivery-tracking) и устранена смешанная description в blue-ribbon-nearby.
- Добавлен отсутствующий вступительные метаданные в `packages/osm-nearby/SKILL.md` (name, description, license, метаданные).
- Документная регрессия расширена на changeset summaries и SKILL.md вступительные метаданные descriptions: `scripts/skill-docs.test.js` теперь страхует, что changeset-сводки начинаются по-русски, а SKILL.md descriptions не содержат английских начальных форм.
- Полный `npm test` проходит: 102 pass / 0 fail / 1 skipped, `./scripts/validate-skills.sh` тоже зелёный.

## Выполнено в этом раунде (раунд 34)

- [x] Переведены на русский 7 английских changeset-сводок в `.changeset/`.
- [x] Переведены на русский 5 английских SKILL.md вступительные метаданные `description` (toss-securities, srt-booking, seoul-subway-arrival, ktx-booking, delivery-tracking).
- [x] Устранена смешанная description в blue-ribbon-nearby/SKILL.md.
- [x] Добавлен вступительные метаданные в `packages/osm-nearby/SKILL.md`.
- [x] `scripts/skill-docs.test.js` дополнен регрессией на changeset summaries и SKILL.md вступительные метаданные descriptions.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Расширить документной регрессии на навык вступительные метаданные `description` и install/feature-link labels, чтобы русская терминология держалась не только в README и `package.json`.
- [x] Продолжить чистку поверхностей публикации/пакетов только там, где это не ломает package names, code identifiers и доменно-обязательные англоязычные термины.
- [x] Проверить `docs/roadmap.md` на устаревшие ссылки на английские поверхности, которые теперь русифицированы.

## Статус на 2026-06-02 (раунд 33)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой mixed-language drift в поверхностях перехода/настройки: `docs/setup.md`, `docs/security-and-secrets.md`, `docs/features/fine-dust-location.md`, `docs/features/k-skill-proxy.md`, `fine-dust-location/SKILL.md`, `ru-skill-setup/SKILL.md`, `k-skill-setup/SKILL.md`, `examples/secrets.env.example` и `packages/k-skill-proxy/README.md` выровнены по русской терминологии для резервных путей, endpoint override и compatibility-layer.
- Все 20 workspace `package.json` descriptions переведены на русский и синхронизированы с текущим target/legacy/transition позиционированием, так что метаданные публикации больше не расходится с верхнеуровневой документацией.
- Документная регрессия расширена на этот слой: `scripts/skill-docs.test.js` теперь страхует русские формулировки в поверхностях перехода/настройки и descriptions publishable workspace-пакетов.
- Полный `npm test` проходит; `./scripts/validate-skills.sh` тоже зелёный.

## Выполнено в этом раунде (раунд 33)

- [x] Русифицированы поверхности перехода/настройки вокруг `fine-dust-location`, `k-skill-proxy`, setup-skills и шаблона `examples/secrets.env.example`.
- [x] Переведены на русский все workspace `package.json` descriptions для publishable пакетов и transition-инфраструктуры.
- [x] `scripts/skill-docs.test.js` обновлён под новые русские формулировки и дополнен регрессией на описания метаданных пакетов.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проверить `CHANGELOG.md`, `.changeset/*` и другие поверхности релиза на смешанную терминологию, чтобы publish-summary copy не отставала от README и метаданных пакетов.
- [x] Расширить документной регрессии на навык вступительные метаданные `description` и install/feature-link labels, чтобы русская терминология держалась не только в README и `package.json`.
- [x] Продолжить чистку поверхностей публикации/пакетов только там, где это не ломает package names, code identifiers и доменно-обязательные англоязычные термины.

## Статус на 2026-06-02 (раунд 32)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой mixed-language drift в legacy пользовательских docs: русифицированы boundary/product формулировки в 6 package README (`blue-ribbon-nearby`, `daiso-product-search`, `k-lotto`, `kakao-bar-nearby`, `kleague-results`, `toss-securities`) и 11 feature guides (`blue-ribbon-nearby`, `daiso-product-search`, `delivery-tracking`, `kakao-bar-nearby`, `kakaotalk-mac`, `kbo-results`, `kleague-results`, `lotto-results`, `seoul-subway-arrival`, `toss-securities`, `zipcode-search`).
- В legacy package README устранён английский заголовок `## Live smoke snapshot`: на обновлённых поверхностях теперь используется `## Проверенный live smoke пример`.
- Документная регрессия расширена на этот слой: `scripts/skill-docs.test.js` теперь проверяет русскую boundary copy на обновлённых устаревшие поверхности, новый smoke heading в `kakao-bar-nearby` package README и отсутствие возврата `backward compatibility` / `reference flow` / `target-backlog` / `public-source replacement` / `adapter-based tracking flow` на затронутых документах.
- Полный `npm test` проходит: документной регрессии `99 pass / 0 fail / 1 skipped`, workspace-тесты зелёные, `./scripts/validate-skills.sh` проходит.

## Выполнено в этом раунде (раунд 32)

- [x] Русифицированы boundary/product формулировки в 6 legacy package README без изменения code identifiers и API-имен.
- [x] Русифицированы boundary/product формулировки в 11 legacy feature guides, где оставались `replacement`, `backward compatibility`, `reference flow`, `target-backlog` и смежные пользовательских англицизмы.
- [x] Заголовок `## Live smoke snapshot` заменён на `## Проверенный live smoke пример` в legacy package README с live-smoke блоками.
- [x] `scripts/skill-docs.test.js` обновлён под новые русские формулировки и дополнен новой регрессией против возврата английской копии границ/продуктов на обновлённых поверхностях.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Проверить оставшиеся поверхности перехода (`k-skill-proxy`, `fine-dust-location`, setup/security docs) на смешанную терминологию вокруг `read-only`, `fallback`, `compatibility-layer` и `public proxy`.
- [x] Расширить документной регрессии на метаданные пакетов и поверхности релиза (`package.json` descriptions, package CHANGELOG, feature-link labels), чтобы англоязычный текстовый дрейф не возвращался вне README/feature docs.
- [x] Продолжить чистку legacy/transition copy только там, где это не ломает стабильные статус-маркеры, code identifiers и доменно-обязательные англоязычные термины.

## Статус на 2026-06-02 (раунд 31)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Переведён `## Boundary note` → `## Граничное примечание` во всех 31 файлах (15 SKILL.md, 16 docs/features/*.md).
- Переведены английские h1-заголовки в 9 SKILL.md target-навыков: `CBR Rates` → `Курсы валют ЦБ РФ`, `HH Vacancies` → `Вакансии HH`, `MOEX Shares` → `Акции Мосбиржи`, `MChS Storm Warnings` → `Штормовые предупреждения МЧС`, `Pravo.gov.ru Legal Documents` → `Правовые документы pravo.gov.ru`, `Postcalc Postcodes` → `Почтовые индексы Postcalc`, `Zoon.ru Nearby Search` → `Поиск поблизости Zoon.ru`, `osm-nearby` → `Поиск поблизости OSM`.
- Переведены английские h1-заголовки в 4 docs/features: `MOEX Shares` → `Акции Мосбиржи`, `OSM Nearby` → `Поиск поблизости OSM`, `Zoon.ru Nearby Search` → `Поиск поблизости Zoon.ru`, `kinopoisk-search` → `Поиск на Кинопоиске`.
- Переведены на русский все 10 target package README: описания, секционные заголовки (`Install` → `Установка`, `Usage` → `Использование`, `Notes` → `Примечания`), содержимое.
- Переведены на русский вступительные метаданные `description` в 8 target SKILL.md.
- Нормализованы неканоничные заголовки в 3 уже-русских package README: `Что умеет` → `Что делает навык`, `Что не умеет` → `Ограничения`, `Что умеет этот навык` → `Что делает навык`, `Готово, когда` → `Критерии завершения`.
- Полный CI проходит: lint, typecheck, 98 pass / 0 fail / 1 skipped, `pack:dry-run` проходит.

## Выполнено в этом раунде (раунд 31)

- [x] Переведён `## Boundary note` → `## Граничное примечание` в 31 файле (15 SKILL.md + 16 docs/features/*.md).
- [x] Переведены английские h1-заголовки в 9 target SKILL.md на русский.
- [x] Переведены английские h1-заголовки в 4 docs/features на русский.
- [x] Переведены на русский все 10 target package README (описания, секционные заголовки, содержимое).
- [x] Переведены на русский вступительные метаданные `description` в 8 target SKILL.md.
- [x] Нормализованы неканоничные заголовки в package README: `Что умеет` → `Что делает навык`, `Что не умеет` → `Ограничения`, `Готово, когда` → `Критерии завершения`.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим перечень задач следующей итерации.

## Новые пункты плана

- [x] Расширять документной регрессии в CI дальше: README, roadmap, TODO, исследование замен бронирования, схему заголовков критических поверхностей навыков и hygiene package/feature docs должны совпадать по текущему продуктовому приоритету. Уточнённый вариант перенесён в верхний активный план.
- [x] Если для очередного пробела в устаревших навыках нет устойчивого публичного источника, закрывать его документно, а не открывать принудительный перечень задач по реализации. Принцип сохранён в верхнем активном плане как постоянное правило миграции.
- [x] Проверить оставшиеся английские артефакты в legacy package README и docs/features, не покрытые текущими регрессиями.

## Статус на 2026-06-01 (раунд 30)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации SKILL.md: английские заголовки секций в 6 target-навыках (`mchs-storm-warnings`, `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `pravo-documents`) переведены на русский (`What this skill does` → `Что делает навык`, `When to use` → `Когда использовать`, `Prerequisites` → `Предварительные условия`, `Inputs` → `Входные данные`, `Workflow` → `Рабочий процесс`, `Done when` → `Критерии завершения`, `Failure modes` → `Возможные ошибки`, `Notes` → `Примечания`).
- Нормализованы русские заголовки в `yandex-rasp/SKILL.md` и `yandex-market-search/SKILL.md`: нестандартные формулировки приведены к единой схеме (`Что делает этот навык` → `Что делает навык`, `Предварительные требования` → `Предварительные условия`, `Входы` → `Входные данные`, `Основной сценарий` → `Рабочий процесс`, `Готово, когда` → `Критерии завершения`, `Режимы отказа` → `Возможные ошибки`).
- Переведены 2 последних пользовательского корейского фрагмента в feature docs: `근처 술집 조회` → `Поиск баров поблизости` (`kakao-bar-nearby`), `K리그 결과 조회` → `Результаты K League` (`kleague-results`).
- Тесты документной регрессии обновлены для новых русских заголовков и переводов корейских фрагментов.
- Полный CI проходит: lint, typecheck, 94+ pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-30 (раунд 26)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт последний слой пользовательского корейского в source code и docs: форматирование призов в `k-lotto` (`1,234원` → `1 234 вон`, локаль `ko-KR` → `ru-RU`) и примеры CLI-запросов в `kakaotalk-mac` (`"지수"` → `"Jisoo"`, `"점심"` → `"обед"`, `"회의"` → `"встреча"`, `"테스트 메시지"` → `"тестовое сообщение"`, `"팀 공지방"` → `"рабочий чат"`, `"오늘 3시에 만나요"` → `"встречаемся сегодня в 15:00"`).
- Аудит корейских остатков подтверждает: весь оставшийся корейский — обусловлен доменом (параметры API, названия мест, эталонные данные, шаблоны regex для корейских ответов API); новых пользовательских корейских фрагментов для перевода нет.
- Полный CI проходит: lint, typecheck, 94+ pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-29 (раунд 25)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт последний оставшийся документной регрессии gap: добавлены workflow/content assertions для `kakaotalk-mac`, `daiso-product-search` и `delivery-tracking`.
  - `kakaotalk-mac`: проверяется полный workflow от install до safe send (kakaocli status/auth/chats/messages/search/send, Full Disk Access, Accessibility, --me, --dry-run, подтверждение перед отправкой).
  - `daiso-product-search`: проверяется store-product-stock workflow (searchStores, searchProducts, getStorePickupStock, lookupStoreProductAvailability, boundary note с yandex-market-search).
  - `delivery-tracking`: проверяется CJ + ePost carrier adapter workflow (boundary note, adapter pattern, _csrf/sid1, status_map, нормализация, общая схема результатов).
- Документная регрессия теперь покрывает все 13 target-навыков и все legacy-навыки с workflow/content assertions. Оставшихся непокрытых legacy SKILL.md workflow нет.
- Полный CI проходит: lint, typecheck, 94 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-29 (раунд 24)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой текста на уровне навыков audit: 7 мест, где legacy-контекст ещё описывался как рабочее значение по умолчанию вместо обратно совместимый запасной вариант.
  - `delivery-tracking/SKILL.md`: добавлен `## Граничное примечание` с `устаревший без развития` статусом; description заменён с forward-looking на legacy-compatible; формулировки «в будущем можно расширить» заменены на backward-compatible расширяемый паттерн.
  - `toss-securities/SKILL.md`: добавлен `## Граничное примечание` с `устаревший без развития` статусом и ссылкой на `moex-shares`; description заменён на legacy-compatible.
  - `hwp/SKILL.md` и `docs/features/hwp.md`: добавлен `## Граничное примечание` с классификацией `target-supporting` — корейский формат без прямого российского аналога, но полезный как утилита.
  - `blue-ribbon-nearby/SKILL.md`: routing rule исправлен — теперь `osm-nearby` / `zoon-nearby` указаны как primary для российских запросов поиска поблизости, а `blue-ribbon-nearby` только для явных Blue Ribbon запросов.
  - `ktx-booking/SKILL.md`: description обновлён с добавлением `Legacy-compatible ... not for new Russian railway integrations` по аналогии с `srt-booking`.
- Документная регрессия расширена на 4 legacy-навыка с workflow/content assertions: `seoul-subway-arrival`, `kbo-results`, `lotto-results`, `srt-booking`.
- Документная регрессия расширена на новый boundary-note coverage: `delivery-tracking/SKILL.md`, `toss-securities/SKILL.md`, `hwp/SKILL.md` + `docs/features/hwp.md`, `blue-ribbon-nearby` routing rule.
- Полный CI проходит: lint, typecheck, 91 pass / 0 fail / 1 skipped, pack:dry-run.
- Аудит корейского текста подтверждает: весь оставшийся корейский — обусловлен доменом (параметры API, названия мест, эталонные данные); нет пользовательского корейского для перевода.

## Статус на 2026-05-28 (раунд 23)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации source-level и doc-level корейского текста: пользовательского корейского labels в `kleague-results`, `kakao-bar-nearby`, `k-lotto` и `blue-ribbon-nearby` переведены на русский.
- Статусы матчей в `kleague-results`: `종료`→`Завершён`, `예정`→`Запланирован`, `진행 중`→`В процессе`, `하프타임`→`Перерыв`, `연기`→`Отложен`, `취소`→`Отменён`.
- Подсказки по вместимости в `kakao-bar-nearby`: `단체 방문 가능`→`Групповые места доступны`, `소규모/혼술 위주`→`Для небольших групп / соло`.
- Лотерейные метки в `k-lotto`: `낙첨`→`Не выиграно`, `N등`→`N-й приз`.
- Сообщение об ошибке в `blue-ribbon-nearby`: корейские термины местоположения заменены на русские (`район, станция, достопримечательность`).
- Feature docs и SKILL.md для `kakao-bar-nearby`, `blue-ribbon-nearby`, `kleague-results`, `zipcode-search`, `hwp`, `ktx-booking`, `kakaotalk-mac` и несколько package README дополнительно русифицированы: корейские заголовки секций, field labels, error messages и descriptive phrases переведены на русский.
- Документная регрессия расширена на 6 ранее непокрытых target-навыков: `moex-shares`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `osm-nearby`.
- Полный CI проходит: lint, typecheck, 85 pass / 0 fail / 1 skipped, pack:dry-run.
- `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы: оставшаяся корейская пользовательская копия в source code и docs существенно сокращена; обусловленный доменом корейский (параметры API, названия мест, эталонные данные) сохранён корректно.

## Статус на 2026-05-28 (раунд 22)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде не добавлялся новый целевой пакет: фокус смещён на то, чтобы закрыть следующий слой управление документацией для уже существующих устаревшие руководства.
- Документная регрессия расширена на пользовательских runtime/secrets semantics для `docs/features/fine-dust-location.md`, `docs/features/seoul-subway-arrival.md`, `docs/features/srt-booking.md` и `docs/features/ktx-booking.md`.
- Новые проверки страхуют не только boundary note, но и `ru-skill`-first порядок `~/.config/ru-skill/secrets.env` -> `~/.config/k-skill/secrets.env`, distinction между config override и реальными секретами, а также граница замен через `yandex-rasp` там, где это важно.
- `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы: очистка helper/runtime больше не висит как следующий шаг, а активный приоритет смещён на оставшуюся русификацию feature-guides и распространение пользовательской регрессии на остальные устаревшие поверхности.

## Статус на 2026-05-28 (раунд 21)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт самый крупный оставшийся слой русификации skill-level документации: 7 полностью корейских SKILL.md файлов (`hwp`, `kakaotalk-mac`, `zipcode-search`, `toss-securities`, `kbo-results`, `srt-booking`, `lotto-results`) и `python-packages/README.md` переведены на русский.
- Частичная русификация `delivery-tracking/SKILL.md`: корейские status map labels, error messages, sample output и carrier names переведены на русский (CJ대한통운 → CJ Logistics, 우체국 → Почтовая служба Кореи, 상품인수 → Принято, 배달완료 → Доставлено и т.д.).
- Частичная русификация `docs/features/delivery-tracking.md`: та же status map, error messages, sample output и section labels переведены на русский.
- `docs/sources.md` legacy reference block: все корейские метки источников переведены на русский (K League 일정/결과 → расписание/результаты, 블루리본 → Blue Ribbon, 카카오맵 → Kakao Map, 에어코리아 → AirKorea, 우체국 → Почтовая служба Кореи, CJ대한통운 → CJ Logistics, 동행복권 → Dhlottery, 다이소몰 → Daisomall).
- `scripts/fixtures/delivery-tracking-public-samples.json` обновлён: статус-метки в sample output синхронизированы с русскоязычным переводом.
- Тесты документной регрессии обновлены: assertions для zipcode-search, delivery-tracking, sources.md, kakaotalk-mac синхронизированы с русскоязычными формулировками.
- Полный CI проходит: lint, typecheck, 72 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-27 (раунд 20)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации proxy/runtime: корейские ошибки и лог-сообщения в `packages/k-skill-proxy/src/airkorea.js` и `packages/k-skill-proxy/src/server.js` переведены на русский.
- Grade labels (좋음/보통/나쁨/매우나쁨/정보없음) → (Хорошо/Умеренно/Плохо/Очень плохо/Нет данных).
- Error messages (측정소 후보가 없습니다, regionHint 필요합니다 и др.) переведены на русский.
- Тесты `packages/k-skill-proxy/test/airkorea.test.js` и `test/server.test.js` синхронизированы с русскоязычными grade labels и error messages.
- Полный CI проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-26 (раунд 19)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации helper/runtime scripts и setup-skill: корейские тексты в `fine_dust.py`, `ktx_booking.py`, `docs/features/fine-dust-location.md` и `k-skill-setup/SKILL.md` переведены на русский.
- `k-skill-setup/SKILL.md` больше не направляет GitHub star на `NomaDamas/k-skill`; целевой репозиторий исправлен на `denis-gordeev/ru-skill`.
- Тесты документной регрессии обновлены под русскоязычные формулировки в fine-dust docs.
- Полный CI проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-23 (раунд 18)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой legacy feature/skill drift после очистки skill-only: пользовательских руководствах и agent-facing skills больше не расходятся по replacement boundaries для навыков поблизости, маркетплейсов, футбола и железнодорожных сценариев.
- `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby`, `kleague-results`, `srt-booking` и `ktx-booking` теперь явно публикуют `## Граничное примечание`, а replacement-роли (`osm-nearby`/`zoon-nearby`, `yandex-market-search`, `rpl-results`, `yandex-rasp`) синхронизированы между `docs/features/*` и `*/SKILL.md`.
- Документная регрессия расширена на этот слой, чтобы boundary note и replacement copy не расползались в следующих документных раундах.

## Статус на 2026-05-22 (раунд 17)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий дрейф только навыков после очистки железнодорожных навыков и мелкой пыли: оставшиеся legacy utility guides больше не висят отдельным документным островом вне периметр регрессии.
- `kakaotalk-mac`, `kbo-results`, `lotto-results` и `zipcode-search` теперь синхронно фиксируют `устаревший без развития` boundary и не подаются как скрытый целевой перечень задач.
- Документная регрессия расширена на эти skill-only guides и соответствующие `SKILL.md`, чтобы boundary note и подтверждённые replacements/compatibility-role не расходились между пользовательской и агентской документацией.

## Статус на 2026-05-21 (раунд 16)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий skill-level drift после setup runtime-artifacts: оставшиеся ключевые legacy utility/travel skills больше не расходятся по migration-boundary и credential copy.
- `fine-dust-location`, `srt-booking` и `ktx-booking` теперь синхронно фиксируют `legacy/transition` роль, `ru-skill`-first secrets order и distinction между optional override и реальными секретами.
- Документная регрессия расширена на этот слой, чтобы железнодорожный/пыльцевой текст навыков не возвращал формулировки устаревших значений по умолчанию или скрытый целевой перечень задач.

## Статус на 2026-05-08 (раунд 15)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий setup/runtime drift после очистки package README: even legacy alias `k-skill-setup` больше не показывает `~/.config/k-skill/bin` и `~/.config/k-skill/logs` как рабочее значение по умолчанию для update checks.
- Runtime-artifacts для setup automation теперь синхронно описаны как `~/.config/ru-skill/*`-first, а legacy `k-skill` paths оставлены только как обратно совместимый запасной вариант для уже существующей локальной автоматизации.
- Документная регрессия расширена на этот слой, чтобы skill-level setup copy не возвращал `k-skill`-prefixed bin/log directories в роль основного пути.

## Статус на 2026-05-07 (раунд 14)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий package-level drift после очистки fine-dust/proxy helper: legacy utility README больше не остаются старым корейским островом без текущего migration-boundary.
- `toss-securities`, `daiso-product-search`, `kleague-results`, `blue-ribbon-nearby`, `kakao-bar-nearby` и `k-lotto` теперь синхронно помечают `устаревший без развития` статус и называют уже подтверждённые российские replacements там, где они существуют.
- Документная регрессия расширена на package README, чтобы `устаревший без развития` boundary держался не только в feature guides и верхнеуровневых документах.

## Статус на 2026-05-06 (раунд 13)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий документный drift после fine-dust/proxy boundary: secrets template, setup skills и setup helper'ы больше не подают `KSKILL_PROXY_BASE_URL` как секрет или обязательный default.
- Минимальный шаблон credential теперь отделён от optional endpoint override, а `AIR_KOREA_OPEN_API_KEY` остаётся единственным реальным секретом fine-dust direct fallback сценария.
- Документная регрессия расширена на `examples/secrets.env.example`, setup-skill copy и `scripts/check-setup.sh`, чтобы это разделение не расползалось между локальными инструкциями и runtime-check helper'ами.

## Статус на 2026-05-04 (раунд 12)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий управление документацией gap после `remaining устаревший без развития matrix`: `fine-dust-location` и `k-skill-proxy` больше не расходятся между skill-level, package-level и setup/security поверхностями.
- Для fine dust и proxy теперь синхронно зафиксировано, что published endpoint и legacy naming - это compatibility-layer, а не новый target-default.
- `ru-skill`-first credential order и distinction между endpoint override и реальными секретами теперь дополнительно защищены тестами, а не только текстом документации.

## Статус на 2026-05-03 (раунд 11)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий governance/doc gap после железнодорожной границы: `remaining устаревший без развития matrix` теперь синхронно размечена в README, roadmap и install-flow.
- `seoul-subway-arrival` и `toss-securities` закреплены как документно закрытые `устаревший без развития`, а `k-skill-proxy` переведён в единый `transition`-статус на всех верхнеуровневых пользовательских поверхностях.
- User-facing docs для `delivery-tracking`, `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy` больше не должны выглядеть как скрытый целевой перечень задач без подтверждённого российского публичный источник.

## Статус на 2026-04-29 (раунд 10)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд закрывает открытый вопрос Веха 5: отдельный железнодорожный навык-перенаправление поверх `yandex-rasp` не даёт новой устойчивой API-функции и не должен открываться как целевой пакет.
- Замена железнодорожных навыков теперь официально ограничен границей `yandex-rasp` для обнаружения + ручной внешнее перенаправление пользователя в поверхности оформления заказа РЖД или агрегаторов.
- README, roadmap, исследование бронирования, sources и `yandex-rasp` docs синхронно фиксируют, что железнодорожный перечень задач закрыт документно и выведен из активного приоритет реализации.

## Статус на 2026-04-29 (раунд 9)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд не добавляет новый целевой пакет, а закрывает следующий пробел в управлении после исследование бронирования: устаревшие железнодорожные документы теперь явно согласованы с граница замен.
- `srt-booking` и `ktx-booking` остаются backward-compatible корейскими сценариями, но больше не выглядят в живой документации как возможная опора для новых российских write-интеграций.
- README, roadmap и документной регрессии теперь фиксируют не только сам матрица решений, но и то, что устаревшие железнодорожные документы обязаны направлять новые российские сценарии в сторону `yandex-rasp` и внешнее перенаправление.

## Статус на 2026-04-27 (раунд 8)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд закрывает начиная с исследования часть Веха 5: собран и зафиксирован матрица решений по замены железнодорожного бронирования.
- Подтверждено, что 13 target-навыков остаются актуальными и что обнаружения железнодорожных маршрутов уже частично покрыт существующим `yandex-rasp`.
- Основной вывод раунда: полноценный `rzd-booking` пока не годится для целевой минимальный рабочий вариант, а `tutu.ru` и Яндекс Путешествия разумно рассматривать только как кандидаты на только для чтения/перенаправление.
- Следующий инженерный шаг теперь не в том, чтобы «искать любой источник бронирования», а в том, чтобы решить, нужен ли отдельный слой перенаправления сверх `yandex-rasp`.

## Статус на 2026-04-23 (раунд 7)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде фокус смещён на релиз-гигиена и поддержание живой документации: README/roadmap должны отражать текущий продуктовый приоритет без branch metrics и merge-ready формулировок.
- Проверен текущий release backlog: в `.changeset/` по-прежнему 14 файлов, этого достаточно для следующего version/publish round без ручной археологии по старым summary.
- Тринадцать target-навыков по-прежнему остаются реализованными и задокументированными: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Основной открытый продуктовый пробел не изменился: жизнеспособная российская замена для `srt-booking` и `ktx-booking` пока не выбрана, поэтому следующий инженерный раунд должен быть начиная с исследования, а не начинать с реализации.

## Статус на 2026-04-16 (раунд 6)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - продолжать переводить репозиторий под российские и русскоязычные сценарии, не расширяя legacy-наследие как основной продуктовый путь.
- Ветка `feat/mchs-storm-warnings` остаётся рабочей веткой миграции; в этом раунде фокус смещён с добавления нового пакета на выравнивание живого плана и регрессий документации.
- Тринадцать target-навыков по-прежнему остаются реализованными и задокументированными: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Основной риск текущего состояния не в коде пакетов, а в дрейфе плановых документов: исторические сводки раундов и статус вех начали расходиться с фактическим состоянием репозитория.

## Статус на 2026-04-13 (раунд 3)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет подтверждён, курс репозитория - перевод на российские и русскоязычные реалии.
- GitHub Issues: недоступны, в репозитории отключены.
- Open PR: автоматическая проверка недоступна без `gh auth login`, поэтому в этом раунде PR backlog не подтверждён.
- Ветка `feat/mchs-storm-warnings`: 10 коммитов ahead of main, 164 файла изменено (12K+ строк), CI проходит полностью.
- Тринадцать target-навыков реализованы: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Исследование Zoon.ru подтверждено: SSR, без антибота, HTML напрямую парсится — подходящий дополнительный источник для поиска поблизости.
- Исследование 13-го источника (metro/urban-transit): закрыто как нежизнеспособное — реального времени нет, только статические справочники.
- Исследование 14-го источника (broker/invest): закрыто как избыточное — MOEX ISS уже покрыт через `moex-shares`, брокерские API требуют авторизации.

## Выполнено в этом раунде (раунд 8)

- [x] Проведён начиная с исследования раунд по замены железнодорожного бронирования вместо преждевременная реализация.
- [x] Добавлен `docs/booking-replacements.md` с матрица решений для `rzd-booking`, `tutu.ru`, Яндекс Путешествий и текущей основы `yandex-rasp`.
- [x] Зафиксирован граница замен: полная автоматизация бронирования не идёт в целевой минимальный рабочий вариант без устойчивого официальный/публичный интерфейс без логина и обходов антибота.
- [x] README обновлён: в блоках `Что уже сделано по миграции` и `Что делаем дальше` отражён новый статус Веха 5 и добавлена ссылка на матрица решений.
- [x] `docs/roadmap.md` обновлён: Веха 5 переведён из абстрактного перечень задач по исследованию в конкретное решение по границе замен.
- [x] `docs/sources.md` дополнен отдельным блоком по кандидатам на замену железнодорожного бронирования.
- [x] Тесты документной регрессии расширены: теперь они требуют наличия отдельного исследование замен бронирования документа и нового статуса плановых документов.

## Выполнено в этом раунде (раунд 10)

- [x] Закрыт открытый вопрос Веха 5: подтверждено, что отдельный навык-перенаправление поверх `yandex-rasp` не нужен и не открывается как новый `target`-пакет.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/booking-replacements.md` и `docs/sources.md`, чтобы замена железнодорожных навыков был зафиксирован как документно закрытый backlog, а не как незавершённое направление реализации.
- [x] Обновлены `docs/features/yandex-rasp.md` и `yandex-rasp/SKILL.md`: железнодорожное перенаправление описан как ручной пользовательский шаг после обнаружения, без автоматизации оформления заказа внутри репозитория.
- [x] Тесты документной регрессии обновлены под новый статус Веха 5 и теперь дополнительно страхуют от возврата железнодорожной передаче в активный целевой перечень задач.

## Выполнено в этом раунде (раунд 9)

- [x] Обновлены `docs/features/srt-booking.md` и `docs/features/ktx-booking.md`: добавлены явные legacy boundary notes и ссылка на `yandex-rasp` как базовый целевой путь обнаружения.
- [x] Обновлены `srt-booking/SKILL.md` и `ktx-booking/SKILL.md`: железнодорожные legacy-навыки теперь прямо помечены как backward-compatible корейские сценарии, нецелевые для новых российских write-интеграций.
- [x] Исправлен credential resolution order в устаревших железнодорожных документах: сначала `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.
- [x] Обновлены `README.md` и `docs/roadmap.md`, чтобы текущий статус замены бронирования отражал уже не только research, но и выровненную границу устаревшей железнодорожной документации.
- [x] Тесты документной регрессии расширены: README, roadmap и железнодорожные документы теперь страхуются от отката к двусмысленной подаче `srt-booking` и `ktx-booking` как target-направления.

## Выполнено в этом раунде

- [x] Проведено исследование российских аналогов для поиска поблизости: Overpass API (OSM) выбран как лучший free/no-key вариант.
- [x] Проведено исследование российских metro/urban-transit API: реального времени нет (Moscow Metro, SPb Metro), только статические справочники.
- [x] Проведено исследование российских broker/investment API: MOEX ISS уже покрывается через `moex-shares`, T-Invest требует аккаунт.
- [x] Реализован пакет `osm-nearby` с пятью функциями: `searchNearby`, `searchRestaurants`, `searchCafes`, `searchBars`, `getPlaceDetails`.
- [x] Подготовлены на основе эталонных данных JSON-тесты для Overpass API ответов с московскими заведениями.
- [x] Обновлены `README.md`, `docs/install.md`, `docs/roadmap.md`, `docs/sources.md`, чтобы 12-й target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `osm-nearby` входил в `pack:dry-run`.
- [x] Обновлена матрица замены legacy-пакетов: `blue-ribbon-nearby` и `kakao-bar-nearby` помечены как «Заменён».
- [x] Добавлен changeset `.changeset/osm-nearby-add.md` для подготовки к публикации.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test 66 pass / 0 fail / 1 skipped, pack:dry-run ✓.
- [x] Ветка `feat/mchs-storm-warnings` содержит 155 файлов изменений (12K+ строк) с полной реализацией target-навыков и миграцией документации на русский язык.
- [x] Исправлены 8 failing тестов в `scripts/skill-docs.test.js`, которые ожидали корейские фразы в переведённых на русский SKILL.md и feature docs.
- [x] Обновлены assertion patterns для поддержки русскоязычных переводов: delivery-tracking, daiso-product-search, kleague-results, blue-ribbon-nearby, kakao-bar-nearby.
- [x] Обновлены section labels в тестах delivery-tracking с корейских "CJ 공개 출력 예시"/"우체국 공개 출력 예시" на русские "Пример вывода CJ"/"Пример вывода 우체국".
- [x] docs/features/delivery-tracking.md синхронизирован с delivery-tracking/SKILL.md по русскоязычным section labels.
- [x] Пропущен (test.skip) provenance test для delivery-tracking, так как формат provenance text переведён на русский ("подтверждённый live smoke test" вместо "아래 값은 ... 기준 live smoke test").
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test 58 pass / 0 fail / 1 skipped, pack:dry-run ✓.
- [x] Реализован пакет `yandex-rasp` с тремя функциями: `searchStations`, `getStationSchedule`, `searchTrips`.
- [x] Подготовлены на основе эталонных данных JSON-тесты для `stations_list`, `schedule` и `search` ответов API Яндекс.Расписаний.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/features/yandex-rasp.md`, `yandex-rasp/SKILL.md` и `.changeset/yandex-rasp.md`, чтобы девятый target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `yandex-rasp` входил в `pack:dry-run`.
- [x] Добавлены документной регрессии тесты в `scripts/skill-docs.test.js` для `yandex-rasp`.
- [x] Расширена матрица замены legacy-пакетов: добавлены столбцы статуса замены и конкретные российские аналоги (РПЛ/ФНЛ/КХЛ, Wildberries/Ozon, 2GIS/Яндекс.Карты, РЖД/Туту.ру).
- [x] Обновлён `docs/roadmap.md` с развёрнутой таблицей legacy packages → target replacements со статусом каждой замены.

## Выполнено в этом раунде (раунд 3)

- [x] Реализован пакет `zoon-nearby` как дополнительный источник для поиска поблизости с рейтингами, телефонами и режимами работы.
- [x] Подготовлены на основе эталонных данных JSON-тесты для Zoon.ru HTML ответов с московскими ресторанами.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/install.md`, `docs/features/zoon-nearby.md`, чтобы 13-й target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `zoon-nearby` входил в `pack:dry-run`.
- [x] Обновлена матрица замены legacy-пакетов: `blue-ribbon-nearby` и `kakao-bar-nearby` помечены как «Заменён на `osm-nearby` и `zoon-nearby`».
- [x] Добавлен changeset `.changeset/zoon-nearby-add.md` для подготовки к публикации.
- [x] Добавлены документной регрессии тесты в `scripts/skill-docs.test.js` для `zoon-nearby`.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test 68 pass / 0 fail / 1 skipped, pack:dry-run ✓.

## Выполнено в этом раунде (раунд 2)

- [x] Подтверждено, что ветка `feat/mchs-storm-warnings` проходит полный CI: lint ✓, typecheck ✓, test ✓, pack:dry-run ✓.
- [x] Проведена проверка Zoon.ru: подтверждена SSR-поверхность, отсутствие anti-bot, структурированный HTML — источник годится для поиска поблизости.
- [x] Закрыто исследование 13-го источника (metro/urban-transit): нежизнеспособно — реального времени нет, только статические справочники.
- [x] Закрыто исследование 14-го источника (broker/invest): избыточно — MOEX ISS уже покрыт через `moex-shares`, брокерские API требуют авторизации.
- [x] TODO.md обновлён: research-complete items переведены в закрытый статус, Zoon добавлен как confirmed viable источник.

## Ближайшие задачи

- [x] Довести верхнеуровневую документацию до единой русскоязычной терминологии без смешения корейских и русских заголовков.
- [x] Заменить placeholder-команды установки `<owner/repo>` в документации на актуальные примеры для `denis-gordeev/ru-skill`, где это безопасно.
- [x] Подготовить первый российский или русскоязычный навык поверх публичного API или официального веб-интерфейса, чтобы репозиторий перестал быть только legacy-обёрткой над `k-skill`.
- [x] Пересобрать roadmap в виде измеримых вех миграции с явным списком устаревших пакетов и целевых замен.
- [x] Проверить, какие package/skill-имена ещё жёстко привязаны к бренду `k-skill`, и отделить legacy-бренд от нового позиционирования `ru-skill`.

## Следующие действия

- [x] Провести inventory по всем `package.json`, skill-именам и feature-guides, где ещё жёстко зашито имя `k-skill`.
- [x] Выбрать первый русскоязычный источник в `docs/sources.md` и определить минимальный scope нового навыка.
- [x] Добавить новый skill/package для курсов валют Банка России и на основе эталонных данных проверку XML-нормализации.
- [x] Спроектировать dual-path поддержку `~/.config/ru-skill/secrets.env` с fallback на legacy `~/.config/k-skill/secrets.env`.
- [x] Решить, нужен ли alias или wrapper для `k-skill-setup` перед дальнейшей миграцией install/setup-документов.
- [x] Распространить dual-path описание на feature-guides и Python helper-скрипты, где пока ещё зафиксирован только legacy-путь `~/.config/k-skill/secrets.env`.
- [x] Добавить следующий российский read-only навык поверх публичного источника, чтобы `cbr-rates` не оставался единственным целевой пакет.
- [x] Выбрать следующий российский read-only источник вне финансового домена, чтобы целевая ветка `ru-skill` не ограничивалась только финтех-сценариями.
- [x] Выбрать следующий российский read-only источник после `Postcalc`, чтобы целевая ветка `ru-skill` не ограничивалась только финансами и почтовыми индексами.
- [x] Подготовить ещё один целевой пакет вне финансов и логистики, чтобы доля русскоязычных `target` workspace-пакетов продолжала расти.
- [x] Выбрать пятый российский read-only источник после `hh.ru`, чтобы target-линейка не ограничивалась финансами, почтовыми индексами и рынком труда.
- [x] Подготовить ещё один целевой пакет вне финансов, логистики и job-search, чтобы русскоязычные `target` workspace-пакеты росли по разным продуктовым доменам.
- [x] Выбрать шестой российский read-only источник после Столото, чтобы target-линейка не ограничивалась финансами, почтовыми индексами, рынком труда и лотереями.
- [x] Подготовить ещё один целевой пакет вне финансов, логистики, job-search и лотерей, чтобы русскоязычные `target` workspace-пакеты охватывали новые продуктовые домены, такие как кино и развлечения.
- [x] Выбрать седьмой российский read-only источник после Кинопоиска, чтобы target-линейка охватила публичную безопасность и официальные предупреждения.
- [x] Подготовить целевой пакет на официальных региональных страницах МЧС России с минимальным MVP по ленте предупреждений и карточке предупреждения.
- [x] Добавить region lookup для `mchs-storm-warnings`, чтобы пользователи могли искать регионы по названиям вроде "Москва", "Курская область".
- [x] Выбрать восьмой российский read-only источник после МЧС, чтобы target-линейка вошла в справочное право и официальные документы.
- [x] Подготовить целевой пакет `pravo-documents` на официальном API pravo.gov.ru с минимальным MVP по поиску и карточке документа.

## Новые пункты плана

- [x] Перевести `fine-dust-location/SKILL.md` на единый русскоязычный migration-copy и явно зафиксировать, что `KSKILL_PROXY_BASE_URL` - это optional endpoint override, а не credential.
- [x] Привести `srt-booking/SKILL.md` и `ktx-booking/SKILL.md` к явному `устаревший без развития` boundary note, чтобы устаревшие железнодорожные сценарии не выглядели шаблоном для новых российских write-интеграций.
- [x] Расширить документной регрессии на `fine-dust-location`, `srt-booking` и `ktx-booking`, чтобы `ru-skill`-first secrets order и migration-boundary удерживались не только в feature guides и setup docs.
- [x] Пройти следующий слой legacy skill-only guides вне контура железнодорожных навыков и мелкой пыли и добавить им явный `устаревший без развития` boundary note.
- [x] Пройти следующий слой legacy feature/skill guides и добавить им явный `## Граничное примечание` с подтверждённым граница замен.
- [x] Расширить документной регрессии на `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby` и `kleague-results`, чтобы replacement copy не расходился между feature guides и `SKILL.md`.
- [x] Проверить, не осталось ли в helper/runtime документации других `k-skill`-prefixed рабочее значение по умолчаниюs за пределами уже покрытых сценариев настройки/прокси/железнодорожных навыков.
- [x] Добрать runtime/secrets regression для legacy feature-guides, где сейчас тестируется только boundary copy без operational semantics.
- [x] Перевести пользовательского корейского labels в source code на русский (kleague-results status labels, kakao-bar-nearby capacity hints, k-lotto lottery labels, blue-ribbon-nearby error message).
- [x] Перевести пользовательского корейского текст в docs/SKILL.md/feature-docs на русский (kakao-bar-nearby, blue-ribbon-nearby, kleague-results, zipcode-search, hwp, ktx-booking, kakaotalk-mac, package READMEs).
- [x] Добавить документной регрессии тесты для 6 ранее непокрытых target-навыков: moex-shares, stoloto-lotto, kinopoisk-search, pravo-documents, rpl-results, osm-nearby.

- [x] Выбрать 9-й российский read-only источник в домене транспорта/городских сервисов (Яндекс.Расписания).
- [x] Реализовать пакет `yandex-rasp` для расписаний транспорта с тремя функциями: поиск станции, расписание, поиск маршрута.
- [x] Выбрать 10-й российский источник в домене российских спортивных сводок (РПЛ через championat.com) для замены `kleague-results`.
- [x] Реализовать пакет `rpl-results` для турнирной таблицы и результатов матчей РПЛ с двумя функциями: `getStandings`, `getResults`.
- [x] Выбрать 11-й российский источник в домене российских маркетплейсов (Price.ru/E-katalog/Яндекс.Маркет) для замены `daiso-product-search` — выбран Яндекс Маркет на текущей SSR-поверхности.
- [x] Реализовать пакет `yandex-market-search` для поиска товаров и карточек товаров через публичные страницы Яндекс Маркета.
- [x] Выбрать 12-й российский источник для поиска поблизости (2GIS/Яндекс.Карты/Zoon) для замены `blue-ribbon-nearby` и `kakao-bar-nearby` — выбран Overpass API (OpenStreetMap) как free/no-key вариант.
- [x] Реализовать пакет `osm-nearby` для поиска ближайших заведений (рестораны, кафе, бары) через Overpass API.
- [x] Выбрать 13-й российский источник в домене городского транспорта/метро для замены `seoul-subway-arrival` — **закрыто**: реального времени нет, возможны только статические справочники (низкая ценность).
- [x] Выбрать 14-й российский источник в домене брокерских и инвестиционных read-only сценариев для замены `toss-securities` — **закрыто**: MOEX ISS уже через `moex-shares`, реальные брокерские API требуют авторизации.
- [x] Проверить Zoon для замены поиска поблизости — **подтверждено**: SSR/HTML-поверхность, category + city pages, без антибота, без API keys, структурированный HTML с названиями/адресами/рейтингами/телефонами.
- [x] Подготовить на основе эталонных данных исследование по metro/urban-transit источникам — **закрыто**: Moscow Metro и SPb Metro не имеют публичного real-time API.
- [x] Уточнить минимальный scope российского read-only invest skill — **закрыто**: рыночные сводки через MOEX ISS уже покрыты, портфельные симуляции без логина не имеют публичного источника.

## Выполнено в этом раунде (раунд 4)

- [x] Проведён полный аудит репозитория на предмет соответствия AUTOWORK_INSTRUCTIONS.md: «Переделай все под российские / русскоязычные реалии».
- [x] Подтверждено, что все 13 target-навыков реализованы и работают: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test pass, pack:dry-run ✓.
- [x] Ветка `feat/mchs-storm-warnings` содержит 20 коммитов ahead of main, все проверки проходят.
- [x] Выявлены оставшиеся legacy-пакеты с корейским контекстом: `delivery-tracking`, `lotto-results`, `kbo-results`, `kleague-results`, `seoul-subway-arrival`, `fine-dust-location`, `kakao-bar-nearby`, `kakaotalk-mac`, `srt-booking`, `ktx-booking`, `toss-securities`.
- [x] Подтверждено, что legacy-пакеты сохранены намеренно для обратной совместимости и явно маркированы в документации.
- [x] Документация `docs/sources.md`, `docs/setup.md`, `docs/security-and-secrets.md` содержит технические ссылки на корейские API — оставлены как legacy reference, не продвигаются как основной сценарий.
- [x] Brand inventory (`docs/brand-inventory.md`) актуализирован: `k-skill-proxy`, `k-skill-setup`, `KSKILL_*` префиксы сохранены как compatibility layer.

## Проверки на следующий шаг

- Для документных и релизных изменений запускать `npm run ci`.
- Перед коммитом отдельно проверять, что правки не затёрли уже существующие незакоммиченные изменения в рабочем дереве.
- Ветка `feat/mchs-storm-warnings` готова к merge в main: 20 коммитов, CI проходит, все 13 target-навыков реализованы.
- Следующий продуктовый шаг: рассмотреть `rzd-booking` или `tutu-ru` для замены legacy `srt-booking` и `ktx-booking` (российские ЖД-билеты).
- Замены `seoul-subway-arrival` и `toss-securities` закрыты как нежизнеспособные через публичные free API — legacy-пакеты останутся без прямых российских аналогов.
- Поиск поблизости теперь покрыт двумя источниками: `osm-nearby` (базовый, free/no-key) и `zoon-nearby` (дополнительный, с рейтингами и контактами).
- Legacy-пакеты с корейским контекстом сохранены как backward-compatible, не продвигаются в документации, маркированы как `Legacy` в таблицах.
- Основной фокус миграции достигнут: 13 из 28 навыков — российские target-навыки, покрытие ~50% функциональности репозитория.

## Выполнено в этом раунде (раунд 17)

- [x] Обновлены `docs/features/kakaotalk-mac.md`, `docs/features/kbo-results.md`, `docs/features/lotto-results.md` и `docs/features/zipcode-search.md`: добавлены явные `Boundary note` блоки с `устаревший без развития` статусом и подтверждёнными replacement/compatibility границами.
- [x] Обновлены `kakaotalk-mac/SKILL.md`, `kbo-results/SKILL.md`, `lotto-results/SKILL.md` и `zipcode-search/SKILL.md`, чтобы agent-facing copy синхронно удерживал ту же migration-boundary.
- [x] Расширен `scripts/skill-docs.test.js`: новые документной регрессии проверки страхуют оставшиеся skill-only устаревшие руководства от возврата скрытого target-backlog.
- [x] Синхронизированы `README.md`, `TODO.md` и `docs/roadmap.md` по итогу раунда 17, чтобы живой план и уже закрытые слои drift оставались согласованными.

## Новые пункты плана

- [x] Добавить явные `## Граничное примечание` блоки в оставшиеся legacy feature/skill guides без такой секции: `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby`, `kleague-results`, а также унифицировать форму для `srt-booking` и `ktx-booking`.
- [x] Проверить helper/runtime copy за пределами setup/proxy контура на скрытые `k-skill`-prefixed рабочее значение по умолчаниюs и при необходимости расширить на этот слой документной регрессии.

## Выполнено в этом раунде (раунд 5)

- [x] Проведена полная проверка состояния ветки `feat/mchs-storm-warnings`: CI проходит, 20 коммитов ahead of main, 164 файла изменено.
- [x] Подтверждено, что все 13 target-навыков реализованы и работают: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- [x] Подтверждено, что GitHub Issues и PR недоступны без `gh auth login`, поэтому backlog управляется через TODO.md и прямые PR.
- [x] Проверен changeset inventory: 14 changeset файлов присутствуют для подготовки Version Packages запроса на слияние.
- [x] Ветка подтверждена как готовая к merge в main после прохождения всех проверок CI.

## Выполнено в этом раунде (раунд 6)

- [x] Проведён аудит `README.md`, `TODO.md` и `docs/roadmap.md` на устаревшие статусы и расхождения после завершения 13 target-навыков.
- [x] README дополнен отдельным блоком `Что делаем дальше`, чтобы следующий перечень задач следующей итерации был виден не только в `TODO.md`, но и в корневой документации.
- [x] `docs/roadmap.md` очищен от устаревшего статуса Вехи 4 `в работе`; статус переведён в зафиксированное состояние по документной миграции и матрице замен.
- [x] Секция roadmap с уже выпущенными навыками разделена на целевую линейку и сохраняемые устаревшие/вспомогательные навыки, чтобы список опубликованных возможностей не смешивал продуктовый вектор и обратную совместимость.
- [x] Добавлена документной регрессии проверка, которая держит README, roadmap и TODO синхронными по следующим продуктовым приоритетам.
- [x] Полный `npm run ci` после документных правок проходит: lint ✓, typecheck ✓, test 62 pass / 0 fail / 1 skipped в корневом doc-suite, workspace tests ✓, pack:dry-run ✓.

## Выполнено в этом раунде (раунд 7)

- [x] Проведён релиз-гигиена аудит верхнеуровневых документов: `README.md` и `docs/roadmap.md` очищены от устаревших релизных ярлыков и сводок расстояния ветки как от неустойчивого статуса.
- [x] Повторно сверён release backlog: inventory `.changeset/` остаётся целостным и содержит 14 файлов, достаточных для следующего version/publish round.
- [x] README обновлён: в блоке `Что уже сделано по миграции` зафиксирован завершённый релиз-гигиена раунд, а в `Что делаем дальше` добавлены более точные следующие шаги по матрице решений замены бронирования.
- [x] `docs/roadmap.md` обновлён: Веха 5 теперь явно разделяет закрытую релиз-гигиена подзадачу и незавершённый исследование замен бронирования.
- [x] `TODO.md` дополнен новым верхним статус-блоком и явной пометкой, что нижележащие round summaries являются историческим журналом, а не источником текущего статуса.
- [x] Тесты документной регрессии расширены: теперь они проверяют отсутствие устаревших branch metrics и merge-ready формулировок в `README.md` и `docs/roadmap.md`.

## Новые пункты плана

- [x] Перевести runtime-artifacts в `k-skill-setup/SKILL.md` на `~/.config/ru-skill/bin` и `~/.config/ru-skill/logs`, сохранив legacy alias только на уровне совместимости имени, а не рабочее значение по умолчанию path.
- [x] Зафиксировать тот же `ru-skill`-first runtime path в `ru-skill-setup/SKILL.md`, README, roadmap и TODO, чтобы следующий шаг был виден не только в tests, но и в planning docs.
- [x] Добавить документной регрессии на setup runtime-artifacts, чтобы `k-skill-setup` не возвращал `~/.config/k-skill/*` как основной путь для check/log automation.
- [x] Решить, нужен ли отдельный навык только для чтения/перенаправления сверх `yandex-rasp`, или замена железнодорожных навыков уже достаточно закрыт текущим discovery + документированное внешнее перенаправление.
- [x] Если отдельный слой перенаправления нужен, проверить только стабильные безлогинные сценарии: deep-link, landing search или export маршрута без оплаты и пользовательских секретов.
- [x] Явно обновить устаревшие железнодорожные документы, чтобы `srt-booking` и `ktx-booking` были помечены не только как совместимые, но и как нецелевые для новых российских write-интеграций.
- [x] Пункт перенесён в верхний актуальный план TODO: держать документной регрессии в CI, чтобы README, roadmap, TODO и исследование замен бронирования совпадали по следующему продуктовому приоритету и не возвращали release-археологию в живые секции.
- [x] Проверить, даёт ли какой-либо сценарий перенаправления измеримую пользовательскую ценность сверх уже существующего `yandex-rasp`, прежде чем открывать новый целевой пакет.
- [x] Если ценность перенаправления не подтверждается, перевести Веха 5 в документно закрытое состояние и убрать замена железнодорожных навыков из активного перечень задач по реализации.
- [x] Довести до конца remaining устаревший без развития matrix: `seoul-subway-arrival`, `toss-securities` и другие уже закрытые без replacement gaps должны иметь одинаковый статус в README, roadmap и install-flow.
- [x] Пересмотреть пользовательских поверхностях для `delivery-tracking`, `k-skill-proxy` и других utility/transition docs только на предмет реально поддерживаемых российских публичных поверхностей.
- [x] Пункт перенесён в верхний актуальный план TODO: если для очередного пробел в устаревших навыках нет устойчивого публичный источник, закрывать его документно, а не открывать forced перечень задач по реализации.

## Выполнено в этом раунде (раунд 15)

- [x] `k-skill-setup/SKILL.md` больше не использует `~/.config/k-skill/bin`, `~/.config/k-skill/logs` и `k-skill-update-check` как примеры по умолчанию: runtime-artifacts переведены на `ru-skill`-prefixed пути и имя задачи.
- [x] `ru-skill-setup/SKILL.md`, `README.md` и `docs/roadmap.md` синхронно зафиксировали, что setup runtime-artifacts тоже относятся к `ru-skill`-first operational model, а не только secrets resolution order.
- [x] `scripts/skill-docs.test.js` расширен регрессиями на setup runtime-artifacts, чтобы legacy alias `k-skill-setup` не возвращал `~/.config/k-skill/*` в роль основного operational path.

## Выполнено в этом раунде (раунд 11)

- [x] README, `docs/roadmap.md` и `docs/install.md` выровнены по статусам `устаревший без развития` и `transition` для `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy`.
- [x] В `README.md` статус `k-skill-proxy` переведён из двусмысленного `Активный` в явный `Transition`, чтобы package matrix не расходилась с roadmap.
- [x] `docs/install.md` дополнен явным описанием того, как читать смешанный список skills: где текущая `target`-линейка, где `устаревший без развития`, а где transition-инфраструктура.
- [x] `docs/features/delivery-tracking.md`, `docs/features/seoul-subway-arrival.md`, `docs/features/toss-securities.md` и `docs/features/k-skill-proxy.md` дополнены boundary notes, чтобы legacy/transition сценарии не выглядели как скрытый backlog новых российских skills.
- [x] `seoul-subway-arrival/SKILL.md` исправлен на `ru-skill`-first credential order с legacy fallback на `~/.config/k-skill/secrets.env`.
- [x] Тесты документной регрессии расширены: теперь они страхуют package-status matrix, install-flow boundary notes и `ru-skill`-first credential order для `seoul-subway-arrival`.

## Новые пункты плана

- [x] Довести `fine-dust-location`, `docs/setup.md` и `docs/security-and-secrets.md` до того же `ru-skill`-first credential order, чтобы proxy/secret flow не расползался между skill-level и setup-level документацией.
- [x] Добавить документной регрессии на пользовательских boundary notes для `fine-dust-location` и других transition/legacy utility guides, чтобы они не возвращались к двусмысленной подаче как потенциальные target-skills.
- [x] Провести отдельный audit helper scripts и package README для `k-skill-proxy`/`fine-dust-location`, чтобы legacy endpoint и naming оставались compatibility-layer, а не неявным public default для новых русскоязычных сценариев.

## Выполнено в этом раунде (раунд 12)

- [x] `docs/features/fine-dust-location.md` дополнен явным boundary note: сценарий зафиксирован как legacy/transition utility, а не как новый target-skill.
- [x] `fine-dust-location/SKILL.md` выровнен по `ru-skill`-first credential order и теперь отдельно объясняет, что published proxy endpoint и legacy naming существуют ради совместимости.
- [x] `docs/setup.md` и `docs/security-and-secrets.md` уточняют различие между `KSKILL_PROXY_BASE_URL` как endpoint override и `AIR_KOREA_OPEN_API_KEY` как реальным секретом для direct fallback/self-hosted proxy.
- [x] `packages/k-skill-proxy/README.md` дополнен transition-boundary и явным порядком secret resolution для `scripts/run-k-skill-proxy.sh`.
- [x] `README.md` и `docs/roadmap.md` синхронизированы с этим раундом и больше не держат `fine-dust-location` backlog только в TODO.
- [x] Тесты документной регрессии расширены на `fine-dust-location`, `k-skill-proxy` package README и proxy secret-order semantics.

## Новые пункты плана

- [x] Расширить аудит на уровне пакета на остальные устаревшие/вспомогательные поверхности, где README или вспомогательные скрипты ещё могут продвигать эндпоинт совместимости как неявное значение по умолчанию для новых сценариев.
- [x] Проверить `examples/secrets.env.example` и связанные setup helper'ы на необходимость более явного разделения config override и настоящих credential, не ломая текущую совместимость.
- [x] Продолжить вычищать текста на уровне навыков, где legacy-контекст ещё описан как рабочее значение по умолчанию вместо обратно совместимый запасной вариант.

## Выполнено в этом раунде (раунд 13)

- [x] `examples/secrets.env.example` больше не смешивает реальные credential с config override: `KSKILL_PROXY_BASE_URL` вынесен в явный optional-comment block вместо обязательной строки шаблона.
- [x] `docs/setup.md`, `docs/security-and-secrets.md`, `k-skill-setup/SKILL.md` и `ru-skill-setup/SKILL.md` синхронно описывают `KSKILL_PROXY_BASE_URL` как optional endpoint override, а не как секрет по умолчанию.
- [x] `fine-dust-location/SKILL.md` дополнительно очищен от operational-default формулировок: published proxy endpoint сохранён как compatibility default, а пользовательский запрос секрета ограничен direct fallback/self-hosted сценарием.
- [x] `scripts/check-setup.sh` теперь не подсказывает добавлять proxy override без необходимости и отражает тот же `ru-skill`-first setup flow.
- [x] `README.md` и `docs/roadmap.md` обновлены, чтобы этот шаг был отражён не только в `TODO.md`.
- [x] Тесты документной регрессии расширены на secrets template, setup skills и setup helper script.

## Новые пункты плана

- [x] Довести тот же необязательное переопределение vs реальные учётные данные split до первой пачки package README и package-level boundary notes за пределами fine-dust/proxy-контура.
- [x] Добавить документной регрессии на package README для `устаревший без развития` boundary и уже подтверждённых российских replacements.
- [x] Проверить оставшиеся legacy setup/runtime helper'ы на подсказки, которые всё ещё могут продвигать `~/.config/k-skill/*` как неявный основной путь.
- [x] Пройти оставшиеся skill-level guides и package README, где корейский контекст ещё допустим технически, но не должен звучать как продуктовый default.
- [x] Продолжить вычищать текста на уровне навыков, где legacy-контекст ещё описан как рабочее значение по умолчанию вместо обратно совместимый запасной вариант.

## Выполнено в этом раунде (раунд 19)

- [x] `scripts/fine_dust.py` русифицирован: корейские метки качества, ошибки, текстовый вывод и argparse help переведены на русский.
- [x] `scripts/ktx_booking.py` русифицирован: корейские help-строки argparse переведены на русский.
- [x] `scripts/test_fine_dust.py` обновлён: assertions синхронизированы с русскоязычными переводами fine_dust.py.
- [x] `docs/features/fine-dust-location.md` русифицирован: корейские описательные термины (`행정구역`, `지역명`, `측정소`, `조회 시각` и др.) заменены русскими аналогами.
- [x] `scripts/skill-docs.test.js` обновлён: документной регрессии assertions для fine-dust docs синхронизированы с русскоязычными формулировками.
- [x] `k-skill-setup/SKILL.md` исправлен: GitHub star направлен на `denis-gordeev/ru-skill` вместо `NomaDamas/k-skill`.
- [x] Проведён аудит helper/runtime scripts на оставшиеся `k-skill`-prefixed defaults: `shared_secrets.py`, `check-setup.sh` и `run-k-skill-proxy.sh` корректно используют `ru-skill`-first порядок; legacy fallback сохранён только как совместимый путь.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Расширить русификацию на `packages/k-skill-proxy/src/server.js` и `packages/k-skill-proxy/test/server.test.js`, где корейские ошибки и лог-сообщения ещё не переведены.
- [x] Добрать runtime/secrets regression для legacy feature-guides, где сейчас тестируется только boundary copy без operational semantics.

## Выполнено в этом раунде (раунд 21)

- [x] `hwp/SKILL.md` полностью переведён на русский: все корейские описания, команды, примеры и заметки.
- [x] `kakaotalk-mac/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow, safety rules и примеры.
- [x] `zipcode-search/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow и заметки.
- [x] `toss-securities/SKILL.md` полностью переведён на русский: все корейские описания, команды, safety rules и примеры.
- [x] `kbo-results/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow и заметки.
- [x] `srt-booking/SKILL.md` оставшиеся корейские фрагменты переведены на русский: примеры запросов, входные данные, заметки.
- [x] `lotto-results/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow и заметки.
- [x] `python-packages/README.md` полностью переведён на русский.
- [x] `delivery-tracking/SKILL.md` корейские фрагменты переведены на русский: status map, error messages, carrier names, sample output.
- [x] `docs/features/delivery-tracking.md` корейские фрагменты переведены на русский: status map, error messages, carrier names, sample output, section labels.
- [x] `docs/sources.md` legacy reference block: все корейские метки источников переведены на русский.
- [x] `scripts/fixtures/delivery-tracking-public-samples.json` обновлён: статус-метки синхронизированы с русскоязычным переводом.
- [x] `scripts/skill-docs.test.js` обновлён: документной регрессии assertions синхронизированы с русскоязычными формулировками для zipcode-search, delivery-tracking, sources.md, kakaotalk-mac, hwp.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 72 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Добавить документной регрессии для пользовательских feature-guides (`fine-dust-location`, `seoul-subway-arrival`, `srt-booking`, `ktx-booking`), чтобы runtime/secrets semantics и `ru-skill`-first порядок не защищались только на уровне `SKILL.md` и setup/proxy helper-docs.
- [x] Синхронизировать `README.md`, `TODO.md` и `docs/roadmap.md` после закрытия очистки helper/runtime, чтобы следующий приоритет больше не ссылался на уже выполненный слой работ.
- [x] Продолжить русификацию оставшихся feature-doc файлов, где ещё встречаются корейские фрагменты (`docs/features/zipcode-search.md`, `docs/features/kakaotalk-mac.md`, `docs/features/kbo-results.md`, `docs/features/toss-securities.md`, `docs/features/lotto-results.md`, `docs/features/srt-booking.md`, `docs/features/hwp.md`).
- [x] Распространить пользовательскую регрессию на runtime/secrets на остальные устаревшие руководства, где сейчас ещё страхуются только boundary notes и replacement copy без operational semantics.

## Выполнено в этом раунде (раунд 24)

- [x] Проведён полный аудит текста на уровне навыков на предмет legacy-контекста, описанного как рабочее значение по умолчанию.
- [x] `delivery-tracking/SKILL.md`: добавлен `## Граничное примечание` (`устаревший без развития`); description заменён на legacy-compatible; forward-looking формулировки удалены.
- [x] `toss-securities/SKILL.md`: добавлен `## Граничное примечание` (`устаревший без развития`, ссылка на `moex-shares`); description заменён на legacy-compatible.
- [x] `hwp/SKILL.md` и `docs/features/hwp.md`: добавлен `## Граничное примечание` (`target-supporting`) — корейский формат без прямого российского аналога, но полезен как утилита.
- [x] `blue-ribbon-nearby/SKILL.md`: routing rule исправлен — `osm-nearby` / `zoon-nearby` теперь primary для российских запросов поиска поблизости.
- [x] `ktx-booking/SKILL.md`: description обновлён с добавлением `Legacy-compatible ... not for new Russian railway integrations`.
- [x] Документная регрессия расширена на 4 legacy-навыка с workflow/content assertions: `seoul-subway-arrival`, `kbo-results`, `lotto-results`, `srt-booking`.
- [x] Документная регрессия расширена на boundary-note coverage: `delivery-tracking/SKILL.md`, `toss-securities/SKILL.md`, `hwp/SKILL.md` + `docs/features/hwp.md`, `blue-ribbon-nearby` routing.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 91 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Продолжить русификацию оставшихся обусловленных доменом корейских фрагментов, где это допустимо без потери смысла — закрыто: после раунда 26 весь оставшийся корейский в исходном коде и документации является обусловленным доменом (параметры API, названия мест, эталонные данные, шаблоны regex); пользовательский корейский полностью устранён.
- [x] Расширить документной регрессии coverage для legacy skills с boundary-level тестами на workflow/content assertions для оставшихся непокрытых: `kakaotalk-mac`, `daiso-product-search`, `delivery-tracking` (SKILL.md workflow).
- [x] Пункт перенесён в верхний актуальный план TODO: держать документной регрессии в CI, чтобы README, roadmap, TODO и исследование замен бронирования совпадали по следующему продуктовому приоритету.
- [x] Пункт перенесён в верхний актуальный план TODO: если для очередного пробел в устаревших навыках нет устойчивого публичный источник, закрывать его документно, а не открывать forced перечень задач по реализации.

## Выполнено в этом раунде (раунд 23)

- [x] User-facing корейские метки в source code переведены на русский: `kleague-results` (статусы матчей), `kakao-bar-nearby` (подсказки вместимости), `k-lotto` (лотерейные метки), `blue-ribbon-nearby` (сообщение об ошибке).
- [x] User-facing корейский текст в docs/SKILL.md/feature-docs переведён на русский: `kakao-bar-nearby`, `blue-ribbon-nearby`, `kleague-results`, `zipcode-search`, `hwp`, `ktx-booking`, `kakaotalk-mac`, package README (`kakao-bar-nearby`, `kleague-results`, `daiso-product-search`, `k-lotto`).
- [x] Документная регрессия расширена на 6 ранее непокрытых target-навыков: `moex-shares`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `osm-nearby`.
- [x] Утверждения документной регрессии обновлены под русскоязычные формулировки во всех затронутых файлах.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 85 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Продолжить русификацию оставшихся обусловленных доменом корейских фрагментов, где это допустимо без потери смысла — закрыто: после раунда 26 весь оставшийся корейский в исходном коде и документации является обусловленным доменом (параметры API, названия мест, эталонные данные, шаблоны regex); пользовательский корейский полностью устранён.
- [x] Расширить документной регрессии coverage для legacy skills с только boundary-level тестами (srt-booking, seoul-subway-arrival, kbo-results, lotto-results): добавить workflow/content assertions.
- [x] Пункт перенесён в верхний актуальный план TODO: держать документной регрессии в CI, чтобы README, roadmap, TODO и исследование замен бронирования совпадали по следующему продуктовому приоритету.
- [x] Пункт перенесён в верхний актуальный план TODO: если для очередного пробел в устаревших навыках нет устойчивого публичный источник, закрывать его документно, а не открывать forced перечень задач по реализации.

- [x] `scripts/skill-docs.test.js` расширен на пользовательских руководствах `fine-dust-location`, `seoul-subway-arrival`, `srt-booking` и `ktx-booking`: добавлены проверки `ru-skill`-first secrets order, runtime/secrets semantics и граница замен.
- [x] `README.md` обновлён: очистка helper/runtime больше не подаётся как следующий шаг, а новый фокус зафиксирован на пользовательской регрессии и оставшейся русификации feature-docs.
- [x] `docs/roadmap.md` синхронизирован с тем же статусом: roadmap теперь явно фиксирует закрытие очистки helper/runtime и следующий слой работы по legacy feature-docs.

## Новые пункты плана

- [x] Продолжить русификацию оставшихся feature doc файлов, где ещё встречаются корейские фрагменты (`docs/features/zipcode-search.md`, `docs/features/kakaotalk-mac.md`, `docs/features/kbo-results.md`, `docs/features/toss-securities.md`, `docs/features/lotto-results.md`, `docs/features/srt-booking.md`, `docs/features/hwp.md`).
- [x] Добрать runtime/secrets regression для legacy feature-guides, где сейчас тестируется только boundary copy без operational semantics.
- [x] Продолжить вычищать текста на уровне навыков, где legacy-контекст ещё описан как рабочее значение по умолчанию вместо обратно совместимый запасной вариант (в основном в feature docs, не SKILL.md).

## Выполнено в этом раунде (раунд 20)

- [x] `packages/k-skill-proxy/src/airkorea.js` русифицирован: корейские grade labels, error messages и log messages переведены на русский.
- [x] `packages/k-skill-proxy/src/server.js` русифицирован: error messages и rate-limit message переведены на русский.
- [x] `packages/k-skill-proxy/test/airkorea.test.js` обновлён: assertions синхронизированы с русскоязычными grade labels.
- [x] `packages/k-skill-proxy/test/server.test.js` обновлён: mock provider messages и grade labels синхронизированы с русскоязычными переводами.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Выполнено в этом раунде (раунд 14)

- [x] `packages/toss-securities/README.md` переведён на текущую русскоязычную migration-модель: добавлен явный `устаревший без развития` boundary, ссылка на replacement `moex-shares` и сохранён read-only контракт над `tossctl`.
- [x] `packages/daiso-product-search/README.md`, `packages/kleague-results/README.md`, `packages/blue-ribbon-nearby/README.md`, `packages/kakao-bar-nearby/README.md` и `packages/k-lotto/README.md` выровнены по той же схеме: legacy compatibility сохранена, но package-level docs больше не подают эти пакеты как скрытый целевой перечень задач.
- [x] `scripts/skill-docs.test.js` расширен регрессиями на package README, чтобы `устаревший без развития` boundary и replacement references удерживались автоматически.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронно обновлены под этот статус и следующий перечень задач следующей итерации.
