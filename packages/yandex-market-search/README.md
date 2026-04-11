# yandex-market-search

Read-only client for product search and product cards on server-rendered [Yandex Market](https://market.yandex.ru/) pages.

## Install

```bash
npm install yandex-market-search
```

## Usage

### Search products

```js
const { searchProducts } = require("yandex-market-search");

const results = await searchProducts("iphone 16");

console.log(results.results[0]);
// {
//   productId: "103572164696",
//   title: "Смартфон Apple iPhone 16 128 ГБ, Dual: nano SIM + eSIM, Черный (без RuStore)",
//   price: { amount: 65172, currency: "RUB" },
//   rating: "4.9",
//   reviewCount: "6.9K",
//   url: "https://market.yandex.ru/card/...",
//   imageUrl: "https://avatars.mds.yandex.net/...",
//   specs: [...]
// }
```

### Fetch a product card

```js
const { getProduct } = require("yandex-market-search");

const product = await getProduct(
  "https://market.yandex.ru/card/smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim/5268004944"
);

console.log(product.title);
// "Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный)"
```

## API

### `searchProducts(query, opts?)`

Searches Yandex Market SERP pages and returns normalized cards from organic results.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | number | `1` | Results page number |
| `fetcher` | function | global `fetch` | Custom fetch implementation for tests |

Returns `{query, source, page, results}` where each result includes `productId`, `title`, `price`, `rating`, `reviewCount`, `url`, `imageUrl`, and top inline `specs`.

### `getProduct(productUrl, opts?)`

Fetches a product card page by full or relative Yandex Market URL.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `fetcher` | function | global `fetch` | Custom fetch implementation for tests |

Returns `{productId, title, brand, price, rating, reviewCount, description, specs, source, url}`.

### `buildSearchUrl(query, opts?)`

Builds a public search URL for Yandex Market.

### `buildProductUrl(slug, productId)`

Builds a canonical product card URL from a known slug and product ID.

## Notes

- No API key or authorization is required.
- This package intentionally works only with publicly accessible server-rendered HTML.
- Search and card pages include a lot of tracking parameters; returned URLs are normalized to canonical `/card/{slug}/{id}` links.
- Read-only only: no cart, checkout, favorites, or merchant account actions.
