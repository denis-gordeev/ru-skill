---
name: pravo-documents
description: Search and read official Russian legal documents via pravo.gov.ru publication API without authorization. Use when the user needs to find federal laws, government decrees, or other official Russian legal acts by name, type, or date.
license: MIT
metadata:
  category: legal-reference
  locale: ru-RU
  phase: v1
---

# Pravo.gov.ru Legal Documents

## What this skill does

Пакет `pravo-documents` использует официальный API портала правовой информации для двух read-only сценариев:

- поиск федеральных законов, постановлений и других правовых актов
- нормализованная карточка документа с полными метаданными

## When to use

- "Найди федеральный закон о защите персональных данных"
- "Покажи последние постановления правительства"
- "Открой документ 0001202501010001"
- "Какой тип документа у 123-ФЗ?"

## Prerequisites

- Node.js 18+
- После публикации: `npm install -g pravo-documents`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Inputs

- Поисковый запрос `name`, например `"федеральный закон"`, `"постановление"`
- Необязательные фильтры: `documentTypeId`, `blockId`, `categoryId`, `dateFrom`, `dateTo`
- Идентификатор документа `eoNumber` для карточки

## Workflow

### 0. Install the package globally when missing

Если `node -e 'require("pravo-documents")'` не проходит, сначала ставится пакет, а не пишется одноразовый HTTP-клиент.

```bash
npm install -g pravo-documents
export NODE_PATH="$(npm root -g)"
```

### 1. Search for legal documents

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { searchPravoDocuments } = require("pravo-documents");

searchPravoDocuments({ name: "федеральный закон", pageSize: 10 }).then((result) =>
  console.log(JSON.stringify(result, null, 2))
);
JS
```

### 2. Read a concrete document card

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getPravoDocument } = require("pravo-documents");

getPravoDocument("0001202501010001").then((doc) =>
  console.log(JSON.stringify(doc, null, 2))
);
JS
```

## Done when

- Для поиска показаны `title`, `complexName`, `eoNumber`, `number`, `documentDate`, `pagesCount`, `pdfUrl`
- Для карточки показаны тип документа, подписавший орган и размеры файлов
- Источник явно назван официальным порталом правовой информации pravo.gov.ru

## Failure modes

- API может вернуть пустой результат для редких запросов
- Некоторые старые документы могут не иметь SVG версии
- `publishDateShort` нормализуется из API и не гарантирует точное время публикации

## Notes

- Навык работает только в read-only режиме
- Пользовательские секреты не нужны
