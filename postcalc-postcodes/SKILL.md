---
name: postcalc-postcodes
description: Check Russian postal indexes and branch cards from public Postcalc city and office pages. Use when the user asks for a specific 6-digit post office index or for a city summary by `citykey`.
license: MIT
metadata:
  category: location
  locale: ru-RU
  phase: v1
---

# Postcalc Postcodes

## What this skill does

Пакет `postcalc-postcodes` получает read-only-сводку по отделению Почты России или по населённому пункту через публичные страницы `Postcalc`.

## When to use

- "Покажи карточку отделения 109189"
- "Дай отделения Почты России для Сыктывкара"
- "Какой `citykey` и индекс по умолчанию у Сыктывкара"

## Prerequisites

- Node.js 18+
- После публикации: `npm install -g postcalc-postcodes`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Inputs

- Шестизначный индекс отделения, например `109189` или `167000`
- `citykey` населённого пункта, например `Сыктывкар` или `Москва`

## Workflow

### 0. Install the package globally when missing

Если `node -e 'require("postcalc-postcodes")'` не проходит, сначала ставится пакет, а не собирается ad-hoc HTML-парсер.

```bash
npm install -g postcalc-postcodes
export NODE_PATH="$(npm root -g)"
```

### 1. Get a normalized office card by postal code

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getOfficeOverview } = require("postcalc-postcodes");

getOfficeOverview("109189").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. Get a normalized city summary by `citykey`

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getCityOverview } = require("postcalc-postcodes");

getCityOverview("Сыктывкар").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Done when

- Для индекса показаны `officeName`, адрес, `officeType`, координаты и `cityKey`
- Для населённого пункта показаны `regId`, `cityKey`, `defaultPostalCode` и список `offices`
- Источник явно описан как публичный read-only `Postcalc`

## Failure modes

- HTML-вёрстка `Postcalc` может измениться
- Для редких `citykey` возможны неоднозначные названия, поэтому нужно смотреть на `regId` и `cityKeyFull`
- Некоторые отделения могут отображаться без адреса или с пометкой, что их нет в Паспорте ОПС

## Notes

- Навык работает только в read-only режиме
- Пользовательские секреты не нужны
