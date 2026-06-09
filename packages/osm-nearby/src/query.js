/**
 * Построить запрос Overpass QL для поиска ближайших мест
 * @param {number} lat
 * @param {number} lon
 * @param {number} radius - метры (по умолчанию 1000)
 * @param {string[]} categories - типы amenity (по умолчанию ['restaurant', 'cafe', 'bar'])
 * @param {number} limit - максимальное количество результатов (по умолчанию 20)
 * @returns {string}
 */
function buildOverpassQuery(lat, lon, radius = 1000, categories = ['restaurant', 'cafe', 'bar'], limit = 20) {
  const amenityFilter = categories.map(cat => `node["amenity"="${cat}"](around:${radius},${lat},${lon});`).join('\n  ');
  
  return `[out:json][timeout:25];
(
  ${amenityFilter}
);
out body ${limit};`;
}

/**
 * Разобрать ответ Overpass API в нормализованные объекты мест
 * @param {Object} data - разобранный JSON из Overpass API
 * @returns {Array<{name: string, lat: number, lon: number, amenity: string, address?: string, phone?: string, website?: string, openingHours?: string, cuisine?: string}>}
 */
function parseOverpassResponse(data) {
  if (!data || !data.elements || !Array.isArray(data.elements)) {
    return [];
  }

  return data.elements
    .filter(element => element.type === 'node' && element.tags)
    .map(element => {
      const tags = element.tags;
      
      return {
        name: tags.name || 'Без названия',
        lat: element.lat,
        lon: element.lon,
        amenity: tags.amenity || "неизвестно",
        address: formatAddress(tags),
        phone: tags.phone || tags['contact:phone'] || undefined,
        website: tags.website || tags['contact:website'] || undefined,
        openingHours: tags.opening_hours || undefined,
        cuisine: tags.cuisine || undefined,
        operator: tags.operator || undefined
      };
    });
}

/**
 * Форматировать адрес из тегов OSM
 * @param {Object} tags
 * @returns {string|undefined}
 */
function formatAddress(tags) {
  const parts = [];
  
  if (tags['addr:street']) {
    parts.push(tags['addr:street']);
    if (tags['addr:housenumber']) {
      parts.push(tags['addr:housenumber']);
    }
  }
  
  if (tags['addr:city']) {
    parts.push(tags['addr:city']);
  }
  
  return parts.length > 0 ? parts.join(', ') : undefined;
}

module.exports = {
  buildOverpassQuery,
  parseOverpassResponse,
  formatAddress
};
