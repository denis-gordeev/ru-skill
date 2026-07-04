# cbr-rates

Клиент только для чтения для официальных курсов валют Банка России через публичный сервис в формате XML.

## Установка

```bash
npm install cbr-rates
```

## Официальные интерфейсы

- XML ежедневных курсов: `https://www.cbr.ru/scripts/XML_daily.asp`
- Справка по сервисам в формате XML: `https://www.cbr.ru/development/SXML/`

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

## Справочник API

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

- Сервис Банка России — только для чтения и публично доступен.
- Названия валют декодируются из Windows-1251 перед нормализацией.
- Изменение за сутки рассчитывается относительно предыдущей доступной даты публикации, а не строго вчерашнего календарного дня.
