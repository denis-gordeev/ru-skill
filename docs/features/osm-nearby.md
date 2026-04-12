# OSM Nearby

Поиск ближайших заведений (рестораны, кафе, бары) через публичный Overpass API OpenStreetMap.

## Когда использовать

- Нужно найти ближайшие рестораны, кафе или бары по координатам
- Требуется free, no-key решение для nearby-поиска в российских городах
- Не нужны рейтинги и отзывы (для них подойдут 2GIS/Яндекс.Карты с API key)

## Минимальный пример

```javascript
const { searchRestaurants } = require("osm-nearby");

// Рестораны в центре Москвы
const places = await searchRestaurants(55.7558, 37.6173, {
  radius: 1000,
  limit: 10
});

console.log(places[0]);
// {
//   name: "Кафе Пушкинъ",
//   lat: 55.7558,
//   lon: 37.6173,
//   amenity: "restaurant",
//   address: "Тверской бульвар, 26, Москва",
//   phone: "+7 495 123-45-67",
//   website: "https://cafe-pushkin.ru",
//   openingHours: "Mo-Su 10:00-23:00",
//   cuisine: "russian"
// }
```

## Доступные функции

| Функция | Что ищет | Категории |
| --- | --- | --- |
| `searchNearby(lat, lon, options)` | Всё подряд | `['restaurant', 'cafe', 'bar']` по умолчанию |
| `searchRestaurants(lat, lon, options)` | Рестораны | `['restaurant', 'fast_food', 'food_court']` |
| `searchCafes(lat, lon, options)` | Кафе | `['cafe', 'biergarten', 'ice_cream']` |
| `searchBars(lat, lon, options)` | Бары | `['bar', 'pub', 'nightclub']` |
| `getPlaceDetails(osmNodeId)` | Одно заведение по OSM ID | — |

## Параметры поиска

```javascript
await searchNearby(55.7558, 37.6173, {
  radius: 2000,        // радиус в метрах (по умолчанию: 1000)
  limit: 15,           // максимум результатов (по умолчанию: 20)
  categories: ['restaurant']  // или 'restaurant'/'cafe'/'bar' для shorthand
});
```

## Что возвращает

Каждое заведение содержит:

- `name` — название (или "Без названия" если нет имени)
- `lat`, `lon` — координаты
- `amenity` — тип заведения
- `address?` — адрес (если есть в OSM)
- `phone?` — телефон
- `website?` — сайт
- `openingHours?` — часы работы
- `cuisine?` — тип кухни
- `operator?` — оператор/сеть

## Источник данных

- **API**: [Overpass API](https://overpass-api.de/)
- **Данные**: [OpenStreetMap](https://www.openstreetmap.org/)
- **Лицензия**: [ODbL](https://opendatacommons.org/licenses/odbl/)
- **Лимиты**: ~10,000 запросов/день на основном инстансе
- **API ключ**: не требуется

## Ограничения

- **Нет рейтингов и отзывов** — OSM не агрегирует пользовательские оценки
- **Качество данных варьируется** — в Москве и Петербурге покрытие хорошее, в малых городах может быть_sparse
- **Не все поля заполнены** — телефон, сайт, часы работы зависят от участников OSM

## Альтернативы для production

Если нужны рейтинги и полные данные:

- **2GIS API** — лучшие данные для российских городов, но требует API key и платную лицензию
- **Яндекс.Карты Places API** — отлично для встроенных карт, но результаты должны отображаться на Яндекс.Карте

`osm-nearby` — лучший free/no-key вариант для базового nearby-поиска.
