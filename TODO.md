# TODO

Живой список задач для `ru-skill`. Обновляется по итогам каждого automation round.

## Статус на 2026-04-05

- `AUTOWORK_INSTRUCTIONS.md`: приоритет подтверждён, курс репозитория - перевод на российские и русскоязычные реалии.
- GitHub Issues: недоступны, в репозитории отключены.
- Open PR: автоматическая проверка недоступна без `gh auth login`, поэтому в этом раунде PR backlog не подтверждён.
- Рабочее дерево уже содержит незакоммиченные изменения, поэтому дальнейшие правки нужно держать точечными.
- Первый новый русскоязычный навык уже добавлен: `cbr-rates` поверх официального XML-сервиса курсов валют Банка России.
- Второй новый русскоязычный навык добавлен: `moex-shares` поверх публичного ISS API Московской биржи.
- В базовых shell-скриптах и документации внедрён dual-path для секретов: сначала `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.
- Оставшиеся legacy feature-guides в `docs/features/*.md` переведены на русскоязычный тон, при этом сохранены нужные legacy-маркеры для doc-regression тестов.
- Для Python helper-скриптов добавлен общий resolver `scripts/shared_secrets.py`; теперь `fine_dust.py` и `ktx_booking.py` читают секреты из env, затем из `~/.config/ru-skill/secrets.env`, затем из legacy fallback.

## Выполнено в этом раунде

- [x] Проверен приоритетный контекст: `AUTOWORK_INSTRUCTIONS.md`, `README.md`, `TODO.md`, `docs/sources.md`, состояние git и доступность PR/issue-данных.
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
- [ ] Реализовать новый target-package поверх `Postcalc` с двумя стабильными сценариями: карточка отделения по индексу и сводка по населённому пункту через `citykey`.
- [ ] Подготовить fixture-based HTML-тесты для страниц `postcalc.ru/cities/...` и `postcalc.ru/offices/...`, чтобы не зависеть от живой вёрстки в CI.

## Проверки на следующий шаг

- Для документных и релизных изменений запускать `npm run ci`.
- Перед коммитом отдельно проверять, что правки не затёрли уже существующие незакоммиченные изменения в рабочем дереве.
- Следующий продуктовый шаг: реализовать третий российский read-only target-skill на базе `Postcalc` для индексов и отделений Почты России, не ломая текущие legacy-пакеты.
