# kinopoisk-search

Публичный read-only клиент для поиска фильмов и просмотра карточек фильмов на Кинопоиске.

## Что умеет

- Получать карточку фильма по ID Кинопоиска: название, год, рейтинг, описание, жанры, режиссёр, актёры.
- Искать фильмы по названию или ключевым словам.
- Работать без авторизации, секретов и прокси.

## Что не умеет

- Получать отзывы, рецензии и пользовательские оценки.
- Добавлять фильмы в избранное или оценивать фильмы.
- Работать с онлайн-просмотром фильмов.

## Источник

- Страница фильма: `https://www.kinopoisk.ru/film/{id}/`
- Поиск фильмов: `https://www.kinopoisk.ru/index/standalone_search/?query={query}`
- Это публичные веб-страницы Кинопоиска, без отдельного REST API.
- Парсинг HTML-страниц через regex-экстракцию, аналогично `stoloto-lotto` и `postcalc-postcodes`.

## Установка

```bash
npm install kinopoisk-search
```

или из корня `ru-skill`:

```bash
npm run build --workspace kinopoisk-search
```

## Использование

### Карточка фильма

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
```

### Поиск фильмов

```js
const { searchFilms } = require("kinopoisk-search");

const results = await searchFilms("Брат");

console.log(results.results[0]);
// {
//   filmId: "326",
//   title: "Брат 2",
//   year: "2000",
//   rating: "7.7",
//   url: "https://www.kinopoisk.ru/film/326/"
// }
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
