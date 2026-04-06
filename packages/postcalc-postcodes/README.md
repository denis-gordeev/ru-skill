# postcalc-postcodes

Read-only client for Postcalc city and post office reference pages that expose Russian postal index and branch metadata.

## Install

```bash
npm install postcalc-postcodes
```

## Usage

```js
const { getOfficeOverview, getCityOverview } = require("postcalc-postcodes");

const office = await getOfficeOverview("109189");
const city = await getCityOverview("Сыктывкар");
```

`getOfficeOverview(postalCode)` returns a normalized office card with the region id, `cityKey`, coordinates, address, office type, optional phone, and canonical Postcalc URL.

`getCityOverview(cityKey)` returns normalized city parameters such as `regId`, `cityKey`, default postal code, population snapshot, and a list of visible offices with coordinates and notes.

## Notes

- Data source: public `https://postcalc.ru/offices/...` and `https://postcalc.ru/cities/...` pages
- Read-only only, no user secrets required
- Tested with fixture-based HTML samples so CI does not depend on live layout
