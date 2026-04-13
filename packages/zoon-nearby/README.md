# zoon-nearby

Supplementary nearby places search via Zoon.ru SSR pages.

## Overview

`zoon-nearby` provides read-only access to Zoon.ru business listings for searching restaurants, cafes, bars, and other establishments by city and category. This package serves as a **supplementary** source to `osm-nearby` (which uses Overpass API), offering richer metadata like ratings, reviews, and detailed business information.

## Why Zoon.ru?

- **SSR pages**: HTML is server-rendered and可以直接 parsed
- **No API keys**: Public read-only access without authentication
- **No anti-bot**: Pages are accessible without CAPTCHA or blocking
- **Rich data**: Ratings, addresses, phones, categories, hours
- **Russian focus**: Strong coverage of Russian cities and businesses

## Installation

```bash
npm install zoon-nearby
```

## Usage

```javascript
const { 
  searchRestaurants, 
  searchCafes, 
  searchBars,
  searchByCategory,
  search,
  getBusinessDetails
} = require('zoon-nearby');

// Search restaurants in Moscow
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

// Search cafes in Saint Petersburg
const cafes = await searchCafes('Санкт-Петербург');

// Search bars with pagination
const barsPage2 = await searchBars('Москва', { page: 2 });

// General search
const results = await search('пицца', 'Москва');

// Get business details
const details = await getBusinessDetails('https://zoon.ru/msk/restaurants/pushkin');
```

## API

### `searchRestaurants(city, opts?)`

Search restaurants in a city.

- `city` (string): City name in Russian (e.g., 'Москва', 'Санкт-Петербург')
- `opts.page` (number, optional): Page number for pagination
- Returns: `{ businesses, totalCount, pagination, query, page }`

### `searchCafes(city, opts?)`

Search cafes in a city. Same parameters as `searchRestaurants`.

### `searchBars(city, opts?)`

Search bars in a city. Same parameters as `searchRestaurants`.

### `searchByCategory(city, category, opts?)`

Search by arbitrary category.

- `city` (string): City name
- `category` (string): Category slug (e.g., 'restaurants', 'hotels', 'pharmacies')
- `opts.page` (number, optional): Page number
- Returns: `{ businesses, totalCount, pagination, query, page }`

### `search(query, city?, opts?)`

General search on Zoon.ru.

- `query` (string): Search term
- `city` (string, optional): City context
- `opts.page` (number, optional): Page number
- Returns: `{ businesses, totalCount, pagination, query, page }`

### `getBusinessDetails(businessUrl, opts?)`

Get detailed information about a specific business.

- `businessUrl` (string): Full Zoon.ru business page URL
- Returns: `{ name, address, rating, phone, category, description, website, hours, url }`

## Response Format

### Business listing

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

### Search results

```javascript
{
  businesses: [ /* business listings */ ],
  totalCount: 1234,
  pagination: {
    hasNextPage: true,
    nextPage: 2,
    pages: [ /* page links */ ]
  },
  query: 'Москва рестораны',
  page: 1
}
```

## License

MIT
