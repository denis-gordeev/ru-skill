# Python package release scaffold

Пакеты Python в этом репозитории размещаются под `python-packages/*`.

В настоящее время реальных пакетов нет, поэтому workflow release-please остаётся в состоянии заглушки.

При добавлении первого Python-пакета необходимо:

1. Создать `python-packages/<package-name>/pyproject.toml`
2. Добавить соответствующий path и `release-type: "python"` в `.github/release-please/python-config.json`
3. Добавить начальную версию в `.github/release-please/python-manifest.json`
4. Подключить build + `pypa/gh-action-pypi-publish` publish job в `release-python.yml`

Примечания:

- PyPI trusted publishing сейчас безопаснее не использовать внутри reusable workflow.
- Фактический `pypi-publish` job следует оставлять в top-level workflow, как сейчас.
