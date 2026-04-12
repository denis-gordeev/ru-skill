const { buildOverpassQuery, parseOverpassResponse } = require("./query");

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";
const DEFAULT_HEADERS = {
  accept: "application/json",
  "user-agent": "ru-skill/osm-nearby"
};

const AMENITY_CATEGORIES = {
  restaurant: ['restaurant', 'fast_food', 'food_court'],
  cafe: ['cafe', 'biergarten', 'ice_cream'],
  bar: ['bar', 'pub', 'nightclub']
};

/**
 * Search nearby places by coordinates
 * @param {number} lat - latitude
 * @param {number} lon - longitude
 * @param {{ radius?: number, categories?: string[] | 'restaurant' | 'cafe' | 'bar', limit?: number }} options
 * @returns {Promise<Array<{name: string, lat: number, lon: number, amenity: string, address?: string, phone?: string, website?: string, openingHours?: string, cuisine?: string}>>}
 */
async function searchNearby(lat, lon, options = {}) {
  const radius = options.radius ?? 1000;
  const limit = options.limit ?? 20;
  
  let categories;
  if (options.categories) {
    if (typeof options.categories === 'string' && AMENITY_CATEGORIES[options.categories]) {
      categories = AMENITY_CATEGORIES[options.categories];
    } else if (Array.isArray(options.categories)) {
      categories = options.categories;
    } else {
      categories = ['restaurant', 'cafe', 'bar'];
    }
  } else {
    categories = ['restaurant', 'cafe', 'bar'];
  }

  const query = buildOverpassQuery(lat, lon, radius, categories, limit);
  
  const response = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: `data=${encodeURIComponent(query)}`
  });

  if (!response.ok) {
    throw new Error(`Overpass API request failed with ${response.status}`);
  }

  const data = await response.json();
  return parseOverpassResponse(data);
}

/**
 * Search nearby restaurants specifically
 * @param {number} lat
 * @param {number} lon
 * @param {{ radius?: number, limit?: number }} options
 */
async function searchRestaurants(lat, lon, options = {}) {
  return searchNearby(lat, lon, {
    ...options,
    categories: 'restaurant'
  });
}

/**
 * Search nearby cafes specifically
 * @param {number} lat
 * @param {number} lon
 * @param {{ radius?: number, limit?: number }} options
 */
async function searchCafes(lat, lon, options = {}) {
  return searchNearby(lat, lon, {
    ...options,
    categories: 'cafe'
  });
}

/**
 * Search nearby bars specifically
 * @param {number} lat
 * @param {number} lon
 * @param {{ radius?: number, limit?: number }} options
 */
async function searchBars(lat, lon, options = {}) {
  return searchNearby(lat, lon, {
    ...options,
    categories: 'bar'
  });
}

/**
 * Get place details by OSM element ID (re-fetches from Overpass)
 * @param {number} id - OSM node ID
 * @returns {Promise<{name: string, lat: number, lon: number, amenity: string, address?: string, phone?: string, website?: string, openingHours?: string, cuisine?: string} | null>}
 */
async function getPlaceDetails(id) {
  const query = `
[out:json][timeout:25];
node(${id});
out body;
`;

  const response = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: `data=${encodeURIComponent(query)}`
  });

  if (!response.ok) {
    throw new Error(`Overpass API request failed with ${response.status}`);
  }

  const data = await response.json();
  const places = parseOverpassResponse(data);
  
  return places.length > 0 ? places[0] : null;
}

module.exports = {
  searchNearby,
  searchRestaurants,
  searchCafes,
  searchBars,
  getPlaceDetails
};
