# cbr-rates

Read-only-клиент для официальных курсов валют Банка России через публичный XML-сервис.

## Установка

```bash
npm install cbr-rates
```

## Официальные поверхности

- XML ежедневных курсов: `https://www.cbr.ru/scripts/XML_daily.asp`
- Справка по XML-сервисам: `https://www.cbr.ru/development/SXML/`

## Использование

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

- `date`: `YYYY-MM-DD`, `Date` или без аргумента — текущий день
- Возвращает нормализованные метаданные и массив `currencies`

### `getRate(charCode, date?)`

- `charCode`: трёхбуквенный ISO-код, например `USD`, `EUR`, `CNY`
- Возвращает одну строку валюты с `requestedDate` и `publishedDate`

### `getRateWithChange(charCode, date?, options?)`

- Добавляет предыдущее доступное опубликованное значение и изменение за сутки
- `options.maxLookbackDays` по умолчанию `7`

## Примечания

- Сервис Банка России — read-only и публично доступен.
- Названия валют декодируются из Windows-1251 перед нормализацией.
- Изменение за сутки рассчитывается относительно предыдущей доступной даты публикации, а не строго вчерашнего календарного дня.
