# Результаты РПЛ

Навык для получения турнирной таблицы и результатов матчей Российской Премьер-Лиги через публичные страницы championat.com.

## Обзор

Этот навык позволяет получать:

- Текущую турнирную таблицу РПЛ (место, команда, игры, победы, ничьи, поражения, мячи, очки)
- Результаты прошедших матчей (дата, команды, счёт)

Данные берут с championat.com — крупного российского спортивного портала.

## Когда использовать

- Пользователь спрашивает: «Какое место у <команды> в таблице РПЛ?»
- Нужен счёт конкретного матча РПЛ
- Запрос касается российских футбольных турниров (Премьер-Лига, РПЛ)
- Нужна статистика сезона: кто лидирует, сколько очков у команд

## Когда НЕ использовать

- Для других лиг (ФНЛ, КХЛ, баскетбол) — навык работает только с РПЛ
- Для live-матчей и онлайн-обновлений — данные обновляются после окончания матчей
- Для статистики игроков (бомбардиры, ассистенты) — только командная статистика

## Как это работает

Навык читает публичные HTML-страницы championat.com и извлекает структурированные данные:

- Турнирная таблица: `/football/_russiapl/tournament/5980/table/`
- Результаты матчей: `/football/_russiapl/tournament/5980/results/`

Парсинг происходит через regex-выражения без зависимости от DOM-парсеров.

## Установка

```bash
npm install -g rpl-results
```

## Примеры использования

### Получить турнирную таблицу

```js
const { getStandings } = await import("rpl-results");

const { season, standings } = await getStandings();
console.log(`РПЛ сезон ${season}:`);
standings.slice(0, 5).forEach((team) => {
  console.log(
    `${team.rank}. ${team.team} — ${team.points} очков ` +
      `(${team.wins}В/${team.draws}Н/${team.losses}П, мячи ${team.goalsFor}-${team.goalsAgainst})`
  );
});
```

### Получить результаты матчей

```js
const { getResults } = await import("rpl-results");

const { matches } = await getResults();
matches.slice(0, 5).forEach((match) => {
  console.log(
    `${match.date}: ${match.homeTeam} ${match.homeScore}:${match.awayScore} ${match.awayTeam}`
  );
});
```

### Найти конкретную команду в таблице

```js
const { getStandings } = await import("rpl-results");

const { standings } = await getStandings();
const team = standings.find((t) => t.team.toLowerCase().includes("зенит"));
if (team) {
  console.log(`${team.team}: ${team.rank} место, ${team.points} очков`);
}
```

## Структура данных

### Standings (турнирная таблица)

```ts
{
  season: string;        // "2024/25"
  source: string;        // "championat.com"
  standings: Array<{
    rank: number;        // Место в таблице
    team: string;        // Название команды
    played: number;      // Сыгранные матчи
    wins: number;        // Победы
    draws: number;       // Ничьи
    losses: number;      // Поражения
    goalsFor: number;    // Забитые мячи
    goalsAgainst: number;// Пропущенные мячи
    goalDifference: number; // Разница мячей
    points: number;      // Очки
  }>;
}
```

### Match results (результаты матчей)

```ts
{
  season: string;        // "2024/25"
  source: string;        // "championat.com"
  matches: Array<{
    date: string;        // Дата матча (DD.MM.YYYY)
    homeTeam: string;    // Домашняя команда
    awayTeam: string;    // Гостевая команда
    homeScore: number;   // Счёт домашней команды
    awayScore: number;   // Счёт гостевой команды
  }>;
}
```

## Требования

- Node.js 18+ (для встроенного `fetch`)
- Доступ к championat.com (без авторизации)
- **Секреты не нужны**

## Ограничения и риски

- championat.com может изменить структуру HTML — тогда нужно обновить парсер
- Данные обновляются после окончания матчей, не в реальном времени
- championat.com — агрегатор, не официальный источник РПЛ
- Для официальных данных используйте premierliga.ru (требует JS-рендеринга)

## Готово, когда

- [x] Возвращается структура standings с rank, team, played, wins, draws, losses, goalsFor/Against, points
- [x] Возвращается список matches с date, homeTeam, awayTeam, homeScore, awayScore
- [x] Данные парсятся с championat.com без авторизации и секретов
- [x] Fixture-based тесты покрывают оба сценария

## Связанные навыки

- [`kinopoisk-search`](kinopoisk-search.md) — поиск фильмов через Кинопоиск (российский спорт и развлечения)
- [`yandex-rasp`](yandex-rasp.md) — расписания транспорта через Яндекс.Расписания
