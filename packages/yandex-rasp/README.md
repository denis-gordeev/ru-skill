# yandex-rasp

Read-only client for [Yandex Raspisanie](https://yandex.ru/rasp/) transport schedules: long-distance trains, suburban trains (elektrichki), buses, and flights across Russia.

## Install

```bash
npm install yandex-rasp
```

## Usage

### Search for stations by name

```js
const { searchStations } = require("yandex-rasp");

const stations = await searchStations("Казанский", {
  // apiKey: "...",  // or set YANDEX_RASP_API_KEY env
});
// => [{ title, yandexCode, esrCode, stationType, transportType, latitude, longitude, direction }, ...]
```

### Get schedule for a station

```js
const { getStationSchedule } = require("yandex-rasp");

const schedule = await getStationSchedule("s9600013", {
  date: "2026-04-10",
  event: "departure",       // "departure" (default) or "arrival"
  transportType: "train",   // optional: plane, train, suburban, bus
});
// => { station, date, schedule: [...], pagination }
```

### Search trips between two stations or cities

```js
const { searchTrips } = require("yandex-rasp");

const trips = await searchTrips("c146", "c159", {
  date: "2026-04-10",
  transportType: "train",
  transfers: true,
});
// => { search, segments, intervalSegments, pagination }
```

## API

### `searchStations(query, opts?)`

Fetches the full stations directory and filters client-side by `query` (case-insensitive match on `title`).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | string | `YANDEX_RASP_API_KEY` env | API key |
| `lang` | string | `ru_RU` | Response language |

Returns `Array<{title, yandexCode, esrCode, stationType, transportType, latitude, longitude, direction}>`.

### `getStationSchedule(stationCode, opts?)`

Gets departures or arrivals for a single station on a given date.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | string | `YANDEX_RASP_API_KEY` env | API key |
| `date` | string | all dates | ISO 8601 date `YYYY-MM-DD` |
| `event` | string | `departure` | `departure` or `arrival` |
| `transportType` | string | all | `plane`, `train`, `suburban`, `bus`, `water`, `helicopter` |
| `direction` | string | — | Suburban direction hint (only for `suburban`) |
| `lang` | string | `ru_RU` | Response language |

Returns `{station: {code, title, stationType}, date, schedule: [...], pagination: {total, limit, offset}}`.

### `searchTrips(fromCode, toCode, opts?)`

Searches for trips between two stations or cities.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | string | `YANDEX_RASP_API_KEY` env | API key |
| `date` | string | all dates | ISO 8601 date `YYYY-MM-DD` |
| `transportType` | string | all | `plane`, `train`, `suburban`, `bus` |
| `transfers` | boolean | `false` | Include routes with transfers |
| `offset` | number | `0` | Pagination offset |
| `limit` | number | `100` | Max results (max 100) |
| `lang` | string | `ru_RU` | Response language |

Returns `{search, segments: [...], intervalSegments: [...], pagination}`.

## Notes

- An API key is required. Get one free at [Yandex Raspisanie API](https://yandex.ru/dev/rasp/).
- The `stations_list` endpoint returns the full directory (~40 MB). Consider caching it.
- This is a read-only client; no ticket purchases or write operations are supported.
- The deprecated `api.rasp.yandex.net` host is not used; this client uses `api.rasp.yandex-net.ru`.
