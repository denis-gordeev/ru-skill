# postcalc-postcodes

Read-only-клиент для публичных страниц Postcalc: справочник индексов и отделений Почты России.

## Установка

```bash
npm install postcalc-postcodes
```

## Использование

```js
const { getOfficeOverview, getCityOverview } = require("postcalc-postcodes");

const office = await getOfficeOverview("109189");
const city = await getCityOverview("Сыктывкар");
```

`getOfficeOverview(postalCode)` возвращает нормализованную карточку отделения с идентификатором региона, `cityKey`, координатами, адресом, типом отделения, телефоном (если указан) и каноническим URL Postcalc.

`getCityOverview(cityKey)` возвращает нормализованные параметры населённого пункта: `regId`, `cityKey`, индекс по умолчанию, население и список видимых отделений с координатами и примечаниями.

## Примечания

- Источник данных: публичные страницы `https://postcalc.ru/offices/...` и `https://postcalc.ru/cities/...`
- Read-only, не требует пользовательских секретов
- Тесты используют HTML-образцы на основе эталонных данных, чтобы CI не зависел от живой вёрстки
