# toss-securities

`toss-securities` - это read-only tossctl wrapper, то есть read-only обёртка над `tossctl` из `JungHoonGhae/tossinvest-cli`. Пакет нормализует install/login/read flow, но сознательно не открывает торговые mutation-команды.

## Boundary note

Этот пакет остаётся `legacy-only`: прямой российский replacement для авторизованных брокерских сценариев не подтверждён, а публичные рыночные read-only сводки уже покрываются `moex-shares`. Поэтому `toss-securities` сохраняется ради backward compatibility и не должен выглядеть как скрытый target-кандидат.

## Установка

Сначала поставить upstream CLI и пройти логин:

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

## Поддерживаемые read-only helpers

- `listAccounts()`
- `getAccountSummary()`
- `getPortfolioPositions()`
- `getPortfolioAllocation()`
- `getQuote(symbol)`
- `getQuoteBatch(symbols)`
- `listOrders()`
- `listCompletedOrders({ market })`
- `listWatchlist()`

Каждый helper внутри вызывает `tossctl ... --output json` и возвращает `commandName`, `bin`, `args`, `data`.

Базовые upstream команды:

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

Пакет остаётся только `read-only`. Команды, которые могут повлиять на реальную сделку, не оборачиваются и не обходят upstream safety gate.
