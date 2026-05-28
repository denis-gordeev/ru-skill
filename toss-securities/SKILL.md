---
name: toss-securities
description: Для запросов к Toss Securities — установка/вход в tossctl из tossinvest-cli, затем просмотр сводки по счёту, портфеля, котировок, истории заказов и списка наблюдения через безопасный read-only поток.
license: MIT
metadata:
  category: finance
  locale: ru-RU
  phase: v1
---

# Toss Securities

## Что делает этот навык

Использует `tossctl` из `JungHoonGhae/tossinvest-cli` для выполнения **только для чтения (read-only)** потока запросов к Toss Securities.

- Список счетов / сводка
- Доля holdings в портфеле
- Котировки одной / нескольких акций
- Незавершённые ордера / история исполненных сделок за месяц
- Список наблюдения

## Когда использовать

- «Покажи сводку по счёту Toss Securities»
- «Проверь котировку TSLA в Toss Securities»
- «Покажи список наблюдения»
- «Посмотри историю исполненных сделок за этот месяц»

## Предварительные требования

- macOS + Homebrew
- `tossctl` установлен
- Сеанс браузера получен через `tossctl auth login`
- Node.js 18+

## Рабочий процесс

### 0. Сначала установить `tossctl` при отсутствии

```bash
brew tap JungHoonGhae/tossinvest-cli
brew install tossctl
tossctl doctor
tossctl auth doctor
tossctl auth login
```

Если сеанс входа отсутствует, сначала завершить этот поток. Не обходить через другой неофициальный скрапинг или произвольную HTTP-реализацию.

### 1. Предпочитать read-only поверхность `tossctl`

Поддерживаемые базовые команды:

- `tossctl account list --output json`
- `tossctl account summary --output json`
- `tossctl portfolio positions --output json`
- `tossctl portfolio allocation --output json`
- `tossctl quote get TSLA --output json`
- `tossctl quote batch TSLA 005930 VOO --output json`
- `tossctl orders list --output json`
- `tossctl orders completed --market all --output json`
- `tossctl watchlist list --output json`

### 2. Использовать локальную обёртку пакета при необходимости скриптинга

```js
const {
  getAccountSummary,
  getQuote,
  listWatchlist
} = require("toss-securities");

async function main() {
  const summary = await getAccountSummary();
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

### 3. Отвечать консервативно

- Номер счёта и чувствительную информацию раскрывать только в необходимом объёме.
- Если пользователь говорит «сегодня» или другую относительную дату, раскрывать её в абсолютную дату.
- Этот навык предназначен только для чтения. Чётко указывать, что реальные торговые операции (mutation) вне области действия.

## Считается выполненным, когда

- Подтверждено состояние установки/входа `tossctl`
- Выполнена соответствующая read-only команда по запросу
- Результат кратко整理ирован

## Режимы сбоев

- Без `tossctl auth login` запросы к счёту/портфелю могут не удастся
- При изменении структуры upstream веб-API может потребоваться обновление самого `tossctl`
- Данные счёта и ордеров чувствительны, поэтому не расширять область вывода чрезмерно
