# Гайд по результатам KBO

## Что умеет этот сценарий

- Получать расписание матчей KBO на выбранную дату.
- Показывать результаты матчей и счёт.
- Оставлять только игры конкретной команды.

## Что нужно заранее

- Node.js 18+
- `npm install -g kbo-game`

## Входные данные

- Дата: `YYYY-MM-DD`
- Необязательно: название команды

## Базовый поток

1. Если пакет не установлен, сначала поставить его глобально, а не искать обходной путь.
2. Запросить матчи на нужную дату.
3. Нормализовать домашнюю и гостевую команду, статус игры и счёт в удобный для чтения вид.
4. Если пользователь просил конкретную команду, отфильтровать список по ней.

## Пример

```bash
GLOBAL_NPM_ROOT="$(npm root -g)" node --input-type=module - <<'JS'
import path from "node:path";
import { pathToFileURL } from "node:url";

const entry = pathToFileURL(
  path.join(process.env.GLOBAL_NPM_ROOT, "kbo-game", "dist", "index.js"),
).href;
const { getGame } = await import(entry);

const date = "2026-03-25";
const games = await getGame(new Date(`${date}T00:00:00+09:00`));
console.log(JSON.stringify(games, null, 2));
JS
```

## Ограничения

- У `kbo-game@0.0.2` рабочий export называется `getGame`; пример с `getGameInfo` из README не сработает.
- `getGame` принимает `Date`, а не строку. Если передать `"YYYY-MM-DD"` напрямую, будет ошибка `date.getFullYear is not a function`.
- В межсезонье ответ может быть пустым.
- Запросы вроде "сегодня" и "вчера" безопаснее сразу переводить в абсолютную дату.
