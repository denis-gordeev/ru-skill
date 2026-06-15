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

| Навык | Описание | Нужны секреты | Документ |
| --- | --- | --- | --- |
| `cbr-rates` | Официальные курсы валют Банка России по публичному XML-сервису | Нет | [Гайд по курсам ЦБ РФ](docs/features/cbr-rates.md) |
| `moex-shares` | Публичные метаданные и задержанные котировки акций Московской биржи через ISS API | Нет | [Гайд по акциям MOEX](docs/features/moex-shares.md) |
| `postcalc-postcodes` | Карточки отделений и сводки по населённым пунктам через публичные страницы Postcalc | Нет | [Гайд по Postcalc и индексам](docs/features/postcalc-postcodes.md) |
| `hh-vacancies` | Поиск вакансий, карточки вакансий и поиск регионов через публичный API hh.ru | Нет | [Гайд по HH вакансиям](docs/features/hh-vacancies.md) |
| `stoloto-lotto` | Публичные результаты лотерей Столото через архивные страницы тиражей | Нет | [Гайд по лотереям Столото](docs/features/stoloto-lotto.md) |
| `kinopoisk-search` | Поиск фильмов и карточки фильмов через публичные страницы Кинопоиска | Нет | [Гайд по Кинопоиску](docs/features/kinopoisk-search.md) |
| `mchs-storm-warnings` | Официальные экстренные предупреждения МЧС по региональным страницам | Нет | [Гайд по предупреждениям МЧС](docs/features/mchs-storm-warnings.md) |
| `pravo-documents` | Поиск и карточки официальных правовых документов через API pravo.gov.ru | Нет | [Гайд по правовым документам](docs/features/pravo-documents.md) |
| `yandex-rasp` | Расписания транспорта (электрички, поезда, автобусы, авиарейсы) через API Яндекс.Расписаний | Да | [Гайд по Яндекс.Расписаниям](docs/features/yandex-rasp.md) |
| `rpl-results` | Турнирная таблица и результаты матчей Российской Премьер-Лиги через championat.com | Нет | [Гайд по РПЛ](docs/features/rpl-results.md) |
| `yandex-market-search` | Поиск товаров и карточки товаров через серверно отрендеренные страницы Яндекс Маркета | Нет | [Гайд по Яндекс Маркету](docs/features/yandex-market-search.md) |
| `osm-nearby` | Поиск ближайших заведений через Overpass API OpenStreetMap | Нет | [Гайд по OSM nearby](docs/features/osm-nearby.md) |
| `zoon-nearby` | Поиск ближайших заведений через публичные страницы Zoon.ru | Нет | [Гайд по Zoon.ru](docs/features/zoon-nearby.md) |
| `srt-booking` | Legacy-совместимый корейский сценарий поиска поездов SRT и бронирования | Да | [Гайд по SRT](docs/features/srt-booking.md) |
| `ktx-booking` | Legacy-совместимый корейский сценарий KTX/Korail через helper с обходом антибота Dynapath | Да | [Гайд по KTX](docs/features/ktx-booking.md) |
| `kakaotalk-mac` | Просмотр, поиск и тестовая отправка сообщений KakaoTalk на macOS через `kakaocli` | Нет | [Гайд по KakaoTalk Mac CLI](docs/features/kakaotalk-mac.md) |
| `seoul-subway-arrival` | Просмотр ожидаемого времени прибытия поездов метро Сеула по станции | Да | [Гайд по метро Сеула](docs/features/seoul-subway-arrival.md) |
| `fine-dust-location` | Проверка PM10/PM2.5 по текущему местоположению или запасному региону через `k-skill-proxy` | Нет | [Гайд по мелкой пыли](docs/features/fine-dust-location.md) |
| `kbo-results` | Результаты и расписание матчей KBO по датам и командам | Нет | [Гайд по KBO](docs/features/kbo-results.md) |
| `kleague-results` | Результаты матчей и таблица K League 1/2 | Нет | [Гайд по K League](docs/features/kleague-results.md) |
| `toss-securities` | Сводки только для чтения по счёту, портфелю, котировкам и watchlist через `tossctl` | Да | [Гайд по Toss Securities](docs/features/toss-securities.md) |
| `lotto-results` | Проверка последних и конкретных тиражей корейской лотереи | Нет | [Гайд по lotto](docs/features/lotto-results.md) |
| `hwp` | Конвертация `.hwp` в JSON/Markdown/HTML, извлечение изображений и пакетная обработка | Нет | [Гайд по HWP](docs/features/hwp.md) |
| `blue-ribbon-nearby` | Поиск ближайших ресторанов Blue Ribbon Survey после уточнения местоположения | Нет | [Гайд по Blue Ribbon nearby](docs/features/blue-ribbon-nearby.md) |
| `kakao-bar-nearby` | Поиск ближайших баров по данным Kakao Map с режимом работы и контактами | Нет | [Гайд по Kakao bar nearby](docs/features/kakao-bar-nearby.md) |
| `zipcode-search` | Поиск официального почтового индекса по адресу | Нет | [Гайд по postcode search](docs/features/zipcode-search.md) |
| `daiso-product-search` | Поиск магазинов, товаров и остатков для самовывоза в Daiso Mall | Нет | [Гайд по Daiso product search](docs/features/daiso-product-search.md) |
| `delivery-tracking` | Отслеживание доставки через официальные поверхности CJ Logistics и Korea Post | Нет | [Гайд по delivery tracking](docs/features/delivery-tracking.md) |

Список выше сейчас смешанный: первые target-навыки уже переведены на российские сценарии, а заметная часть остального набора всё ещё остаётся legacy-наследием корейских интеграций. Legacy-функции сохранены, чтобы не ломать существующие рабочие потоки, пока репозиторий переориентируется на русскоязычное использование.

## Текущие пакеты

| Пакет | Описание | Статус |
| --- | --- | --- |
| `cbr-rates` | Клиент для официальных курсов валют Банка России | Target |
| `moex-shares` | Клиент для публичных акций Московской биржи через ISS API | Target |
| `postcalc-postcodes` | Клиент для сводок только для чтения по индексам и отделениям Почты России через Postcalc | Target |
| `hh-vacancies` | Клиент для поиска вакансий и карточек вакансий через публичный API hh.ru | Target |
| `stoloto-lotto` | Клиент для публичных результатов лотерей Столото через архивные страницы | Target |
| `kinopoisk-search` | Клиент для поиска фильмов и карточек фильмов через публичные страницы Кинопоиска | Target |
| `mchs-storm-warnings` | Клиент для официальных экстренных предупреждений МЧС по региональным страницам | Target |
| `pravo-documents` | Клиент для поиска и карточек официальных правовых документов через API pravo.gov.ru | Target |
| `yandex-rasp` | Клиент для расписаний транспорта через API Яндекс.Расписаний | Target |
| `rpl-results` | Клиент для турнирных таблиц и результатов матчей РПЛ через championat.com | Target |
| `yandex-market-search` | Клиент для поиска товаров и карточек товаров через серверно отрендеренные страницы Яндекс Маркета | Target |
| `osm-nearby` | Клиент для поиска ближайших заведений через Overpass API OpenStreetMap | Target |
| `zoon-nearby` | Клиент для поиска ближайших заведений через публичные страницы Zoon.ru | Target |
| `k-lotto` | Клиент для результатов корейской лотереи | Legacy |
| `daiso-product-search` | Поиск магазинов, товаров и остатков Daiso | Legacy |
| `blue-ribbon-nearby` | Поиск ближайших ресторанов Blue Ribbon | Legacy |
| `kakao-bar-nearby` | Поиск баров рядом через Kakao Map | Legacy |
| `kleague-results` | Результаты матчей и таблица K League | Legacy |
| `toss-securities` | Обёртка только для чтения над `tossctl` | Legacy |
| `k-skill-proxy` | База прокси для бесплатных API | Transition |

## Документация

| Документ | Описание |
| --- | --- |
| [Установка](docs/install.md) | Установка навыков и локальная проверка |
| [Общая настройка](docs/setup.md) | Подготовка секретов и переменных окружения |
| [Политика секретов](docs/security-and-secrets.md) | Правила хранения и использования секретов |
| [Гайд по прокси](docs/features/k-skill-proxy.md) | Эксплуатация прокси для бесплатных API |
| [Релизы и публикация](docs/releasing.md) | Changesets, release-please и trusted publishing |
| [Дорожная карта](docs/roadmap.md) | Следующие шаги миграции под российские сценарии |
| [Замены booking-навыков](docs/booking-replacements.md) | Матрица решений по замене `srt-booking` и `ktx-booking` |
| [Инвентарь бренда](docs/brand-inventory.md) | Где legacy-имя `k-skill` ещё нужно ради совместимости |
| [Источники и поверхности](docs/sources.md) | Публичные документы и API, на которые опирается проект |

## Что уже сделано по миграции

- Добавлен первый целевой русскоязычный навык `cbr-rates` на официальном XML-сервисе Банка России.
- Добавлен второй целевой русскоязычный навык `moex-shares` на публичном ISS API Московской биржи.
- Добавлен третий целевой русскоязычный навык `postcalc-postcodes` для индексов и отделений Почты России через публичные страницы Postcalc.
- Добавлен четвёртый целевой русскоязычный навык `hh-vacancies` для поиска вакансий и карточек вакансий через публичный API `hh.ru`.
- Добавлен пятый целевой русскоязычный навык `stoloto-lotto` для результатов лотерей через публичные страницы архива Столото.
- Добавлен шестой целевой русскоязычный навык `kinopoisk-search` для поиска фильмов и карточек фильмов через публичные страницы Кинопоиска.
- Добавлен седьмой целевой русскоязычный навык `mchs-storm-warnings` для официальных экстренных предупреждений МЧС России по региональным страницам.
- Добавлен восьмой целевой русскоязычный навык `pravo-documents` для поиска и чтения официальных правовых документов через API pravo.gov.ru.
- Добавлен девятый целевой русскоязычный навык `yandex-rasp` для расписаний транспорта через API Яндекс.Расписаний.
- Добавлен десятый целевой русскоязычный навык `rpl-results` для турнирной таблицы и результатов матчей Российской Премьер-Лиги через championat.com.
- Добавлен одиннадцатый целевой русскоязычный навык `yandex-market-search` для поиска товаров и карточек товаров через серверно отрендеренные страницы Яндекс Маркета.
- Добавлен двенадцатый целевой русскоязычный навык `osm-nearby` для поиска ближайших заведений через публичный Overpass API OpenStreetMap.
- Добавлен тринадцатый целевой русскоязычный навык `zoon-nearby` для поиска ближайших заведений через публичные страницы Zoon.ru.
- Верхнеуровневая документация и roadmap переведены на единый русскоязычный сценарий с явным разделением `Target` и `Legacy`.
- `README.md`, `TODO.md`, `docs/install.md` и `docs/roadmap.md` синхронизированы между собой; добавлена регрессия, которая проверяет, что поток установки не пропускает текущие `target` workspace-пакеты.
- Для setup и shell-скриптов введён двойной путь secrets: сначала `~/.config/ru-skill/secrets.env`, затем legacy запасной вариант `~/.config/k-skill/secrets.env`.
- Setup-поток теперь можно вызывать через предпочтительное имя `ru-skill-setup`; `k-skill-setup` сохранён как совместимый alias.
- Плановая документация очищена от устаревших статусов: `README.md`, `TODO.md` и `docs/roadmap.md` теперь синхронно фиксируют 13 реализованных `target`-навыков и текущее состояние migration backlog.
- В `docs/roadmap.md` обновлён статус Milestone 4: документная миграция, матрица замен и маркировка legacy-пакетов доведены до рабочего завершения; дальше фокус смещён на booking-replacements и release hygiene.
- Добавлена отдельная doc-regression проверка, которая не даёт README, roadmap и TODO разъехаться по следующим шагам и продуктовым приоритетам.
- Проведён release-hygiene раунд: подтверждён текущий inventory `.changeset/`, а из верхнеуровневых документов убраны устаревшие релизные ярлыки и сводки расстояния ветки как неустойчивый live-статус.
- Doc-regression усилен: README и roadmap теперь дополнительно страхуются тестами от возврата устаревшей release-археологии в живые секции.
- Проведён исследовательский раунд по railway booking replacements: добавлен отдельный документ с матрицей решений, где официальный поток РЖД признан слишком тяжёлым по части оформления заказа для MVP, а `tutu.ru` и Яндекс Путешествия зафиксированы как кандидаты только для чтения и перенаправления, а не как подтверждённые публичные booking API.
- Legacy railway docs выровнены с этим решением: `srt-booking` и `ktx-booking` теперь явно помечены как backward-compatible корейские сценарии, а не как направление для новых российских интеграций на запись.
- Milestone 5 закрыт документно: подтверждено, что `yandex-rasp` уже покрывает стабильный поиск железнодорожных маршрутов, а отдельный навык-перенаправление без публичного booking API не добавляет новой устойчивой функции.
- `docs/booking-replacements.md`, `docs/sources.md`, `docs/features/yandex-rasp.md` и `yandex-rasp/SKILL.md` обновлены под это решение: внешний переход в поверхности оформления заказа описан как пользовательский ручной шаг, а не как новый `target`-пакет.
- Доведена до конца `remaining legacy-only matrix`: `seoul-subway-arrival` и `toss-securities` теперь одинаково помечены как документно закрытые `Legacy`, а `k-skill-proxy` — как `Transition` во всех user-facing верхнеуровневых документах.
- `docs/install.md` больше не смешивает `target`, `legacy-only` и transition-навыки без пояснений: в install-flow зафиксированы границы для `delivery-tracking`, `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy`.
- User-facing guides для `delivery-tracking`, `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy` дополнены явными граничными примечаниями, чтобы legacy/transition сценарии не выглядели как скрытый целевой перечень задач.
- `fine-dust-location`, `docs/setup.md`, `docs/security-and-secrets.md` и `packages/k-skill-proxy/README.md` выровнены по `ru-skill`-first порядку секретов и transition-boundary: опубликованный proxy endpoint описан как слой совместимости, а `AIR_KOREA_OPEN_API_KEY` оставлен только для прямого резервного доступа или прокси на собственном сервере.
- Doc-regression расширен на `fine-dust-location` и proxy helper-docs, чтобы граничные примечания, порядок `~/.config/ru-skill/secrets.env` -> `~/.config/k-skill/secrets.env` и различие между переопределением адреса и реальными секретами не разъезжались.
- `examples/secrets.env.example`, setup-skills и `scripts/check-setup.sh` дополнительно выровнены по той же модели: `KSKILL_PROXY_BASE_URL` теперь везде подан как необязательное переопределение адреса, а не как секрет по умолчанию или обязательный элемент стартового шаблона.
- Doc-regression расширен ещё на secrets template и setup helper-docs, чтобы необязательное переопределение/настоящие учётные данные не откатывалась в локальных инструкциях и проверках окружения.
- Package-level README для legacy utility-пакетов (`toss-securities`, `daiso-product-search`, `kleague-results`, `blue-ribbon-nearby`, `kakao-bar-nearby`, `k-lotto`) выровнены с текущей migration-governance: они теперь явно фиксируют `legacy-only` границу, называют российские replacements там, где они уже есть, и не выглядят как активный целевой перечень задач.
- Doc-regression расширен на этот package-level слой, чтобы `legacy-only` граница удерживалась не только в feature guides и top-level docs, но и в README отдельных workspace-пакетов.
- Legacy alias `k-skill-setup` больше не продвигает `~/.config/k-skill/bin` и `~/.config/k-skill/logs` как runtime-default: update-check examples и log paths переведены на `~/.config/ru-skill/*`, а legacy-пути оставлены только как совместимый запасной вариант.
- Doc-regression расширен на setup runtime-artifacts, чтобы even legacy setup-skill не возвращал `k-skill`-prefixed bin/log directories в роли основного operational path.
- Оставшиеся legacy skill-level guides тоже выровнены с migration-boundary: `fine-dust-location`, `srt-booking` и `ktx-booking` теперь одинаково фиксируют `legacy/transition` роль, `ru-skill`-first secrets order и различие между необязательным переопределением адреса и реальными секретами.
- Doc-regression расширен на этот skill-level слой, чтобы railway/fine-dust copy не возвращала legacy defaults или скрытый целевой перечень задач в новые раунды.
- Следующий слой legacy skill-only guides тоже выровнен: `kakaotalk-mac`, `kbo-results`, `lotto-results` и `zipcode-search` теперь явно фиксируют `legacy-only` границу и не выглядят как активные target-кандидаты.
- Doc-regression расширен и на эти skill-only surfaces, чтобы граница миграции для локальных CLI и корейских utility workflows не терялся между `docs/features/*` и `*/SKILL.md`.
- Следующий слой legacy feature/skill drift тоже закрыт: `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby`, `kleague-results`, `srt-booking` и `ktx-booking` теперь в user-facing guides явно публикуют `## Граничное примечание`, а их границы замен синхронизированы со связанными `SKILL.md`.
- Doc-regression расширен и на этот feature/skill слой, чтобы replacement copy для nearby, marketplace, football и legacy railway сценариев не расходился между `docs/features/*` и `*/SKILL.md`.
- Helper/runtime cleanup формально закрыт и на user-facing legacy guides: `fine-dust-location`, `seoul-subway-arrival`, `srt-booking` и `ktx-booking` теперь дополнительно страхуются регрессиями на `ru-skill`-first secrets order, runtime/secrets semantics и граница замен.
- User-facing Korean labels в source code переведены на русский: статусы матчей (`kleague-results`), подсказки вместимости (`kakao-bar-nearby`), лотерейные метки (`k-lotto`), сообщения об ошибках (`blue-ribbon-nearby`).
- User-facing Korean текст в feature docs, SKILL.md и package README дополнительно русифицирован: `kakao-bar-nearby`, `blue-ribbon-nearby`, `kleague-results`, `zipcode-search`, `hwp`, `ktx-booking`, `kakaotalk-mac`.
- Doc-regression расширен на все 13 target-навыков (ранее непокрытые: `moex-shares`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `osm-nearby`).
- `README.md`, `TODO.md` и `docs/roadmap.md` синхронизированы: оставшийся Korean в source code и docs - domain-inherent (API parameters, location names, fixture data), следующий приоритет - расширить doc-regression coverage для legacy skills.
- Skill-level copy audit завершён: 7 мест, где legacy-контекст описывался как рабочее значение по умолчанию, исправлены на обратно совместимый запасной вариант (`delivery-tracking`, `toss-securities`, `hwp`, `blue-ribbon-nearby`, `ktx-booking`).
- Doc-regression теперь покрывает все 13 target-навыков и 4 legacy-навыка с workflow/content assertions (`seoul-subway-arrival`, `kbo-results`, `lotto-results`, `srt-booking`).
- Английские заголовки секций во всех target SKILL.md переведены на русский и приведены к единой схеме; нестандартные русские формулировки в `yandex-rasp` и `yandex-market-search` нормализованы; последние Korean фрагменты в feature docs (`kakao-bar-nearby`, `kleague-results`) переведены на русский.
- `ru-skill-setup/SKILL.md` переведён на русские секционные заголовки (`Назначение`, `Порядок разрешения учётных данных`, `Стандартный сценарий`, `Совместимость`), чтобы предпочтительный setup-alias не оставался последним English-heading outlier.
- Legacy alias `k-skill-setup/SKILL.md` теперь использует ту же верхнеуровневую heading scheme (`Назначение`, `Порядок разрешения учётных данных`, `Стандартный сценарий`, `Совместимость`) без изменения setup-flow, secrets order и семантики совместимости.
- `zoon-nearby/SKILL.md` и `packages/zoon-nearby/SKILL.md` приведены к target-канону (`Что делает навык`, `Когда использовать`, `Предварительные условия`, `Входные данные`, `Рабочий процесс`, `Критерии завершения`, `Возможные ошибки`, `Примечания`), чтобы дополнительный nearby-источник не оставался особым случаем по структуре.
- `docs/features/zoon-nearby.md` и `packages/zoon-nearby/README.md` очищены от смешанного артефакта `可以直接`; doc-regression теперь дополнительно страхует heading scheme для setup alias и `zoon-nearby`, а также отсутствие такого mixed-language drift.
- Все 17 SKILL.md с неканоничными заголовками нормализованы к единой схеме (`Что делает навык`, `Предварительные условия`, `Критерии завершения`, `Возможные ошибки`); устранены варианты `Что делает этот навык`, `Что умеет`, `Предварительные требования`, `Считается выполненным, когда`, `Режимы сбоев`.
- Все 29 feature docs в `docs/features/` нормализованы к каноничной heading scheme; устранены варианты `Что умеет этот сценарий`, `Что нужно заранее`, `Базовый поток`, `Базовый сценарий`, `Обзор`, `Входы`, `Готово, когда`.
- `packages/osm-nearby/SKILL.md` полностью перестроен под каноничную схему target-навыка; `Что умеет` заменено на `Что делает навык` и т.д.
- Устранены 10 Chinese character артефактов в user-facing документации: `整理` → `структурировать` (7 мест), `布尔` → `булевый` (1 место), `实时` → `в реальном времени` (1 место), `返回` → `вернуть` (1 место).
- Doc-regression расширен: добавлены тесты на каноничность heading scheme во всех SKILL.md и feature docs, а также на отсутствие Chinese character артефактов.
- `TODO.md` переведён на более строгую top-block модель: актуальный backlog закреплён в верхних блоках `Статус`, `Выполнено в этом раунде` и `Новые пункты плана`, а исторические plan-секции больше не держат живые unchecked-пункты.
- Doc-regression расширен на preferred setup-skill и hygiene живого backlog: тесты теперь страхуют русские заголовки в `ru-skill-setup` и то, что активные unchecked-пункты живут только в верхнем plan block `TODO.md`.
- Переведён `## Boundary note` → `## Граничное примечание` во всех 31 файле (15 SKILL.md, 16 docs/features/*.md).
- Переведены английские h1-заголовки в 9 target SKILL.md на русский: `CBR Rates` → `Курсы валют ЦБ РФ`, `HH Vacancies` → `Вакансии HH`, `MOEX Shares` → `Акции Мосбиржи`, `MChS Storm Warnings` → `Штормовые предупреждения МЧС`, `Pravo.gov.ru Legal Documents` → `Правовые документы pravo.gov.ru`, `Postcalc Postcodes` → `Почтовые индексы Postcalc`, `Zoon.ru Nearby Search` → `Поиск поблизости Zoon.ru`, `osm-nearby` → `Поиск поблизости OSM`.
- Переведены английские h1-заголовки в 4 docs/features на русский: `MOEX Shares` → `Акции Мосбиржи`, `OSM Nearby` → `Поиск поблизости OSM`, `Zoon.ru Nearby Search` → `Поиск поблизости Zoon.ru`, `kinopoisk-search` → `Поиск на Кинопоиске`.
- Переведены на русский все 10 target package README: описания, секционные заголовки (`Install` → `Установка`, `Usage` → `Использование`, `Notes` → `Примечания`) и содержимое.
- Переведены на русский frontmatter `description` в 8 target SKILL.md.
- Нормализованы неканоничные заголовки в уже-русских package README: `Что умеет` → `Что делает навык`, `Что не умеет` → `Ограничения`, `Готово, когда` → `Критерии завершения`.
- Следующий слой legacy user-facing drift тоже закрыт: в package README и feature guides для `blue-ribbon-nearby`, `daiso-product-search`, `k-lotto`, `kakao-bar-nearby`, `kleague-results`, `toss-securities`, `kakaotalk-mac`, `kbo-results`, `lotto-results`, `delivery-tracking`, `seoul-subway-arrival`, `zipcode-search` английские граничные/продуктовые формулировки (`обратная совместимость`, `эталонный сценарий`, `целевой перечень задач`, `публичная замена источника`) заменены на русские аналоги без изменения code identifiers.
- Заголовок `## Live smoke snapshot` убран из legacy package README с проверенными smoke-примерами: на этих surfaces теперь используется `## Проверенный проверочный пример`.
- Doc-regression дополнительно страхует этот слой: `scripts/skill-docs.test.js` проверяет новые русские формулировки и не даёт touched legacy surfaces вернуть старую английскую граничную/продуктовую копию.
- Следующий слой mixed-language drift закрыт уже на transition/setup surfaces: `docs/setup.md`, `docs/security-and-secrets.md`, `docs/features/fine-dust-location.md`, `docs/features/k-skill-proxy.md`, `fine-dust-location/SKILL.md`, оба setup-skill, `examples/secrets.env.example` и `packages/k-skill-proxy/README.md` теперь используют согласованную русскую терминологию для резервных путей, переопределения адреса и слоя совместимости.
- Все 20 workspace `package.json` descriptions переведены на русский и выровнены с текущим target/legacy/transition позиционированием репозитория, чтобы npm/publish metadata не расходилась с README и feature docs.
- Doc-regression расширен на transition/setup copy и package metadata: тесты теперь страхуют русские формулировки вокруг `KSKILL_PROXY_BASE_URL`, `AIR_KOREA_OPEN_API_KEY` и descriptions во всех publishable workspace-пакетах.
- Полный `npm test` и `./scripts/validate-skills.sh` проходят после этой синхронизации.
- Закрыт следующий мелкий слой mixed-language drift в repo-governance и publish surfaces: `packages/zoon-nearby/README.md` переведён с неканоничного `## Обзор` на `## Что делает навык`, `AGENTS.md` русифицирован, а оставшиеся `fixture-based` формулировки в `.changeset/fair-steaks-pretend.md` и `.changeset/moex-shares.md` переведены на русский.
- Doc-regression расширен на package README heading и repo-governance surfaces: тесты страхуют, что `packages/zoon-nearby/README.md` не возвращает `## Обзор`, `AGENTS.md` не возвращает `Default posture: public read-only endpoint`, а changeset-сводки не используют `fixture-based`.
- Закрыт следующий слой English jargon в shell/infrastructure surfaces: `scripts/check-setup.sh` и `scripts/validate-skills.sh` теперь выдают русские user-facing статусы, ошибки и подсказки вместо `missing`, `insecure`, `next steps`, `skill layout looks valid`.
- Doc-regression расширен на shell/infrastructure surfaces: тесты страхуют русские сообщения в `scripts/check-setup.sh` и `scripts/validate-skills.sh`, а также не дают вернуть английские helper/status формулировки в эти CLI-скрипты.
- Переведены на русский все оставшиеся английские assert-сообщения в `scripts/skill-docs.test.js` (~107 сообщений); внутренних английских сообщений об ошибках в тестах больше нет.
- Переведены на русский английские h1-заголовки в верхнеуровневых документах: `# Brand Inventory` → `# Инвентарь бренда`, `# Sources` → `# Источники`, `# Roadmap` → `# Дорожная карта`.
- Устранён оставшийся English jargon в feature docs: `production` → `промышленного использования`, `live-проверке` → `проверке в реальном времени`, `live-вёрстку` → `актуальную вёрстку`, `live-данные` → `данные в реальном времени`, `export` → `экспорт`, `discovery` → `обнаружение`.

## Что делаем дальше

- Railway replacement выведен из активного implementation backlog: текущая граница зафиксирована в [docs/booking-replacements.md](docs/booking-replacements.md) как `yandex-rasp` + ручное внешнее перенаправление без нового навыка оформления заказа.
- Если в будущем появится официальный и устойчивый railway booking source без логина, закрытых API и ненадёжных обходов антибота, тогда можно вернуться к идее отдельного target-пакета; до этого автоматизацию записи в потоках оформления заказа не раздувать.
- Skill-only drift, legacy feature/skill drift, helper/runtime cleanup, source-level русификация и skill-level copy audit уже закрыты; весь user-facing Korean в source code и docs полностью устранён; оставшийся Korean — domain-inherent (API parameters, location names, fixture data, regex patterns).
- Все SKILL.md и feature docs приведены к единой каноничной heading scheme; неканоничные варианты (`Что делает этот навык`, `Что умеет`, `Предварительные требования`, `Режимы сбоев`, `Что умеет этот сценарий`, `Что нужно заранее`, `Базовый поток`, `Базовый сценарий`, `Обзор`) устранены.
- Package README на актуальных target-поверхностях тоже доведены до каноничной heading scheme; оставшийся `## Обзор` в `packages/zoon-nearby/README.md` устранён.
- Chinese character артефакты (`整理`, `布尔`, `返回`, `实时`) устранены из всей user-facing документации; doc-regression страхует отсутствие таких артефактов.
- Doc-regression покрывает все 13 target-навыков и все legacy-навыки с workflow/content assertions, каноничность heading scheme и отсутствие mixed-language артефактов.
- Английские артефакты в target package README, SKILL.md h1-заголовках и секционных заголовках устранены; `## Boundary note` переведён как `## Граничное примечание`.
- На обновлённых legacy package README и feature guides снят следующий слой user-facing English drift; следующий проход нужен уже по transition surfaces и package metadata, а не по тем же документам с граничными примечаниями.
- Transition/setup surfaces и package metadata descriptions теперь тоже выровнены; следующий проход нужен уже по publish/release surfaces (`CHANGELOG.md`, changeset summaries, feature-link labels, skill frontmatter descriptions), а не по тем же credential/proxy документам.
- Все 7 английских changeset-сводок в `.changeset/` переведены на русский, чтобы publish-summary copy не отставала от README и package metadata.
- Все 5 оставшихся английских SKILL.md frontmatter `description` (toss-securities, srt-booking, seoul-subway-arrival, ktx-booking, delivery-tracking) и смешанная description в blue-ribbon-nearby переведены на русский; добавлен frontmatter в `packages/osm-nearby/SKILL.md`.
- Doc-regression расширен на changeset summaries и SKILL.md frontmatter descriptions: тесты теперь страхуют русские формулировки на этих publish surfaces.
- Milestone headings в `docs/roadmap.md` переведены на русский: `Migration milestones` → `Вехи миграции`, `Milestone N` → `Веха N`, `Legacy packages` → `Legacy-пакеты`.
- English jargon в `docs/features/osm-nearby.md` устранён: `free/no-key` → `бесплатное решение без API-ключа`, `sparse` → `неполным`.
- Doc-regression расширен на roadmap milestone headings и osm-nearby English jargon.
- Верхний активный блок `TODO.md` теперь зафиксирован как единственный живой backlog; исторические round-секции остаются архивом и не должны снова накапливать открытые checklist-пункты.
- Shell/infrastructure surfaces больше не выбиваются по языку: `scripts/check-setup.sh` и `scripts/validate-skills.sh` синхронизированы с русскоязычным setup/runtime контуром и застрахованы doc-regression тестами.
- Source-code error messages и Python helper messages в legacy-пакетах (`toss-securities`, `kleague-results`, `kakao-bar-nearby`, `blue-ribbon-nearby`, `k-lotto`, `daiso-product-search`, `ktx_booking.py`, `fine_dust.py`) переведены на русский и застрахованы doc-regression тестами.
- Продолжить сужать публичную роль legacy-пакетов: сохранять совместимость, но выносить новые пользовательские сценарии только в российские `target`-пакеты.
- Держать в CI синхрон README, roadmap, TODO, booking docs и package metadata descriptions, чтобы закрытые milestone не возвращались в активный backlog из-за документного дрейфа.
- Следующий проход делать уже по оставшимся edge-case поверхностям: npm script output, helper JS utilities (`fix-changelog-headings.js`), и другим редким repo-infrastructure сообщениям.
- Английские assert-сообщения в `scripts/skill-docs.test.js` полностью переведены на русский; h1-заголовки верхнеуровневых документов (`Brand Inventory`, `Sources`, `Roadmap`) русифицированы; English jargon в feature docs (`production`, `live-`, `discovery`, `export`) устранён.

## Быстрые ссылки на ключевые функции

- [Курсы валют Банка России](docs/features/cbr-rates.md)
- [Акции Московской биржи](docs/features/moex-shares.md)
- [Postcalc и индексы Почты России](docs/features/postcalc-postcodes.md)
- [HH вакансии](docs/features/hh-vacancies.md)
- [Лотереи Столото](docs/features/stoloto-lotto.md)
- [Кинопоиск](docs/features/kinopoisk-search.md)
- [Предупреждения МЧС](docs/features/mchs-storm-warnings.md)
- [Правовые документы pravo.gov.ru](docs/features/pravo-documents.md)
- [Яндекс.Расписания](docs/features/yandex-rasp.md)
- [Результаты РПЛ](docs/features/rpl-results.md)
- [Яндекс Маркет](docs/features/yandex-market-search.md)
- [OSM nearby](docs/features/osm-nearby.md)
- [Zoon.ru](docs/features/zoon-nearby.md)
- [Бронирование SRT](docs/features/srt-booking.md)
- [Бронирование KTX](docs/features/ktx-booking.md)
- [KakaoTalk Mac CLI](docs/features/kakaotalk-mac.md)
- [Прибытие поездов метро Сеула](docs/features/seoul-subway-arrival.md)
- [Fine dust по местоположению](docs/features/fine-dust-location.md)
- [Результаты KBO](docs/features/kbo-results.md)
- [Результаты K League](docs/features/kleague-results.md)
- [Сводки Toss Securities](docs/features/toss-securities.md)
- [Результаты корейской лотереи](docs/features/lotto-results.md)
- [Обработка HWP-документов](docs/features/hwp.md)
- [Ближайшие рестораны Blue Ribbon](docs/features/blue-ribbon-nearby.md)
- [Ближайшие бары через Kakao Map](docs/features/kakao-bar-nearby.md)
- [Поиск почтового индекса](docs/features/zipcode-search.md)
- [Поиск товаров Daiso](docs/features/daiso-product-search.md)
- [Отслеживание доставки](docs/features/delivery-tracking.md)

## С чего начать

1. Прочитайте [Установку](docs/install.md) и установите только те навыки, которые реально нужны.
2. Если используете legacy-функции из `k-skill`, сначала проверьте [Общую настройку](docs/setup.md) и [Политику секретов](docs/security-and-secrets.md).
3. Для общей подготовки окружения используйте `ru-skill-setup`; legacy-имя `k-skill-setup` остаётся рабочим alias.
4. Область дальнейшего перехода на российские сценарии зафиксирована в [Дорожной карте](docs/roadmap.md).
5. При изменении релизных настроек и метаданных соблюдайте [Гайд по релизам](docs/releasing.md) и правила Changesets.

## Примечания

- GitHub-репозиторий: `denis-gordeev/ru-skill`.
- Отдельный issue tracker не используется; работа ведётся через PR.
- Действия вроде запроса на GitHub star допустимы только при явном согласии пользователя.
