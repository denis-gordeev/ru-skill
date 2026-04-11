const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  decodeHtmlEntities,
  stripTags,
  parsePrice,
  normalizeProductUrl,
  parseSearchResults,
  parseProductPage,
} = require("../src/parse");

const {
  buildSearchUrl,
  buildProductUrl,
  searchProducts,
  getProduct,
} = require("../src/index");

const SEARCH_FIXTURE = `
<article data-auto="searchOrganic">
  <a href="/card/smartfon-apple-iphone-16-128-gb-dual-nano-sim--esim-chernyy/103572164696?from=search" data-auto="snippet-link">
    <img src="https://avatars.mds.yandex.net/get-mpic/1.jpeg/orig" alt="Смартфон Apple iPhone 16 128 ГБ, Dual: nano SIM + eSIM, Черный (без RuStore)">
    <span role="link" data-auto="snippet-title" title="Смартфон Apple iPhone 16 128 ГБ, Dual: nano SIM + eSIM, Черный (без RuStore)">Смартфон Apple iPhone 16 128 ГБ, Dual: nano SIM + eSIM, Черный (без RuStore)</span>
  </a>
  <div class="_2Ce4O">
    <span>Диагональ экрана: </span>
    <span>6.1&quot;</span>
  </div>
  <div class="_2Ce4O">
    <span>Встроенная память : </span>
    <span>128 ГБ</span>
  </div>
  <div>
    <span class="ds-visuallyHidden">Цена с картой Яндекс Пэй 65 172 ₽ вместо </span>
    <span class="ds-valueLine" data-auto="snippet-price-current" aria-hidden="true">
      <span>65 172</span><span> ₽</span>
    </span>
  </div>
  <div data-zone-name="rating">
    <span class="ds-visuallyHidden">Рейтинг товара: 4.9 из 5</span>
    <span class="ds-visuallyHidden">Оценок: (6.9K) · 16.5K купили</span>
    <span data-auto="reviews"><span aria-hidden="true">4.9</span><span aria-hidden="true"> 6.9K оценок</span></span>
  </div>
</article>
<article data-auto="searchOrganic">
  <a href="/card/iphone-17-256gb-white-sim--esim/4759234769?from=search" data-auto="snippet-link">
    <span data-auto="snippet-title" title="iPhone 17 256GB White SIM + eSIM">iPhone 17 256GB White SIM + eSIM</span>
  </a>
  <div class="_2Ce4O">
    <span>Диагональ экрана: </span>
    <span>6.3"</span>
  </div>
  <span class="ds-visuallyHidden">Цена 101 999 ₽</span>
  <div data-zone-name="rating">
    <span class="ds-visuallyHidden">Рейтинг товара: 5.0 из 5</span>
    <span class="ds-visuallyHidden">на основе 18 оценок</span>
  </div>
</article>
`;

const PRODUCT_FIXTURE = `
<html>
  <head>
    <meta name="description" content="Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный) на Яндекс Маркете.">
  </head>
  <body>
    <a data-auto="product-card-vendor"><span>Apple</span></a>
    <h1 data-auto="productCardTitle">Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный)</h1>
    <a data-auto="snippet-link">
      <div>
        <span class="ds-visuallyHidden">Цена 79 262 ₽</span>
        <span class="ds-valueLine" data-auto="snippet-price-current" aria-hidden="true">
          <span>79 262</span><span> ₽</span>
        </span>
      </div>
    </a>
    <div data-zone-name="rating">
      <span class="ds-visuallyHidden">Рейтинг товара: 4.9 из 5</span>
      <span class="ds-visuallyHidden">на основе 1555 оценок</span>
      <span data-auto="reviews"><span aria-hidden="true">4.9</span><span aria-hidden="true"> 1555 оценок</span></span>
    </div>
    <div data-auto="specs-list-fullExtended" aria-label="Характеристики">
      <div class="_3rW2x _1MOwX _2eMnU">
        <div class="_1IaDe"><div class="_6DaYY"><span data-auto="product-spec">Артикул Маркета</span></div></div>
        <div class="eXP5k"><div class="b2ZT4"><div class="ds-text"><span>5268004944</span></div></div></div>
      </div>
      <div class="_3rW2x _1MOwX _2eMnU">
        <div class="_1IaDe"><div class="_6DaYY"><span data-auto="product-spec">Бренд</span></div></div>
        <div class="eXP5k"><div class="b2ZT4"><a href="/category/mobilnyye-telefony-apple"><div class="ds-text"><span>Apple</span></div></a></div></div>
      </div>
      <div class="_3rW2x _1MOwX _2eMnU">
        <div class="_1IaDe"><div class="_6DaYY"><span data-auto="product-spec">Встроенная память</span></div></div>
        <div class="eXP5k"><div class="b2ZT4"><div class="ds-text"><span>256 ГБ</span></div></div></div>
      </div>
      <div class="_3rW2x _1MOwX _2eMnU">
        <div class="_1IaDe"><div class="_6DaYY"><span data-auto="product-spec">Диагональ экрана</span></div></div>
        <div class="eXP5k"><div class="b2ZT4"><div class="ds-text"><span>6.1"</span></div></div></div>
      </div>
    </div>
  </body>
</html>
`;

test("decodeHtmlEntities and stripTags normalize market HTML fragments", () => {
  assert.equal(decodeHtmlEntities("6.1&quot; &amp; more"), '6.1" & more');
  assert.equal(stripTags("<div><span>  Apple&nbsp;iPhone </span></div>"), "Apple iPhone");
});

test("parsePrice extracts integer ruble amounts", () => {
  assert.equal(parsePrice("65 172 ₽"), 65172);
  assert.equal(parsePrice("101 999 ₽"), 101999);
  assert.equal(parsePrice(""), null);
});

test("normalizeProductUrl strips tracking query params", () => {
  assert.equal(
    normalizeProductUrl("/card/demo-product/12345?from=search&clid=1"),
    "https://market.yandex.ru/card/demo-product/12345"
  );
});

test("buildSearchUrl and buildProductUrl return Yandex Market URLs", () => {
  assert.equal(
    buildSearchUrl("iphone 16"),
    "https://market.yandex.ru/search?text=iphone+16"
  );
  assert.equal(
    buildSearchUrl("iphone 16", { page: 3 }),
    "https://market.yandex.ru/search?text=iphone+16&page=3"
  );
  assert.equal(
    buildProductUrl("smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim", "5268004944"),
    "https://market.yandex.ru/card/smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim/5268004944"
  );
});

test("parseSearchResults extracts product cards from Yandex Market SERP HTML", () => {
  const parsed = parseSearchResults(SEARCH_FIXTURE, "iphone");

  assert.equal(parsed.query, "iphone");
  assert.equal(parsed.source, "market.yandex.ru");
  assert.equal(parsed.results.length, 2);
  assert.deepEqual(parsed.results[0], {
    productId: "103572164696",
    title: "Смартфон Apple iPhone 16 128 ГБ, Dual: nano SIM + eSIM, Черный (без RuStore)",
    price: { amount: 65172, currency: "RUB" },
    rating: "4.9",
    reviewCount: "6.9K",
    url: "https://market.yandex.ru/card/smartfon-apple-iphone-16-128-gb-dual-nano-sim--esim-chernyy/103572164696",
    imageUrl: "https://avatars.mds.yandex.net/get-mpic/1.jpeg/orig",
    specs: [
      { name: "Диагональ экрана", value: '6.1"' },
      { name: "Встроенная память", value: "128 ГБ" },
    ],
  });
});

test("parseProductPage extracts title price rating and full specs", () => {
  const parsed = parseProductPage(
    PRODUCT_FIXTURE,
    "https://market.yandex.ru/card/smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim/5268004944?from=search"
  );

  assert.deepEqual(parsed, {
    productId: "5268004944",
    title: "Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный)",
    brand: "Apple",
    price: { amount: 79262, currency: "RUB" },
    rating: "4.9",
    reviewCount: "1555",
    description:
      "Смартфон Apple iPhone 16 256GB, Белый (White), nano SIM + eSIM (Восстановленный) на Яндекс Маркете.",
    specs: [
      { name: "Артикул Маркета", value: "5268004944" },
      { name: "Бренд", value: "Apple" },
      { name: "Встроенная память", value: "256 ГБ" },
      { name: "Диагональ экрана", value: '6.1"' },
    ],
    source: "market.yandex.ru",
    url: "https://market.yandex.ru/card/smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim/5268004944",
  });
});

test("searchProducts fetches and parses search HTML via mocked fetch", async () => {
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    text: async () => SEARCH_FIXTURE,
  });

  const result = await searchProducts("iphone", { fetcher: mockFetch, page: 2 });
  assert.equal(result.page, 2);
  assert.equal(result.results[0].productId, "103572164696");
});

test("getProduct fetches and parses a product card via mocked fetch", async () => {
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    text: async () => PRODUCT_FIXTURE,
  });

  const result = await getProduct("/card/smartfon-apple-iphone-16-256gb-belyy-white-nano-sim--esim/5268004944?clid=1", {
    fetcher: mockFetch,
  });

  assert.equal(result.productId, "5268004944");
  assert.equal(result.price.amount, 79262);
});

test("searchProducts and getProduct surface HTTP failures", async () => {
  const mockFetch = async () => ({
    ok: false,
    status: 503,
  });

  await assert.rejects(
    async () => searchProducts("iphone", { fetcher: mockFetch }),
    /Yandex Market request failed with 503/
  );
  await assert.rejects(
    async () => getProduct("https://market.yandex.ru/card/demo/1", { fetcher: mockFetch }),
    /Yandex Market request failed with 503/
  );
});
