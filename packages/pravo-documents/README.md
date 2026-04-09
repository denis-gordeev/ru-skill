# pravo-documents

Read-only Node.js client for official Russian legal documents via pravo.gov.ru publication API.

## Install

```bash
npm install pravo-documents
```

## Public surfaces

- Search endpoint: `https://publication.pravo.gov.ru/api/Documents`
- Document card: `https://publication.pravo.gov.ru/api/Document?eoNumber=<number>`
- Blocks reference: `https://publication.pravo.gov.ru/api/PublicBlocks`
- Source type: official Russian legal information portal, no auth required

## Usage

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

## API

### `searchPravoDocuments(options?)`

Search for official Russian legal documents with optional filters.

- `options.name`: search query (e.g. `"федеральный закон"`)
- `options.documentTypeId`: filter by document type ID
- `options.blockId`: filter by publication block
- `options.categoryId`: filter by category
- `options.signatoryAuthorityId`: filter by signatory authority
- `options.dateFrom`, `options.dateTo`: date range filters (ISO format)
- `options.page`: page number, default `1`
- `options.pageSize`: results per page, `1-100`, default `20`
- Returns `{ items: Array<object>, pagination: object }`

Each item contains:
- `eoNumber`: electronic publication number
- `title`: document title
- `complexName`: full official name with date
- `number`: registration number (e.g. `"123-ФЗ"`)
- `documentDate`: document date
- `publishDate`: publication date (ISO 8601)
- `pagesCount`: number of pages
- `pdfUrl`: link to document page

### `getPravoDocument(eoNumber)`

Get full document card metadata.

- `eoNumber`: electronic publication number (required)
- Returns document metadata including:
  - All fields from search items
  - `documentType`: type ID and name
  - `signatoryAuthority`: list of authorities with `isMain` flag

### `listPravoBlocks()`

List publication blocks (categories of documents).

- Returns array of block objects

### URL builders

- `buildSearchUrl(options?)`
- `buildDocumentUrl(eoNumber)`

## Notes

- The package stays read-only and does not need secrets.
- This is metadata-only access; PDF content itself is not downloaded or parsed.
- All queries hit the official pravo.gov.ru publication API.

## Tests

```bash
npm test --workspace pravo-documents
```

Fixture-based tests pin both search results and a document card, so CI does not depend on live API responses.
