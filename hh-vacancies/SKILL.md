---
name: hh-vacancies
description: Search public hh.ru vacancies, inspect vacancy cards, and resolve Russian area ids without authorization. Use when the user asks for Russian-speaking job search results, a specific HH vacancy, or an area like Moscow or Saint Petersburg.
license: MIT
metadata:
  category: jobs
  locale: ru-RU
  phase: v1
---

# HH Vacancies

## What this skill does

Пакет `hh-vacancies` использует публичный API `api.hh.ru` для трёх read-only сценариев:

- lookup area по `areaId`
- поиск вакансий по тексту и региону
- нормализованная карточка конкретной вакансии

## When to use

- "Найди frontend вакансии в Москве"
- "Покажи карточку вакансии hh 131927189"
- "Какой area id у Москвы"
- "Дай пару вакансий аналитика данных в Петербурге"

## Prerequisites

- Node.js 18+
- После публикации: `npm install -g hh-vacancies`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Inputs

- Поисковая строка вакансии, например `frontend react`
- Необязательный `areaId`, например `1` для Москвы
- Идентификатор вакансии HH, например `131927189`

## Workflow

### 0. Install the package globally when missing

Если `node -e 'require("hh-vacancies")'` не проходит, сначала ставится пакет, а не пишутся ad-hoc запросы к HH API.

```bash
npm install -g hh-vacancies
export NODE_PATH="$(npm root -g)"
```

### 1. Resolve area metadata

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getAreaOverview } = require("hh-vacancies");

getAreaOverview(1).then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. Search vacancies in a specific area

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { searchVacancies } = require("hh-vacancies");

searchVacancies("frontend react", { areaId: 1, perPage: 3 })
  .then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 3. Read a detailed vacancy card

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getVacancyOverview } = require("hh-vacancies");

getVacancyOverview("131927189").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Done when

- Для поиска показаны `title`, `salary`, `area`, `employer`, `experience` и `vacancyUrl`
- Для подробной карточки показаны `descriptionText`, адрес, ближайшее метро и режим работы
- Источник явно назван публичным read-only API `hh.ru`

## Failure modes

- HH может частично скрывать зарплату или вовсе не отдавать её
- Некоторые вакансии быстро архивируются, поэтому `vacancyId` может перестать открываться
- HTML-описание вакансии может меняться, поэтому нормализованный `descriptionText` нужно воспринимать как удобную выжимку, а не как pixel-perfect копию карточки

## Notes

- Навык работает только в read-only режиме
- Пользовательские секреты не нужны
