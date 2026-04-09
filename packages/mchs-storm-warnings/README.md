# mchs-storm-warnings

Read-only Node.js client for official regional MChS storm and emergency warning pages.

## Install

```bash
npm install mchs-storm-warnings
```

## Public surfaces

- Regional warnings index: `https://{region}.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya`
- Individual warning page: `https://{region}.mchs.gov.ru/.../shtormovye-i-ekstrennye-preduprezhdeniya/{warning_id}`
- Source type: official regional MChS pages, no auth required

## Usage

```js
const {
  getStormWarning,
  listStormWarnings
} = require("mchs-storm-warnings");

(async () => {
  const latest = await listStormWarnings("46");
  const warning = await getStormWarning("46", latest.items[0].warningId);

  console.log(latest.regionName);
  console.log(latest.items[0].title);
  console.log(warning.bodyText);
})();
```

## API

### `lookupRegion(query)`

Look up a region by name or host and return the normalized host and full name.

```js
const { lookupRegion } = require("mchs-storm-warnings");

const kursk = lookupRegion("Курская область");
// { name: "Курская область", host: "46" }

const moscow = lookupRegion("Москва");
// { name: "г. Москва", host: "moscow" }
```

- `query`: region name or host (e.g. `"Курская область"`, `"Москва"`, `"46"`, `"moscow"`)
- Returns `{ name: string, host: string }` or `null` if not found
- Supports fuzzy matching on Russian region names

### `listRegions()`

List all available regions with their names and hosts.

```js
const { listRegions } = require("mchs-storm-warnings");

const regions = listRegions();
// [{ name: "Республика Адыгея", host: "01" }, ...]
```

- Returns an array of `{ name: string, host: string }` sorted by Russian name
- Covers all 85+ Russian federal subjects

### `listStormWarnings(regionHost, options?)`

- `regionHost`: MChS regional host such as `46`, `78`, `moscow`, or a region name like `"Курская область"`
- `options.page`: optional page number, default `0`
- Returns a normalized feed with `regionName`, `sectionTitle`, and `items`

### `getStormWarning(regionHost, warningPathOrId)`

- `warningPathOrId`: numeric warning id, relative path, or absolute warning URL
- Returns `title`, `publishedAt`, `publishedAtIso`, `bodyText`, export links, and the canonical warning URL

### URL builders

- `buildWarningsIndexUrl(regionHost, options?)`
- `buildWarningUrl(regionHost, warningPathOrId)`
- `buildRegionOrigin(regionHost)`

## Notes

- The package stays read-only and does not need secrets.
- `publishedAtIso` is normalized from the public page and does not infer region-specific timezone offsets.
- Export links (`pdfUrl`, `wordUrl`) are returned when the page exposes them.

## Tests

```bash
npm test --workspace mchs-storm-warnings
```

Fixture-based tests pin both the warning feed and an individual warning page, so CI does not depend on live MChS markup.
