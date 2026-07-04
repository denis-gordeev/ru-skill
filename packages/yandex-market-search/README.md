# yandex-market-search

Клиент только для чтения для поиска товаров и карточек товаров на страницах, сгенерированных на сервере [Яндекс Маркета](https://market.yandex.ru/).

## Установка

```bash
npm install yandex-market-search
```

## Использование

### Поиск товаров

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

### Карточка товара

```js
const { getProduct } = require("yandex-market-search");

const product = await getProduct(
  "https://market.yandex.ru/card/smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim/5268004944"
);

console.log(product.title);
// "Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный)"
```

## Справочник API

### `searchProducts(query, opts?)`

Поиск по страницам выдачи Яндекс Маркета, возвращает нормализованные карточки из органических результатов.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `page` | number | `1` | Номер страницы результатов |
| `fetcher` | function | глобальный `fetch` | Пользовательская реализация запросов для тестов |

Возвращает `{query, source, page, results}`, где каждый результат содержит `productId`, `title`, `price`, `rating`, `reviewCount`, `url`, `imageUrl` и топ `specs`.

### `getProduct(productUrl, opts?)`

Получение карточки товара по полному или относительному URL Яндекс Маркета.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `fetcher` | function | глобальный `fetch` | Пользовательская реализация запросов для тестов |

Возвращает `{productId, title, brand, price, rating, reviewCount, description, specs, source, url}`.

### `buildSearchUrl(query, opts?)`

Формирование публичного URL поиска на Яндекс Маркете.

### `buildProductUrl(slug, productId)`

Формирование канонического URL карточки товара по идентификатору категории и ID.

## Примечания

- API-ключ и авторизация не требуются.
- Пакет работает только с публичным HTML, сгенерированным на сервере.
- Страницы поиска и карточек содержат много параметров отслеживания; возвращаемые URL нормализуются до канонических `/card/{идентификатор_категории}/{id}`.
- Только для чтения: нет корзины, оплаты, избранного или действий с аккаунтом продавца.
