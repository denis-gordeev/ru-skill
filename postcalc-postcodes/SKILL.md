---
name: postcalc-postcodes
description: Проверка российских почтовых индексов и карточек отделений через публичные страницы Postcalc. Использовать, когда пользователь спрашивает конкретный 6-значный индекс отделения или сводку по населённому пункту через `citykey`.
license: MIT
metadata:
  category: местоположение
  locale: ru-RU
  phase: v1
---

# Почтовые индексы Postcalc

## Что делает навык

Пакет `postcalc-postcodes` получает сводку только для чтения по отделению Почты России или по населённому пункту через публичные страницы `Postcalc`.

## Когда использовать

- "Покажи карточку отделения 109189"
- "Дай отделения Почты России для Сыктывкара"
- "Какой `citykey` и индекс по умолчанию у Сыктывкара"

## Предварительные условия

- Node.js 18+
- После публикации: `npm install -g postcalc-postcodes`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Входные данные

- Шестизначный индекс отделения, например `109189` или `167000`
- `citykey` населённого пункта, например `Сыктывкар` или `Москва`

## Рабочий процесс

### 0. Установить пакет глобально, если отсутствует

Если `node -e 'require("postcalc-postcodes")'` не проходит, сначала ставится пакет, а не собирается разовая программа разбора HTML.

```bash
npm install -g postcalc-postcodes
export NODE_PATH="$(npm root -g)"
```

### 1. Получить карточку отделения по почтовому индексу

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getOfficeOverview } = require("postcalc-postcodes");

getOfficeOverview("109189").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. Получить сводку по населённому пункту через `citykey`

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getCityOverview } = require("postcalc-postcodes");

getCityOverview("Сыктывкар").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Критерии завершения

- Для индекса показаны `officeName`, адрес, `officeType`, координаты и `cityKey`
- Для населённого пункта показаны `regId`, `cityKey`, `defaultPostalCode` и список `offices`
- Источник явно описан как публичный `Postcalc` только для чтения

## Возможные ошибки

- HTML-вёрстка `Postcalc` может измениться
- Для редких `citykey` возможны неоднозначные названия, поэтому нужно смотреть на `regId` и `cityKeyFull`
- Некоторые отделения могут отображаться без адреса или с пометкой, что их нет в Паспорте ОПС

## Примечания

- Навык работает только в режиме чтения
- Пользовательские секреты не нужны
