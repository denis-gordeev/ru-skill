# Гайд по результатам K League

## Что умеет этот сценарий

- Показывать расписание и результаты матчей K League 1 и K League 2 по дате.
- Фильтровать матчи по конкретной команде (`FC서울`, `서울 이랜드`, код команды и т.п.).
- Возвращать текущую турнирную таблицу.

## Что нужно заранее

- Node.js 18+
- `npm install -g kleague-results`

## Входные данные

- Дата: `YYYY-MM-DD`
- Лига: `K리그1` или `K리그2`
- Необязательно: имя команды, полное название или код

## Официальные поверхности

Здесь используется не HTML scraping, а `공식 JSON` и `공식 표면`.

- Расписание и результаты: `https://www.kleague.com/getScheduleList.do`
- Таблица команд: `https://www.kleague.com/record/teamRank.do`

## Базовый поток

1. Если пакет не установлен, сначала поставить `kleague-results`, а не искать обходы.
2. Через `getScheduleList.do` получить данные за нужный месяц и затем отфильтровать ровно нужную дату.
3. Если указана команда, считать эквивалентными алиасы вроде `서울`, `FC서울`, `K09`.
4. Через `teamRank.do` подтянуть `현재 순위` и показать её вместе с результатами матчей.

## Пример

```bash
GLOBAL_NPM_ROOT="$(npm root -g)" node --input-type=module - <<'JS'
import path from "node:path";
import { pathToFileURL } from "node:url";

const entry = pathToFileURL(
  path.join(process.env.GLOBAL_NPM_ROOT, "kleague-results", "src", "index.js"),
).href;
const { getKLeagueSummary } = await import(entry);

const summary = await getKLeagueSummary("2026-03-22", {
  leagueId: "K리그1",
  team: "FC서울",
  includeStandings: true,
});

console.log(JSON.stringify(summary, null, 2));
JS
```

## Ограничения

- `getScheduleList.do` возвращает месяц целиком, поэтому фильтрация по точной дате обязательна.
- Таблица сейчас берётся в режиме `stadium=all`; при необходимости можно позже расширить до home/away.
- Короткие названия вроде `서울` могут обозначать разные клубы в разных лигах, поэтому в K League 2 нужно отдельно проверять `서울 이랜드`.
- До завершения матча статус может быть `예정` или `진행 중`.
- Пока пакет новый, до релиза его стоит проверять через локальный workspace или `pack`-артефакт, а публикацию делать уже после merge.

Историческое описание для doc-регрессий: `K리그 결과 조회`.
