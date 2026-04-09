---
name: mchs-storm-warnings
description: Read official regional MChS storm and emergency warnings without authorization. Use when the user needs the latest official weather hazard bulletin, an individual warning card, or a quick check for a Russian region such as Moscow, Saint Petersburg, or a numbered oblast host.
license: MIT
metadata:
  category: public-safety
  locale: ru-RU
  phase: v1
---

# MChS Storm Warnings

## What this skill does

Пакет `mchs-storm-warnings` использует официальные региональные страницы МЧС России для двух read-only сценариев:

- список последних экстренных предупреждений по региональному хосту
- нормализованная карточка конкретного предупреждения

## When to use

- "Покажи последние экстренные предупреждения МЧС по Курской области"
- "Есть ли штормовое предупреждение по Москве"
- "Открой предупреждение МЧС 5695266"
- "Дай официальный текст последнего предупреждения МЧС по региону 78"

## Prerequisites

- Node.js 18+
- После публикации: `npm install -g mchs-storm-warnings`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Inputs

- `regionHost`, например `46`, `78`, `moscow` или название региона вроде `"Курская область"`, `"Москва"`, `"Санкт-Петербург"`
- Необязательная страница списка `page`
- Идентификатор предупреждения или относительный путь предупреждения

## Region lookup

Пакет поддерживает поиск региона по человекочитаемому названию вместо ручного ввода `regionHost`:

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { lookupRegion, listRegions } = require("mchs-storm-warnings");

// Поиск по названию
const kursk = lookupRegion("Курская область");
console.log(kursk); // { name: "Курская область", host: "46" }

const moscow = lookupRegion("Москва");
console.log(moscow); // { name: "г. Москва", host: "moscow" }

// Список всех регионов
const all = listRegions();
console.log(all.length); // 85+ регионов
JS
```

## Workflow

### 0. Install the package globally when missing

Если `node -e 'require("mchs-storm-warnings")'` не проходит, сначала ставится пакет, а не пишется одноразовый HTML-парсер под MChS.

```bash
npm install -g mchs-storm-warnings
export NODE_PATH="$(npm root -g)"
```

### 1. Read the latest regional warning feed

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { listStormWarnings } = require("mchs-storm-warnings");

listStormWarnings("46").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. Read a concrete warning card

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getStormWarning } = require("mchs-storm-warnings");

getStormWarning("46", "5695266").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Done when

- Для списка показаны `title`, `publishedAt`, `publishedAtIso`, `tag` и `url`
- Для карточки показаны официальный `title`, `bodyText`, дата публикации и экспортные ссылки `pdfUrl`/`wordUrl`, если они есть
- Источник явно назван официальной региональной страницей МЧС России

## Failure modes

- Региональные сайты МЧС используют одинаковый CMS-шаблон, но конкретная вёрстка может чуть отличаться между регионами
- Некоторые предупреждения позже переводятся в архив или уточняются, поэтому старый `warningId` может отдавать 404
- `publishedAtIso` нормализуется из публичной страницы и не добавляет региональный часовой пояс

## Notes

- Навык работает только в read-only режиме
- Пользовательские секреты не нужны
