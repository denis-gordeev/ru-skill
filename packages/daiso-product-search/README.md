# daiso-product-search

`daiso-product-search` - устаревший пакет только для чтения для поиска товаров и остатков для самовывоза в Daiso Mall по официальным веб-поверхностям.

## Граничное примечание

Этот пакет остаётся `устаревший без развития`: для российского обнаружения на маркетплейсе его замена уже реализована как `yandex-market-search`. `daiso-product-search` сохраняется ради обратной совместимости и как эталонный сценарий для потоков магазин/товар/наличие, но не должен выглядеть как активный трек целевой линейки репозитория.

## Установка

После публикации:

```bash
npm install daiso-product-search
```

При локальной разработке в этом репозитории:

```bash
npm install
```

## Принципы использования

- Нужны и `storeQuery`, и `productQuery`.
- Приоритет всегда у официальных Daiso Mall поверхностей.
- Подтверждённый сценарий здесь именно про остатки для самовывоза.
- Если официальный источник не отдаёт расположение товара внутри магазина, отвечать только про остатки.

## Пример

```js
const { lookupStoreProductAvailability } = require("daiso-product-search");

async function main() {
  const result = await lookupStoreProductAvailability({
    storeQuery: "강남역2호점",
    productQuery: "VT 리들샷 100",
    productLimit: 10
  });

  console.log(result.selectedStore);
  console.log(result.selectedProduct);
  console.log(result.pickupStock);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Проверочный пример

На 2026-03-27 комбинация `storeQuery=강남역2호점` и `productQuery=VT 리들샷 100` вернула через официальную поверхность следующие магазин/товар/наличие данные:

```json
{
  "selectedStore": {
    "strCd": "10224",
    "name": "강남역2호점"
  },
  "selectedProduct": {
    "pdNo": "1049275",
    "displayName": "VT 리들샷 100 페이셜 부스팅 퍼스트 앰플 2ml*6개입"
  },
  "pickupStock": {
    "strCd": "10224",
    "pdNo": "1049275",
    "quantity": 0,
    "inStock": false
  }
}
```

## API-справочник

- `searchStores(query, options?)`
- `getStoreDetail(strCd, options?)`
- `searchProducts(query, options?)`
- `getStorePickupStock({ pdNo, strCd }, options?)`
- `getOnlineStock({ pdNo, onldPdNo? }, options?)`
- `lookupStoreProductAvailability({ storeQuery, productQuery, ...options })`

Если `SearchGoods` отдаёт `onldPdNo`, его можно без преобразований передать в `getOnlineStock()` для дополнительной онлайн-проверки.
