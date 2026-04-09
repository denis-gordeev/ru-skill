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

### `listStormWarnings(regionHost, options?)`

- `regionHost`: MChS regional host such as `46`, `78`, or `moscow`
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
