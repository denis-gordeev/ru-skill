# kleague-results

`kleague-results` - устаревший клиент только для чтения для официальных адресов K League в формате JSON. Пакет отдаёт результаты матчей по дате и текущую таблицу, не прибегая к разбору HTML.

## Граничное примечание

Этот пакет остаётся `устаревший без развития`: для российских футбольных сводок его замена уже реализована как `rpl-results`. `kleague-results` сохраняется ради обратной совместимости, но не должен подаваться как незавершённый перечень задач целевой линейки.

## Установка

```bash
npm install kleague-results
```

## Официальные интерфейсы

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

## Справочник программного интерфейса

### `getMatchResults(date, options)`

- `date`: `YYYY-MM-DD` или `Date`
- `options.leagueId`: `1`, `2`, `K리그1`, `K리그2`
- `options.team`: короткое имя, полное имя или код-псевдоним команды

### `getStandings(options)`

- `options.leagueId`: `1` или `2`
- `options.year`: сезонный год, по умолчанию текущий год по корейскому времени

### `getKLeagueSummary(date, options)`

- Возвращает результаты за дату и `standings` в одном ответе.

## Возвращаемые значения

### Результат матча (`matches[].*`)

Каждый матч содержит объект `status` с полями:

- `state` (состояние): программный идентификатор статуса матча. Возможные значения: `"finished"` (завершён), `"scheduled"` (запланирован), `"live"` (в процессе), `"halftime"` (перерыв), `"postponed"` (отложен), `"cancelled"` (отменён).
- `label`: русская метка статуса (например, `"Завершён"`, `"Запланирован"`).
- `finished`: `true`, если матч завершён.

Поле `winner` (победитель): программный идентификатор исхода матча. Возможные значения: `"home"` (победа хозяев), `"away"` (победа гостей), `"draw"` (ничья), `null` (матч не завершён или счёт неизвестен). Рядом всегда возвращается `winnerLabel` с русской меткой.

## Примечания

- Официальный поток JSON проще и устойчивее, чем разбор HTML.
- `getScheduleList.do` отдаёт месяц целиком, поэтому библиотека дополнительно фильтрует точную дату.
- `teamRank.do` читает текущую турнирную таблицу в режиме `stadium=all`.
