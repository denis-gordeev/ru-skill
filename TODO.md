# TODO

Живой список задач для `ru-skill`. Обновляется по итогам каждого automation round.

## Статус на 2026-04-04

- `AUTOWORK_INSTRUCTIONS.md`: приоритет подтверждён, курс репозитория - перевод на российские и русскоязычные реалии.
- GitHub Issues: недоступны, в репозитории отключены.
- Open PR: автоматическая проверка недоступна без `gh auth login`, поэтому в этом раунде PR backlog не подтверждён.
- Рабочее дерево уже содержит незакоммиченные изменения, поэтому дальнейшие правки нужно держать точечными.
- Первый новый русскоязычный навык уже добавлен: `cbr-rates` поверх официального XML-сервиса курсов валют Банка России.
- В базовых shell-скриптах и документации внедрён dual-path для секретов: сначала `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.

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
- [ ] Перевести remaining legacy feature-guides с корейских заголовков и mixed-language блоков на единый русскоязычный тон без потери технических деталей.
- [ ] Вынести общую логику поиска secrets-файла в Python helper/shared utility, чтобы shell и Python больше не расходились по текстам и fallback-порядку.
- [ ] Добавить следующий российский read-only навык поверх публичного источника, чтобы `cbr-rates` не оставался единственным target-package.

## Проверки на следующий шаг

- Для документных и релизных изменений запускать `npm run ci`.
- Перед коммитом отдельно проверять, что правки не затёрли уже существующие незакоммиченные изменения в рабочем дереве.
- Следующий продуктовый шаг: выровнять оставшиеся legacy feature-guides по языку, затем вынести shared secrets-resolution для Python helpers и выбрать второй российский target-skill.
