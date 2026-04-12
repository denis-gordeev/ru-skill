# osm-nearby

Поиск ближайших заведений (рестораны, кафе, бары) через публичный Overpass API OpenStreetMap.

## Что умеет

- Искать ближайшие заведения по координатам в радиусе до 40 км
- Фильтровать по категориям: рестораны, кафе, бары, фастфуд и другие amenity-типы
- Возвращать детали: название, адрес, телефон, сайт, часы работы, тип кухни
- Работать без API ключа и без авторизации

## Быстрый старт

```javascript
const { searchNearby, searchRestaurants, searchCafes, searchBars } = require("osm-nearby");

// Рестораны в центре Москвы в радиусе 1 км
const restaurants = await searchRestaurants(55.7558, 37.6173, {
  radius: 1000,
  limit: 15
});

// Кафе в центре Петербурга
const cafes = await searchCafes(59.9343, 30.3351, {
  radius: 500
});

// Бары с расширенным поиском
const bars = await searchBars(55.7558, 37.6173, {
  radius: 2000,
  limit: 10
});
```

## Функции

### `searchNearby(lat, lon, options?)`

Поиск заведений по координатам.

**Параметры:**
- `lat` (number): Широта
- `lon` (number): Долгота
- `options` (object, необязательно):
  - `radius` (number): Радиус поиска в метрах (по умолчанию: 1000)
  - `categories` (string[] | 'restaurant' | 'cafe' | 'bar'): Типы amenity (по умолчанию: ['restaurant', 'cafe', 'bar'])
  - `limit` (number): Максимум результатов (по умолчанию: 20)

**Возвращает:** Массив объектов заведений с полями `name`, `lat`, `lon`, `amenity`, `address?`, `phone?`, `website?`, `openingHours?`, `cuisine?`.

### `searchRestaurants(lat, lon, options?)`

Поиск ресторанов (включает `restaurant`, `fast_food`, `food_court`).

### `searchCafes(lat, lon, options?)`

Поиск кафе (включает `cafe`, `biergarten`, `ice_cream`).

### `searchBars(lat, lon, options?)`

Поиск баров (включает `bar`, `pub`, `nightclub`).

### `getPlaceDetails(osmNodeId)`

Получить детали заведения по OSM ID.

**Возвращает:** Объект заведения или `null`.

## Источник данных

Используется [Overpass API](https://overpass-api.de/) для запросов к данным OpenStreetMap. API ключ не требуется.

- Основной endpoint: `https://overpass-api.de/api/interpreter`
- Лимиты: ~10,000 запросов/день
- Лицензия данных: [ODbL](https://www.openstreetmap.org/copyright)

## Ограничения

- Нет рейтингов и отзывов (в отличие от курируемых сервисов)
- Качество данных варьируется по регионам (лучше в крупных городах)
- Не все заведения имеют полные метаданные (телефон, сайт и т.д.)

## Пример ответа

```json
{
  "name": "Кафе Пушкинъ",
  "lat": 55.7558,
  "lon": 37.6173,
  "amenity": "restaurant",
  "address": "Тверской бульвар, 26, Москва",
  "phone": "+7 495 123-45-67",
  "website": "https://cafe-pushkin.ru",
  "openingHours": "Mo-Su 10:00-23:00",
  "cuisine": "russian"
}
```
