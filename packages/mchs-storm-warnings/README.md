# mchs-storm-warnings

Клиент только для чтения для официальных региональных страниц МЧС России с экстренными предупреждениями.

## Установка

```bash
npm install mchs-storm-warnings
```

## Публичные интерфейсы

- Индекс предупреждений региона: `https://{region}.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya`
- Страница отдельного предупреждения: `https://{region}.mchs.gov.ru/.../shtormovye-i-ekstrennye-preduprezhdeniya/{warning_id}`
- Тип источника: официальные региональные страницы МЧС, без авторизации

## Использование

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

## Справочник API

### `lookupRegion(query)`

Поиск региона по названию или хосту, возвращает нормализованные хост и полное название.

```js
const { lookupRegion } = require("mchs-storm-warnings");

const kursk = lookupRegion("Курская область");
// { name: "Курская область", host: "46" }

const moscow = lookupRegion("Москва");
// { name: "г. Москва", host: "moscow" }
```

- `query`: название региона или хост (например `"Курская область"`, `"Москва"`, `"46"`, `"moscow"`)
- Возвращает `{ name: string, host: string }` или `null`, если не найден
- Поддерживает нечёткий поиск по русским названиям регионов, включая разговорные сокращения (`"Удмуртия"`, `"Башкирия"`, `"Питер"`, `"СПб"`, `"Подмосковье"`, `"Кузбасс"` и другие)

### `listRegions()`

Возвращает список всех доступных регионов с названиями и хостами.

```js
const { listRegions } = require("mchs-storm-warnings");

const regions = listRegions();
// [{ name: "Республика Адыгея", host: "01" }, ...]
```

- Возвращает массив `{ name: string, host: string }`, отсортированный по русскому названию
- Покрывает все 85 субъектов Российской Федерации

### `listStormWarnings(regionHost, options?)`

- `regionHost`: хост региона МЧС, например `46`, `78`, `moscow`, или название региона вроде `"Курская область"`
- `options.page`: номер страницы (опционально), по умолчанию `0`
- Возвращает нормализованную ленту с `regionName`, `sectionTitle` и `items`

### `getStormWarning(regionHost, warningPathOrId)`

- `warningPathOrId`: числовой идентификатор предупреждения, относительный путь или абсолютный URL
- Возвращает `title`, `publishedAt`, `publishedAtIso`, `bodyText`, ссылки на экспорт и канонический URL предупреждения

### Построение URL

- `buildWarningsIndexUrl(regionHost, options?)`
- `buildWarningUrl(regionHost, warningPathOrId)`
- `buildRegionOrigin(regionHost)`

## Примечания

- Пакет работает только для чтения и не требует секретов.
- `publishedAtIso` нормализуется из публичной страницы и не выводит смещение часового пояса региона.
- Ссылки на экспорт (`pdfUrl`, `wordUrl`) возвращаются, если страница их предоставляет.

## Тесты

```bash
npm test --workspace mchs-storm-warnings
```

Тесты используют подход на основе эталонных данных с сохранёнными страницами предупреждений, чтобы система непрерывной интеграции (CI) не зависела от живой вёрстки МЧС.
