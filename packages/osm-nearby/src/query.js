/**
 * Build Overpass QL query for nearby places
 * @param {number} lat
 * @param {number} lon
 * @param {number} radius - meters (default 1000)
 * @param {string[]} categories - amenity types (default ['restaurant', 'cafe', 'bar'])
 * @param {number} limit - max results (default 20)
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
 * Parse Overpass API response into normalized place objects
 * @param {Object} data - parsed JSON from Overpass API
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
        amenity: tags.amenity || 'unknown',
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
 * Format address from OSM tags
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
