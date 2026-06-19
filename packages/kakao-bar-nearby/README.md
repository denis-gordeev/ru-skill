# kakao-bar-nearby

`kakao-bar-nearby` - устаревший пакет только для чтения для поиска баров рядом через мобильный поиск Kakao Map и `panel3` JSON.

## Граничное примечание

Этот пакет остаётся `legacy-only`: для российских сценариев поиска ближайших его замена уже реализована как `osm-nearby` и `zoon-nearby`. `kakao-bar-nearby` сохраняется ради обратной совместимости и как эталонный сценарий для подсказки по меню/часам/рассадке, но не должен выглядеть как активный перечень задач целевой линейки.

## Установка

После публикации:

```bash
npm install kakao-bar-nearby
```

При локальной разработке в этом репозитории:

```bash
npm install
```

## Принципы использования

- Пользовательское местоположение не отслеживается автоматически.
- Сначала нужно спросить, где пользователь находится сейчас; историческая формулировка для регрессий: `сначала спрашиваем текущее местоположение`.
- Рабочие запросы выглядят как `서울역 술집`, `강남 술집`, `사당 술집`.
- Если есть открытые места, их стоит поднимать первыми.

## Официальные поверхности Kakao Map

- Мобильный поиск: `https://m.map.kakao.com/actions/searchView`
- JSON панели места: `https://place-api.map.kakao.com/places/panel3/<confirmId>`
- Страница места: `https://place.map.kakao.com/<confirmId>`

## Пример

```js
const { searchNearbyBarsByLocationQuery } = require("kakao-bar-nearby");

async function main() {
  const result = await searchNearbyBarsByLocationQuery("서울역", {
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

Ниже фрагмент реального ответа, проверенный 2026-03-29 для `사당`, `limit=3`, `panelLimit=8`.

```json
{
  "anchor": {
    "name": "사당1동먹자골목상점가"
  },
  "meta": {
    "openNowCount": 4
  },
  "items": [
    {
      "name": "우미노식탁",
      "openStatus": { "label": "영업 중", "detail": "24:00 까지" },
      "seatingKeywords": ["단체석", "케이크 반입 가능", "바테이블"]
    },
    {
      "name": "방배을지로골뱅이술집포차 사당역점",
      "openStatus": { "label": "영업 중", "detail": "24:00 까지" },
      "menuSamples": ["을지로골뱅이(골뱅이무침)", "백골뱅이탕 (중)", "먹태"]
    },
    {
      "name": "커먼테이블",
      "openStatus": { "label": "영업 중", "detail": "01:00 까지" },
      "phone": "010-7730-1056"
    }
  ]
}
```

## API-справочник

- `searchNearbyBarsByLocationQuery(query, options?)`
- `searchNearbyBarsByCoordinates({ latitude, longitude }, options?)`
- `searchAnchorCandidates(query, options?)`
