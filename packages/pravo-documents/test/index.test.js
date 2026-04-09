const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  getPravoDocument,
  listPravoBlocks,
  searchPravoDocuments
} = require("../src/index");
const {
  buildDocumentUrl,
  buildSearchUrl,
  normalizeDocumentCard,
  normalizeDocumentItem
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const searchFixture = fs.readFileSync(path.join(fixturesDir, "search-results.json"), "utf8");
const cardFixture = fs.readFileSync(path.join(fixturesDir, "document-card.json"), "utf8");

test("buildSearchUrl creates correct URL with defaults", () => {
  const url = buildSearchUrl();
  assert.ok(url.includes("/api/Documents"));
  assert.ok(url.includes("CurrentPage=1"));
  assert.ok(url.includes("PageSize=20"));
});

test("buildSearchUrl applies name search parameter", () => {
  const url = buildSearchUrl({ name: "федеральный закон" });
  assert.ok(url.includes("NameSearchType=0"));
  assert.ok(url.includes("Name=%D1%84%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D0%BB") || url.includes("Name="));
});

test("buildSearchUrl applies filters and pagination", () => {
  const url = buildSearchUrl({
    documentTypeId: "type-1",
    page: 2,
    pageSize: 50
  });
  assert.ok(url.includes("DocumentTypeId=type-1"));
  assert.ok(url.includes("CurrentPage=2"));
  assert.ok(url.includes("PageSize=50"));
});

test("buildSearchUrl validates page number", () => {
  assert.throws(() => buildSearchUrl({ page: 0 }), /page must be an integer greater than or equal to 1/);
  assert.throws(() => buildSearchUrl({ page: -1 }), /page must be an integer greater than or equal to 1/);
});

test("buildSearchUrl validates page size", () => {
  assert.throws(() => buildSearchUrl({ pageSize: 0 }), /pageSize must be an integer between 1 and 100/);
  assert.throws(() => buildSearchUrl({ pageSize: 101 }), /pageSize must be an integer between 1 and 100/);
});

test("buildDocumentUrl creates correct URL", () => {
  const url = buildDocumentUrl("0001202501010001");
  assert.equal(url, "https://publication.pravo.gov.ru/api/Document?eoNumber=0001202501010001");
});

test("buildDocumentUrl validates eoNumber", () => {
  assert.throws(() => buildDocumentUrl(""), /eoNumber must be a non-empty string/);
  assert.throws(() => buildDocumentUrl(null), /eoNumber must be a non-empty string/);
});

test("normalizeDocumentItem extracts key fields", () => {
  const searchResults = JSON.parse(searchFixture);
  const item = normalizeDocumentItem(searchResults.items[0]);

  assert.equal(item.eoNumber, "0001202501010001");
  assert.equal(item.title, "О внесении изменений в отдельные законодательные акты");
  assert.equal(item.complexName, "Федеральный закон от 01.01.2025");
  assert.equal(item.number, "123-ФЗ");
  assert.equal(item.pagesCount, 15);
  assert.equal(item.hasSvg, true);
  assert.ok(item.pdfUrl);
});

test("normalizeDocumentCard extracts full metadata", () => {
  const cardData = JSON.parse(cardFixture);
  const card = normalizeDocumentCard(cardData);

  assert.equal(card.eoNumber, "0001202501010001");
  assert.equal(card.documentType.name, "Федеральный закон");
  assert.equal(card.signatoryAuthority.length, 1);
  assert.equal(card.signatoryAuthority[0].name, "Президент Российской Федерации");
  assert.equal(card.signatoryAuthority[0].isMain, true);
});

test("public helpers search and fetch document cards", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const value = String(url);

    if (value.includes("/api/Document?eoNumber=")) {
      return new Response(cardFixture, {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    if (value.includes("/api/Documents")) {
      return new Response(searchFixture, {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    throw new Error(`Unexpected mocked URL: ${value}`);
  };

  try {
    const search = await searchPravoDocuments({ name: "федеральный закон" });
    assert.equal(search.items.length, 2);
    assert.equal(search.pagination.itemsTotalCount, 2);
    assert.equal(search.items[0].eoNumber, "0001202501010001");

    const doc = await getPravoDocument("0001202501010001");
    assert.equal(doc.eoNumber, "0001202501010001");
    assert.equal(doc.documentType.name, "Федеральный закон");
  } finally {
    global.fetch = originalFetch;
  }
});
