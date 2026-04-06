# Postcalc и индексы Почты России

## Что делает навык

`postcalc-postcodes` читает публичные страницы `Postcalc` и нормализует два сценария:

- карточка отделения по шестизначному индексу
- сводка по населённому пункту через `citykey`

## Когда использовать

- Нужен адрес, тип ОПС и координаты конкретного отделения
- Нужно быстро получить `regId`, `citykey` и индекс по умолчанию для населённого пункта
- Нужен список отделений по городу без браузерного парсинга вручную

## Предварительные условия

- Node.js 18+
- После публикации: `npm install -g postcalc-postcodes`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке из этого репозитория: `npm install`

## Базовый сценарий

1. Если пакет не установлен, сначала поставить `postcalc-postcodes`.
2. Для индекса использовать `getOfficeOverview`.
3. Для населённого пункта использовать `getCityOverview`.

## Пример: карточка отделения

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getOfficeOverview } = require("postcalc-postcodes");

getOfficeOverview("109189").then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Пример: сводка по населённому пункту

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getCityOverview } = require("postcalc-postcodes");

getCityOverview("Сыктывкар").then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Что возвращать пользователю

- Для отделения: `postalCode`, `officeName`, `address`, `officeType`, `latitude`, `longitude`, `cityKey`
- Для населённого пункта: `regId`, `cityKey`, `cityKeyFull`, `defaultPostalCode`, `offices`
- Если в карточке есть служебная пометка вроде `Нет в Паспорте ОПС.`, её тоже стоит показать как `note`

## Ограничения

- Это только read-only сценарий
- Источник данных: публичные страницы `https://postcalc.ru/offices/...` и `https://postcalc.ru/cities/...`
- CI опирается на fixture-based HTML, а не на live-вёрстку
