# osm-nearby

Клиент только для чтения для поиска ближайших заведений через публичный Overpass API OpenStreetMap.

## Возможности

- Поиск ближайших ресторанов, кафе, баров и других заведений по координатам
- Бесплатный доступ, без API-ключа
- Глобальное покрытие через OpenStreetMap
- Возвращает детали: название, адрес, телефон, сайт, часы работы, тип кухни

## Использование

```javascript
const { searchNearby, searchRestaurants, searchCafes, searchBars, getPlaceDetails } = require("osm-nearby");

// Поиск всех заведений общепита в радиусе 1 км
const places = await searchNearby(55.7558, 37.6173, {
  radius: 1000,
  categories: ['restaurant', 'cafe', 'bar'],
  limit: 20
});

// Поиск только ресторанов в радиусе 2 км
const restaurants = await searchRestaurants(55.7558, 37.6173, {
  radius: 2000,
  limit: 10
});

// Детали конкретного заведения по OSM node ID
const details = await getPlaceDetails(1234567890);
```

## API

### `searchNearby(lat, lon, options?)`

Поиск ближайших заведений по координатам.

**Параметры:**
- `lat` (number): Широта
- `lon` (number): Долгота
- `options` (object, опционально):
  - `radius` (number): Радиус поиска в метрах (по умолчанию: 1000)
  - `categories` (string[] | 'restaurant' | 'cafe' | 'bar'): Типы заведений (по умолчанию: ['restaurant', 'cafe', 'bar'])
  - `limit` (number): Максимальное число результатов (по умолчанию: 20)

**Возвращает:** Массив объектов с `name`, `lat`, `lon`, `amenity`, `address?`, `phone?`, `website?`, `openingHours?`, `cuisine?`.

### `searchRestaurants(lat, lon, options?)`

Поиск ближайших ресторанов (включает `restaurant`, `fast_food`, `food_court`).

### `searchCafes(lat, lon, options?)`

Поиск ближайших кафе (включает `cafe`, `biergarten`, `ice_cream`).

### `searchBars(lat, lon, options?)`

Поиск ближайших баров (включает `bar`, `pub`, `nightclub`).

### `getPlaceDetails(osmNodeId)`

Получение деталей конкретного заведения по OSM element ID.

**Возвращает:** Объект заведения или `null`, если не найден.

## Источник данных

Пакет использует [Overpass API](https://overpass-api.de/) для запросов к данным OpenStreetMap. API-ключ не требуется.

- Основной эндпоинт: `https://overpass-api.de/api/interpreter`
- Лимиты: ~10 000 запросов/день на основном экземпляре
- Лицензия данных: [ODbL](https://www.openstreetmap.org/copyright)

## Ограничения

- Нет рейтингов и отзывов (в отличие от курируемых сервисов)
- Качество данных зависит от региона (лучше в крупных городах)
- Не у всех заведений заполнены все метаданные (телефон, сайт и т.д.)
