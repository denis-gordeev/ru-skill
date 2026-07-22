# yandex-rasp

Клиент только для чтения для расписаний транспорта [Яндекс.Расписаний](https://yandex.ru/rasp/): поезда дальнего следования, электрички, автобусы и авиарейсы по России.

## Установка

```bash
npm install yandex-rasp
```

## Использование

### Поиск станций по названию

```js
const { searchStations } = require("yandex-rasp");

const stations = await searchStations("Казанский", {
  // apiKey: "...",  // или задайте YANDEX_RASP_API_KEY в окружении
});
// => [{ title, yandexCode, esrCode, stationType, transportType, latitude, longitude, direction }, ...]
```

### Расписание станции

```js
const { getStationSchedule } = require("yandex-rasp");

const schedule = await getStationSchedule("s9600013", {
  date: "2026-04-10",
  event: "departure",       // "departure" (по умолчанию) или "arrival"
  transportType: "train",   // опционально: plane, train, suburban, bus
});
// => { station, date, schedule: [...], pagination }
```

### Поиск маршрутов между станциями или городами

```js
const { searchTrips } = require("yandex-rasp");

const trips = await searchTrips("c146", "c159", {
  date: "2026-04-10",
  transportType: "train",
  transfers: true,
});
// => { search, segments, intervalSegments, pagination }
```

## Справочник программного интерфейса

### `searchStations(query, opts?)`

Получает полный справочник станций и фильтрует на клиенте по `query` (нечёткое совпадение в `title`).

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `apiKey` | string | переменная `YANDEX_RASP_API_KEY` | ключ программного интерфейса |
| `lang` | string | `ru_RU` | Язык ответа |

Возвращает `Array<{title, yandexCode, esrCode, stationType, transportType, latitude, longitude, direction}>`.

### `getStationSchedule(stationCode, opts?)`

Получает отправления или прибытия для станции на указанную дату.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `apiKey` | string | переменная `YANDEX_RASP_API_KEY` | ключ программного интерфейса |
| `date` | string | все даты | Дата ISO 8601 `YYYY-MM-DD` |
| `event` | string | `departure` | `departure` или `arrival` |
| `transportType` | string | все | `plane`, `train`, `suburban`, `bus`, `water`, `helicopter` |
| `direction` | string | — | Подсказка направления для электричек (только `suburban`) |
| `lang` | string | `ru_RU` | Язык ответа |

Возвращает `{station: {code, title, stationType}, date, schedule: [...], pagination: {total, limit, offset}}`.

### `searchTrips(fromCode, toCode, opts?)`

Поиск маршрутов между двумя станциями или городами.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `apiKey` | string | переменная `YANDEX_RASP_API_KEY` | ключ программного интерфейса |
| `date` | string | все даты | Дата ISO 8601 `YYYY-MM-DD` |
| `transportType` | string | все | `plane`, `train`, `suburban`, `bus` |
| `transfers` | boolean | `false` | Включить маршруты с пересадками |
| `offset` | number | `0` | Смещение для постраничной навигации |
| `limit` | number | `100` | Максимум результатов (не более 100) |
| `lang` | string | `ru_RU` | Язык ответа |

Возвращает `{search, segments: [...], intervalSegments: [...], pagination}`.

## Примечания

- Требуется ключ программного интерфейса. Бесплатный ключ можно получить на [Яндекс.Расписания API](https://yandex.ru/dev/rasp/).
- Конечная точка `stations_list` возвращает полный справочник (~40 МБ). Рекомендуется сохранять в буфере.
- Это клиент только для чтения; покупка билетов и операции записи не поддерживаются.
- Устаревший узел `api.rasp.yandex.net` не используется; клиент работает через `api.rasp.yandex-net.ru`.
