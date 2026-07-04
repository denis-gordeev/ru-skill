# pravo-documents

Клиент только для чтения для официальных правовых документов через API портала pravo.gov.ru.

## Установка

```bash
npm install pravo-documents
```

## Публичные поверхности

- Конечная точка поиска: `https://publication.pravo.gov.ru/api/Documents`
- Карточка документа: `https://publication.pravo.gov.ru/api/Document?eoNumber=<number>`
- Справочник рубрик: `https://publication.pravo.gov.ru/api/PublicBlocks`
- Тип источника: официальный портал правовой информации, без авторизации

## Использование

```js
const {
  getPravoDocument,
  searchPravoDocuments
} = require("pravo-documents");

(async () => {
  const search = await searchPravoDocuments({ name: "федеральный закон", pageSize: 10 });
  const doc = await getPravoDocument(search.items[0].eoNumber);

  console.log(search.pagination.itemsTotalCount);
  console.log(doc.title);
  console.log(doc.documentType.name);
})();
```

## Справочник API

### `searchPravoDocuments(options?)`

Поиск официальных правовых документов с опциональными фильтрами.

- `options.name`: поисковый запрос (например `"федеральный закон"`)
- `options.documentTypeId`: фильтр по типу документа
- `options.blockId`: фильтр по рубрике публикации
- `options.categoryId`: фильтр по категории
- `options.signatoryAuthorityId`: фильтр по подписавшему органу
- `options.dateFrom`, `options.dateTo`: фильтр по диапазону дат (ISO-формат)
- `options.page`: номер страницы, по умолчанию `1`
- `options.pageSize`: результатов на странице, `1–100`, по умолчанию `20`
- Возвращает `{ items: Array<object>, pagination: object }`

Каждый элемент содержит:
- `eoNumber`: номер электронной публикации
- `title`: заголовок документа
- `complexName`: полное официальное название с датой
- `number`: регистрационный номер (например `"123-ФЗ"`)
- `documentDate`: дата документа
- `publishDate`: дата публикации (ISO 8601)
- `pagesCount`: количество страниц
- `pdfUrl`: ссылка на страницу документа

### `getPravoDocument(eoNumber)`

Получение полной карточки метаданных документа.

- `eoNumber`: номер электронной публикации (обязательный)
- Возвращает метаданные документа, включая:
  - Все поля из результатов поиска
  - `documentType`: идентификатор и название типа
  - `signatoryAuthority`: список органов с признаком `isMain`

### `listPravoBlocks()`

Список рубрик публикаций (категорий документов).

- Возвращает массив объектов-рубрик

### Построение URL

- `buildSearchUrl(options?)`
- `buildDocumentUrl(eoNumber)`

## Примечания

- Пакет работает только для чтения и не требует секретов.
- Доступ только к метаданным; содержимое PDF не загружается и не разбирается.
- Все запросы направляются к официальному API pravo.gov.ru.

## Тесты

```bash
npm test --workspace pravo-documents
```

Тесты используют подход на основе эталонных данных с сохранёнными результатами поиска и карточками документов, чтобы система непрерывной интеграции (CI) не зависела от живых ответов API.
