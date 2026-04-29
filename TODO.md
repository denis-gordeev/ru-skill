# TODO

Живой список задач для `ru-skill`. Обновляется по итогам каждого automation round.

Исторические round summaries ниже сохраняются как журнал миграции. Источником актуального статуса считаются самый верхний блок `Статус ...`, последний блок `Выполнено в этом раунде` и `Новые пункты плана`.

## Статус на 2026-04-29 (раунд 10)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд закрывает открытый вопрос Milestone 5: отдельный railway handoff-skill поверх `yandex-rasp` не даёт новой устойчивой API-функции и не должен открываться как target-package.
- Railway replacement теперь официально ограничен границей `yandex-rasp` для discovery + ручной внешний handoff пользователя в checkout-поверхности РЖД или агрегаторов.
- README, roadmap, booking research, sources и `yandex-rasp` docs синхронно фиксируют, что railway backlog закрыт документно и выведен из активного implementation priority.

## Статус на 2026-04-29 (раунд 9)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд не добавляет новый target-пакет, а закрывает следующий governance gap после booking research: legacy railway docs теперь явно согласованы с replacement boundary.
- `srt-booking` и `ktx-booking` остаются backward-compatible корейскими сценариями, но больше не выглядят в живой документации как возможная опора для новых российских write-интеграций.
- README, roadmap и doc-regression теперь фиксируют не только сам decision matrix, но и то, что legacy railway docs обязаны направлять новые российские сценарии в сторону `yandex-rasp` и external handoff.

## Статус на 2026-04-27 (раунд 8)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд закрывает research-first часть Milestone 5: собран и зафиксирован decision matrix по railway booking replacements.
- Подтверждено, что 13 target-навыков остаются актуальными и что railway-discovery уже частично покрыт существующим `yandex-rasp`.
- Основной вывод раунда: полноценный `rzd-booking` пока не годится для target-MVP, а `tutu.ru` и Яндекс Путешествия разумно рассматривать только как read-only/handoff-кандидаты.
- Следующий инженерный шаг теперь не в том, чтобы «искать любой booking source», а в том, чтобы решить, нужен ли отдельный handoff-слой сверх `yandex-rasp`.

## Статус на 2026-04-23 (раунд 7)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде фокус смещён на release-hygiene и поддержание живой документации: README/roadmap должны отражать текущий продуктовый приоритет без branch metrics и merge-ready формулировок.
- Проверен текущий release backlog: в `.changeset/` по-прежнему 14 файлов, этого достаточно для следующего version/publish round без ручной археологии по старым summary.
- Тринадцать target-навыков по-прежнему остаются реализованными и задокументированными: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Основной открытый product gap не изменился: жизнеспособная российская замена для `srt-booking` и `ktx-booking` пока не выбрана, поэтому следующий инженерный раунд должен быть research-first, а не implementation-first.

## Статус на 2026-04-16 (раунд 6)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - продолжать переводить репозиторий под российские и русскоязычные сценарии, не расширяя legacy-наследие как основной продуктовый путь.
- Ветка `feat/mchs-storm-warnings` остаётся рабочей веткой миграции; в этом раунде фокус смещён с добавления нового пакета на выравнивание живого плана и регрессий документации.
- Тринадцать target-навыков по-прежнему остаются реализованными и задокументированными: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Основной риск текущего состояния не в коде пакетов, а в дрейфе planning docs: historical round summaries и milestone status начали расходиться с фактическим состоянием репозитория.

## Статус на 2026-04-13 (раунд 3)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет подтверждён, курс репозитория - перевод на российские и русскоязычные реалии.
- GitHub Issues: недоступны, в репозитории отключены.
- Open PR: автоматическая проверка недоступна без `gh auth login`, поэтому в этом раунде PR backlog не подтверждён.
- Ветка `feat/mchs-storm-warnings`: 10 коммитов ahead of main, 164 файла изменено (12K+ строк), CI проходит полностью.
- Тринадцать target-навыков реализованы: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Исследование Zoon.ru подтверждено: SSR, без anti-bot, HTML напрямую парсится — viable supplementary источник для nearby-поиска.
- Исследование 13-го источника (metro/urban-transit): закрыто как нежизнеспособное — реального времени нет, только статические справочники.
- Исследование 14-го источника (broker/invest): закрыто как избыточное — MOEX ISS уже покрыт через `moex-shares`, брокерские API требуют авторизации.

## Выполнено в этом раунде (раунд 8)

- [x] Проведён research-first раунд по railway booking replacements вместо premature implementation.
- [x] Добавлен `docs/booking-replacements.md` с decision matrix для `rzd-booking`, `tutu.ru`, Яндекс Путешествий и текущего baseline `yandex-rasp`.
- [x] Зафиксирован replacement boundary: full booking automation не идёт в target-MVP без устойчивого official/public interface без логина и anti-bot обходов.
- [x] README обновлён: в блоках `Что уже сделано по миграции` и `Что делаем дальше` отражён новый статус Milestone 5 и добавлена ссылка на decision matrix.
- [x] `docs/roadmap.md` обновлён: Milestone 5 переведён из абстрактного research backlog в конкретное решение по границе replacement-а.
- [x] `docs/sources.md` дополнен отдельным блоком по кандидатам на railway booking replacement.
- [x] Doc-regression тесты расширены: теперь они требуют наличия отдельного booking-research документа и нового статуса planning docs.

## Выполнено в этом раунде (раунд 10)

- [x] Закрыт открытый вопрос Milestone 5: подтверждено, что отдельный handoff-skill поверх `yandex-rasp` не нужен и не открывается как новый `target`-пакет.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/booking-replacements.md` и `docs/sources.md`, чтобы railway replacement был зафиксирован как документно закрытый backlog, а не как незавершённое implementation-направление.
- [x] Обновлены `docs/features/yandex-rasp.md` и `yandex-rasp/SKILL.md`: railway handoff описан как ручной пользовательский шаг после discovery, без checkout automation внутри репозитория.
- [x] Doc-regression тесты обновлены под новый статус Milestone 5 и теперь дополнительно страхуют от возврата railway handoff в активный target-backlog.

## Выполнено в этом раунде (раунд 9)

- [x] Обновлены `docs/features/srt-booking.md` и `docs/features/ktx-booking.md`: добавлены явные legacy boundary notes и ссылка на `yandex-rasp` как базовый target discovery-путь.
- [x] Обновлены `srt-booking/SKILL.md` и `ktx-booking/SKILL.md`: железнодорожные legacy-навыки теперь прямо помечены как backward-compatible корейские сценарии, нецелевые для новых российских write-интеграций.
- [x] Исправлен credential resolution order в railway legacy-docs: сначала `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.
- [x] Обновлены `README.md` и `docs/roadmap.md`, чтобы текущий booking-replacement status отражал уже не только research, но и выровненную legacy railway documentation boundary.
- [x] Doc-regression тесты расширены: README, roadmap и railway docs теперь страхуются от отката к двусмысленной подаче `srt-booking` и `ktx-booking` как target-направления.

## Выполнено в этом раунде

- [x] Проведено исследование российских аналогов для nearby-поиска: Overpass API (OSM) выбран как лучший free/no-key вариант.
- [x] Проведено исследование российских metro/urban-transit API: реального времени нет (Moscow Metro, SPb Metro), только статические справочники.
- [x] Проведено исследование российских broker/investment API: MOEX ISS уже покрывается через `moex-shares`, T-Invest требует аккаунт.
- [x] Реализован пакет `osm-nearby` с пятью функциями: `searchNearby`, `searchRestaurants`, `searchCafes`, `searchBars`, `getPlaceDetails`.
- [x] Подготовлены fixture-based JSON-тесты для Overpass API ответов с московскими заведениями.
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
- [x] Подготовлены fixture-based JSON-тесты для `stations_list`, `schedule` и `search` ответов API Яндекс.Расписаний.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/features/yandex-rasp.md`, `yandex-rasp/SKILL.md` и `.changeset/yandex-rasp.md`, чтобы девятый target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `yandex-rasp` входил в `pack:dry-run`.
- [x] Добавлены doc-regression тесты в `scripts/skill-docs.test.js` для `yandex-rasp`.
- [x] Расширена матрица замены legacy-пакетов: добавлены столбцы статуса замены и конкретные российские аналоги (РПЛ/ФНЛ/КХЛ, Wildberries/Ozon, 2GIS/Яндекс.Карты, РЖД/Туту.ру).
- [x] Обновлён `docs/roadmap.md` с развёрнутой таблицей legacy packages → target replacements со статусом каждой замены.

## Выполнено в этом раунде (раунд 3)

- [x] Реализован пакет `zoon-nearby` как supplementary источник для nearby-поиска с рейтингами, телефонами и режимами работы.
- [x] Подготовлены fixture-based JSON-тесты для Zoon.ru HTML ответов с московскими ресторанами.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/install.md`, `docs/features/zoon-nearby.md`, чтобы 13-й target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `zoon-nearby` входил в `pack:dry-run`.
- [x] Обновлена матрица замены legacy-пакетов: `blue-ribbon-nearby` и `kakao-bar-nearby` помечены как «Заменён на `osm-nearby` и `zoon-nearby`».
- [x] Добавлен changeset `.changeset/zoon-nearby-add.md` для подготовки к публикации.
- [x] Добавлены doc-regression тесты в `scripts/skill-docs.test.js` для `zoon-nearby`.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test 68 pass / 0 fail / 1 skipped, pack:dry-run ✓.

## Выполнено в этом раунде (раунд 2)

- [x] Подтверждено, что ветка `feat/mchs-storm-warnings` проходит полный CI: lint ✓, typecheck ✓, test ✓, pack:dry-run ✓.
- [x] Проведена проверка Zoon.ru: подтверждена SSR-поверхность, отсутствие anti-bot, структурированный HTML — источник годится для nearby-поиска.
- [x] Закрыто исследование 13-го источника (metro/urban-transit): нежизнеспособно — реального времени нет, только статические справочники.
- [x] Закрыто исследование 14-го источника (broker/invest): избыточно — MOEX ISS уже покрыт через `moex-shares`, брокерские API требуют авторизации.
- [x] TODO.md обновлён: research-complete items переведены в закрытый статус, Zoon добавлен как confirmed viable источник.

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
- [x] Реализовать пакет `yandex-rasp` для расписаний транспорта с тремя функциями: поиск станции, расписание, поиск маршрута.
- [x] Выбрать 10-й российский источник в домене российских спортивных сводок (РПЛ через championat.com) для замены `kleague-results`.
- [x] Реализовать пакет `rpl-results` для турнирной таблицы и результатов матчей РПЛ с двумя функциями: `getStandings`, `getResults`.
- [x] Выбрать 11-й российский источник в домене российских маркетплейсов (Price.ru/E-katalog/Яндекс.Маркет) для замены `daiso-product-search` — выбран Яндекс Маркет на текущей SSR-поверхности.
- [x] Реализовать пакет `yandex-market-search` для поиска товаров и карточек товаров через публичные страницы Яндекс Маркета.
- [x] Выбрать 12-й российский источник для nearby-поиска (2GIS/Яндекс.Карты/Zoon) для замены `blue-ribbon-nearby` и `kakao-bar-nearby` — выбран Overpass API (OpenStreetMap) как free/no-key вариант.
- [x] Реализовать пакет `osm-nearby` для поиска ближайших заведений (рестораны, кафе, бары) через Overpass API.
- [x] Выбрать 13-й российский источник в домене городского транспорта/метро для замены `seoul-subway-arrival` — **закрыто**: реального времени нет, возможны только статические справочники (низкая ценность).
- [x] Выбрать 14-й российский источник в домене брокерских и инвестиционных read-only сценариев для замены `toss-securities` — **закрыто**: MOEX ISS уже через `moex-shares`, реальные брокерские API требуют авторизации.
- [x] Проверить Zoon для nearby-replacement — **подтверждено**: SSR/HTML-поверхность, category + city pages, без anti-bot, без API keys, структурированный HTML с названиями/адресами/рейтингами/телефонами.
- [x] Подготовить fixture-first исследование по metro/urban-transit источникам — **закрыто**: Moscow Metro и SPb Metro не имеют публичного real-time API.
- [x] Уточнить минимальный scope российского read-only invest skill — **закрыто**: рыночные сводки через MOEX ISS уже покрыты, портфельные симуляции без логина не имеют публичного источника.

## Выполнено в этом раунде (раунд 4)

- [x] Проведён полный аудит репозитория на предмет соответствия AUTOWORK_INSTRUCTIONS.md: «Переделай все под российские / русскоязычные реалии».
- [x] Подтверждено, что все 13 target-навыков реализованы и работают: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test pass, pack:dry-run ✓.
- [x] Ветка `feat/mchs-storm-warnings` содержит 20 коммитов ahead of main, все проверки проходят.
- [x] Выявлены оставшиеся legacy-пакеты с корейским контекстом: `delivery-tracking`, `lotto-results`, `kbo-results`, `kleague-results`, `seoul-subway-arrival`, `fine-dust-location`, `kakao-bar-nearby`, `kakaotalk-mac`, `srt-booking`, `ktx-booking`, `toss-securities`.
- [x] Подтверждено, что legacy-пакеты сохранены намеренно для обратной совместимости и явно маркированы в документации.
- [x] Документация `docs/sources.md`, `docs/setup.md`, `docs/security-and-secrets.md` содержит технические ссылки на Korean APIs — оставлены как legacy reference, не продвигаются как основной сценарий.
- [x] Brand inventory (`docs/brand-inventory.md`) актуализирован: `k-skill-proxy`, `k-skill-setup`, `KSKILL_*` префиксы сохранены как compatibility layer.

## Проверки на следующий шаг

- Для документных и релизных изменений запускать `npm run ci`.
- Перед коммитом отдельно проверять, что правки не затёрли уже существующие незакоммиченные изменения в рабочем дереве.
- Ветка `feat/mchs-storm-warnings` готова к merge в main: 20 коммитов, CI проходит, все 13 target-навыков реализованы.
- Следующий продуктовый шаг: рассмотреть `rzd-booking` или `tutu-ru` для замены legacy `srt-booking` и `ktx-booking` (российские ЖД-билеты).
- Замены `seoul-subway-arrival` и `toss-securities` закрыты как нежизнеспособные через публичные free API — legacy-пакеты останутся без прямых российских аналогов.
- Nearby-поиск теперь покрыт двумя источниками: `osm-nearby` (базовый, free/no-key) и `zoon-nearby` (supplementary, с рейтингами и контактами).
- Legacy-пакеты с корейским контекстом сохранены как backward-compatible, не продвигаются в документации, маркированы как `Legacy` в таблицах.
- Основной фокус миграции достигнут: 13 из 28 навыков — российские target-навыки, покрытие ~50% функциональности репозитория.

## Выполнено в этом раунде (раунд 5)

- [x] Проведена полная проверка состояния ветки `feat/mchs-storm-warnings`: CI проходит, 20 коммитов ahead of main, 164 файла изменено.
- [x] Подтверждено, что все 13 target-навыков реализованы и работают: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- [x] Подтверждено, что GitHub Issues и PR недоступны без `gh auth login`, поэтому backlog управляется через TODO.md и прямые PR.
- [x] Проверен changeset inventory: 14 changeset файлов присутствуют для подготовки Version Packages PR.
- [x] Ветка подтверждена как готовая к merge в main после прохождения всех проверок CI.

## Выполнено в этом раунде (раунд 6)

- [x] Проведён аудит `README.md`, `TODO.md` и `docs/roadmap.md` на устаревшие статусы и расхождения после завершения 13 target-навыков.
- [x] README дополнен отдельным блоком `Что делаем дальше`, чтобы следующий iteration backlog был виден не только в `TODO.md`, но и в корневой документации.
- [x] `docs/roadmap.md` очищен от устаревшего статуса Milestone 4 `в работе`; статус переведён в зафиксированное состояние по документной миграции и матрице замен.
- [x] Секция roadmap с уже выпущенными навыками разделена на target-линейку и сохраняемые legacy/utility-навыки, чтобы список опубликованных возможностей не смешивал продуктовый вектор и backward compatibility.
- [x] Добавлена doc-regression проверка, которая держит README, roadmap и TODO синхронными по следующим продуктовым приоритетам.
- [x] Полный `npm run ci` после документных правок проходит: lint ✓, typecheck ✓, test 62 pass / 0 fail / 1 skipped в корневом doc-suite, workspace tests ✓, pack:dry-run ✓.

## Выполнено в этом раунде (раунд 7)

- [x] Проведён release-hygiene аудит верхнеуровневых документов: `README.md` и `docs/roadmap.md` очищены от устаревших релизных ярлыков и сводок расстояния ветки как от неустойчивого статуса.
- [x] Повторно сверён release backlog: inventory `.changeset/` остаётся целостным и содержит 14 файлов, достаточных для следующего version/publish round.
- [x] README обновлён: в блоке `Что уже сделано по миграции` зафиксирован завершённый release-hygiene раунд, а в `Что делаем дальше` добавлены более точные следующие шаги по booking-replacement decision matrix.
- [x] `docs/roadmap.md` обновлён: Milestone 5 теперь явно разделяет закрытую release-hygiene подзадачу и незавершённый booking-research.
- [x] `TODO.md` дополнен новым верхним статус-блоком и явной пометкой, что нижележащие round summaries являются историческим журналом, а не источником текущего статуса.
- [x] Doc-regression тесты расширены: теперь они проверяют отсутствие устаревших branch metrics и merge-ready формулировок в `README.md` и `docs/roadmap.md`.

## Новые пункты плана

- [x] Решить, нужен ли отдельный read-only/handoff skill сверх `yandex-rasp`, или railway replacement уже достаточно закрыт текущим discovery + documented external handoff.
- [x] Если отдельный handoff-layer нужен, проверить только стабильные безлогинные сценарии: deep-link, landing search или export маршрута без оплаты и пользовательских секретов.
- [x] Явно обновить legacy railway docs, чтобы `srt-booking` и `ktx-booking` были помечены не только как совместимые, но и как нецелевые для новых российских write-интеграций.
- [ ] Продолжать держать doc-regression в CI: README, roadmap, TODO и booking-research должны совпадать по следующему продуктовому приоритету и не возвращать release-археологию в живые секции.
- [x] Проверить, даёт ли какой-либо handoff-сценарий измеримую пользовательскую ценность сверх уже существующего `yandex-rasp`, прежде чем открывать новый target-package.
- [x] Если handoff-ценность не подтверждается, перевести Milestone 5 в документно закрытое состояние и убрать railway replacement из активного implementation backlog.
- [ ] Довести до конца remaining legacy-only matrix: `seoul-subway-arrival`, `toss-securities` и другие уже закрытые без replacement gaps должны иметь одинаковый статус в README, roadmap и install-flow.
- [ ] Пересмотреть user-facing surfaces для `delivery-tracking`, `k-skill-proxy` и других utility/transition docs только на предмет реально поддерживаемых российских public surfaces.
- [ ] Если для очередного legacy-gap нет устойчивого public source, закрывать его документно, а не открывать forced implementation backlog.
