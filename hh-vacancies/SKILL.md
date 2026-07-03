---
name: hh-vacancies
description: Поиск публичных вакансий hh.ru, просмотр карточек вакансий и разрешение идентификаторов регионов без авторизации. Использовать, когда пользователь ищет русскоязычные вакансии, конкретную вакансию HH или регион вроде Москвы или Санкт-Петербурга.
license: MIT
metadata:
  category: вакансии
  locale: ru-RU
  phase: v1
---

# Вакансии HH

## Что делает навык

Пакет `hh-vacancies` использует публичный API `api.hh.ru` для трёх сценариев только для чтения:

- поиск региона по `areaId`
- поиск вакансий по тексту и региону
- нормализованная карточка конкретной вакансии

## Когда использовать

- "Найди вакансии клиентской разработки в Москве"
- "Покажи карточку вакансии hh 131927189"
- "Какой идентификатор региона у Москвы"
- "Дай пару вакансий аналитика данных в Петербурге"

## Предварительные условия

- Node.js 18+
- После публикации: `npm install -g hh-vacancies`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Входные данные

- Поисковая строка вакансии, например `frontend react`
- Необязательный `areaId`, например `1` для Москвы
- Идентификатор вакансии HH, например `131927189`

## Рабочий процесс

### 0. Установить пакет глобально, если отсутствует

Если `node -e 'require("hh-vacancies")'` не проходит, сначала ставится пакет, а не пишутся разовые запросы к HH API.

```bash
npm install -g hh-vacancies
export NODE_PATH="$(npm root -g)"
```

### 1. Получить метаданные региона

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getAreaOverview } = require("hh-vacancies");

getAreaOverview(1).then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. Поиск вакансий в указанном регионе

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { searchVacancies } = require("hh-vacancies");

searchVacancies("frontend react", { areaId: 1, perPage: 3 })
  .then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 3. Прочитать подробную карточку вакансии

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getVacancyOverview } = require("hh-vacancies");

getVacancyOverview("131927189").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Критерии завершения

- Для поиска показаны `title`, `salary`, `area`, `employer`, `experience` и `vacancyUrl`
- Для подробной карточки показаны `descriptionText`, адрес, ближайшее метро и режим работы
- Источник явно назван публичным API `hh.ru` только для чтения

## Возможные ошибки

- HH может частично скрывать зарплату или вовсе не отдавать её
- Некоторые вакансии быстро архивируются, поэтому `vacancyId` может перестать открываться
- HTML-описание вакансии может меняться, поэтому нормализованный `descriptionText` нужно воспринимать как удобную выжимку, а не как точную копию карточки

## Примечания

- Навык работает только в режиме чтения
- Пользовательские секреты не нужны
