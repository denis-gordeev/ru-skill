---
name: rpl-results
description: Результаты матчей и турнирная таблица Российской Премьер-Лиги через публичные страницы championat.com
metadata:
  category: sports
  locale: ru
  phase: target
---

# rpl-results

Результаты матчей и турнирная таблица РПЛ через championat.com.

## Когда использовать

- Пользователь спрашивает текущую таблицу РПЛ, очки команды или место в таблице.
- Нужны результаты прошедших туров, счёт конкретного матча.
- Запрос касается российских футбольных турниров (РПЛ, Премьер-Лига).

## Что умеет этот навык

- `getStandings()` — текущая турнирная таблица: место, команда, игры, победы, ничьи, поражения, мячи, очки.
- `getResults()` — результаты прошедших матчей: дата, команды, счёт.

## Как запустить

```bash
npm install -g rpl-results
```

## Примеры использования

### Турнирная таблица

```js
const { getStandings } = await import("rpl-results");
const { standings, season } = await getStandings();
console.log(`РПЛ ${season}:`);
standings.slice(0, 3).forEach((t) => {
  console.log(`${t.rank}. ${t.team} — ${t.points} очков (${t.played} игр)`);
});
```

### Результаты матчей

```js
const { getResults } = await import("rpl-results");
const { matches } = await getResults();
matches.slice(0, 5).forEach((m) => {
  console.log(`${m.date}: ${m.homeTeam} ${m.homeScore}:${m.awayScore} ${m.awayTeam}`);
});
```

## Готово, когда

- [x] Возвращается структура standings с rank, team, played, wins, draws, losses, goalsFor/Against, points.
- [x] Возвращается список matches с date, homeTeam, awayTeam, homeScore, awayScore.
- [x] Данные парсятся с championat.com без авторизации и секретов.

## Возможные ошибки

- championat.com недоступен или вернул ошибку — выбрасывается `Error` с кодом статуса.
- Изменилась структура HTML на championat.com — нужно обновить `parse.js`.

## Примечания

- Это read-only источник, без записи, авторизации или пользовательских данных.
- championat.com — публичный спортивный агрегатор, не официальный источник РПЛ.
- Для официальных данных используйте premierliga.ru (требует JS-рендеринга).
