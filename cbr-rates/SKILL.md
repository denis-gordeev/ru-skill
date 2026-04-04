---
name: cbr-rates
description: Check official Bank of Russia currency rates from the public XML feed, including a requested date and the previous available published value. Use when the user asks for CBR exchange rates for USD, EUR, CNY, or similar currencies.
license: MIT
metadata:
  category: finance
  locale: ru-RU
  phase: v1
---

# CBR Rates

## What this skill does

Пакет `cbr-rates` получает официальный курс валют Банка России из публичного XML-сервиса и нормализует ответ в пригодный для агента JSON.

## When to use

- "Какой курс доллара ЦБ РФ на сегодня"
- "Покажи курс евро Банка России на 2 апреля 2026"
- "Сравни курс юаня с предыдущим доступным значением"

## Prerequisites

- Node.js 18+
- После публикации: `npm install -g cbr-rates`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Inputs

- Буквенный код валюты: `USD`, `EUR`, `CNY`
- Необязательная дата в формате `YYYY-MM-DD`

## Workflow

### 0. Install the package globally when missing

Если `node -e 'require("cbr-rates")'` не проходит, сначала ставится официальный пакет, а не пишется новый XML-парсер с нуля.

```bash
npm install -g cbr-rates
export NODE_PATH="$(npm root -g)"
```

### 1. Get the normalized rate for a specific date

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getRate } = require("cbr-rates");
getRate("USD", "2026-04-02").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. Include the previous available published value

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getRateWithChange } = require("cbr-rates");
getRateWithChange("CNY", "2026-04-02").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Done when

- Подтверждён официальный курс Банка России для запрошенной валюты
- Указаны `publishedDate`, номинал и курс за единицу
- Если запросили изменение, показано предыдущее доступное опубликованное значение и направление движения

## Failure modes

- XML-схема Банка России может измениться
- На нерабочие даты сервис может вернуть ближайшую доступную публикацию, поэтому нужно смотреть на `publishedDate`, а не только на запрошенную дату

## Notes

- Навык работает только в режиме read-only
- Пользовательские секреты не нужны
