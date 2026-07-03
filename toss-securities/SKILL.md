---
name: toss-securities
description: Обратно совместимая обёртка только для чтения над tossctl для Toss Securities. Использовать только для существующих корейских брокерских запросов; публичные рыночные данные уже покрываются moex-shares.
license: MIT
metadata:
  category: финансы
  locale: ru-RU
  phase: v1
---

# Брокерские данные Toss Securities

## Граничное примечание

Этот навык остаётся `устаревший без развития`: прямая российская замена для авторизованных брокерских сценариев не подтверждена, а публичные рыночные сводки только для чтения уже покрываются `moex-shares`. `toss-securities` сохраняется ради обратной совместимости с существующими корейскими брокерскими сценариями, но не считается новым целевым направлением `ru-skill`.

## Что делает навык

Использует `tossctl` из `JungHoonGhae/tossinvest-cli` для выполнения **только для чтения** потока запросов к Toss Securities.

- Список счетов / сводка
- Доля позиций в портфеле
- Котировки одной / нескольких акций
- Незавершённые ордера / история исполненных сделок за месяц
- Список наблюдения

## Когда использовать

- «Покажи сводку по счёту Toss Securities»
- «Проверь котировку TSLA в Toss Securities»
- «Покажи список наблюдения»
- «Посмотри историю исполненных сделок за этот месяц»

## Предварительные условия

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

Если сеанс входа отсутствует, сначала завершить этот поток. Не обходить через другой неофициальный сбор данных или произвольную HTTP-реализацию.

### 1. Предпочитать поверхность `tossctl` только для чтения

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

### 2. Использовать локальную обёртку пакета при необходимости написания скриптов

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
- Этот навык предназначен только для чтения. Чётко указывать, что реальные торговые операции (модифицирующие) вне области действия.

## Критерии завершения

- Подтверждено состояние установки/входа `tossctl`
- Выполнена соответствующая команда только для чтения по запросу
- Результат кратко структурирован

## Возможные ошибки

- Без `tossctl auth login` запросы к счёту/портфелю могут не удастся
- При изменении структуры вышестоящего API может потребоваться обновление самого `tossctl`
- Данные счёта и ордеров чувствительны, поэтому не расширять область вывода чрезмерно
