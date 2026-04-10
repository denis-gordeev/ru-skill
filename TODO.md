# TODO

Живой список задач для `ru-skill`. Обновляется по итогам каждого automation round.

## Статус на 2026-04-09

- `AUTOWORK_INSTRUCTIONS.md`: приоритет подтверждён, курс репозитория - перевод на российские и русскоязычные реалии.
- GitHub Issues: недоступны, в репозитории отключены.
- Open PR: автоматическая проверка недоступна без `gh auth login`, поэтому в этом раунде PR backlog не подтверждён.
- Рабочее дерево уже содержит незакоммиченные изменения, поэтому дальнейшие правки нужно держать точечными.
- Первый новый русскоязычный навык уже добавлен: `cbr-rates` поверх официального XML-сервиса курсов валют Банка России.
- Второй новый русскоязычный навык добавлен: `moex-shares` поверх публичного ISS API Московской биржи.
- Третий новый русскоязычный навык добавлен: `postcalc-postcodes` поверх публичных страниц `Postcalc` для индексов и отделений Почты России.
- Четвёртый новый русскоязычный навык добавлен: `hh-vacancies` поверх публичного API `hh.ru` для поиска вакансий, карточек вакансий и lookup регионов.
- Пятый новый русскоязычный навык добавлен: `stoloto-lotto` поверх публичных страниц архива Столото для результатов лотерей `4 из 20`, `5 из 36`, `6 из 45`, `7 из 49` и других.
- Шестой новый русскоязычный навык добавлен: `kinopoisk-search` поверх публичных страниц Кинопоиска для поиска фильмов и карточек фильмов.
- Седьмой новый русскоязычный навык добавлен: `mchs-storm-warnings` поверх официальных региональных страниц МЧС России с экстренными предупреждениями.
- В базовых shell-скриптах и документации внедрён dual-path для секретов: сначала `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.
- Оставшиеся legacy feature-guides в `docs/features/*.md` переведены на русскоязычный тон, при этом сохранены нужные legacy-маркеры для doc-regression тестов.
- Для Python helper-скриптов добавлен общий resolver `scripts/shared_secrets.py`; теперь `fine_dust.py` и `ktx_booking.py` читают секреты из env, затем из `~/.config/ru-skill/secrets.env`, затем из legacy fallback.

## Выполнено в этом раунде

- [x] Проверен приоритетный контекст: `AUTOWORK_INSTRUCTIONS.md`, `README.md`, `TODO.md`, `docs/sources.md`, состояние git и доступность PR/issue-данных.
- [x] Переведены все 8 оставшихся SKILL.md файлов с корейского на русский: k-skill-setup, daiso-product-search, ktx-booking, kleague-results, kakao-bar-nearby, delivery-tracking, seoul-subway-arrival, blue-ribbon-nearby.
- [x] Выбран 9-й российский read-only источник: Яндекс.Расписания для расписаний транспорта (электрички, поезда, автобусы, авиарейсы).
- [x] Обновлён `docs/sources.md` с документацией 9-го источника `yandex-rasp`.
- [x] Обновлён `docs/roadmap.md`: Milestone 4 переведён в статус "в работе", добавлен приоритет по реализации yandex-rasp.
- [x] Начата матрица поэтапной замены legacy-пакетов: все legacy SKILL.md теперь на русском, что унифицирует документацию.

- [x] Проверен приоритетный контекст: `AUTOWORK_INSTRUCTIONS.md`, `README.md`, `TODO.md`, `docs/sources.md`, состояние git и доступность PR/issue-данных.
- [x] Собран inventory по `package.json`, skill-именам, feature-guides и скриптам, где бренд `k-skill` ещё жёстко зашит ради совместимости.
- [x] Добавлен документ `docs/brand-inventory.md` с разделением на intentional legacy surface area и мешающие позиционированию хвосты.
- [x] В `docs/sources.md` выбран первый конкретный русскоязычный источник: официальный XML-сервис курсов валют Банка России.
- [x] В `docs/roadmap.md` обновлён статус migration milestones с учётом brand inventory и выбранного первого источника.
- [x] В `README.md` добавлена ссылка на brand inventory как часть основной миграционной документации.
- [x] Реализован region lookup для `mchs-storm-warnings`: добавлен `src/regions.js` с маппингом всех 85+ российских регионов на хосты.
- [x] Обновлены `mchs-storm-warnings/SKILL.md`, `packages/mchs-storm-warnings/README.md` и `docs/features/mchs-storm-warnings.md` с документацией region lookup.
- [x] Добавлены fixture-based тесты на `lookupRegion` и `listRegions` для проверки маппинга регионов.
- [x] Выбран восьмой российский read-only источник: официальный портал правовой информации pravo.gov.ru с публичным API.
- [x] Реализован новый target-package `pravo-documents` для поиска и карточек официальных правовых документов.
- [x] Подготовлены fixture-based JSON-тесты для search results и document card, чтобы CI не зависел от live API.
- [x] Обновлены `README.md`, `docs/sources.md`, `docs/features/pravo-documents.md`, `pravo-documents/SKILL.md` и `.changeset/pravo-documents.md`, чтобы восьмой target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `pravo-documents` входил в `pack:dry-run`.
- [x] Собран inventory по `package.json`, skill-именам, feature-guides и скриптам, где бренд `k-skill` ещё жёстко зашит ради совместимости.
- [x] Добавлен документ `docs/brand-inventory.md` с разделением на intentional legacy surface area и мешающие позиционированию хвосты.
- [x] В `docs/sources.md` выбран первый конкретный русскоязычный источник: официальный XML-сервис курсов валют Банка России.
- [x] В `docs/roadmap.md` обновлён статус migration milestones с учётом brand inventory и выбранного первого источника.
- [x] В `README.md` добавлена ссылка на brand inventory как часть основной миграционной документации.
- [x] Добавлен новый skill/package `cbr-rates` для официальных курсов валют Банка России.
- [x] Добавлена fixture-based проверка XML-нормализации и вычисления изменения к предыдущей доступной публикации для `cbr-rates`.
- [x] Обновлены `README.md`, `docs/install.md` и `docs/roadmap.md`, чтобы новый российский навык был встроен в основной пользовательский путь.
- [x] Реализован dual-path resolver для `secrets.env` в `scripts/check-setup.sh` и `scripts/run-k-skill-proxy.sh` с приоритетом `~/.config/ru-skill/secrets.env`.
- [x] Обновлены `docs/setup.md`, `docs/security-and-secrets.md` и `docs/install.md`, чтобы новый путь был основным, а legacy-путь явно описан как fallback.
- [x] Добавлен compatibility alias `ru-skill-setup`, при этом legacy-имя `k-skill-setup` сохранено для обратной совместимости.
- [x] Обновлены `k-skill-setup/SKILL.md`, `docs/install.md` и `README.md`, чтобы setup-поток продвигался под именем `ru-skill-setup`.
- [x] Обновлены feature-guides и Python helper-скрипты, где оставался жёсткий путь только к `~/.config/k-skill/secrets.env`.
- [x] Переведены оставшиеся legacy feature-guides на русский, при этом сохранены совместимые формулировки для `scripts/skill-docs.test.js`.
- [x] Вынесена общая логика поиска `secrets.env` в `scripts/shared_secrets.py` и подключена в Python helper-скрипты.
- [x] Добавлены Python regression-тесты на shared secrets-resolution для `fine_dust.py` и `ktx_booking.py`.
- [x] Прогнаны `PYTHONPATH=scripts python3 -m unittest scripts/test_fine_dust.py scripts/test_ktx_booking.py` и полный `npm run ci`.
- [x] Добавлен новый target-package `moex-shares` для публичных акций Московской биржи с fixture-based тестами и skill-документацией.
- [x] Обновлены `README.md`, `docs/install.md`, `docs/roadmap.md` и `docs/sources.md`, чтобы второй российский read-only навык был встроен в основную матрицу репозитория.
- [x] Выбран третий русскоязычный read-only источник вне финансового домена: `Postcalc` как база индексов и отделений, опирающаяся на эталонный справочник Почты России.
- [x] Обновлены `docs/sources.md` и `docs/roadmap.md`, чтобы следующий целевой навык был заранее зафиксирован и не терялся между automation round.
- [x] Реализован новый target-package `postcalc-postcodes` поверх `Postcalc` с двумя стабильными сценариями: карточка отделения по индексу и сводка по населённому пункту через `citykey`.
- [x] Подготовлены fixture-based HTML-тесты для страниц `postcalc.ru/cities/...` и `postcalc.ru/offices/...`, чтобы не зависеть от живой вёрстки в CI.
- [x] Обновлены `README.md`, `docs/install.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/features/postcalc-postcodes.md` и `postcalc-postcodes/SKILL.md`, чтобы третий российский target-skill был встроен в основной пользовательский путь.
- [x] Обновлены `package.json`, `scripts/skill-docs.test.js` и `.changeset/postcalc-postcodes.md`, чтобы новый workspace входил в doc-regression и pack dry-run поток.
- [x] Выбран четвёртый русскоязычный read-only источник вне финансов и логистики: публичный API `hh.ru` для вакансий и регионов.
- [x] Реализован новый target-package `hh-vacancies` с тремя базовыми read-only сценариями: lookup региона, поиск вакансий и карточка вакансии.
- [x] Подготовлены fixture-based JSON-тесты для `areas`, `vacancies` и `vacancies/{id}`, чтобы CI не зависел от live API.
- [x] Обновлены `README.md`, `docs/install.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/features/hh-vacancies.md`, `hh-vacancies/SKILL.md` и `.changeset/hh-vacancies.md`, чтобы четвёртый target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `hh-vacancies` входил в `pack:dry-run`.
- [x] Выбран пятый русскоязычный read-only источник вне финансов, логистики и job-search: публичный архив результатов лотерей Столото.
- [x] Реализован новый target-package `stoloto-lotto` с поддержкой `4x20`, `5x36`, `6x45`, `7x49`, `ruslotto` и других лотерей.
- [x] Подготовлены fixture-based HTML-тесты для страниц архива `4x20` и `6x45`, чтобы CI не зависел от живой вёрстки stoloto.ru.
- [x] Обновлены `docs/sources.md`, `docs/roadmap.md` и `TODO.md`, чтобы пятый российский target-skill был зафиксирован и встроен в основной пользовательский путь.
- [x] Выбран шестой русскоязычный read-only источник вне финансов, лотерей, почтовых индексов и рынка труда: публичные страницы Кинопоиска для фильмов.
- [x] Реализован новый target-package `kinopoisk-search` с двумя базовыми read-only сценариями: карточка фильма по ID и поиск фильмов по названию.
- [x] Подготовлены fixture-based HTML-тесты для страниц фильмов и поиска Кинопоиска, чтобы CI не зависел от живой вёрстки kinopoisk.ru.
- [x] Обновлены `README.md`, `docs/install.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/features/kinopoisk-search.md` и `.changeset/kinopoisk-search.md`, чтобы шестой target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `kinopoisk-search` входил в `pack:dry-run`.
- [x] Выбран седьмой русскоязычный read-only источник после Кинопоиска, чтобы target-линейка расширилась в сторону публичной безопасности и официальных предупреждений.
- [x] Реализован новый target-package `mchs-storm-warnings` для официальных региональных страниц МЧС России с лентой экстренных предупреждений и карточкой предупреждения.
- [x] Подготовлены fixture-based HTML-тесты для списка предупреждений и карточки предупреждения МЧС, чтобы CI не зависел от живой вёрстки регионального сайта.
- [x] Обновлены `README.md`, `docs/install.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/features/mchs-storm-warnings.md`, `mchs-storm-warnings/SKILL.md` и `.changeset/mchs-storm-warnings.md`, чтобы седьмой target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `mchs-storm-warnings` входил в `pack:dry-run`.

## Ближайшие задачи

- [x] Довести верхнеуровневую документацию до единой русскоязычной терминологии без смешения корейских и русских заголовков.
- [x] Заменить placeholder-команды установки `<owner/repo>` в документации на актуальные примеры для `denis-gordeev/ru-skill`, где это безопасно.
- [x] Подготовить первый российский или русскоязычный навык поверх публичного API или официального веб-интерфейса, чтобы репозиторий перестал быть только legacy-обёрткой над `k-skill`.
- [x] Пересобрать roadmap в виде измеримых migration milestone'ов с явным списком legacy-пакетов и целевых замен.
- [x] Проверить, какие package/skill-имена ещё жёстко привязаны к бренду `k-skill`, и отделить legacy-бренд от нового позиционирования `ru-skill`.

## Следующие действия

- [x] Провести inventory по всем `package.json`, skill-именам и feature-guides, где ещё жёстко зашито имя `k-skill`.
- [x] Выбрать первый русскоязычный источник в `docs/sources.md` и определить минимальный scope нового навыка.
- [x] Добавить новый skill/package для курсов валют Банка России и fixture-based проверку XML-нормализации.
- [x] Спроектировать dual-path поддержку `~/.config/ru-skill/secrets.env` с fallback на legacy `~/.config/k-skill/secrets.env`.
- [x] Решить, нужен ли alias или wrapper для `k-skill-setup` перед дальнейшей миграцией install/setup-документов.
- [x] Распространить dual-path описание на feature-guides и Python helper-скрипты, где пока ещё зафиксирован только legacy-путь `~/.config/k-skill/secrets.env`.
- [x] Добавить следующий российский read-only навык поверх публичного источника, чтобы `cbr-rates` не оставался единственным target-package.
- [x] Выбрать следующий российский read-only источник вне финансового домена, чтобы целевая ветка `ru-skill` не ограничивалась только финтех-сценариями.
- [x] Выбрать следующий российский read-only источник после `Postcalc`, чтобы целевая ветка `ru-skill` не ограничивалась только финансами и почтовыми индексами.
- [x] Подготовить ещё один target-package вне финансов и логистики, чтобы доля русскоязычных `target` workspace-пакетов продолжала расти.
- [x] Выбрать пятый российский read-only источник после `hh.ru`, чтобы target-линейка не ограничивалась финансами, почтовыми индексами и рынком труда.
- [x] Подготовить ещё один target-package вне финансов, логистики и job-search, чтобы русскоязычные `target` workspace-пакеты росли по разным продуктовым доменам.
- [x] Выбрать шестой российский read-only источник после Столото, чтобы target-линейка не ограничивалась финансами, почтовыми индексами, рынком труда и лотереями.
- [x] Подготовить ещё один target-package вне финансов, логистики, job-search и лотерей, чтобы русскоязычные `target` workspace-пакеты охватывали новые продуктовые домены, такие как кино и развлечения.
- [x] Выбрать седьмой российский read-only источник после Кинопоиска, чтобы target-линейка охватила публичную безопасность и официальные предупреждения.
- [x] Подготовить target-package на официальных региональных страницах МЧС России с минимальным MVP по ленте предупреждений и карточке предупреждения.
- [x] Добавить region lookup для `mchs-storm-warnings`, чтобы пользователи могли искать регионы по названиям вроде "Москва", "Курская область".
- [x] Выбрать восьмой российский read-only источник после МЧС, чтобы target-линейка вошла в справочное право и официальные документы.
- [x] Подготовить target-package `pravo-documents` на официальном API pravo.gov.ru с минимальным MVP по поиску и карточке документа.

## Новые пункты плана

- [x] Выбрать 9-й российский read-only источник в домене транспорта/городских сервисов (Яндекс.Расписания).
- [x] Перевести все оставшиеся SKILL.md файлы с корейского на русский для единообразия документации.
- [ ] Начать реализацию пакета `yandex-rasp` для расписаний транспорта.
- [ ] Начать матрицу поэтапной замены legacy-пакетов на российские аналоги в рамках Milestone 4, а не только добавлять новые target-пакеты.

## Проверки на следующий шаг

- Для документных и релизных изменений запускать `npm run ci`.
- Перед коммитом отдельно проверять, что правки не затёрли уже существующие незакоммиченные изменения в рабочем дереве.
- Следующий продуктовый шаг: реализовать пакет `yandex-rasp` для расписаний транспорта или начать матрицу замены legacy-пакетов (Milestone 4).
