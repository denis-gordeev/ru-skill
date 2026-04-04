# Релизы и автоматическая публикация

Этот репозиторий использует **Changesets для npm** и **release-please для Python**.

## Node / npm пакеты

- Расположение: `packages/*`
- Управление версиями: Changesets
- Workflow публикации: `.github/workflows/release-npm.yml`
- Момент публикации: после merge bot-generated PR `Version Packages` в `main`
- Предпочтительный способ аутентификации: trusted publishing через GitHub OIDC
- Базовое правило: версии пакетов не редактируются вручную для релиза, вместо этого в PR добавляется `.changeset/*.md`

### Поток релиза

1. В функциональном PR добавляется `.changeset/*.md`.
2. PR мержится в `main`.
3. Changesets создаёт PR `Version Packages`.
4. PR `Version Packages` мержится в `main`.
5. GitHub Actions публикует только изменившиеся npm-пакеты через `changeset publish`.
6. `CHANGELOG.md` в пакетах ведёт сам Changesets, а отдельные GitHub Releases для npm-пакетов не создаются, пока `createGithubReleases: false`.

## Trusted publishing для npm

- Предпочтителен OIDC/trusted publishing, а не долгоживущий `NPM_TOKEN`.
- Для этого workflow должен иметь `id-token: write`, а пакет на стороне npm должен быть настроен на trusted publisher для этого репозитория.
- `NPM_CONFIG_PROVENANCE=true` остаётся включённым, чтобы npm публиковал provenance-метаданные.
- Если trusted publishing недоступен для конкретного пакета или реестра, только тогда допустим fallback на токен. Такой fallback нужно отдельно задокументировать и обосновать.

## Python пакеты

- Расположение: `python-packages/*`
- Управление версиями: release-please
- Workflow публикации: `.github/workflows/release-python.yml`
- Момент публикации: только если release-please сообщил `release_created=true` для реального пути пакета
- Текущее состояние: в репозитории пока нет реального Python-пакета, поэтому workflow остаётся scaffold-only

## Проверка перед релизными изменениями

```bash
npm install
npm run ci
```

Если меняются release/workflow/package metadata, нужно обязательно прогонять `npm run ci` и держать документацию, workflow и метаданные в одном изменении.
