# kleague-results

`kleague-results` - legacy read-only клиент для официальных K League JSON endpoint'ов. Пакет отдаёт результаты матчей по дате и текущую таблицу, не прибегая к HTML scraping.

## Boundary note

Этот пакет остаётся `legacy-only`: для российских футбольных сводок его replacement уже реализован как `rpl-results`. `kleague-results` сохраняется ради backward compatibility, но не должен подаваться как незавершённый target-backlog.

## Установка

```bash
npm install kleague-results
```

## Официальные поверхности

- Расписание и результаты: `https://www.kleague.com/getScheduleList.do`
- Таблица команд: `https://www.kleague.com/record/teamRank.do`

## Пример

```js
const { getKLeagueSummary, getMatchResults, getStandings } = require("kleague-results");

(async () => {
  const results = await getMatchResults("2026-03-22", {
    leagueId: "K리그1",
    team: "FC서울",
  });

  const standings = await getStandings({
    leagueId: 1,
    year: 2026,
  });

  const summary = await getKLeagueSummary("2026-03-22", {
    leagueId: "K리그1",
    team: "FC서울",
    includeStandings: true,
  });

  console.log(results.matches[0]);
  console.log(standings.rows[0]);
  console.log(summary);
})();
```

## API

### `getMatchResults(date, options)`

- `date`: `YYYY-MM-DD` или `Date`
- `options.leagueId`: `1`, `2`, `K리그1`, `K리그2`
- `options.team`: short name, full name или team code alias

### `getStandings(options)`

- `options.leagueId`: `1` или `2`
- `options.year`: сезонный год, по умолчанию текущий год по корейскому времени

### `getKLeagueSummary(date, options)`

- Возвращает результаты за дату и `standings` в одном ответе.

## Примечания

- Официальный JSON поток проще и устойчивее, чем HTML crawling.
- `getScheduleList.do` отдаёт месяц целиком, поэтому библиотека дополнительно фильтрует точную дату.
- `teamRank.do` читает текущую турнирную таблицу в режиме `stadium=all`.
