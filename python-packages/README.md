# Каркас выпуска пакета Python

Пакеты Python в этом репозитории размещаются под `python-packages/*`.

В настоящее время реальных пакетов нет, поэтому процесс release-please остаётся в состоянии заглушки.

При добавлении первого пакета Python необходимо:

1. Создать `python-packages/<package-name>/pyproject.toml`
2. Добавить соответствующий path и `release-type: "python"` в `.github/release-please/python-config.json`
3. Добавить начальную версию в `.github/release-please/python-manifest.json`
4. Подключить build + `pypa/gh-action-pypi-publish` задачу публикации в `release-python.yml`

Примечания:

- Доверенная публикация PyPI сейчас безопаснее не использовать внутри повторно используемого процесса.
- Фактическая задача публикации `pypi-publish` следует оставлять в верхнеуровневом процессе, как сейчас.
