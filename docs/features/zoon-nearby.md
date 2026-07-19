# Поиск поблизости Zoon.ru

Поиск ближайших заведений и организаций через публичные страницы Zoon.ru.

## Что делает навык

`zoon-nearby` — это дополнительный источник для поиска заведений (рестораны, кафе, бары, отели, аптеки) в российских городах через страницы Zoon.ru с серверной отрисовкой (SSR). Этот навык дополняет `osm-nearby` (Overpass API), предоставляя более подробную информацию: рейтинги, отзывы, телефоны, режим работы.

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

// Поиск баров с постраничной навигацией
const barsPage2 = await searchBars('Москва', { page: 2 });

// Общий поиск
const results = await search('пицца', 'Москва');

// Детальная информация о заведении
const details = await getBusinessDetails('https://zoon.ru/msk/restaurants/pushkin');
```

## Справочник API

### `searchRestaurants(city, opts?)`

Поиск ресторанов в городе.

- `city` (string): Название города на русском (например, 'Москва', 'Санкт-Петербург')
- `opts.page` (number, опционально): Номер страницы для постраничной навигации
- Возвращает: `{ businesses, totalCount, pagination, query, page }`

### `searchCafes(city, opts?)`

Поиск кафе в городе. Те же параметры, что и у `searchRestaurants`.

### `searchBars(city, opts?)`

Поиск баров в городе. Те же параметры, что и у `searchRestaurants`.

### `searchByCategory(city, category, opts?)`

Поиск по произвольной категории.

- `city` (string): Название города
- `category` (string): Идентификатор категории (например, 'restaurants', 'hotels', 'pharmacies')
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

- `businessUrl` (string): Полный адрес страницы заведения на Zoon.ru
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

- **Страницы с серверной отрисовкой (SSR)**: HTML генерируется на сервере и напрямую разбирается
- **Без ключей API**: Публичный доступ без проверки подлинности
- **Без защиты от роботов**: Страницы доступны без проверки на робота или блокировок
- **Богатые данные**: Рейтинги, адреса, телефоны, категории, режим работы
- **Российский фокус**: Хорошее покрытие российских городов и заведений

## Технические детали

- **Источник**: Zoon.ru (публичные страницы с серверной отрисовкой (SSR))
- **ключи API**: Не требуются
- **Защита от роботов**: Отсутствует
- **Метод**: Разбор HTML со страниц с серверной отрисовкой (SSR)
- **Лимиты**: Разумное использование, буферизация при частых запросах

## Связанные навыки

- `osm-nearby` — основной источник для поиска ближайших через Overpass API (OSM)
- `yandex-market-search` — поиск товаров через Яндекс Маркет

## Лицензия

MIT
