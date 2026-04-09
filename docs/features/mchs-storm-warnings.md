# Экстренные предупреждения МЧС

## Что делает навык

`mchs-storm-warnings` - это read-only-обёртка над официальными региональными страницами МЧС России для списка последних экстренных предупреждений и чтения карточки конкретного предупреждения.

## Когда использовать

- Нужно быстро проверить официальные штормовые предупреждения по конкретному российскому региону
- Нужно показать пользователю первоисточник, а не пересказ из новостного агрегатора
- Нужно получить нормализованный текст предупреждения, дату публикации и ссылку на PDF/Word-экспорт страницы

## Предварительные условия

- Node.js 18+
- После публикации: `npm install -g mchs-storm-warnings`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке из этого репозитория: `npm install`

## Базовый сценарий

1. Если пакет не установлен, сначала поставить `mchs-storm-warnings`.
2. Уточнить региональный хост МЧС, например `46`, `78` или `moscow`.
3. Получить первую страницу списка предупреждений через `listStormWarnings`.
4. Если нужен полный официальный текст, дочитать карточку через `getStormWarning`.

## Пример: список последних предупреждений

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { listStormWarnings } = require("mchs-storm-warnings");

listStormWarnings("46").then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Пример: карточка предупреждения

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getStormWarning } = require("mchs-storm-warnings");

getStormWarning("46", "5695266").then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
JS
```

## Что возвращать пользователю

- Для списка: `title`, `publishedAt`, `publishedAtIso`, `tag`, `warningId`, `url`
- Для карточки: `title`, `bodyText`, `publishedAt`, `publishedAtIso`, `sectionTitle`, `pdfUrl`, `wordUrl`
- Для региона: `regionHost` и `regionName`, если они восстанавливаются из страницы

## Ограничения

- Это только read-only сценарий
- Источник данных: официальные страницы вида `https://{region}.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya`
- Региональный хост должен быть известен заранее; этот MVP не решает задачу общего поиска региона по названию
- `publishedAtIso` нормализуется из публичной строки даты или `itemprop="datePublished"` и не добавляет региональную временную зону
