# kinopoisk-search

Поиск фильмов и просмотр карточек фильмов через публичные страницы Кинопоиска.

## Обзор

Навык `kinopoisk-search` позволяет получать информацию о фильмах через публичные страницы крупнейшей русскоязычной базы данных о кино — Кинопоиска. Это read-only сценарий, не требующий авторизации, секретов или прокси.

## Что можно сделать

- **Получить карточку фильма** по известному ID Кинопоиска: название, год выпуска, рейтинг Кинопоиска, краткое описание, жанры, режиссёр и основные актёры.
- **Найти фильмы по названию** или ключевым словам: поисковая выдача с названиями, годами, рейтингами и прямыми ссылками на страницы фильмов.
- **Построить публичные URL** для страниц фильма и поиска, чтобы агент мог открыть их в браузере.

## Что нельзя сделать

- Получать пользовательские рецензии, отзывы и оценки.
- Добавлять фильмы в избранное или выставлять оценки.
- Смотреть фильмы онлайн — навык работает только с метаданными.

## Источник данных

- Страница фильма: `https://www.kinopoisk.ru/film/{id}/`
- Поиск фильмов: `https://www.kinopoisk.ru/index/standalone_search/?query={query}`
- Это официальные публичные веб-страницы Кинопоиска, без отдельного REST API.
- Парсинг HTML выполняется через regex-экстракцию, аналогично `stoloto-lotto` и `postcalc-postcodes`.

## Установка

```bash
npm install kinopoisk-search
```

или из корня `ru-skill`:

```bash
npm run build --workspace kinopoisk-search
```

## Использование

### Карточка фильма по ID

```js
const { getFilmById } = require("kinopoisk-search");

const film = await getFilmById("326");

console.log(film.title);
// "Брат 2"

console.log(film.year);
// "2000"

console.log(film.rating);
// "7.7"

console.log(film.director);
// "Алексей Балабанов"

console.log(film.genres);
// ["боевик", "криминал", "драма"]

console.log(film.actors);
// ["Сергей Бодров", "Виктор Сухоруков", ...]

console.log(film.description);
// "Данила Багров возвращается в Россию..."
```

### Поиск фильмов

```js
const { searchFilms } = require("kinopoisk-search");

const results = await searchFilms("Брат");

console.log(results.query);
// "Брат"

for (const film of results.results) {
  console.log(`${film.title} (${film.year}) — рейтинг: ${film.rating}`);
  console.log(film.url);
}
// Брат 2 (2000) — рейтинг: 7.7
// https://www.kinopoisk.ru/film/326/
// Брат (1997) — рейтинг: 8.2
// https://www.kinopoisk.ru/film/117/
```

### Построение URL

```js
const { buildFilmUrl, buildSearchUrl } = require("kinopoisk-search");

console.log(buildFilmUrl("326"));
// "https://www.kinopoisk.ru/film/326/"

console.log(buildSearchUrl("Брат 2"));
// "https://www.kinopoisk.ru/index/standalone_search/?query=Брат+2"
```

## API

| Функция | Описание |
| --- | --- |
| `getFilmById(filmId)` | Получить карточку фильма по ID Кинопоиска |
| `searchFilms(query)` | Поиск фильмов по названию или ключевым словам |
| `buildFilmUrl(filmId)` | Построить публичный URL страницы фильма |
| `buildSearchUrl(query)` | Построить публичный URL страницы поиска |

## Тесты

```bash
npm test --workspace kinopoisk-search
```

Тесты используют fixture-based подход с сохранёнными HTML-страницами Кинопоиска, чтобы CI не зависел от живой вёрстки kinopoisk.ru.

## Примечания

- Кинопоиск не предоставляет отдельного публичного REST API; данные извлекаются из HTML-страниц.
- Вёрстка страниц может меняться; fixture-based тесты помогают отлавливать регрессии парсинга.
- Этот навык — read-only замена сценариев поиска развлечений на российский культурный контекст.
