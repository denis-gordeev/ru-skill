# hh-vacancies

Клиент только для чтения для публичного API hh.ru: поиск вакансий, карточки вакансий и справочник регионов.

## Установка

```bash
npm install hh-vacancies
```

## Публичные интерфейсы

- Поиск вакансий: `https://api.hh.ru/vacancies`
- Карточка вакансии: `https://api.hh.ru/vacancies/{vacancy_id}`
- Справочник регионов: `https://api.hh.ru/areas/{area_id}`
- Документация API: `https://api.hh.ru/openapi/redoc`

## Использование

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

## Справочник API

### `getAreaOverview(areaId)`

- `areaId`: числовой идентификатор региона HH, например `1` для Москвы
- Возвращает нормализованные `name`, `parentAreaId`, координаты, смещение часового пояса и дочерние регионы

### `searchVacancies(text, options?)`

- `text`: непустая строка поиска, например `frontend react` или `аналитик данных`
- `options.areaId`: числовой идентификатор региона (опционально)
- `options.page`: номер страницы с нуля (опционально)
- `options.perPage`: размер страницы от `1` до `100` (опционально)
- Возвращает нормализованные карточки с зарплатой, работодателем, фрагментами, форматом работы и метаданными роли

### `getVacancyOverview(vacancyId)`

- `vacancyId`: числовой идентификатор вакансии HH
- Возвращает подробные данные вакансии: `descriptionText`, адрес, метро, зарплату и формат работы

## Примечания

- Публичный API hh.ru — только для чтения в этих сценариях и не требует пользовательских секретов.
- Поля зарплаты могут отсутствовать или быть заполнены частично.
- Подробные описания вакансий нормализуются из HTML в читаемый текст.
