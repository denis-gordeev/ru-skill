/**
 * Parse Zoon.ru HTML responses for business listings
 * 
 * Zoon.ru provides SSR pages with structured HTML containing:
 * - Business names
 * - Addresses
 * - Ratings
 * - Phone numbers
 * - Categories
 * 
 * This parser extracts business cards from category/city pages.
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
 * Parse a Zoon.ru category page HTML and extract business listings
 * @param {string} html - Raw HTML from Zoon.ru
 * @param {string} query - Original search query for context
 * @returns {{ businesses: Array<{name: string, address?: string, rating?: string, phone?: string, category?: string, url?: string}>, totalCount?: number, pagination: {hasNextPage: boolean, nextPage?: number} }}
 */
function parseSearchResults(html, query = '') {
  const businesses = [];
  
  // Split by organization containers - match from start to next container or end
  const containerStartRegex = /<div[^>]*data-item-type="organization"[^>]*>/gi;
  const starts = [...html.matchAll(containerStartRegex)];
  
  for (let i = 0; i < starts.length; i++) {
    const startIndex = starts.index;
    // Find the next container start or use end of HTML
    const endIndex = i + 1 < starts.length ? starts[i + 1].index : html.length;
    const container = html.substring(startIndex, endIndex);
    
    // Extract name
    const nameMatch = container.match(/itemprop="name">([^<]+)</i);
    const name = nameMatch ? nameMatch[1].trim() : null;
    
    if (!name) continue;
    
    const business = { name };
    
    // Extract address
    const addressMatch = container.match(/itemprop="address"[^>]*>([^<]+)</i);
    if (addressMatch) business.address = addressMatch[1].trim();
    
    // Extract rating
    const ratingMatch = container.match(/itemprop="ratingValue"[^>]*>([^<]+)</i);
    if (ratingMatch) business.rating = ratingMatch[1].trim();
    
    // Extract phone
    const phoneMatch = container.match(/itemprop="telephone"[^>]*>([^<]+)</i);
    if (phoneMatch) business.phone = phoneMatch[1].trim();
    
    // Extract category
    const categoryMatch = container.match(/itemprop="servesCuisine"[^>]*>([^<]+)</i);
    if (categoryMatch) business.category = categoryMatch[1].trim();
    
    // Extract URL
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
 * Normalize a Zoon.ru business URL
 * @param {string} url - Raw URL
 * @returns {string|null}
 */
function normalizeBusinessUrl(url) {
  if (!url) return null;
  
  // If it looks like a valid Zoon.ru path, normalize it
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
 * Parse a business detail page from Zoon.ru
 * @param {string} html - Raw HTML from Zoon.ru business page
 * @param {string} url - Page URL for context
 * @returns {{name: string, address?: string, rating?: string, phone?: string, category?: string, description?: string, website?: string, hours?: string}}
 */
function parseBusinessPage(html, url = '') {
  const name = extractText(html, 'itemprop="name"') || 
               extractText(html, 'organizationCard__title');
  
  if (!name) {
    throw new Error('Unable to parse business name from Zoon.ru page');
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
  // Internal utilities exposed for testing
  extractText,
  extractHref,
  parseItemCount,
  extractPagination
};
