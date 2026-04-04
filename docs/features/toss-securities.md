# Гайд по просмотру данных Toss Securities

## Что умеет этот сценарий

- Читать список счетов и сводку по аккаунту через `tossctl`.
- Показывать позиции портфеля и распределение активов.
- Получать котировки по одному или нескольким тикерам.
- Читать незавершённые и исполненные заявки.
- Показывать watchlist.

## Что нужно заранее

- macOS и Homebrew
- Установленный `tossctl`
- Выполненный `tossctl auth login`
- Node.js 18+

## Установка upstream и логин

Здесь используется готовый `tossctl` из `JungHoonGhae/tossinvest-cli`.

```bash
brew tap JungHoonGhae/tossinvest-cli
brew install tossctl
tossctl doctor
tossctl auth doctor
tossctl auth login
```

Пока логин не завершён, не нужно пытаться читать аккаунт или портфель.

## Поддерживаемые read-only команды

- `tossctl account list --output json`
- `tossctl account summary --output json`
- `tossctl portfolio positions --output json`
- `tossctl portfolio allocation --output json`
- `tossctl quote get TSLA --output json`
- `tossctl quote batch TSLA 005930 VOO --output json`
- `tossctl orders list --output json`
- `tossctl orders completed --market all --output json`
- `tossctl watchlist list --output json`

## Пример на Node.js

```js
const {
  getAccountSummary,
  getPortfolioPositions,
  getQuote,
  listCompletedOrders
} = require("toss-securities");

async function main() {
  const summary = await getAccountSummary();
  const positions = await getPortfolioPositions();
  const quote = await getQuote("TSLA");
  const completed = await listCompletedOrders({ market: "all" });

  console.log(summary.data);
  console.log(positions.data);
  console.log(quote.data);
  console.log(completed.data);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Практические советы

- Для сводки счёта и портфеля нужна живая сессия логина.
- Символы вроде `TSLA`, `VOO`, `005930` можно передавать напрямую.
- В ответах по заявкам ограничивайтесь read-only сводкой и не толкайте пользователя к реальной сделке.
- Для чувствительных данных возвращайте только действительно нужные поля.

## Ограничения

- `tossctl` неофициальный и зависит от внутренних веб-API, которые могут меняться.
- Если браузерная сессия истекла, может потребоваться повторный `tossctl auth login`.
- Пакет `toss-securities` в этом репозитории остаётся read-only обёрткой и не открывает mutation-команды.
