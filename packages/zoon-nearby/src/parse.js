/**
 * Разбор ответов HTML Zoon.ru для списков организаций
 *
 * Zoon.ru предоставляет страницы с серверной отрисовкой (SSR) со структурированным HTML, содержащим:
 * - Названия организаций
 * - Адреса
 * - Рейтинги
 * - Телефоны
 * - Категории
 *
 * Этот модуль разбора извлекает карточки организаций из страниц категорий/городов.
 */

const NAME_SELECTOR = '[data-item-type="organization"] [itemprop="name"], .catalogItem__title';
const ADDRESS_SELECTOR = '[itemprop="address"], .catalogItem__address';
const RATING_SELECTOR = '[itemprop="ratingValue"], .catalogItem__rating';
const PHONE_SELECTOR = '[itemprop="telephone"], .catalogItem__phone';
const CATEGORY_SELECTOR = '[itemprop="servesCuisine"], .catalogItem__category';
const URL_SELECTOR = 'a[itemprop="url"], .catalogItem__title a';
const ITEM_CONTAINER = '[data-item-type="organization"], .catalogItem';

function extractText(html, selector) {
  const match = html.match(new RegExp(`${selector}[^>]*>([^<]+)<`, 'i'));
  return match ? match[1].trim() : null;
}

function extractHref(html, selector) {
  const match = html.match(new RegExp(`${selector}[^>]*href="([^"]+)"`, 'i'));
  return match ? match[1] : null;
}

function parseItemCount(html) {
  const match = html.match(/Найдено\s+([\d\s,]+)\s+организаци/i) || 
                html.match(/found\s+([\d\s,]+)\s+organizat/i);
  if (match) {
    return parseInt(match[1].replace(/\s/g, '').replace(/,/g, ''), 10);
  }
  return null;
}

function extractPagination(html) {
  const pages = [];
  const pageRegex = /href="([^"]*page=(\d+)[^"]*)"[^>]*>(\d+)</g;
  let match;
  
  while ((match = pageRegex.exec(html)) !== null) {
    pages.push({
      url: match[1],
      page: parseInt(match[2], 10),
      label: match[3]
    });
  }
  
  const nextPageMatch = html.match(/href="([^"]*page=(\d+)[^"]*)"[^>]*>Следующая/i);
  const hasNextPage = !!nextPageMatch;
  const nextPage = hasNextPage ? parseInt(nextPageMatch[2], 10) : null;
  
  return {
    pages,
    hasNextPage,
    nextPage
  };
}

/**
 * Разобрать HTML страницы категории Zoon.ru и извлечь список организаций
 * @param {string} html - Исходный HTML с Zoon.ru
 * @param {string} query - Исходный поисковый запрос для контекста
 * @returns {{ businesses: Array<{name: string, address?: string, rating?: string, phone?: string, category?: string, url?: string}>, totalCount?: number, pagination: {hasNextPage: boolean, nextPage?: number} }}
 */
function parseSearchResults(html, query = '') {
  const businesses = [];
  
  // Разделение по контейнерам организаций — совпадение от начала до следующего контейнера или конца
  const containerStartRegex = /<div[^>]*data-item-type="organization"[^>]*>/gi;
  const starts = [...html.matchAll(containerStartRegex)];
  
  for (let i = 0; i < starts.length; i++) {
    const startIndex = starts.index;
    // Найти начало следующего контейнера или использовать конец HTML
    const endIndex = i + 1 < starts.length ? starts[i + 1].index : html.length;
    const container = html.substring(startIndex, endIndex);
    
    // Извлечь название
    const nameMatch = container.match(/itemprop="name">([^<]+)</i);
    const name = nameMatch ? nameMatch[1].trim() : null;
    
    if (!name) continue;
    
    const business = { name };
    
    // Извлечь адрес
    const addressMatch = container.match(/itemprop="address"[^>]*>([^<]+)</i);
    if (addressMatch) business.address = addressMatch[1].trim();
    
    // Извлечь рейтинг
    const ratingMatch = container.match(/itemprop="ratingValue"[^>]*>([^<]+)</i);
    if (ratingMatch) business.rating = ratingMatch[1].trim();
    
    // Извлечь телефон
    const phoneMatch = container.match(/itemprop="telephone"[^>]*>([^<]+)</i);
    if (phoneMatch) business.phone = phoneMatch[1].trim();
    
    // Извлечь категорию
    const categoryMatch = container.match(/itemprop="servesCuisine"[^>]*>([^<]+)</i);
    if (categoryMatch) business.category = categoryMatch[1].trim();
    
    // Извлечь адрес
    const urlMatch = container.match(/itemprop="url"[^>]*href="([^"]+)"/i);
    if (urlMatch) {
      business.url = urlMatch[1].startsWith('http') ? urlMatch[1] : `https://zoon.ru${urlMatch[1]}`;
    }
    
    businesses.push(business);
  }
  
  const totalCount = parseItemCount(html);
  const pagination = extractPagination(html);
  
  return {
    businesses,
    totalCount,
    pagination,
    query
  };
}

/**
 * Нормализовать адрес организации на Zoon.ru
 * @param {string} url - Исходный адрес
 * @returns {string|null}
 */
function normalizeBusinessUrl(url) {
  if (!url) return null;
  
  // Если похоже на допустимый путь Zoon.ru, нормализовать
  if (url.startsWith('/')) {
    return `https://zoon.ru${url}`;
  }
  
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Разобрать страницу организации на Zoon.ru
 * @param {string} html - Исходный HTML со страницы организации на Zoon.ru
 * @param {string} url - Адрес страницы для контекста
 * @returns {{name: string, address?: string, rating?: string, phone?: string, category?: string, description?: string, website?: string, hours?: string}}
 */
function parseBusinessPage(html, url = '') {
  const name = extractText(html, 'itemprop="name"') || 
               extractText(html, 'organizationCard__title');
  
  if (!name) {
    throw new Error('Не удалось извлечь название организации со страницы Zoon.ru');
  }
  
  const result = { name };
  
  const address = extractText(html, 'itemprop="address"');
  if (address) result.address = address;
  
  const rating = extractText(html, 'itemprop="ratingValue"');
  if (rating) result.rating = rating;
  
  const phone = extractText(html, 'itemprop="telephone"');
  if (phone) result.phone = phone;
  
  const category = extractText(html, 'itemprop="servesCuisine') || 
                   extractText(html, 'organizationCard__category');
  if (category) result.category = category;
  
  const description = extractText(html, 'itemprop="description"') || 
                      extractText(html, 'organizationCard__description');
  if (description) result.description = description;
  
  const website = extractHref(html, 'itemprop="url"');
  if (website) result.website = website;
  
  const hours = extractText(html, 'itemprop="openingHours"') || 
                extractText(html, 'organizationCard__hours');
  if (hours) result.hours = hours;
  
  result.url = url;
  
  return result;
}

module.exports = {
  parseSearchResults,
  parseBusinessPage,
  normalizeBusinessUrl,
  // Внутренние утилиты, открытые для тестирования
  extractText,
  extractHref,
  parseItemCount,
  extractPagination
};
