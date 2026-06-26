# Поиск поблизости Zoon.ru

Поиск ближайших заведений и организаций через публичные страницы Zoon.ru.

## Что делает навык

`zoon-nearby` — это дополнительный источник для поиска заведений (рестораны, кафе, бары, отели, аптеки) в российских городах через серверно отрендеренные страницы Zoon.ru. Этот навык дополняет `osm-nearby` (Overpass API), предоставляя более подробную информацию: рейтинги, отзывы, телефоны, режим работы.

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

// Детальная информация о заведении
const details = await getBusinessDetails('https://zoon.ru/msk/restaurants/pushkin');
```

## API-справочник

### `searchRestaurants(city, opts?)`

Поиск ресторанов в городе.

- `city` (string): Название города на русском (например, 'Москва', 'Санкт-Петербург')
- `opts.page` (number, опционально): Номер страницы для пагинации
- Возвращает: `{ businesses, totalCount, pagination, query, page }`

### `searchCafes(city, opts?)`

Поиск кафе в городе. Те же параметры, что и у `searchRestaurants`.

### `searchBars(city, opts?)`

Поиск баров в городе. Те же параметры, что и у `searchRestaurants`.

### `searchByCategory(city, category, opts?)`

Поиск по произвольной категории.

- `city` (string): Название города
- `category` (string): Слаг категории (например, 'restaurants', 'hotels', 'pharmacies')
- `opts.page` (number, опционально): Номер страницы
- Возвращает: `{ businesses, totalCount, pagination, query, page }`

### `search(query, city?, opts?)`

Общий поиск по Zoon.ru.

- `query` (string): Поисковый запрос
- `city` (string, опционально): Город для контекста
- `opts.page` (number, опционально): Номер страницы
- Возвращает: `{ businesses, totalCount, pagination, query, page }`

### `getBusinessDetails(businessUrl, opts?)`

Получение детальной информации о конкретном заведении.

- `businessUrl` (string): Полный URL страницы заведения на Zoon.ru
- Возвращает: `{ name, address, rating, phone, category, description, website, hours, url }`

## Формат ответа

### Карточка заведения

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
  businesses: [ /* карточки заведений */ ],
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

## Почему Zoon.ru?

- **Серверно отрендеренные страницы (SSR)**: HTML генерируется на сервере и напрямую парсится
- **Без API ключей**: Публичный доступ без аутентификации
- **Без антибота**: Страницы доступны без CAPTCHA или блокировок
- **Богатые данные**: Рейтинги, адреса, телефоны, категории, режим работы
- **Российский фокус**: Хорошее покрытие российских городов и заведений

## Технические детали

- **Источник**: Zoon.ru (публичные серверно отрендеренные страницы)
- **API-ключи**: Не требуются
- **Антибот**: Отсутствует
- **Метод**: Парсинг HTML с серверно отрендеренных страниц
- **Лимиты**: Разумное использование, кэширование при частых запросах

## Связанные навыки

- `osm-nearby` — основной источник для поиска ближайших через Overpass API (OSM)
- `yandex-market-search` — поиск товаров через Яндекс Маркет

## Лицензия

MIT
