# Гайд по ресторанам Blue Ribbon рядом

## Что умеет этот сценарий

- Искать рестораны Blue Ribbon рядом с текущим местоположением пользователя.
- Сопоставлять район, станцию или ориентир с официальными зонами Blue Ribbon.
- Выполнять nearby-поиск по координатам.
- Возвращать верхние результаты по расстоянию.

## Что нужно заранее

- Доступ в интернет
- `node` 18+
- Пакет `blue-ribbon-nearby` или установленный целиком этот репозиторий

## Что спросить первым

Этот сценарий нужно запускать только после уточнения текущего местоположения пользователя. В legacy-формулировке: `반드시 현재 위치` нужно спросить заранее.

Рекомендуемый вопрос:

```text
Напишите, где вы сейчас находитесь. Подойдут район, станция, ориентир или координаты. После этого я подберу ближайшие рестораны Blue Ribbon.
```

## Входные данные

- Район или торговая зона (`동네`): `광화문`, `성수동`, `판교`
- Станция или ориентир (`역명`): `강남역`, `서울역`, `코엑스`
- Координаты (`위도`, `경도`): `37.573713, 126.978338`

Ориентиры через внутренние alias приводятся к ближайшей официальной зоне Blue Ribbon. Например, `코엑스` -> `삼성동/대치동`.
Legacy-формулировка для регрессий: `맛집 문의는 기본적으로 blue-ribbon-nearby` 를 먼저 본다.

## Официальные поверхности Blue Ribbon

- Список районов и зон: `https://www.bluer.co.kr/search/zone`
- JSON nearby-ресторанов: `https://www.bluer.co.kr/restaurants/map`
- Поисковая страница: `https://www.bluer.co.kr/search`

Ключевые параметры nearby-запроса:

- `zone1`
- `zone2`
- `zone2Lat`
- `zone2Lng`
- `isAround=true`
- `ribbon=true`
- `ribbonType=RIBBON_THREE,RIBBON_TWO,RIBBON_ONE`
- `distance=500|1000|2000|5000`

Если есть только координаты, nearby-область строится через bounding box на `latitude1`, `latitude2`, `longitude1`, `longitude2`.

## Базовый поток

1. Сначала спросить текущее местоположение.
2. Если пользователь прислал район, станцию или ориентир, найти ближайшую official zone через `search/zone`.
3. Если пользователь прислал координаты, посчитать bounding box для nearby-поиска.
4. Вызвать `/restaurants/map` с `isAround=true`, `ribbon=true`, `ribbonType=RIBBON_THREE,RIBBON_TWO,RIBBON_ONE`, `sort=distance`.
5. Вернуть 3-5 ближайших результатов.

## Пример на Node.js

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

## Проверенный live smoke пример

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

## Практические советы

- Если строка местоположения расплывчатая, лучше переспросить ближайшую станцию или координаты.
- Если зона определяется неоднозначно, безопаснее показать 2-3 кандидата и попросить уточнение.
- В ответ лучше отдавать верхние 3-5 мест по расстоянию, а не длинный список.

## Ограничения

- Blue Ribbon может отдавать `403`, если запрос недостаточно похож на браузерный.
- Если структура zone-списка изменится, поменяется и логика сопоставления.
- Без координат и при слишком широком названии района кандидатов может быть слишком много.
