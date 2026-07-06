# stoloto-lotto

Публичный клиент только для чтения для архива результатов лотерей Столото.

## Что делает навык

- Получать последние результаты тиражей для популярных лотерей: `4 из 20`, `5 из 36`, `6 из 45`, `7 из 49`, `Русское лото`, `Топ-3` и других.
- Возвращать номер тиража, дату, выпавшие числа и размер суперприза.
- Работать без авторизации, секретов и посредника.

## Ограничения

- Проверять конкретные билеты по номеру.
- Оформлять заявки на выплату выигрыша.
- Работать с личным кабинетом Столото.

## Источник

- Архив тиражей: `https://www.stoloto.ru/{game}/archive`
- Это официальный публичный веб-интерфейс Столото, без отдельного REST API (API архитектурного стиля REST).
- Разбор страниц HTML через извлечение регулярными выражениями, аналогично `postcalc-postcodes`.

## Установка

```bash
npm install stoloto-lotto
```

или из корня `ru-skill`:

```bash
npm run build --workspace stoloto-lotto
```

## Использование

### Последние тиражи

```js
const { getArchiveDraws } = require("stoloto-lotto");

const draws = await getArchiveDraws("6x45");

console.log(draws.gameName);
// "Архив тиражей лотереи «Спортлото 6 из 45»"

console.log(draws.draws[0]);
// {
//   drawNumber: 98765,
//   date: "07.04.2026",
//   numbers: [15, 24, 33, 41, 7, 45],
//   prize: "15 000 000"
// }
```

### Поддерживаемые лотереи

```js
const { SUPPORTED_GAMES, normalizeGameSlug } = require("stoloto-lotto");

console.log(SUPPORTED_GAMES);
// ["4x20", "5x36", "6x45", "7x49", "12x24", "ruslotto", "top3", "5x2"]

console.log(normalizeGameSlug("6 из 45")); // "6x45"
console.log(normalizeGameSlug("русское лото")); // "ruslotto"
```

### Построение URL

```js
const { buildArchiveUrl } = require("stoloto-lotto");

console.log(buildArchiveUrl("4x20"));
// "https://www.stoloto.ru/4x20/archive"
```

## Справочник API

| Функция | Описание |
| --- | --- |
| `getArchiveDraws(gameSlug)` | Получить последние тиражи для указанной лотереи |
| `getDrawById(gameSlug, drawNumber)` | Получить тираж по номеру (если страница поддерживает фильтрацию) |
| `buildArchiveUrl(gameSlug)` | Построить публичный URL архива |
| `normalizeGameSlug(gameSlug)` | Нормализовать название лотереи в канонический идентификатор |
| `SUPPORTED_GAMES` | Массив поддерживаемых канонических идентификаторов |

## Тесты

```bash
npm test --workspace stoloto-lotto
```

Тесты используют подход на основе эталонных данных с сохранёнными страницами HTML архива, чтобы система непрерывной интеграции (CI) не зависела от живой вёрстки stoloto.ru.
