# osm-nearby

Read-only client for nearby places search via OpenStreetMap Overpass API.

## Features

- Search nearby restaurants, cafes, bars, and other amenities by coordinates
- Free, no API key required
- Global coverage via OpenStreetMap
- Returns place details: name, address, phone, website, opening hours, cuisine type

## Usage

```javascript
const { searchNearby, searchRestaurants, searchCafes, searchBars, getPlaceDetails } = require("osm-nearby");

// Search all food/drink places within 1km
const places = await searchNearby(55.7558, 37.6173, {
  radius: 1000,
  categories: ['restaurant', 'cafe', 'bar'],
  limit: 20
});

// Search restaurants only within 2km
const restaurants = await searchRestaurants(55.7558, 37.6173, {
  radius: 2000,
  limit: 10
});

// Get details of a specific place by OSM node ID
const details = await getPlaceDetails(1234567890);
```

## API

### `searchNearby(lat, lon, options?)`

Search nearby places by coordinates.

**Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude
- `options` (object, optional):
  - `radius` (number): Search radius in meters (default: 1000)
  - `categories` (string[] | 'restaurant' | 'cafe' | 'bar'): Amenity types (default: ['restaurant', 'cafe', 'bar'])
  - `limit` (number): Maximum results (default: 20)

**Returns:** Array of place objects with `name`, `lat`, `lon`, `amenity`, `address?`, `phone?`, `website?`, `openingHours?`, `cuisine?`.

### `searchRestaurants(lat, lon, options?)`

Search nearby restaurants specifically (includes `restaurant`, `fast_food`, `food_court`).

### `searchCafes(lat, lon, options?)`

Search nearby cafes specifically (includes `cafe`, `biergarten`, `ice_cream`).

### `searchBars(lat, lon, options?)`

Search nearby bars specifically (includes `bar`, `pub`, `nightclub`).

### `getPlaceDetails(osmNodeId)`

Get details of a specific place by OSM element ID.

**Returns:** Place object or `null` if not found.

## Data Source

This package uses the [Overpass API](https://overpass-api.de/) to query OpenStreetMap data. No API key is required.

- Main endpoint: `https://overpass-api.de/api/interpreter`
- Rate limits: ~10,000 queries/day on main instance
- Data license: [ODbL](https://www.openstreetmap.org/copyright)

## Limitations

- No ratings or reviews (unlike curated services)
- Data quality varies by region (better in major cities)
- Not all places have complete metadata (phone, website, etc.)
