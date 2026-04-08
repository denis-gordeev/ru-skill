# HH вакансии

## Что делает навык

`hh-vacancies` - это read-only-обёртка над публичным API `api.hh.ru` для поиска вакансий, чтения карточки вакансии и lookup'а региона по `areaId`.

## Когда использовать

- Нужна русскоязычная или российская подборка вакансий по запросу и региону
- Нужно быстро открыть нормализованную карточку конкретной вакансии HH без браузерной ручной чистки HTML
- Нужно проверить `areaId` для Москвы, Санкт-Петербурга или другого региона перед поиском

## Предварительные условия

- Node.js 18+
- После публикации: `npm install -g hh-vacancies`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке из этого репозитория: `npm install`

## Базовый сценарий

1. Если пакет не установлен, сначала поставить `hh-vacancies`.
2. При необходимости уточнить регион через `getAreaOverview`.
3. Получить первую страницу вакансий через `searchVacancies`.
4. Если нужна подробная карточка, дочитать конкретную позицию через `getVacancyOverview`.

## Пример: lookup региона

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getAreaOverview } = require("hh-vacancies");

getAreaOverview(1).then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Пример: поиск вакансий

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { searchVacancies } = require("hh-vacancies");

searchVacancies("frontend react", { areaId: 1, perPage: 3 }).then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Пример: карточка вакансии

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getVacancyOverview } = require("hh-vacancies");

getVacancyOverview("131927189").then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Что возвращать пользователю

- Для поиска: `title`, `salary`, `area`, `employer`, `experience`, `workFormats`, `vacancyUrl`
- Для карточки: `descriptionText`, адрес, ближайшее метро, `employment`, `schedule`, `workingHours`
- Для региона: `name`, `parentAreaId`, координаты и дочерние `children`, если они есть

## Ограничения

- Это только read-only сценарий
- Источник данных: публичные endpoints `https://api.hh.ru/vacancies`, `https://api.hh.ru/vacancies/{vacancy_id}` и `https://api.hh.ru/areas/{area_id}`
- Зарплата и часть полей могут отсутствовать, потому что работодатель их не заполнил
