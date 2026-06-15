---
name: ru-skill-setup
description: После установки ru-skill настройте общие секреты и проверки времени выполнения через предпочтительное имя ru-skill, сохранив совместимость с legacy alias `k-skill-setup`.
license: MIT
metadata:
  category: setup
  locale: ru-RU
  phase: v1
---

# Настройка ru-skill

## Назначение

`ru-skill-setup` - предпочтительный setup-alias для общего post-install потока в этом репозитории.

- Готовит shared secrets и проверки времени выполнения после установки полного набора `ru-skill`
- Сначала использует `~/.config/ru-skill/secrets.env`
- Сохраняет совместимость с legacy-именем `k-skill-setup` и резервным путём `~/.config/k-skill/secrets.env`

## Порядок разрешения учётных данных

Все требующие учётных данных навыки используют один и тот же порядок.

1. Уже выставленная переменная окружения
2. Secret vault агента
3. `~/.config/ru-skill/secrets.env`
4. Legacy-резерв `~/.config/k-skill/secrets.env`
5. Запрос значения у пользователя и сохранение через один из путей выше

Явное переопределение: `RU_SKILL_SECRETS_FILE`, затем `KSKILL_SECRETS_FILE`.

## Стандартный сценарий

1. Установить навыки из `denis-gordeev/ru-skill`
2. Выполнить общую настройку по [docs/setup.md](../docs/setup.md)
3. Проверить окружение командой:

```bash
bash scripts/check-setup.sh
```

4. При необходимости продолжить с feature-specific навыками

Для `fine-dust-location` опубликованный совместимый адрес прокси остаётся рабочим вариантом по умолчанию без дополнительного секрета. `KSKILL_PROXY_BASE_URL` используется только как необязательное переопределение адреса, а реальным секретом в сценариях прямого резервного доступа или прокси на собственном сервере остаётся `AIR_KOREA_OPEN_API_KEY`.

## Совместимость

- Предпочтительное имя setup-навыка: `ru-skill-setup`
- Legacy alias: `k-skill-setup`
- Предпочтительный secrets path: `~/.config/ru-skill/secrets.env`
- Legacy-резервный путь: `~/.config/k-skill/secrets.env`
- Предпочтительные артефакты выполнения для проверок обновлений и логов: `~/.config/ru-skill/bin` и `~/.config/ru-skill/logs`

Оба имени должны вести к одному и тому же setup-потоку без ломающей миграции.
