---
name: moex-shares
description: Check public Moscow Exchange share metadata and delayed market snapshots from the official ISS API. Use when the user asks for MOEX ticker data such as SBER, GAZP, LKOH, lot size, ISIN, previous close, or current delayed price snapshot.
license: MIT
metadata:
  category: finance
  locale: ru-RU
  phase: v1
---

# MOEX Shares

## What this skill does

Пакет `moex-shares` получает по публичному ISS API Московской биржи базовые метаданные акции и отложенный рыночный снимок по тикеру.

## When to use

- "Покажи цену SBER на Московской бирже"
- "Какой ISIN у GAZP"
- "Дай lot size и предыдущую цену для LKOH"
- "Покажи первые тикеры с основной доски TQBR"

## Prerequisites

- Node.js 18+
- После публикации: `npm install -g moex-shares`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Inputs

- Тикер MOEX, например `SBER`, `GAZP`, `LKOH`
- Необязательный board id, по умолчанию `TQBR`

## Workflow

### 0. Install the package globally when missing

Если `node -e 'require("moex-shares")'` не проходит, сначала ставится пакет, а не собирается ad-hoc запрос к ISS вручную.

```bash
npm install -g moex-shares
export NODE_PATH="$(npm root -g)"
```

### 1. Get a normalized overview by ticker

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getSecurityOverview } = require("moex-shares");
getSecurityOverview("SBER").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. List the first page of shares on TQBR

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { listShares } = require("moex-shares");
listShares().then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Done when

- Подтверждён тикер MOEX и board
- Показаны ключевые поля: `shortName`, `isin`, `lotSize`
- Если нужен рынок, показаны `lastPrice`, `change`, `lastChangePercent` и время обновления

## Failure modes

- Публичный ISS может вернуть задержанные данные, а не real-time
- Для несуществующего тикера или неподдерживаемой доски ответ может быть пустым или с ошибкой HTTP

## Notes

- Навык работает только в read-only режиме
- Пользовательские секреты не нужны
