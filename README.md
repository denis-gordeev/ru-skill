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
| `srt-booking` | Поиск поездов SRT, бронирование, просмотр и отмена брони | Да | [Гайд по SRT](docs/features/srt-booking.md) |
| `ktx-booking` | Поиск и бронирование поездов KTX/Korail через helper с обходом Dynapath anti-bot | Да | [Гайд по KTX](docs/features/ktx-booking.md) |
| `kakaotalk-mac` | Просмотр, поиск и тестовая отправка сообщений KakaoTalk на macOS через `kakaocli` | Нет | [Гайд по KakaoTalk Mac CLI](docs/features/kakaotalk-mac.md) |
| `seoul-subway-arrival` | Просмотр ожидаемого времени прибытия поездов метро Сеула по станции | Да | [Гайд по метро Сеула](docs/features/seoul-subway-arrival.md) |
| `fine-dust-location` | Проверка PM10/PM2.5 по текущему местоположению или запасному региону через `k-skill-proxy` | Нет | [Гайд по fine dust](docs/features/fine-dust-location.md) |
| `kbo-results` | Результаты и расписание матчей KBO по датам и командам | Нет | [Гайд по KBO](docs/features/kbo-results.md) |
| `kleague-results` | Результаты матчей и таблица K League 1/2 | Нет | [Гайд по K League](docs/features/kleague-results.md) |
| `toss-securities` | Read-only-сводки по счёту, портфелю, котировкам и watchlist через `tossctl` | Да | [Гайд по Toss Securities](docs/features/toss-securities.md) |
| `lotto-results` | Проверка последних и конкретных тиражей корейской лотереи | Нет | [Гайд по lotto](docs/features/lotto-results.md) |
| `hwp` | Конвертация `.hwp` в JSON/Markdown/HTML, извлечение изображений и пакетная обработка | Нет | [Гайд по HWP](docs/features/hwp.md) |
| `blue-ribbon-nearby` | Поиск ближайших ресторанов Blue Ribbon Survey после уточнения местоположения | Нет | [Гайд по Blue Ribbon nearby](docs/features/blue-ribbon-nearby.md) |
| `kakao-bar-nearby` | Поиск ближайших баров по данным Kakao Map с режимом работы и контактами | Нет | [Гайд по Kakao bar nearby](docs/features/kakao-bar-nearby.md) |
| `zipcode-search` | Поиск официального почтового индекса по адресу | Нет | [Гайд по postcode search](docs/features/zipcode-search.md) |
| `daiso-product-search` | Поиск магазинов, товаров и pickup-остатков в Daiso Mall | Нет | [Гайд по Daiso product search](docs/features/daiso-product-search.md) |
| `delivery-tracking` | Отслеживание доставки через официальные поверхности CJ Logistics и Korea Post | Нет | [Гайд по delivery tracking](docs/features/delivery-tracking.md) |

Все перечисленные выше функции пока остаются в основном legacy-набором корейских сценариев. Они сохранены, чтобы не ломать существующие рабочие потоки, пока репозиторий переориентируется на русскоязычное использование.

## Текущие пакеты

| Пакет | Описание | Статус |
| --- | --- | --- |
| `cbr-rates` | Клиент для официальных курсов валют Банка России | Target |
| `moex-shares` | Клиент для публичных акций Московской биржи через ISS API | Target |
| `k-lotto` | Клиент для результатов корейской лотереи | Legacy |
| `daiso-product-search` | Поиск магазинов, товаров и остатков Daiso | Legacy |
| `blue-ribbon-nearby` | Поиск ресторанов Blue Ribbon nearby | Legacy |
| `kakao-bar-nearby` | Поиск баров рядом через Kakao Map | Legacy |
| `kleague-results` | Результаты матчей и таблица K League | Legacy |
| `toss-securities` | Read-only-обёртка над `tossctl` | Legacy |
| `k-skill-proxy` | База прокси для бесплатных API | Активный |

## Документация

| Документ | Описание |
| --- | --- |
| [Установка](docs/install.md) | Установка навыков и локальная проверка |
| [Общая настройка](docs/setup.md) | Подготовка секретов и переменных окружения |
| [Политика секретов](docs/security-and-secrets.md) | Правила хранения и использования секретов |
| [Гайд по прокси](docs/features/k-skill-proxy.md) | Эксплуатация прокси для бесплатных API |
| [Релизы и публикация](docs/releasing.md) | Changesets, release-please и trusted publishing |
| [Дорожная карта](docs/roadmap.md) | Следующие шаги миграции под российские сценарии |
| [Инвентарь бренда](docs/brand-inventory.md) | Где legacy-имя `k-skill` ещё нужно ради совместимости |
| [Источники и поверхности](docs/sources.md) | Публичные документы и API, на которые опирается проект |

## Что уже сделано по миграции

- Добавлен первый целевой русскоязычный навык `cbr-rates` на официальном XML-сервисе Банка России.
- Добавлен второй целевой русскоязычный навык `moex-shares` на публичном ISS API Московской биржи.
- Верхнеуровневая документация и roadmap переведены на единый русскоязычный сценарий с явным разделением `Target` и `Legacy`.
- Для setup и shell-скриптов введён dual-path secrets: сначала `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.
- Setup-поток теперь можно вызывать через предпочтительное имя `ru-skill-setup`; `k-skill-setup` сохранён как совместимый alias.

## Быстрые ссылки на ключевые функции

- [Курсы валют Банка России](docs/features/cbr-rates.md)
- [Акции Московской биржи](docs/features/moex-shares.md)
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
