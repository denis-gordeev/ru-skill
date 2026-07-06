# moex-shares

Клиент только для чтения для публичного ISS API Московской биржи: метаданные акций и задержанные рыночные снимки.

## Установка

```bash
npm install moex-shares
```

## Официальные интерфейсы

- Обзор ISS: `https://www.moex.com/a8531`
- Конечная точка акций: `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER.json`

## Использование

```js
const { getSecurityOverview, listShares } = require("moex-shares");

(async () => {
  const sber = await getSecurityOverview("SBER");
  const page = await listShares();

  console.log(sber.marketData.lastPrice);
  console.log(page.items[0]);
})();
```

## Справочник API

### `getSecurityOverview(secId, options?)`

- `secId`: тикер акции Московской биржи, например `SBER`, `GAZP`, `LKOH`
- `options.board`: идентификатор доски, по умолчанию `TQBR`

### `listShares(options?)`

- Возвращает страницу тикеров и кратких метаданных для board `TQBR`
- `options.start` по умолчанию равен `0`

## Примечания

- ISS API доступен только для чтения и публично доступен без секретов.
- Данные по умолчанию приходят с задержкой, как на публичном интерфейсе MOEX ISS.
- Пакет нормализует только акции рынка `stock/shares`, без облигаций, валюты и срочного рынка.
