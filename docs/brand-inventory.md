# Brand Inventory

Этот документ фиксирует, где в репозитории ещё остаётся бренд `k-skill`, зачем он там нужен и что можно безопасно менять в рамках миграции `ru-skill`.

## Статус на 2026-04-04

Инвентарь собран по `package.json`, skill-именам, feature-guides, корневой документации и служебным скриптам. Основной вывод: бренд `k-skill` уже не доминирует на верхнем уровне, а часть критичных migration-пунктов уже закрыта через compatibility-layer, но несколько legacy surface area всё ещё нельзя переименовать без явного migration plan.

## Где `k-skill` пока остаётся намеренно

| Поверхность | Текущее имя или путь | Почему пока остаётся | Что делать дальше |
| --- | --- | --- | --- |
| Workspace package | `packages/k-skill-proxy` / npm name `k-skill-proxy` | Это внутренний переходный пакет, уже описанный как инфраструктурная база | Сохранить имя как legacy-compatible, но в документации продвигать его только как transition-layer внутри `ru-skill` |
| Skill | `k-skill-setup` | Legacy-имя всё ещё может быть вызвано во внешних средах | Alias `ru-skill-setup` уже добавлен; дальше продвигать только новое имя, оставляя legacy alias ради совместимости |
| Secrets path | `~/.config/k-skill/secrets.env` | Legacy-путь всё ещё может существовать у текущих пользователей | Dual-path уже внедрён: сначала `ru-skill`, затем fallback на `k-skill`; дальше убирать жёсткие упоминания из remaining legacy-docs |
| Env prefix | `KSKILL_*` | Префикс используется в shell/Python/Node коде и тестах | Менять только вместе с обратной совместимостью или явным compatibility-layer |
| Public proxy URL | `k-skill-proxy.nomadamas.org` | Используется как опубликованный legacy endpoint | Оставить как legacy endpoint, новые русскоязычные adapter'ы описывать как `ru-skill` capabilities поверх этого слоя |

## Где `k-skill` остаётся как legacy-след и мешает позиционированию

| Тип | Примеры | Комментарий |
| --- | --- | --- |
| Корневые документы | `README.md`, `docs/install.md`, `docs/setup.md`, `docs/security-and-secrets.md`, `docs/roadmap.md` | Здесь бренд должен упоминаться только как legacy-контекст или переходный слой |
| Feature guides | `docs/features/k-skill-proxy.md` и remaining guides с корейскими заголовками | Часть упоминаний технически корректна, но ещё не везде выровнен русский тон и legacy-маркировка |
| Скрипты и helpers | `scripts/run-k-skill-proxy.sh`, отдельные help/default URL в legacy helper'ах | Dual-path по secrets уже внедрён, но proxy naming и часть legacy help-текстов ещё остаются |
| Тесты | `scripts/skill-docs.test.js`, `scripts/test_fine_dust.py` | Эти тесты фиксируют текущее поведение и должны меняться только вместе с совместимостью |
| User-Agent | `packages/k-lotto/src/index.js`, `packages/kleague-results/src/index.js` | Это безопасный хвост legacy-бренда; можно оставить до выноса или архивирования пакетов |

## Что уже можно считать отделённым брендом `ru-skill`

- Корневой npm workspace называется `ru-skill`.
- У всех опубликованных legacy-пакетов в `keywords` уже фигурирует `ru-skill`.
- Корневой README и roadmap описывают legacy-пакеты как переходное наследие, а не как целевое направление продукта.

## Практический plan без ломки совместимости

1. Не переименовывать сразу `k-skill-proxy`, `k-skill-setup`, `KSKILL_*` и `~/.config/k-skill/*`, пока не появится явный compatibility-layer.
2. Все новые русскоязычные навыки и пакеты называть уже в бренде `ru-skill`, без новых `k-*` префиксов.
3. Не трогать пока `KSKILL_*` и `k-skill-proxy`, но продолжать переводить пользовательскую документацию на `ru-skill` как основное имя.
4. Следующей итерацией решить, нужен ли alias-слой и отдельная русскоязычная обвязка для proxy-сценария, или достаточно документного legacy-блока.
