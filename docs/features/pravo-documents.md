# Официальные правовые документы pravo.gov.ru

## Что делает навык

`pravo-documents` - это read-only-обёртка над официальным API портала правовой информации для поиска федеральных законов, постановлений и других правовых актов с получением нормализованных метаданных документа.

## Когда использовать

- Нужно быстро найти официальный текст федерального законов, постановлений или распоряжений
- Нужно проверить реквизиты документа (номер, дата, тип, подписавший орган)
- Нужно получить список документов по тематике или за определённый период

## Предварительные условия

- Node.js 18+
- После публикации: `npm install -g pravo-documents`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке из этого репозитория: `npm install`

## Базовый сценарий

1. Если пакет не установлен, сначала поставить `pravo-documents`.
2. Определить поисковый запрос или фильтры (тип документа, дата-диапазон).
3. Получить список документов через `searchPravoDocuments`.
4. Если нужны полные реквизиты, дочитать карточку через `getPravoDocument`.

## Пример: поиск федеральных законов

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { searchPravoDocuments } = require("pravo-documents");

searchPravoDocuments({
  name: "персональные данные",
  pageSize: 10
}).then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Пример: карточка документа

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getPravoDocument } = require("pravo-documents");

getPravoDocument("0001202501010001").then((doc) => {
  console.log(JSON.stringify(doc, null, 2));
});
JS
```

## Что возвращать пользователю

- Для поиска: `title`, `complexName`, `eoNumber`, `number`, `documentDate`, `pagesCount`, `pdfUrl`
- Для карточки: `documentType`, `signatoryAuthority`, `pdfFileLength`, `hasSvg` и все поля поиска
- Ссылка на официальную страницу документа: `https://publication.pravo.gov.ru/Document/{eoNumber}`

## Ограничения

- Это только read-only сценарий метаданных; содержимое PDF не скачивается и не парсится
- Источник данных: официальный API `https://publication.pravo.gov.ru/api/`
- API не поддерживает полнотекстовый поиск с Boolean-операторами
- Для сложных запросов может потребоваться комбинация фильтров
- `publishDateShort` приходит в ISO-формате без указания часового пояса
