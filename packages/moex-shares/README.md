# moex-shares

Read-only Node.js client for Moscow Exchange ISS share metadata and delayed market snapshots.

## Install

```bash
npm install moex-shares
```

## Official surfaces

- ISS overview: `https://www.moex.com/a8531`
- Share security endpoint: `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER.json`

## Usage

```js
const { getSecurityOverview, listShares } = require("moex-shares");

(async () => {
  const sber = await getSecurityOverview("SBER");
  const page = await listShares();

  console.log(sber.marketData.lastPrice);
  console.log(page.items[0]);
})();
```

## API

### `getSecurityOverview(secId, options?)`

- `secId`: тикер акции Московской биржи, например `SBER`, `GAZP`, `LKOH`
- `options.board`: board id, по умолчанию `TQBR`

### `listShares(options?)`

- Возвращает страницу тикеров и кратких метаданных для board `TQBR`
- `options.start` по умолчанию равен `0`

## Notes

- ISS API read-only и публично доступен без секретов.
- Данные по умолчанию приходят с задержкой, как на публичной поверхности MOEX ISS.
- Пакет нормализует только акции рынка `stock/shares`, без облигаций, валюты и срочного рынка.
