# hh-vacancies

Read-only Node.js client for public hh.ru vacancy search, vacancy details, and area lookup APIs.

## Install

```bash
npm install hh-vacancies
```

## Public surfaces

- Vacancy search: `https://api.hh.ru/vacancies`
- Vacancy card: `https://api.hh.ru/vacancies/{vacancy_id}`
- Area lookup: `https://api.hh.ru/areas/{area_id}`
- Public API documentation: `https://api.hh.ru/openapi/redoc`

## Usage

```js
const {
  getAreaOverview,
  getVacancyOverview,
  searchVacancies
} = require("hh-vacancies");

(async () => {
  const moscow = await getAreaOverview(1);
  const search = await searchVacancies("frontend react", { areaId: 1, perPage: 2 });
  const vacancy = await getVacancyOverview(search.items[0].vacancyId);

  console.log(moscow.name);
  console.log(search.items[0].title);
  console.log(vacancy.descriptionText);
})();
```

## API

### `getAreaOverview(areaId)`

- `areaId`: numeric HH area id, for example `1` for Moscow
- Returns normalized `name`, `parentAreaId`, coordinates, timezone offset, and immediate child areas

### `searchVacancies(text, options?)`

- `text`: non-empty search string such as `frontend react` or `аналитик данных`
- `options.areaId`: optional numeric area id
- `options.page`: optional 0-based page
- `options.perPage`: optional page size from `1` to `100`
- Returns normalized cards with salary, employer, snippets, work format, and role metadata

### `getVacancyOverview(vacancyId)`

- `vacancyId`: numeric HH vacancy id
- Returns normalized detailed vacancy data including `descriptionText`, address, metro, salary, and work-format fields

## Notes

- The hh.ru public API is read-only for these flows and does not require user secrets.
- Salary fields may be absent or partially filled, so callers should handle `null`.
- Detailed vacancy descriptions are normalized from HTML into readable plain text.
