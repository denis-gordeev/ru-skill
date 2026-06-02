# k-lotto

`k-lotto` - legacy-пакет для результатов корейской лотереи 6/45 через официальные страницы и JSON-ответы Dhlottery.

## Граничное примечание

Этот пакет остаётся `legacy-only`: для российских публичных сценариев его замена уже реализована как `stoloto-lotto`. `k-lotto` сохраняется только ради обратной совместимости и не должен продвигаться как новый пользовательский сценарий `ru-skill`.

## Установка

После публикации:

```bash
npm install k-lotto
```

При локальной разработке в этом репозитории:

```bash
npm install
```

## Пример

```js
const lotto = require("k-lotto");

async function main() {
  const latestRound = await lotto.getLatestRound();
  const detail = await lotto.getDetailResult(latestRound);
  const checked = await lotto.checkNumber(latestRound, [3, 10, 14, 15, 23, 24]);

  console.log({ latestRound, detail, checked });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Публичный API

- `getLatestRound()`
- `getResult(round)`
- `getDetailResult(round)`
- `checkNumber(round, ticketNumbers)`
- `evaluateTicket(detailResult, ticketNumbers)`
