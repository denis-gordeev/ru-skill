# Яндекс Маркет — yandex-market-search

## Что делает навык

`yandex-market-search` — это клиент только для чтения для поиска товаров и чтения карточек товаров на публичных страницах с серверным рендерингом (SSR) Яндекс Маркета. Он нужен как российская замена устаревшего навыка `daiso-product-search`.

## Предварительные условия

- Доступ к `https://market.yandex.ru/`
- Никакие API-ключи, токены или прокси не нужны

## Входные данные

| Сценарий | Вход | Пример |
| --- | --- | --- |
| Поиск товаров | Строка запроса + опционально `page` | `searchProducts("iphone 16")` |
| Карточка товара | URL из результатов поиска | `getProduct("https://market.yandex.ru/card/...")` |

## Рабочий процесс

1. Вызвать `searchProducts("название товара")`
2. Выбрать результат по `title`, `price`, `rating` и встроенным характеристикам
3. Передать `url` в `getProduct(url)` для чтения полной карточки

## Пример ответа — поиск

```json
{
  "query": "iphone 16",
  "source": "market.yandex.ru",
  "page": 1,
  "results": [
    {
      "productId": "103572164696",
      "title": "Смартфон Apple iPhone 16 128 ГБ, Dual: nano SIM + eSIM, Черный (без RuStore)",
      "price": { "amount": 65172, "currency": "RUB" },
      "rating": "4.9",
      "reviewCount": "6.9K",
      "url": "https://market.yandex.ru/card/smartfon-apple-iphone-16-128-gb-dual-nano-sim--esim-chernyy/103572164696",
      "imageUrl": "https://avatars.mds.yandex.net/get-mpic/1.jpeg/orig",
      "specs": [
        { "name": "Диагональ экрана", "value": "6.1\"" },
        { "name": "Встроенная память", "value": "128 ГБ" }
      ]
    }
  ]
}
```

## Пример ответа — карточка товара

```json
{
  "productId": "5268004944",
  "title": "Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный)",
  "brand": "Apple",
  "price": { "amount": 79262, "currency": "RUB" },
  "rating": "4.9",
  "reviewCount": "1555",
  "description": "Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный) на Яндекс Маркете.",
  "specs": [
    { "name": "Артикул Маркета", "value": "5268004944" },
    { "name": "Бренд", "value": "Apple" },
    { "name": "Встроенная память", "value": "256 ГБ" },
    { "name": "Диагональ экрана", "value": "6.1\"" }
  ],
  "source": "market.yandex.ru",
  "url": "https://market.yandex.ru/card/smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim/5268004944"
}
```

## Что важно проверять в ответе

- `url` должен быть каноническим `/card/{slug}/{id}` без отслеживающих параметров запроса
- `price.amount` — целое число в рублях
- `rating` и `reviewCount` могут быть строками, потому что Маркет публикует и сокращённые значения вроде `6.9K`
- `specs` — верхние встроенные характеристики в выдаче и первые полные характеристики на карточке

## Ограничения

- Это не официальный публичный API, а HTML-поверхность Яндекс Маркета
- Программа разбора опирается на текущую сгенерированную на сервере вёрстку (SSR). При сильном изменении шаблонов нужен новый раунд эталонных данных
- Не покрываются корзина, оформление заказа, отзывы, сравнение магазинов и сценарии со стороны продавца
