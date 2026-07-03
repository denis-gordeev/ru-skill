# toss-securities

`toss-securities` - это обёртка только для чтения над `tossctl` из `JungHoonGhae/tossinvest-cli`. Пакет нормализует сценарий установки, входа и чтения данных, но сознательно не открывает торговые команды изменения состояния.

## Граничное примечание

Этот пакет остаётся `устаревший без развития`: прямая российская замена для авторизованных брокерских сценариев не подтверждена, а публичные рыночные сводки только для чтения уже покрываются `moex-shares`. Поэтому `toss-securities` сохраняется ради обратной совместимости и не должен выглядеть как скрытый кандидат целевой линейки.

## Установка

Сначала поставить исходный интерфейс командной строки и выполнить вход:

```bash
brew tap JungHoonGhae/tossinvest-cli
brew install tossctl
tossctl doctor
tossctl auth doctor
tossctl auth login
```

Затем установить пакет:

```bash
npm install toss-securities
```

## Поддерживаемые функции только для чтения

- `listAccounts()`
- `getAccountSummary()`
- `getPortfolioPositions()`
- `getPortfolioAllocation()`
- `getQuote(symbol)`
- `getQuoteBatch(symbols)`
- `listOrders()`
- `listCompletedOrders({ market })`
- `listWatchlist()`

Каждая вспомогательная функция внутри вызывает `tossctl ... --output json` и возвращает `commandName`, `bin`, `args`, `data`.

Базовые команды `tossctl`:

- `tossctl account summary --output json`
- `tossctl quote get TSLA --output json`
- `tossctl watchlist list --output json`

## Пример

```js
const {
  getAccountSummary,
  getQuote,
  listWatchlist
} = require("toss-securities");

async function main() {
  const summary = await getAccountSummary({
    configDir: "/Users/me/.config/tossctl"
  });
  const quote = await getQuote("TSLA");
  const watchlist = await listWatchlist();

  console.log(summary.data);
  console.log(quote.data);
  console.log(watchlist.data);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Что намеренно не поддерживается

- `tossctl order place`
- `tossctl order cancel`
- `tossctl order amend`
- permission grant/revoke

Пакет остаётся только сценарием чтения. Команды, которые могут повлиять на реальную сделку, не оборачиваются и не обходят защитный механизм исходного интерфейса командной строки.
