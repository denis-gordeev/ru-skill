---
name: ru-skill-setup
description: After installing ru-skill, configure shared secrets and runtime checks using the preferred ru-skill naming while keeping compatibility with legacy k-skill-setup.
license: MIT
metadata:
  category: setup
  locale: ru-RU
  phase: v1
---

# ru-skill Setup

## Purpose

`ru-skill-setup` - предпочтительный setup-alias для общего post-install потока в этом репозитории.

- Готовит shared secrets и runtime-проверки после установки полного набора `ru-skill`
- Сначала использует `~/.config/ru-skill/secrets.env`
- Сохраняет совместимость с legacy-именем `k-skill-setup` и fallback-путём `~/.config/k-skill/secrets.env`

## Resolution order

Все credential-bearing навыки используют один и тот же порядок.

1. Уже выставленная переменная окружения
2. Secret vault агента
3. `~/.config/ru-skill/secrets.env`
4. Legacy fallback `~/.config/k-skill/secrets.env`
5. Запрос значения у пользователя и сохранение через один из путей выше

Явное переопределение: `RU_SKILL_SECRETS_FILE`, затем `KSKILL_SECRETS_FILE`.

## Default flow

1. Установить навыки из `denis-gordeev/ru-skill`
2. Выполнить общую настройку по [docs/setup.md](../docs/setup.md)
3. Проверить окружение командой:

```bash
bash scripts/check-setup.sh
```

4. При необходимости продолжить с feature-specific навыками

## Compatibility

- Предпочтительное имя setup-навыка: `ru-skill-setup`
- Legacy alias: `k-skill-setup`
- Предпочтительный secrets path: `~/.config/ru-skill/secrets.env`
- Legacy fallback path: `~/.config/k-skill/secrets.env`

Оба имени должны вести к одному и тому же setup-потоку без ломающей миграции.
