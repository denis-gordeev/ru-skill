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

describe('модуль разбора zoon-nearby', () => {
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
    it('извлекает список организаций со страницы категории', () => {
      const result = parseSearchResults(restaurantsHtml, 'Москва рестораны');
      
      assert.strictEqual(result.businesses.length, 3);
      assert.strictEqual(result.businesses[0].name, 'Кафе Пушкинъ');
      assert.strictEqual(result.businesses[0].address, 'Тверской бульвар, 26А, Москва');
      assert.strictEqual(result.businesses[0].rating, '4.8');
      assert.strictEqual(result.businesses[0].phone, '+7 (495) 123-45-67');
      assert.strictEqual(result.businesses[0].category, 'Русская кухня');
    });

    it('разбирает общее количество из HTML', () => {
      const count = parseItemCount(restaurantsHtml);
      assert.strictEqual(count, 1234);
    });

    it('извлекает информацию о постраничной навигации', () => {
      const pagination = extractPagination(restaurantsHtml);
      
      assert.strictEqual(pagination.hasNextPage, true);
      assert.strictEqual(pagination.nextPage, 2);
      assert.strictEqual(pagination.pages.length, 3);
    });

    it('включает запрос в результат', () => {
      const result = parseSearchResults(restaurantsHtml, 'test query');
      assert.strictEqual(result.query, 'test query');
    });
  });

  describe('parseBusinessPage', () => {
    it('извлекает данные организации со страницы деталей', () => {
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

    it('выбрасывает ошибку, если название организации не удалось разобрать', () => {
      assert.throws(
        () => parseBusinessPage('<html><body>empty</body></html>'),
        /Не удалось извлечь название организации/
      );
    });
  });

  describe('normalizeBusinessUrl', () => {
    it('нормализует относительные адреса', () => {
      const result = normalizeBusinessUrl('/msk/restaurants/pushkin');
      assert.ok(result && result.includes('zoon.ru'));
    });

    it('оставляет абсолютные адреса без изменений', () => {
      const result = normalizeBusinessUrl('https://zoon.ru/msk/restaurants/pushkin');
      assert.strictEqual(result, 'https://zoon.ru/msk/restaurants/pushkin');
    });

    it('возвращает null для некорректных адресов', () => {
      const result = normalizeBusinessUrl('not-a-url');
      assert.strictEqual(result, null);
    });

    it('возвращает null для пустого ввода', () => {
      const result = normalizeBusinessUrl('');
      assert.strictEqual(result, null);
    });
  });
});
