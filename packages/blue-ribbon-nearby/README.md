# blue-ribbon-nearby

`blue-ribbon-nearby` - устаревший пакет только для чтения для поиска ближайших ресторанов Blue Ribbon по официальным зонам и интерфейсам в формате JSON сервиса.

## Граничное примечание

Этот пакет остаётся `устаревший без развития`: для российских сценариев поиска ближайших его замена уже реализована как `osm-nearby` и `zoon-nearby`. `blue-ribbon-nearby` сохраняется ради обратной совместимости и как эталонный сценарий для поиска сначала по местоположению, но не должен считаться новым направлением целевой линейки.

## Установка

После публикации:

```bash
npm install blue-ribbon-nearby
```

При локальной разработке в этом репозитории:

```bash
npm install
```

## Принципы использования

- Пользовательское местоположение не отслеживается автоматически.
- Сначала обязательно спросите текущее местоположение пользователя.
- Ориентиры вроде `코엑스` приводятся к ближайшей официальной зоне, например `삼성동/대치동`.
- По умолчанию пакет фильтрует только Blue Ribbon места через `ribbonType=RIBBON_THREE,RIBBON_TWO,RIBBON_ONE`.

## Официальные интерфейсы Blue Ribbon

- Районы и зоны: `https://www.bluer.co.kr/search/zone`
- JSON ресторанов поблизости: `https://www.bluer.co.kr/restaurants/map`
- Поисковая страница: `https://www.bluer.co.kr/search`

## Пример

```js
const { searchNearbyByLocationQuery } = require("blue-ribbon-nearby");

async function main() {
  const result = await searchNearbyByLocationQuery("광화문", {
    distanceMeters: 1000,
    limit: 5
  });

  console.log(result.anchor);
  console.log(result.items);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Проверочный пример

Ниже фрагмент реального ответа, проверенный 2026-03-27 для `광화문`, `distanceMeters=1000`, `limit=5`.

```json
{
  "anchor": {
    "zone1": "서울 강북",
    "zone2": "광화문/종로2가"
  },
  "items": [
    {
      "name": "미치루스시",
      "ribbonType": "RIBBON_ONE",
      "ribbonCount": 1,
      "distanceMeters": 61
    },
    {
      "name": "한성옥",
      "ribbonType": "RIBBON_ONE",
      "ribbonCount": 1,
      "distanceMeters": 170
    },
    {
      "name": "청진옥",
      "ribbonType": "RIBBON_TWO",
      "ribbonCount": 2,
      "distanceMeters": 242
    }
  ]
}
```

## Справочник API

- `searchNearbyByLocationQuery(query, options?)`
- `searchNearbyByCoordinates({ latitude, longitude }, options?)`
- `searchOfficialZones(query, options?)`
