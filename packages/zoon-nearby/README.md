# zoon-nearby

Дополнительный источник для поиска ближайших заведений через публичные страницы Zoon.ru с серверной отрисовкой (SSR, Server-Side Rendering).

## Что делает навык

`zoon-nearby` предоставляет доступ только для чтения к справочнику организаций Zoon.ru для поиска ресторанов, кафе, баров и других заведений по городу и категории. Пакет служит **дополнительным** источником к `osm-nearby` (который использует Overpass API), предлагая более богатые метаданные: рейтинги, отзывы и подробную информацию об организациях.

## Преимущества Zoon.ru

- **Серверная отрисовка (SSR)**: HTML генерируется на сервере и напрямую разбирается
- **Без ключей API**: Публичный доступ только для чтения без авторизации
- **Без защиты от роботов**: Страницы доступны без капчи и блокировок
- **Богатые данные**: Рейтинги, адреса, телефоны, категории, часы работы
- **Российский фокус**: Широкое покрытие российских городов и организаций

## Установка

```bash
npm install zoon-nearby
```

## Использование

```javascript
const { 
  searchRestaurants, 
  searchCafes, 
  searchBars,
  searchByCategory,
  search,
  getBusinessDetails
} = require('zoon-nearby');

// Поиск ресторанов в Москве
const restaurants = await searchRestaurants('Москва');
console.log(restaurants.businesses);
// [
//   {
//     name: 'Кафе Пушкинъ',
//     address: 'Тверской бульвар, 26А, Москва',
//     rating: '4.8',
//     phone: '+7 (495) 123-45-67',
//     category: 'Русская кухня',
//     url: 'https://zoon.ru/msk/restaurants/pushkin'
//   },
//   ...
// ]

// Поиск кафе в Санкт-Петербурге
const cafes = await searchCafes('Санкт-Петербург');

// Поиск баров с пагинацией
const barsPage2 = await searchBars('Москва', { page: 2 });

// Общий поиск
const results = await search('пицца', 'Москва');

// Детали организации
const details = await getBusinessDetails('https://zoon.ru/msk/restaurants/pushkin');
```

## Справочник API

### `searchRestaurants(city, opts?)`

Поиск ресторанов в городе.

- `city` (string): Название города по-русски (например, 'Москва', 'Санкт-Петербург')
- `opts.page` (number, опционально): Номер страницы для пагинации
- Возвращает: `{ businesses, totalCount, pagination, query, page }`

### `searchCafes(city, opts?)`

Поиск кафе в городе. Параметры аналогичны `searchRestaurants`.

### `searchBars(city, opts?)`

Поиск баров в городе. Параметры аналогичны `searchRestaurants`.

### `searchByCategory(city, category, opts?)`

Поиск по произвольной категории.

- `city` (string): Название города
- `category` (string): Идентификатор категории (например, 'restaurants', 'hotels', 'pharmacies')
- `opts.page` (number, опционально): Номер страницы
- Возвращает: `{ businesses, totalCount, pagination, query, page }`

### `search(query, city?, opts?)`

Общий поиск на Zoon.ru.

- `query` (string): Поисковый запрос
- `city` (string, опционально): Городской контекст
- `opts.page` (number, опционально): Номер страницы
- Возвращает: `{ businesses, totalCount, pagination, query, page }`

### `getBusinessDetails(businessUrl, opts?)`

Подробная информация о конкретной организации.

- `businessUrl` (string): Полный URL страницы организации на Zoon.ru
- Возвращает: `{ name, address, rating, phone, category, description, website, hours, url }`

## Формат ответа

### Карточка организации

```javascript
{
  name: 'Кафе Пушкинъ',
  address: 'Тверской бульвар, 26А, Москва',
  rating: '4.8',
  phone: '+7 (495) 123-45-67',
  category: 'Русская кухня',
  url: 'https://zoon.ru/msk/restaurants/pushkin'
}
```

### Результаты поиска

```javascript
{
  businesses: [ /* карточки организаций */ ],
  totalCount: 1234,
  pagination: {
    hasNextPage: true,
    nextPage: 2,
    pages: [ /* ссылки на страницы */ ]
  },
  query: 'Москва рестораны',
  page: 1
}
```

## Лицензия

MIT
