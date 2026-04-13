const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { 
  parseSearchResults, 
  parseBusinessPage, 
  normalizeBusinessUrl,
  extractText,
  extractHref,
  parseItemCount,
  extractPagination
} = require('../src/parse');

const fixturesDir = path.join(__dirname, 'fixtures');

describe('zoon-nearby parser', () => {
  let restaurantsHtml;
  let businessDetailHtml;

  before(() => {
    restaurantsHtml = fs.readFileSync(
      path.join(fixturesDir, 'restaurants_moscow.html'),
      'utf8'
    );
    businessDetailHtml = fs.readFileSync(
      path.join(fixturesDir, 'business_detail.html'),
      'utf8'
    );
  });

  describe('parseSearchResults', () => {
    it('should extract business listings from category page', () => {
      const result = parseSearchResults(restaurantsHtml, 'Москва рестораны');
      
      assert.strictEqual(result.businesses.length, 3);
      assert.strictEqual(result.businesses[0].name, 'Кафе Пушкинъ');
      assert.strictEqual(result.businesses[0].address, 'Тверской бульвар, 26А, Москва');
      assert.strictEqual(result.businesses[0].rating, '4.8');
      assert.strictEqual(result.businesses[0].phone, '+7 (495) 123-45-67');
      assert.strictEqual(result.businesses[0].category, 'Русская кухня');
    });

    it('should parse total count from HTML', () => {
      const count = parseItemCount(restaurantsHtml);
      assert.strictEqual(count, 1234);
    });

    it('should extract pagination info', () => {
      const pagination = extractPagination(restaurantsHtml);
      
      assert.strictEqual(pagination.hasNextPage, true);
      assert.strictEqual(pagination.nextPage, 2);
      assert.strictEqual(pagination.pages.length, 3);
    });

    it('should include query in result', () => {
      const result = parseSearchResults(restaurantsHtml, 'test query');
      assert.strictEqual(result.query, 'test query');
    });
  });

  describe('parseBusinessPage', () => {
    it('should extract business details from detail page', () => {
      const result = parseBusinessPage(businessDetailHtml, 'https://zoon.ru/msk/restaurants/pushkin');
      
      assert.strictEqual(result.name, 'Кафе Пушкинъ');
      assert.strictEqual(result.address, 'Тверской бульвар, 26А, Москва, 125009');
      assert.strictEqual(result.rating, '4.8');
      assert.strictEqual(result.phone, '+7 (495) 123-45-67');
      assert.strictEqual(result.category, 'Русская кухня');
      assert.ok(result.description.includes('Легендарный ресторан'));
      assert.ok(result.hours.includes('Пн-Чт'));
      assert.strictEqual(result.url, 'https://zoon.ru/msk/restaurants/pushkin');
    });

    it('should throw if business name cannot be parsed', () => {
      assert.throws(
        () => parseBusinessPage('<html><body>empty</body></html>'),
        /Unable to parse business name/
      );
    });
  });

  describe('normalizeBusinessUrl', () => {
    it('should normalize relative URLs', () => {
      const result = normalizeBusinessUrl('/msk/restaurants/pushkin');
      assert.ok(result && result.includes('zoon.ru'));
    });

    it('should keep absolute URLs as-is', () => {
      const result = normalizeBusinessUrl('https://zoon.ru/msk/restaurants/pushkin');
      assert.strictEqual(result, 'https://zoon.ru/msk/restaurants/pushkin');
    });

    it('should return null for invalid URLs', () => {
      const result = normalizeBusinessUrl('not-a-url');
      assert.strictEqual(result, null);
    });

    it('should return null for empty input', () => {
      const result = normalizeBusinessUrl('');
      assert.strictEqual(result, null);
    });
  });
});
