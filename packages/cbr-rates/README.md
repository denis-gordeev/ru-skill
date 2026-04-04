# cbr-rates

Read-only Node.js client for the official Bank of Russia XML exchange-rate feeds.

## Install

```bash
npm install cbr-rates
```

## Official surfaces

- Daily rates XML: `https://www.cbr.ru/scripts/XML_daily.asp`
- XML services reference: `https://www.cbr.ru/development/SXML/`

## Usage

```js
const { getDailyRates, getRate, getRateWithChange } = require("cbr-rates");

(async () => {
  const daily = await getDailyRates("2026-04-02");
  const usd = await getRate("USD", "2026-04-02");
  const cny = await getRateWithChange("CNY", "2026-04-02");

  console.log(daily.date);
  console.log(usd.unitRate);
  console.log(cny.change);
})();
```

## API

### `getDailyRates(date?)`

- `date`: `YYYY-MM-DD`, `Date`, or omitted for today
- Returns normalized metadata plus the full `currencies` array

### `getRate(charCode, date?)`

- `charCode`: 3-letter ISO code like `USD`, `EUR`, `CNY`
- Returns one normalized currency row with `requestedDate` and `publishedDate`

### `getRateWithChange(charCode, date?, options?)`

- Adds the previous available published value and day-over-day change
- `options.maxLookbackDays` defaults to `7`

## Notes

- The Bank of Russia feed is read-only and public.
- Currency names are decoded from Windows-1251 before normalization.
- Day-over-day change is calculated against the previous available published date, not strictly calendar yesterday.
