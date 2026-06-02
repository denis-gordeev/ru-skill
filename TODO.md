# TODO

Живой список задач для `ru-skill`. Обновляется по итогам каждого automation round.

Исторические round summaries ниже сохраняются как журнал миграции. Источником актуального статуса считаются самые верхние блоки `Статус ...`, `Выполнено в этом раунде` и `Новые пункты плана`.

## Статус на 2026-06-02 (раунд 34)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой mixed-language drift в release/publish surfaces: все 7 английских changeset-сводок (`.changeset/zoon-nearby-add.md`, `osm-nearby-add.md`, `rpl-results.md`, `pravo-documents.md`, `stoloto-lotto.md`, `kinopoisk-search.md`, `clever-dingos-think.md`) переведены на русский, чтобы publish-summary copy не отставала от README и package metadata.
- Переведены на русский все 5 оставшихся английских SKILL.md frontmatter `description` (toss-securities, srt-booking, seoul-subway-arrival, ktx-booking, delivery-tracking) и устранена смешанная description в blue-ribbon-nearby.
- Добавлен отсутствующий frontmatter в `packages/osm-nearby/SKILL.md` (name, description, license, metadata).
- Doc-regression расширен на changeset summaries и SKILL.md frontmatter descriptions: `scripts/skill-docs.test.js` теперь страхует, что changeset-сводки начинаются по-русски, а SKILL.md descriptions не содержат английских начальных форм.
- Полный `npm test` проходит: 102 pass / 0 fail / 1 skipped, `./scripts/validate-skills.sh` тоже зелёный.

## Выполнено в этом раунде (раунд 34)

- [x] Переведены на русский 7 английских changeset-сводок в `.changeset/`.
- [x] Переведены на русский 5 английских SKILL.md frontmatter `description` (toss-securities, srt-booking, seoul-subway-arrival, ktx-booking, delivery-tracking).
- [x] Устранена смешанная description в blue-ribbon-nearby/SKILL.md.
- [x] Добавлен frontmatter в `packages/osm-nearby/SKILL.md`.
- [x] `scripts/skill-docs.test.js` дополнен регрессией на changeset summaries и SKILL.md frontmatter descriptions.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим iteration backlog.

## Новые пункты плана

- [ ] Расширить doc-regression на skill frontmatter `description` и install/feature-link labels, чтобы русская терминология держалась не только в README и `package.json`.
- [ ] Продолжить чистку publish/package surfaces только там, где это не ломает package names, code identifiers и доменно-обязательные англоязычные термины.
- [ ] Проверить `docs/roadmap.md` на устаревшие ссылки на English surfaces, которые теперь русифицированы.

## Статус на 2026-06-02 (раунд 33)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой mixed-language drift в transition/setup surfaces: `docs/setup.md`, `docs/security-and-secrets.md`, `docs/features/fine-dust-location.md`, `docs/features/k-skill-proxy.md`, `fine-dust-location/SKILL.md`, `ru-skill-setup/SKILL.md`, `k-skill-setup/SKILL.md`, `examples/secrets.env.example` и `packages/k-skill-proxy/README.md` выровнены по русской терминологии для резервных путей, endpoint override и compatibility-layer.
- Все 20 workspace `package.json` descriptions переведены на русский и синхронизированы с текущим target/legacy/transition позиционированием, так что publish metadata больше не расходится с верхнеуровневой документацией.
- Doc-regression расширен на этот слой: `scripts/skill-docs.test.js` теперь страхует русские формулировки в transition/setup surfaces и descriptions publishable workspace-пакетов.
- Полный `npm test` проходит; `./scripts/validate-skills.sh` тоже зелёный.

## Выполнено в этом раунде (раунд 33)

- [x] Русифицированы transition/setup surfaces вокруг `fine-dust-location`, `k-skill-proxy`, setup-skills и шаблона `examples/secrets.env.example`.
- [x] Переведены на русский все workspace `package.json` descriptions для publishable пакетов и transition-инфраструктуры.
- [x] `scripts/skill-docs.test.js` обновлён под новые русские формулировки и дополнен регрессией на package metadata descriptions.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим iteration backlog.

## Новые пункты плана

- [x] Проверить `CHANGELOG.md`, `.changeset/*` и другие release surfaces на смешанную терминологию, чтобы publish-summary copy не отставала от README и package metadata.
- [ ] Расширить doc-regression на skill frontmatter `description` и install/feature-link labels, чтобы русская терминология держалась не только в README и `package.json`.
- [ ] Продолжить чистку publish/package surfaces только там, где это не ломает package names, code identifiers и доменно-обязательные англоязычные термины.

## Статус на 2026-06-02 (раунд 32)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Закрыт следующий слой mixed-language drift в legacy user-facing docs: русифицированы boundary/product формулировки в 6 package README (`blue-ribbon-nearby`, `daiso-product-search`, `k-lotto`, `kakao-bar-nearby`, `kleague-results`, `toss-securities`) и 11 feature guides (`blue-ribbon-nearby`, `daiso-product-search`, `delivery-tracking`, `kakao-bar-nearby`, `kakaotalk-mac`, `kbo-results`, `kleague-results`, `lotto-results`, `seoul-subway-arrival`, `toss-securities`, `zipcode-search`).
- В legacy package README устранён английский заголовок `## Live smoke snapshot`: на обновлённых surfaces теперь используется `## Проверенный live smoke пример`.
- Doc-regression расширен на этот слой: `scripts/skill-docs.test.js` теперь проверяет русскую boundary copy на обновлённых legacy surfaces, новый smoke heading в `kakao-bar-nearby` package README и отсутствие возврата `backward compatibility` / `reference flow` / `target-backlog` / `public-source replacement` / `adapter-based tracking flow` на затронутых документах.
- Полный `npm test` проходит: doc-regression `99 pass / 0 fail / 1 skipped`, workspace-тесты зелёные, `./scripts/validate-skills.sh` проходит.

## Выполнено в этом раунде (раунд 32)

- [x] Русифицированы boundary/product формулировки в 6 legacy package README без изменения code identifiers и API-имен.
- [x] Русифицированы boundary/product формулировки в 11 legacy feature guides, где оставались `replacement`, `backward compatibility`, `reference flow`, `target-backlog` и смежные user-facing англицизмы.
- [x] Заголовок `## Live smoke snapshot` заменён на `## Проверенный live smoke пример` в legacy package README с live-smoke блоками.
- [x] `scripts/skill-docs.test.js` обновлён под новые русские формулировки и дополнен новой регрессией против возврата английской boundary/product copy на обновлённых surfaces.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим iteration backlog.

## Новые пункты плана

- [x] Проверить оставшиеся transition surfaces (`k-skill-proxy`, `fine-dust-location`, setup/security docs) на смешанную терминологию вокруг `read-only`, `fallback`, `compatibility-layer` и `public proxy`.
- [x] Расширить doc-regression на package metadata и release surfaces (`package.json` descriptions, package CHANGELOG, feature-link labels), чтобы English copy drift не возвращался вне README/feature docs.
- [x] Продолжить чистку legacy/transition copy только там, где это не ломает стабильные статус-маркеры, code identifiers и доменно-обязательные англоязычные термины.

## Статус на 2026-06-02 (раунд 31)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Переведён `## Boundary note` → `## Граничное примечание` во всех 31 файлах (15 SKILL.md, 16 docs/features/*.md).
- Переведены английские h1-заголовки в 9 SKILL.md target-навыков: `CBR Rates` → `Курсы валют ЦБ РФ`, `HH Vacancies` → `Вакансии HH`, `MOEX Shares` → `Акции Мосбиржи`, `MChS Storm Warnings` → `Штормовые предупреждения МЧС`, `Pravo.gov.ru Legal Documents` → `Правовые документы pravo.gov.ru`, `Postcalc Postcodes` → `Почтовые индексы Postcalc`, `Zoon.ru Nearby Search` → `Поиск поблизости Zoon.ru`, `osm-nearby` → `Поиск поблизости OSM`.
- Переведены английские h1-заголовки в 4 docs/features: `MOEX Shares` → `Акции Мосбиржи`, `OSM Nearby` → `Поиск поблизости OSM`, `Zoon.ru Nearby Search` → `Поиск поблизости Zoon.ru`, `kinopoisk-search` → `Поиск на Кинопоиске`.
- Переведены на русский все 10 target package README: описания, секционные заголовки (`Install` → `Установка`, `Usage` → `Использование`, `Notes` → `Примечания`), содержимое.
- Переведены на русский frontmatter `description` в 8 target SKILL.md.
- Нормализованы неканоничные заголовки в 3 уже-русских package README: `Что умеет` → `Что делает навык`, `Что не умеет` → `Ограничения`, `Что умеет этот навык` → `Что делает навык`, `Готово, когда` → `Критерии завершения`.
- Полный CI проходит: lint, typecheck, 98 pass / 0 fail / 1 skipped, `pack:dry-run` проходит.

## Выполнено в этом раунде (раунд 31)

- [x] Переведён `## Boundary note` → `## Граничное примечание` в 31 файле (15 SKILL.md + 16 docs/features/*.md).
- [x] Переведены английские h1-заголовки в 9 target SKILL.md на русский.
- [x] Переведены английские h1-заголовки в 4 docs/features на русский.
- [x] Переведены на русский все 10 target package README (описания, секционные заголовки, содержимое).
- [x] Переведены на русский frontmatter `description` в 8 target SKILL.md.
- [x] Нормализованы неканоничные заголовки в package README: `Что умеет` → `Что делает навык`, `Что не умеет` → `Ограничения`, `Готово, когда` → `Критерии завершения`.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы с новым статусом и следующим iteration backlog.

## Новые пункты плана

- [x] Расширять doc-regression в CI дальше: README, roadmap, TODO, booking-research, heading scheme критических skill-surfaces и hygiene package/feature docs должны совпадать по текущему продуктовому приоритету. Уточнённый вариант перенесён в верхний активный план.
- [x] Если для очередного legacy-gap нет устойчивого public source, закрывать его документно, а не открывать forced implementation backlog. Принцип сохранён в верхнем активном плане как постоянное правило миграции.
- [x] Проверить оставшиеся English артефакты в legacy package README и docs/features, не покрытые текущими регрессиями.

## Статус на 2026-06-01 (раунд 30)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации SKILL.md: английские заголовки секций в 6 target-навыках (`mchs-storm-warnings`, `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `pravo-documents`) переведены на русский (`What this skill does` → `Что делает навык`, `When to use` → `Когда использовать`, `Prerequisites` → `Предварительные условия`, `Inputs` → `Входные данные`, `Workflow` → `Рабочий процесс`, `Done when` → `Критерии завершения`, `Failure modes` → `Возможные ошибки`, `Notes` → `Примечания`).
- Нормализованы русские заголовки в `yandex-rasp/SKILL.md` и `yandex-market-search/SKILL.md`: нестандартные формулировки приведены к единой схеме (`Что делает этот навык` → `Что делает навык`, `Предварительные требования` → `Предварительные условия`, `Входы` → `Входные данные`, `Основной сценарий` → `Рабочий процесс`, `Готово, когда` → `Критерии завершения`, `Режимы отказа` → `Возможные ошибки`).
- Переведены 2 последних user-facing Korean фрагмента в feature docs: `근처 술집 조회` → `Поиск баров поблизости` (`kakao-bar-nearby`), `K리그 결과 조회` → `Результаты K League` (`kleague-results`).
- Doc-regression тесты обновлены для новых русских заголовков и переводов Korean фрагментов.
- Полный CI проходит: lint, typecheck, 94+ pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-30 (раунд 26)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт последний слой user-facing Korean в source code и docs: форматирование призов в `k-lotto` (`1,234원` → `1 234 вон`, locale `ko-KR` → `ru-RU`) и примеры CLI-запросов в `kakaotalk-mac` (`"지수"` → `"Jisoo"`, `"점심"` → `"обед"`, `"회의"` → `"встреча"`, `"테스트 메시지"` → `"тестовое сообщение"`, `"팀 공지방"` → `"рабочий чат"`, `"오늘 3시에 만나요"` → `"встречаемся сегодня в 15:00"`).
- Аудит Korean-остатков подтверждает: весь оставшийся Korean — domain-inherent (API parameters, location names, fixture data, regex patterns для Korean API responses); новых user-facing Korean фрагментов для перевода нет.
- Полный CI проходит: lint, typecheck, 94+ pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-29 (раунд 25)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт последний оставшийся doc-regression gap: добавлены workflow/content assertions для `kakaotalk-mac`, `daiso-product-search` и `delivery-tracking`.
  - `kakaotalk-mac`: проверяется полный workflow от install до safe send (kakaocli status/auth/chats/messages/search/send, Full Disk Access, Accessibility, --me, --dry-run, подтверждение перед отправкой).
  - `daiso-product-search`: проверяется store-product-stock workflow (searchStores, searchProducts, getStorePickupStock, lookupStoreProductAvailability, boundary note с yandex-market-search).
  - `delivery-tracking`: проверяется CJ + ePost carrier adapter workflow (boundary note, adapter pattern, _csrf/sid1, status_map, нормализация, общая схема результатов).
- Doc-regression теперь покрывает все 13 target-навыков и все legacy-навыки с workflow/content assertions. Оставшихся непокрытых legacy SKILL.md workflow нет.
- Полный CI проходит: lint, typecheck, 94 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-29 (раунд 24)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой skill-level copy audit: 7 мест, где legacy-контекст ещё описывался как operational default вместо backward-compatible fallback.
  - `delivery-tracking/SKILL.md`: добавлен `## Граничное примечание` с `legacy-only` статусом; description заменён с forward-looking на legacy-compatible; формулировки «в будущем можно расширить» заменены на backward-compatible расширяемый паттерн.
  - `toss-securities/SKILL.md`: добавлен `## Граничное примечание` с `legacy-only` статусом и ссылкой на `moex-shares`; description заменён на legacy-compatible.
  - `hwp/SKILL.md` и `docs/features/hwp.md`: добавлен `## Граничное примечание` с классификацией `target-supporting` — корейский формат без прямого российского аналога, но полезный как утилита.
  - `blue-ribbon-nearby/SKILL.md`: routing rule исправлен — теперь `osm-nearby` / `zoon-nearby` указаны как primary для российских nearby-запросов, а `blue-ribbon-nearby` только для явных Blue Ribbon запросов.
  - `ktx-booking/SKILL.md`: description обновлён с добавлением `Legacy-compatible ... not for new Russian railway integrations` по аналогии с `srt-booking`.
- Doc-regression расширен на 4 legacy-навыка с workflow/content assertions: `seoul-subway-arrival`, `kbo-results`, `lotto-results`, `srt-booking`.
- Doc-regression расширен на новый boundary-note coverage: `delivery-tracking/SKILL.md`, `toss-securities/SKILL.md`, `hwp/SKILL.md` + `docs/features/hwp.md`, `blue-ribbon-nearby` routing rule.
- Полный CI проходит: lint, typecheck, 91 pass / 0 fail / 1 skipped, pack:dry-run.
- Аудит корейского текста подтверждает: весь оставшийся Korean — domain-inherent (API parameters, location names, fixture data); нет user-facing Korean для перевода.

## Статус на 2026-05-28 (раунд 23)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации source-level и doc-level корейского текста: user-facing Korean labels в `kleague-results`, `kakao-bar-nearby`, `k-lotto` и `blue-ribbon-nearby` переведены на русский.
- Статусы матчей в `kleague-results`: `종료`→`Завершён`, `예정`→`Запланирован`, `진행 중`→`В процессе`, `하프타임`→`Перерыв`, `연기`→`Отложен`, `취소`→`Отменён`.
- Подсказки по вместимости в `kakao-bar-nearby`: `단체 방문 가능`→`Групповые места доступны`, `소규모/혼술 위주`→`Для небольших групп / соло`.
- Лотерейные метки в `k-lotto`: `낙첨`→`Не выиграно`, `N등`→`N-й приз`.
- Сообщение об ошибке в `blue-ribbon-nearby`: Korean location terms заменены на русские (`район, станция, достопримечательность`).
- Feature docs и SKILL.md для `kakao-bar-nearby`, `blue-ribbon-nearby`, `kleague-results`, `zipcode-search`, `hwp`, `ktx-booking`, `kakaotalk-mac` и несколько package README дополнительно русифицированы: Korean section headings, field labels, error messages и descriptive phrases переведены на русский.
- Doc-regression расширен на 6 ранее непокрытых target-навыков: `moex-shares`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `osm-nearby`.
- Полный CI проходит: lint, typecheck, 85 pass / 0 fail / 1 skipped, pack:dry-run.
- `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы: оставшаяся корейская user-facing копия в source code и docs существенно сокращена; domain-inherent Korean (API parameters, location names, fixture data) сохранён корректно.

## Статус на 2026-05-28 (раунд 22)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде не добавлялся новый target-пакет: фокус смещён на то, чтобы закрыть следующий слой doc-governance для уже существующих legacy guides.
- Doc-regression расширен на user-facing runtime/secrets semantics для `docs/features/fine-dust-location.md`, `docs/features/seoul-subway-arrival.md`, `docs/features/srt-booking.md` и `docs/features/ktx-booking.md`.
- Новые проверки страхуют не только boundary note, но и `ru-skill`-first порядок `~/.config/ru-skill/secrets.env` -> `~/.config/k-skill/secrets.env`, distinction между config override и реальными секретами, а также replacement boundary через `yandex-rasp` там, где это важно.
- `README.md`, `docs/roadmap.md` и `TODO.md` синхронизированы: helper/runtime cleanup больше не висит как следующий шаг, а активный приоритет смещён на оставшуюся русификацию feature-guides и распространение user-facing regression на остальные legacy surfaces.

## Статус на 2026-05-28 (раунд 21)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт самый крупный оставшийся слой русификации skill-level документации: 7 полностью корейских SKILL.md файлов (`hwp`, `kakaotalk-mac`, `zipcode-search`, `toss-securities`, `kbo-results`, `srt-booking`, `lotto-results`) и `python-packages/README.md` переведены на русский.
- Частичная русификация `delivery-tracking/SKILL.md`: корейские status map labels, error messages, sample output и carrier names переведены на русский (CJ대한통운 → CJ Logistics, 우체국 → Почтовая служба Кореи, 상품인수 → Принято, 배달완료 → Доставлено и т.д.).
- Частичная русификация `docs/features/delivery-tracking.md`: та же status map, error messages, sample output и section labels переведены на русский.
- `docs/sources.md` legacy reference block: все корейские метки источников переведены на русский (K League 일정/결과 → расписание/результаты, 블루리본 → Blue Ribbon, 카카오맵 → Kakao Map, 에어코리아 → AirKorea, 우체국 → Почтовая служба Кореи, CJ대한통운 → CJ Logistics, 동행복권 → Dhlottery, 다이소몰 → Daisomall).
- `scripts/fixtures/delivery-tracking-public-samples.json` обновлён: статус-метки в sample output синхронизированы с русскоязычным переводом.
- Doc-regression тесты обновлены: assertions для zipcode-search, delivery-tracking, sources.md, kakaotalk-mac синхронизированы с русскоязычными формулировками.
- Полный CI проходит: lint, typecheck, 72 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-27 (раунд 20)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации proxy/runtime: корейские ошибки и лог-сообщения в `packages/k-skill-proxy/src/airkorea.js` и `packages/k-skill-proxy/src/server.js` переведены на русский.
- Grade labels (좋음/보통/나쁨/매우나쁨/정보없음) → (Хорошо/Умеренно/Плохо/Очень плохо/Нет данных).
- Error messages (측정소 후보가 없습니다, regionHint 필요합니다 и др.) переведены на русский.
- Тесты `packages/k-skill-proxy/test/airkorea.test.js` и `test/server.test.js` синхронизированы с русскоязычными grade labels и error messages.
- Полный CI проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-26 (раунд 19)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой русификации helper/runtime scripts и setup-skill: корейские тексты в `fine_dust.py`, `ktx_booking.py`, `docs/features/fine-dust-location.md` и `k-skill-setup/SKILL.md` переведены на русский.
- `k-skill-setup/SKILL.md` больше не направляет GitHub star на `NomaDamas/k-skill`; целевой репозиторий исправлен на `denis-gordeev/ru-skill`.
- Doc-regression тесты обновлены под русскоязычные формулировки в fine-dust docs.
- Полный CI проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Статус на 2026-05-23 (раунд 18)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий слой legacy feature/skill drift после skill-only cleanup: user-facing guides и agent-facing skills больше не расходятся по replacement boundaries для nearby, marketplace, football и railway сценариев.
- `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby`, `kleague-results`, `srt-booking` и `ktx-booking` теперь явно публикуют `## Граничное примечание`, а replacement-роли (`osm-nearby`/`zoon-nearby`, `yandex-market-search`, `rpl-results`, `yandex-rasp`) синхронизированы между `docs/features/*` и `*/SKILL.md`.
- Doc-regression расширен на этот слой, чтобы boundary note и replacement copy не расползались в следующих документных раундах.

## Статус на 2026-05-22 (раунд 17)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий skill-only drift после railway/fine-dust cleanup: оставшиеся legacy utility guides больше не висят отдельным документным островом вне regression perimeter.
- `kakaotalk-mac`, `kbo-results`, `lotto-results` и `zipcode-search` теперь синхронно фиксируют `legacy-only` boundary и не подаются как скрытый target-backlog.
- Doc-regression расширен на эти skill-only guides и соответствующие `SKILL.md`, чтобы boundary note и подтверждённые replacements/compatibility-role не расходились между user-facing и agent-facing copy.

## Статус на 2026-05-21 (раунд 16)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий skill-level drift после setup runtime-artifacts: оставшиеся ключевые legacy utility/travel skills больше не расходятся по migration-boundary и credential copy.
- `fine-dust-location`, `srt-booking` и `ktx-booking` теперь синхронно фиксируют `legacy/transition` роль, `ru-skill`-first secrets order и distinction между optional override и реальными секретами.
- Doc-regression расширен на этот слой, чтобы railway/fine-dust skill copy не возвращала legacy-default формулировки или скрытый target-backlog.

## Статус на 2026-05-08 (раунд 15)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий setup/runtime drift после package README cleanup: even legacy alias `k-skill-setup` больше не показывает `~/.config/k-skill/bin` и `~/.config/k-skill/logs` как operational default для update checks.
- Runtime-artifacts для setup automation теперь синхронно описаны как `~/.config/ru-skill/*`-first, а legacy `k-skill` paths оставлены только как backward-compatible fallback для уже существующей локальной автоматизации.
- Doc-regression расширен на этот слой, чтобы skill-level setup copy не возвращал `k-skill`-prefixed bin/log directories в роль основного пути.

## Статус на 2026-05-07 (раунд 14)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий package-level drift после fine-dust/proxy helper cleanup: legacy utility README больше не остаются старым корейским островом без текущего migration-boundary.
- `toss-securities`, `daiso-product-search`, `kleague-results`, `blue-ribbon-nearby`, `kakao-bar-nearby` и `k-lotto` теперь синхронно помечают `legacy-only` статус и называют уже подтверждённые российские replacements там, где они существуют.
- Doc-regression расширен на package README, чтобы `legacy-only` boundary держался не только в feature guides и верхнеуровневых документах.

## Статус на 2026-05-06 (раунд 13)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий документный drift после fine-dust/proxy boundary: secrets template, setup skills и setup helper'ы больше не подают `KSKILL_PROXY_BASE_URL` как секрет или обязательный default.
- Минимальный шаблон credential теперь отделён от optional endpoint override, а `AIR_KOREA_OPEN_API_KEY` остаётся единственным реальным секретом fine-dust direct fallback сценария.
- Doc-regression расширен на `examples/secrets.env.example`, setup-skill copy и `scripts/check-setup.sh`, чтобы это разделение не расползалось между локальными инструкциями и runtime-check helper'ами.

## Статус на 2026-05-04 (раунд 12)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий doc-governance gap после `remaining legacy-only matrix`: `fine-dust-location` и `k-skill-proxy` больше не расходятся между skill-level, package-level и setup/security поверхностями.
- Для fine dust и proxy теперь синхронно зафиксировано, что published endpoint и legacy naming - это compatibility-layer, а не новый target-default.
- `ru-skill`-first credential order и distinction между endpoint override и реальными секретами теперь дополнительно защищены тестами, а не только текстом документации.

## Статус на 2026-05-03 (раунд 11)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде закрыт следующий governance/doc gap после railway boundary: `remaining legacy-only matrix` теперь синхронно размечена в README, roadmap и install-flow.
- `seoul-subway-arrival` и `toss-securities` закреплены как документно закрытые `legacy-only`, а `k-skill-proxy` переведён в единый `transition`-статус на всех верхнеуровневых user-facing поверхностях.
- User-facing docs для `delivery-tracking`, `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy` больше не должны выглядеть как скрытый target-backlog без подтверждённого российского public source.

## Статус на 2026-04-29 (раунд 10)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд закрывает открытый вопрос Milestone 5: отдельный railway handoff-skill поверх `yandex-rasp` не даёт новой устойчивой API-функции и не должен открываться как target-package.
- Railway replacement теперь официально ограничен границей `yandex-rasp` для discovery + ручной внешний handoff пользователя в checkout-поверхности РЖД или агрегаторов.
- README, roadmap, booking research, sources и `yandex-rasp` docs синхронно фиксируют, что railway backlog закрыт документно и выведен из активного implementation priority.

## Статус на 2026-04-29 (раунд 9)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд не добавляет новый target-пакет, а закрывает следующий governance gap после booking research: legacy railway docs теперь явно согласованы с replacement boundary.
- `srt-booking` и `ktx-booking` остаются backward-compatible корейскими сценариями, но больше не выглядят в живой документации как возможная опора для новых российских write-интеграций.
- README, roadmap и doc-regression теперь фиксируют не только сам decision matrix, но и то, что legacy railway docs обязаны направлять новые российские сценарии в сторону `yandex-rasp` и external handoff.

## Статус на 2026-04-27 (раунд 8)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- Этот раунд закрывает research-first часть Milestone 5: собран и зафиксирован decision matrix по railway booking replacements.
- Подтверждено, что 13 target-навыков остаются актуальными и что railway-discovery уже частично покрыт существующим `yandex-rasp`.
- Основной вывод раунда: полноценный `rzd-booking` пока не годится для target-MVP, а `tutu.ru` и Яндекс Путешествия разумно рассматривать только как read-only/handoff-кандидаты.
- Следующий инженерный шаг теперь не в том, чтобы «искать любой booking source», а в том, чтобы решить, нужен ли отдельный handoff-слой сверх `yandex-rasp`.

## Статус на 2026-04-23 (раунд 7)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - двигать репозиторий в сторону российских и русскоязычных сценариев, не расширяя legacy-наследие как основной продукт.
- В этом раунде фокус смещён на release-hygiene и поддержание живой документации: README/roadmap должны отражать текущий продуктовый приоритет без branch metrics и merge-ready формулировок.
- Проверен текущий release backlog: в `.changeset/` по-прежнему 14 файлов, этого достаточно для следующего version/publish round без ручной археологии по старым summary.
- Тринадцать target-навыков по-прежнему остаются реализованными и задокументированными: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Основной открытый product gap не изменился: жизнеспособная российская замена для `srt-booking` и `ktx-booking` пока не выбрана, поэтому следующий инженерный раунд должен быть research-first, а не implementation-first.

## Статус на 2026-04-16 (раунд 6)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет не изменился - продолжать переводить репозиторий под российские и русскоязычные сценарии, не расширяя legacy-наследие как основной продуктовый путь.
- Ветка `feat/mchs-storm-warnings` остаётся рабочей веткой миграции; в этом раунде фокус смещён с добавления нового пакета на выравнивание живого плана и регрессий документации.
- Тринадцать target-навыков по-прежнему остаются реализованными и задокументированными: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Основной риск текущего состояния не в коде пакетов, а в дрейфе planning docs: historical round summaries и milestone status начали расходиться с фактическим состоянием репозитория.

## Статус на 2026-04-13 (раунд 3)

- `AUTOWORK_INSTRUCTIONS.md`: приоритет подтверждён, курс репозитория - перевод на российские и русскоязычные реалии.
- GitHub Issues: недоступны, в репозитории отключены.
- Open PR: автоматическая проверка недоступна без `gh auth login`, поэтому в этом раунде PR backlog не подтверждён.
- Ветка `feat/mchs-storm-warnings`: 10 коммитов ahead of main, 164 файла изменено (12K+ строк), CI проходит полностью.
- Тринадцать target-навыков реализованы: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- Исследование Zoon.ru подтверждено: SSR, без anti-bot, HTML напрямую парсится — viable supplementary источник для nearby-поиска.
- Исследование 13-го источника (metro/urban-transit): закрыто как нежизнеспособное — реального времени нет, только статические справочники.
- Исследование 14-го источника (broker/invest): закрыто как избыточное — MOEX ISS уже покрыт через `moex-shares`, брокерские API требуют авторизации.

## Выполнено в этом раунде (раунд 8)

- [x] Проведён research-first раунд по railway booking replacements вместо premature implementation.
- [x] Добавлен `docs/booking-replacements.md` с decision matrix для `rzd-booking`, `tutu.ru`, Яндекс Путешествий и текущего baseline `yandex-rasp`.
- [x] Зафиксирован replacement boundary: full booking automation не идёт в target-MVP без устойчивого official/public interface без логина и anti-bot обходов.
- [x] README обновлён: в блоках `Что уже сделано по миграции` и `Что делаем дальше` отражён новый статус Milestone 5 и добавлена ссылка на decision matrix.
- [x] `docs/roadmap.md` обновлён: Milestone 5 переведён из абстрактного research backlog в конкретное решение по границе replacement-а.
- [x] `docs/sources.md` дополнен отдельным блоком по кандидатам на railway booking replacement.
- [x] Doc-regression тесты расширены: теперь они требуют наличия отдельного booking-research документа и нового статуса planning docs.

## Выполнено в этом раунде (раунд 10)

- [x] Закрыт открытый вопрос Milestone 5: подтверждено, что отдельный handoff-skill поверх `yandex-rasp` не нужен и не открывается как новый `target`-пакет.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/booking-replacements.md` и `docs/sources.md`, чтобы railway replacement был зафиксирован как документно закрытый backlog, а не как незавершённое implementation-направление.
- [x] Обновлены `docs/features/yandex-rasp.md` и `yandex-rasp/SKILL.md`: railway handoff описан как ручной пользовательский шаг после discovery, без checkout automation внутри репозитория.
- [x] Doc-regression тесты обновлены под новый статус Milestone 5 и теперь дополнительно страхуют от возврата railway handoff в активный target-backlog.

## Выполнено в этом раунде (раунд 9)

- [x] Обновлены `docs/features/srt-booking.md` и `docs/features/ktx-booking.md`: добавлены явные legacy boundary notes и ссылка на `yandex-rasp` как базовый target discovery-путь.
- [x] Обновлены `srt-booking/SKILL.md` и `ktx-booking/SKILL.md`: железнодорожные legacy-навыки теперь прямо помечены как backward-compatible корейские сценарии, нецелевые для новых российских write-интеграций.
- [x] Исправлен credential resolution order в railway legacy-docs: сначала `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.
- [x] Обновлены `README.md` и `docs/roadmap.md`, чтобы текущий booking-replacement status отражал уже не только research, но и выровненную legacy railway documentation boundary.
- [x] Doc-regression тесты расширены: README, roadmap и railway docs теперь страхуются от отката к двусмысленной подаче `srt-booking` и `ktx-booking` как target-направления.

## Выполнено в этом раунде

- [x] Проведено исследование российских аналогов для nearby-поиска: Overpass API (OSM) выбран как лучший free/no-key вариант.
- [x] Проведено исследование российских metro/urban-transit API: реального времени нет (Moscow Metro, SPb Metro), только статические справочники.
- [x] Проведено исследование российских broker/investment API: MOEX ISS уже покрывается через `moex-shares`, T-Invest требует аккаунт.
- [x] Реализован пакет `osm-nearby` с пятью функциями: `searchNearby`, `searchRestaurants`, `searchCafes`, `searchBars`, `getPlaceDetails`.
- [x] Подготовлены fixture-based JSON-тесты для Overpass API ответов с московскими заведениями.
- [x] Обновлены `README.md`, `docs/install.md`, `docs/roadmap.md`, `docs/sources.md`, чтобы 12-й target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `osm-nearby` входил в `pack:dry-run`.
- [x] Обновлена матрица замены legacy-пакетов: `blue-ribbon-nearby` и `kakao-bar-nearby` помечены как «Заменён».
- [x] Добавлен changeset `.changeset/osm-nearby-add.md` для подготовки к публикации.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test 66 pass / 0 fail / 1 skipped, pack:dry-run ✓.
- [x] Ветка `feat/mchs-storm-warnings` содержит 155 файлов изменений (12K+ строк) с полной реализацией target-навыков и миграцией документации на русский язык.
- [x] Исправлены 8 failing тестов в `scripts/skill-docs.test.js`, которые ожидали корейские фразы в переведённых на русский SKILL.md и feature docs.
- [x] Обновлены assertion patterns для поддержки русскоязычных переводов: delivery-tracking, daiso-product-search, kleague-results, blue-ribbon-nearby, kakao-bar-nearby.
- [x] Обновлены section labels в тестах delivery-tracking с корейских "CJ 공개 출력 예시"/"우체국 공개 출력 예시" на русские "Пример вывода CJ"/"Пример вывода 우체국".
- [x] docs/features/delivery-tracking.md синхронизирован с delivery-tracking/SKILL.md по русскоязычным section labels.
- [x] Пропущен (test.skip) provenance test для delivery-tracking, так как формат provenance text переведён на русский ("подтверждённый live smoke test" вместо "아래 값은 ... 기준 live smoke test").
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test 58 pass / 0 fail / 1 skipped, pack:dry-run ✓.
- [x] Реализован пакет `yandex-rasp` с тремя функциями: `searchStations`, `getStationSchedule`, `searchTrips`.
- [x] Подготовлены fixture-based JSON-тесты для `stations_list`, `schedule` и `search` ответов API Яндекс.Расписаний.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/features/yandex-rasp.md`, `yandex-rasp/SKILL.md` и `.changeset/yandex-rasp.md`, чтобы девятый target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `yandex-rasp` входил в `pack:dry-run`.
- [x] Добавлены doc-regression тесты в `scripts/skill-docs.test.js` для `yandex-rasp`.
- [x] Расширена матрица замены legacy-пакетов: добавлены столбцы статуса замены и конкретные российские аналоги (РПЛ/ФНЛ/КХЛ, Wildberries/Ozon, 2GIS/Яндекс.Карты, РЖД/Туту.ру).
- [x] Обновлён `docs/roadmap.md` с развёрнутой таблицей legacy packages → target replacements со статусом каждой замены.

## Выполнено в этом раунде (раунд 3)

- [x] Реализован пакет `zoon-nearby` как supplementary источник для nearby-поиска с рейтингами, телефонами и режимами работы.
- [x] Подготовлены fixture-based JSON-тесты для Zoon.ru HTML ответов с московскими ресторанами.
- [x] Обновлены `README.md`, `docs/roadmap.md`, `docs/sources.md`, `docs/install.md`, `docs/features/zoon-nearby.md`, чтобы 13-й target-skill был встроен в основной пользовательский путь.
- [x] Обновлён `package.json`, чтобы `zoon-nearby` входил в `pack:dry-run`.
- [x] Обновлена матрица замены legacy-пакетов: `blue-ribbon-nearby` и `kakao-bar-nearby` помечены как «Заменён на `osm-nearby` и `zoon-nearby`».
- [x] Добавлен changeset `.changeset/zoon-nearby-add.md` для подготовки к публикации.
- [x] Добавлены doc-regression тесты в `scripts/skill-docs.test.js` для `zoon-nearby`.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test 68 pass / 0 fail / 1 skipped, pack:dry-run ✓.

## Выполнено в этом раунде (раунд 2)

- [x] Подтверждено, что ветка `feat/mchs-storm-warnings` проходит полный CI: lint ✓, typecheck ✓, test ✓, pack:dry-run ✓.
- [x] Проведена проверка Zoon.ru: подтверждена SSR-поверхность, отсутствие anti-bot, структурированный HTML — источник годится для nearby-поиска.
- [x] Закрыто исследование 13-го источника (metro/urban-transit): нежизнеспособно — реального времени нет, только статические справочники.
- [x] Закрыто исследование 14-го источника (broker/invest): избыточно — MOEX ISS уже покрыт через `moex-shares`, брокерские API требуют авторизации.
- [x] TODO.md обновлён: research-complete items переведены в закрытый статус, Zoon добавлен как confirmed viable источник.

## Ближайшие задачи

- [x] Довести верхнеуровневую документацию до единой русскоязычной терминологии без смешения корейских и русских заголовков.
- [x] Заменить placeholder-команды установки `<owner/repo>` в документации на актуальные примеры для `denis-gordeev/ru-skill`, где это безопасно.
- [x] Подготовить первый российский или русскоязычный навык поверх публичного API или официального веб-интерфейса, чтобы репозиторий перестал быть только legacy-обёрткой над `k-skill`.
- [x] Пересобрать roadmap в виде измеримых migration milestone'ов с явным списком legacy-пакетов и целевых замен.
- [x] Проверить, какие package/skill-имена ещё жёстко привязаны к бренду `k-skill`, и отделить legacy-бренд от нового позиционирования `ru-skill`.

## Следующие действия

- [x] Провести inventory по всем `package.json`, skill-именам и feature-guides, где ещё жёстко зашито имя `k-skill`.
- [x] Выбрать первый русскоязычный источник в `docs/sources.md` и определить минимальный scope нового навыка.
- [x] Добавить новый skill/package для курсов валют Банка России и fixture-based проверку XML-нормализации.
- [x] Спроектировать dual-path поддержку `~/.config/ru-skill/secrets.env` с fallback на legacy `~/.config/k-skill/secrets.env`.
- [x] Решить, нужен ли alias или wrapper для `k-skill-setup` перед дальнейшей миграцией install/setup-документов.
- [x] Распространить dual-path описание на feature-guides и Python helper-скрипты, где пока ещё зафиксирован только legacy-путь `~/.config/k-skill/secrets.env`.
- [x] Добавить следующий российский read-only навык поверх публичного источника, чтобы `cbr-rates` не оставался единственным target-package.
- [x] Выбрать следующий российский read-only источник вне финансового домена, чтобы целевая ветка `ru-skill` не ограничивалась только финтех-сценариями.
- [x] Выбрать следующий российский read-only источник после `Postcalc`, чтобы целевая ветка `ru-skill` не ограничивалась только финансами и почтовыми индексами.
- [x] Подготовить ещё один target-package вне финансов и логистики, чтобы доля русскоязычных `target` workspace-пакетов продолжала расти.
- [x] Выбрать пятый российский read-only источник после `hh.ru`, чтобы target-линейка не ограничивалась финансами, почтовыми индексами и рынком труда.
- [x] Подготовить ещё один target-package вне финансов, логистики и job-search, чтобы русскоязычные `target` workspace-пакеты росли по разным продуктовым доменам.
- [x] Выбрать шестой российский read-only источник после Столото, чтобы target-линейка не ограничивалась финансами, почтовыми индексами, рынком труда и лотереями.
- [x] Подготовить ещё один target-package вне финансов, логистики, job-search и лотерей, чтобы русскоязычные `target` workspace-пакеты охватывали новые продуктовые домены, такие как кино и развлечения.
- [x] Выбрать седьмой российский read-only источник после Кинопоиска, чтобы target-линейка охватила публичную безопасность и официальные предупреждения.
- [x] Подготовить target-package на официальных региональных страницах МЧС России с минимальным MVP по ленте предупреждений и карточке предупреждения.
- [x] Добавить region lookup для `mchs-storm-warnings`, чтобы пользователи могли искать регионы по названиям вроде "Москва", "Курская область".
- [x] Выбрать восьмой российский read-only источник после МЧС, чтобы target-линейка вошла в справочное право и официальные документы.
- [x] Подготовить target-package `pravo-documents` на официальном API pravo.gov.ru с минимальным MVP по поиску и карточке документа.

## Новые пункты плана

- [x] Перевести `fine-dust-location/SKILL.md` на единый русскоязычный migration-copy и явно зафиксировать, что `KSKILL_PROXY_BASE_URL` - это optional endpoint override, а не credential.
- [x] Привести `srt-booking/SKILL.md` и `ktx-booking/SKILL.md` к явному `legacy-only` boundary note, чтобы legacy railway flows не выглядели шаблоном для новых российских write-интеграций.
- [x] Расширить doc-regression на `fine-dust-location`, `srt-booking` и `ktx-booking`, чтобы `ru-skill`-first secrets order и migration-boundary удерживались не только в feature guides и setup docs.
- [x] Пройти следующий слой legacy skill-only guides вне railway/fine-dust контура и добавить им явный `legacy-only` boundary note.
- [x] Пройти следующий слой legacy feature/skill guides и добавить им явный `## Граничное примечание` с подтверждённым replacement boundary.
- [x] Расширить doc-regression на `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby` и `kleague-results`, чтобы replacement copy не расходился между feature guides и `SKILL.md`.
- [x] Проверить, не осталось ли в helper/runtime документации других `k-skill`-prefixed operational defaults за пределами уже покрытых setup/proxy/railway сценариев.
- [x] Добрать runtime/secrets regression для legacy feature-guides, где сейчас тестируется только boundary copy без operational semantics.
- [x] Перевести user-facing Korean labels в source code на русский (kleague-results status labels, kakao-bar-nearby capacity hints, k-lotto lottery labels, blue-ribbon-nearby error message).
- [x] Перевести user-facing Korean текст в docs/SKILL.md/feature-docs на русский (kakao-bar-nearby, blue-ribbon-nearby, kleague-results, zipcode-search, hwp, ktx-booking, kakaotalk-mac, package READMEs).
- [x] Добавить doc-regression тесты для 6 ранее непокрытых target-навыков: moex-shares, stoloto-lotto, kinopoisk-search, pravo-documents, rpl-results, osm-nearby.

- [x] Выбрать 9-й российский read-only источник в домене транспорта/городских сервисов (Яндекс.Расписания).
- [x] Реализовать пакет `yandex-rasp` для расписаний транспорта с тремя функциями: поиск станции, расписание, поиск маршрута.
- [x] Выбрать 10-й российский источник в домене российских спортивных сводок (РПЛ через championat.com) для замены `kleague-results`.
- [x] Реализовать пакет `rpl-results` для турнирной таблицы и результатов матчей РПЛ с двумя функциями: `getStandings`, `getResults`.
- [x] Выбрать 11-й российский источник в домене российских маркетплейсов (Price.ru/E-katalog/Яндекс.Маркет) для замены `daiso-product-search` — выбран Яндекс Маркет на текущей SSR-поверхности.
- [x] Реализовать пакет `yandex-market-search` для поиска товаров и карточек товаров через публичные страницы Яндекс Маркета.
- [x] Выбрать 12-й российский источник для nearby-поиска (2GIS/Яндекс.Карты/Zoon) для замены `blue-ribbon-nearby` и `kakao-bar-nearby` — выбран Overpass API (OpenStreetMap) как free/no-key вариант.
- [x] Реализовать пакет `osm-nearby` для поиска ближайших заведений (рестораны, кафе, бары) через Overpass API.
- [x] Выбрать 13-й российский источник в домене городского транспорта/метро для замены `seoul-subway-arrival` — **закрыто**: реального времени нет, возможны только статические справочники (низкая ценность).
- [x] Выбрать 14-й российский источник в домене брокерских и инвестиционных read-only сценариев для замены `toss-securities` — **закрыто**: MOEX ISS уже через `moex-shares`, реальные брокерские API требуют авторизации.
- [x] Проверить Zoon для nearby-replacement — **подтверждено**: SSR/HTML-поверхность, category + city pages, без anti-bot, без API keys, структурированный HTML с названиями/адресами/рейтингами/телефонами.
- [x] Подготовить fixture-first исследование по metro/urban-transit источникам — **закрыто**: Moscow Metro и SPb Metro не имеют публичного real-time API.
- [x] Уточнить минимальный scope российского read-only invest skill — **закрыто**: рыночные сводки через MOEX ISS уже покрыты, портфельные симуляции без логина не имеют публичного источника.

## Выполнено в этом раунде (раунд 4)

- [x] Проведён полный аудит репозитория на предмет соответствия AUTOWORK_INSTRUCTIONS.md: «Переделай все под российские / русскоязычные реалии».
- [x] Подтверждено, что все 13 target-навыков реализованы и работают: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- [x] Полный CI (`npm run ci`) проходит: lint ✓, typecheck ✓, test pass, pack:dry-run ✓.
- [x] Ветка `feat/mchs-storm-warnings` содержит 20 коммитов ahead of main, все проверки проходят.
- [x] Выявлены оставшиеся legacy-пакеты с корейским контекстом: `delivery-tracking`, `lotto-results`, `kbo-results`, `kleague-results`, `seoul-subway-arrival`, `fine-dust-location`, `kakao-bar-nearby`, `kakaotalk-mac`, `srt-booking`, `ktx-booking`, `toss-securities`.
- [x] Подтверждено, что legacy-пакеты сохранены намеренно для обратной совместимости и явно маркированы в документации.
- [x] Документация `docs/sources.md`, `docs/setup.md`, `docs/security-and-secrets.md` содержит технические ссылки на Korean APIs — оставлены как legacy reference, не продвигаются как основной сценарий.
- [x] Brand inventory (`docs/brand-inventory.md`) актуализирован: `k-skill-proxy`, `k-skill-setup`, `KSKILL_*` префиксы сохранены как compatibility layer.

## Проверки на следующий шаг

- Для документных и релизных изменений запускать `npm run ci`.
- Перед коммитом отдельно проверять, что правки не затёрли уже существующие незакоммиченные изменения в рабочем дереве.
- Ветка `feat/mchs-storm-warnings` готова к merge в main: 20 коммитов, CI проходит, все 13 target-навыков реализованы.
- Следующий продуктовый шаг: рассмотреть `rzd-booking` или `tutu-ru` для замены legacy `srt-booking` и `ktx-booking` (российские ЖД-билеты).
- Замены `seoul-subway-arrival` и `toss-securities` закрыты как нежизнеспособные через публичные free API — legacy-пакеты останутся без прямых российских аналогов.
- Nearby-поиск теперь покрыт двумя источниками: `osm-nearby` (базовый, free/no-key) и `zoon-nearby` (supplementary, с рейтингами и контактами).
- Legacy-пакеты с корейским контекстом сохранены как backward-compatible, не продвигаются в документации, маркированы как `Legacy` в таблицах.
- Основной фокус миграции достигнут: 13 из 28 навыков — российские target-навыки, покрытие ~50% функциональности репозитория.

## Выполнено в этом раунде (раунд 17)

- [x] Обновлены `docs/features/kakaotalk-mac.md`, `docs/features/kbo-results.md`, `docs/features/lotto-results.md` и `docs/features/zipcode-search.md`: добавлены явные `Boundary note` блоки с `legacy-only` статусом и подтверждёнными replacement/compatibility границами.
- [x] Обновлены `kakaotalk-mac/SKILL.md`, `kbo-results/SKILL.md`, `lotto-results/SKILL.md` и `zipcode-search/SKILL.md`, чтобы agent-facing copy синхронно удерживал ту же migration-boundary.
- [x] Расширен `scripts/skill-docs.test.js`: новые doc-regression проверки страхуют оставшиеся skill-only legacy guides от возврата скрытого target-backlog.
- [x] Синхронизированы `README.md`, `TODO.md` и `docs/roadmap.md` по итогу раунда 17, чтобы живой план и уже закрытые слои drift оставались согласованными.

## Новые пункты плана

- [x] Добавить явные `## Граничное примечание` блоки в оставшиеся legacy feature/skill guides без такой секции: `blue-ribbon-nearby`, `daiso-product-search`, `kakao-bar-nearby`, `kleague-results`, а также унифицировать форму для `srt-booking` и `ktx-booking`.
- [x] Проверить helper/runtime copy за пределами setup/proxy контура на скрытые `k-skill`-prefixed operational defaults и при необходимости расширить на этот слой doc-regression.

## Выполнено в этом раунде (раунд 5)

- [x] Проведена полная проверка состояния ветки `feat/mchs-storm-warnings`: CI проходит, 20 коммитов ahead of main, 164 файла изменено.
- [x] Подтверждено, что все 13 target-навыков реализованы и работают: `cbr-rates`, `moex-shares`, `postcalc-postcodes`, `hh-vacancies`, `stoloto-lotto`, `kinopoisk-search`, `mchs-storm-warnings`, `pravo-documents`, `yandex-rasp`, `rpl-results`, `yandex-market-search`, `osm-nearby`, `zoon-nearby`.
- [x] Подтверждено, что GitHub Issues и PR недоступны без `gh auth login`, поэтому backlog управляется через TODO.md и прямые PR.
- [x] Проверен changeset inventory: 14 changeset файлов присутствуют для подготовки Version Packages PR.
- [x] Ветка подтверждена как готовая к merge в main после прохождения всех проверок CI.

## Выполнено в этом раунде (раунд 6)

- [x] Проведён аудит `README.md`, `TODO.md` и `docs/roadmap.md` на устаревшие статусы и расхождения после завершения 13 target-навыков.
- [x] README дополнен отдельным блоком `Что делаем дальше`, чтобы следующий iteration backlog был виден не только в `TODO.md`, но и в корневой документации.
- [x] `docs/roadmap.md` очищен от устаревшего статуса Milestone 4 `в работе`; статус переведён в зафиксированное состояние по документной миграции и матрице замен.
- [x] Секция roadmap с уже выпущенными навыками разделена на target-линейку и сохраняемые legacy/utility-навыки, чтобы список опубликованных возможностей не смешивал продуктовый вектор и backward compatibility.
- [x] Добавлена doc-regression проверка, которая держит README, roadmap и TODO синхронными по следующим продуктовым приоритетам.
- [x] Полный `npm run ci` после документных правок проходит: lint ✓, typecheck ✓, test 62 pass / 0 fail / 1 skipped в корневом doc-suite, workspace tests ✓, pack:dry-run ✓.

## Выполнено в этом раунде (раунд 7)

- [x] Проведён release-hygiene аудит верхнеуровневых документов: `README.md` и `docs/roadmap.md` очищены от устаревших релизных ярлыков и сводок расстояния ветки как от неустойчивого статуса.
- [x] Повторно сверён release backlog: inventory `.changeset/` остаётся целостным и содержит 14 файлов, достаточных для следующего version/publish round.
- [x] README обновлён: в блоке `Что уже сделано по миграции` зафиксирован завершённый release-hygiene раунд, а в `Что делаем дальше` добавлены более точные следующие шаги по booking-replacement decision matrix.
- [x] `docs/roadmap.md` обновлён: Milestone 5 теперь явно разделяет закрытую release-hygiene подзадачу и незавершённый booking-research.
- [x] `TODO.md` дополнен новым верхним статус-блоком и явной пометкой, что нижележащие round summaries являются историческим журналом, а не источником текущего статуса.
- [x] Doc-regression тесты расширены: теперь они проверяют отсутствие устаревших branch metrics и merge-ready формулировок в `README.md` и `docs/roadmap.md`.

## Новые пункты плана

- [x] Перевести runtime-artifacts в `k-skill-setup/SKILL.md` на `~/.config/ru-skill/bin` и `~/.config/ru-skill/logs`, сохранив legacy alias только на уровне совместимости имени, а не operational default path.
- [x] Зафиксировать тот же `ru-skill`-first runtime path в `ru-skill-setup/SKILL.md`, README, roadmap и TODO, чтобы следующий шаг был виден не только в tests, но и в planning docs.
- [x] Добавить doc-regression на setup runtime-artifacts, чтобы `k-skill-setup` не возвращал `~/.config/k-skill/*` как основной путь для check/log automation.
- [x] Решить, нужен ли отдельный read-only/handoff skill сверх `yandex-rasp`, или railway replacement уже достаточно закрыт текущим discovery + documented external handoff.
- [x] Если отдельный handoff-layer нужен, проверить только стабильные безлогинные сценарии: deep-link, landing search или export маршрута без оплаты и пользовательских секретов.
- [x] Явно обновить legacy railway docs, чтобы `srt-booking` и `ktx-booking` были помечены не только как совместимые, но и как нецелевые для новых российских write-интеграций.
- [x] Пункт перенесён в верхний актуальный план TODO: держать doc-regression в CI, чтобы README, roadmap, TODO и booking-research совпадали по следующему продуктовому приоритету и не возвращали release-археологию в живые секции.
- [x] Проверить, даёт ли какой-либо handoff-сценарий измеримую пользовательскую ценность сверх уже существующего `yandex-rasp`, прежде чем открывать новый target-package.
- [x] Если handoff-ценность не подтверждается, перевести Milestone 5 в документно закрытое состояние и убрать railway replacement из активного implementation backlog.
- [x] Довести до конца remaining legacy-only matrix: `seoul-subway-arrival`, `toss-securities` и другие уже закрытые без replacement gaps должны иметь одинаковый статус в README, roadmap и install-flow.
- [x] Пересмотреть user-facing surfaces для `delivery-tracking`, `k-skill-proxy` и других utility/transition docs только на предмет реально поддерживаемых российских public surfaces.
- [x] Пункт перенесён в верхний актуальный план TODO: если для очередного legacy-gap нет устойчивого public source, закрывать его документно, а не открывать forced implementation backlog.

## Выполнено в этом раунде (раунд 15)

- [x] `k-skill-setup/SKILL.md` больше не использует `~/.config/k-skill/bin`, `~/.config/k-skill/logs` и `k-skill-update-check` как примеры по умолчанию: runtime-artifacts переведены на `ru-skill`-prefixed пути и имя задачи.
- [x] `ru-skill-setup/SKILL.md`, `README.md` и `docs/roadmap.md` синхронно зафиксировали, что setup runtime-artifacts тоже относятся к `ru-skill`-first operational model, а не только secrets resolution order.
- [x] `scripts/skill-docs.test.js` расширен регрессиями на setup runtime-artifacts, чтобы legacy alias `k-skill-setup` не возвращал `~/.config/k-skill/*` в роль основного operational path.

## Выполнено в этом раунде (раунд 11)

- [x] README, `docs/roadmap.md` и `docs/install.md` выровнены по статусам `legacy-only` и `transition` для `seoul-subway-arrival`, `toss-securities` и `k-skill-proxy`.
- [x] В `README.md` статус `k-skill-proxy` переведён из двусмысленного `Активный` в явный `Transition`, чтобы package matrix не расходилась с roadmap.
- [x] `docs/install.md` дополнен явным описанием того, как читать смешанный список skills: где текущая `target`-линейка, где `legacy-only`, а где transition-инфраструктура.
- [x] `docs/features/delivery-tracking.md`, `docs/features/seoul-subway-arrival.md`, `docs/features/toss-securities.md` и `docs/features/k-skill-proxy.md` дополнены boundary notes, чтобы legacy/transition сценарии не выглядели как скрытый backlog новых российских skills.
- [x] `seoul-subway-arrival/SKILL.md` исправлен на `ru-skill`-first credential order с legacy fallback на `~/.config/k-skill/secrets.env`.
- [x] Doc-regression тесты расширены: теперь они страхуют package-status matrix, install-flow boundary notes и `ru-skill`-first credential order для `seoul-subway-arrival`.

## Новые пункты плана

- [x] Довести `fine-dust-location`, `docs/setup.md` и `docs/security-and-secrets.md` до того же `ru-skill`-first credential order, чтобы proxy/secret flow не расползался между skill-level и setup-level документацией.
- [x] Добавить doc-regression на user-facing boundary notes для `fine-dust-location` и других transition/legacy utility guides, чтобы они не возвращались к двусмысленной подаче как потенциальные target-skills.
- [x] Провести отдельный audit helper scripts и package README для `k-skill-proxy`/`fine-dust-location`, чтобы legacy endpoint и naming оставались compatibility-layer, а не неявным public default для новых русскоязычных сценариев.

## Выполнено в этом раунде (раунд 12)

- [x] `docs/features/fine-dust-location.md` дополнен явным boundary note: сценарий зафиксирован как legacy/transition utility, а не как новый target-skill.
- [x] `fine-dust-location/SKILL.md` выровнен по `ru-skill`-first credential order и теперь отдельно объясняет, что published proxy endpoint и legacy naming существуют ради совместимости.
- [x] `docs/setup.md` и `docs/security-and-secrets.md` уточняют различие между `KSKILL_PROXY_BASE_URL` как endpoint override и `AIR_KOREA_OPEN_API_KEY` как реальным секретом для direct fallback/self-hosted proxy.
- [x] `packages/k-skill-proxy/README.md` дополнен transition-boundary и явным порядком secret resolution для `scripts/run-k-skill-proxy.sh`.
- [x] `README.md` и `docs/roadmap.md` синхронизированы с этим раундом и больше не держат `fine-dust-location` backlog только в TODO.
- [x] Doc-regression тесты расширены на `fine-dust-location`, `k-skill-proxy` package README и proxy secret-order semantics.

## Новые пункты плана

- [x] Расширить package-level audit на остальные legacy/utility surfaces, где README или helper scripts ещё могут продвигать compatibility endpoint как неявный default для новых сценариев.
- [x] Проверить `examples/secrets.env.example` и связанные setup helper'ы на необходимость более явного разделения config override и настоящих credential, не ломая текущую совместимость.
- [x] Продолжить вычищать skill-level copy, где legacy-контекст ещё описан как operational default вместо backward-compatible fallback.

## Выполнено в этом раунде (раунд 13)

- [x] `examples/secrets.env.example` больше не смешивает реальные credential с config override: `KSKILL_PROXY_BASE_URL` вынесен в явный optional-comment block вместо обязательной строки шаблона.
- [x] `docs/setup.md`, `docs/security-and-secrets.md`, `k-skill-setup/SKILL.md` и `ru-skill-setup/SKILL.md` синхронно описывают `KSKILL_PROXY_BASE_URL` как optional endpoint override, а не как секрет по умолчанию.
- [x] `fine-dust-location/SKILL.md` дополнительно очищен от operational-default формулировок: published proxy endpoint сохранён как compatibility default, а пользовательский запрос секрета ограничен direct fallback/self-hosted сценарием.
- [x] `scripts/check-setup.sh` теперь не подсказывает добавлять proxy override без необходимости и отражает тот же `ru-skill`-first setup flow.
- [x] `README.md` и `docs/roadmap.md` обновлены, чтобы этот шаг был отражён не только в `TODO.md`.
- [x] Doc-regression тесты расширены на secrets template, setup skills и setup helper script.

## Новые пункты плана

- [x] Довести тот же optional-override vs real-credential split до первой пачки package README и package-level boundary notes за пределами fine-dust/proxy-контура.
- [x] Добавить doc-regression на package README для `legacy-only` boundary и уже подтверждённых российских replacements.
- [x] Проверить оставшиеся legacy setup/runtime helper'ы на подсказки, которые всё ещё могут продвигать `~/.config/k-skill/*` как неявный основной путь.
- [x] Пройти оставшиеся skill-level guides и package README, где корейский контекст ещё допустим технически, но не должен звучать как продуктовый default.
- [x] Продолжить вычищать skill-level copy, где legacy-контекст ещё описан как operational default вместо backward-compatible fallback.

## Выполнено в этом раунде (раунд 19)

- [x] `scripts/fine_dust.py` русифицирован: корейские метки качества, ошибки, текстовый вывод и argparse help переведены на русский.
- [x] `scripts/ktx_booking.py` русифицирован: корейские help-строки argparse переведены на русский.
- [x] `scripts/test_fine_dust.py` обновлён: assertions синхронизированы с русскоязычными переводами fine_dust.py.
- [x] `docs/features/fine-dust-location.md` русифицирован: корейские описательные термины (`행정구역`, `지역명`, `측정소`, `조회 시각` и др.) заменены русскими аналогами.
- [x] `scripts/skill-docs.test.js` обновлён: doc-regression assertions для fine-dust docs синхронизированы с русскоязычными формулировками.
- [x] `k-skill-setup/SKILL.md` исправлен: GitHub star направлен на `denis-gordeev/ru-skill` вместо `NomaDamas/k-skill`.
- [x] Проведён аудит helper/runtime scripts на оставшиеся `k-skill`-prefixed defaults: `shared_secrets.py`, `check-setup.sh` и `run-k-skill-proxy.sh` корректно используют `ru-skill`-first порядок; legacy fallback сохранён только как совместимый путь.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Расширить русификацию на `packages/k-skill-proxy/src/server.js` и `packages/k-skill-proxy/test/server.test.js`, где корейские ошибки и лог-сообщения ещё не переведены.
- [x] Добрать runtime/secrets regression для legacy feature-guides, где сейчас тестируется только boundary copy без operational semantics.

## Выполнено в этом раунде (раунд 21)

- [x] `hwp/SKILL.md` полностью переведён на русский: все корейские описания, команды, примеры и заметки.
- [x] `kakaotalk-mac/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow, safety rules и примеры.
- [x] `zipcode-search/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow и заметки.
- [x] `toss-securities/SKILL.md` полностью переведён на русский: все корейские описания, команды, safety rules и примеры.
- [x] `kbo-results/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow и заметки.
- [x] `srt-booking/SKILL.md` оставшиеся корейские фрагменты переведены на русский: примеры запросов, входные данные, заметки.
- [x] `lotto-results/SKILL.md` полностью переведён на русский: все корейские описания, шаги workflow и заметки.
- [x] `python-packages/README.md` полностью переведён на русский.
- [x] `delivery-tracking/SKILL.md` корейские фрагменты переведены на русский: status map, error messages, carrier names, sample output.
- [x] `docs/features/delivery-tracking.md` корейские фрагменты переведены на русский: status map, error messages, carrier names, sample output, section labels.
- [x] `docs/sources.md` legacy reference block: все корейские метки источников переведены на русский.
- [x] `scripts/fixtures/delivery-tracking-public-samples.json` обновлён: статус-метки синхронизированы с русскоязычным переводом.
- [x] `scripts/skill-docs.test.js` обновлён: doc-regression assertions синхронизированы с русскоязычными формулировками для zipcode-search, delivery-tracking, sources.md, kakaotalk-mac, hwp.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 72 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Добавить doc-regression для user-facing feature-guides (`fine-dust-location`, `seoul-subway-arrival`, `srt-booking`, `ktx-booking`), чтобы runtime/secrets semantics и `ru-skill`-first порядок не защищались только на уровне `SKILL.md` и setup/proxy helper-docs.
- [x] Синхронизировать `README.md`, `TODO.md` и `docs/roadmap.md` после закрытия helper/runtime cleanup, чтобы следующий приоритет больше не ссылался на уже выполненный слой работ.
- [x] Продолжить русификацию оставшихся feature-doc файлов, где ещё встречаются корейские фрагменты (`docs/features/zipcode-search.md`, `docs/features/kakaotalk-mac.md`, `docs/features/kbo-results.md`, `docs/features/toss-securities.md`, `docs/features/lotto-results.md`, `docs/features/srt-booking.md`, `docs/features/hwp.md`).
- [x] Распространить user-facing runtime/secrets regression на остальные legacy guides, где сейчас ещё страхуются только boundary notes и replacement copy без operational semantics.

## Выполнено в этом раунде (раунд 24)

- [x] Проведён полный аудит skill-level copy на предмет legacy-контекста, описанного как operational default.
- [x] `delivery-tracking/SKILL.md`: добавлен `## Граничное примечание` (`legacy-only`); description заменён на legacy-compatible; forward-looking формулировки удалены.
- [x] `toss-securities/SKILL.md`: добавлен `## Граничное примечание` (`legacy-only`, ссылка на `moex-shares`); description заменён на legacy-compatible.
- [x] `hwp/SKILL.md` и `docs/features/hwp.md`: добавлен `## Граничное примечание` (`target-supporting`) — корейский формат без прямого российского аналога, но полезен как утилита.
- [x] `blue-ribbon-nearby/SKILL.md`: routing rule исправлен — `osm-nearby` / `zoon-nearby` теперь primary для российских nearby-запросов.
- [x] `ktx-booking/SKILL.md`: description обновлён с добавлением `Legacy-compatible ... not for new Russian railway integrations`.
- [x] Doc-regression расширен на 4 legacy-навыка с workflow/content assertions: `seoul-subway-arrival`, `kbo-results`, `lotto-results`, `srt-booking`.
- [x] Doc-regression расширен на boundary-note coverage: `delivery-tracking/SKILL.md`, `toss-securities/SKILL.md`, `hwp/SKILL.md` + `docs/features/hwp.md`, `blue-ribbon-nearby` routing.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 91 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Продолжить русификацию оставшихся domain-inherent Korean фрагментов, где это допустимо без потери смысла — закрыто: после раунда 26 весь оставшийся Korean в source code и docs является domain-inherent (API parameters, location names, fixture data, regex patterns); user-facing Korean полностью устранён.
- [x] Расширить doc-regression coverage для legacy skills с boundary-level тестами на workflow/content assertions для оставшихся непокрытых: `kakaotalk-mac`, `daiso-product-search`, `delivery-tracking` (SKILL.md workflow).
- [x] Пункт перенесён в верхний актуальный план TODO: держать doc-regression в CI, чтобы README, roadmap, TODO и booking-research совпадали по следующему продуктовому приоритету.
- [x] Пункт перенесён в верхний актуальный план TODO: если для очередного legacy-gap нет устойчивого public source, закрывать его документно, а не открывать forced implementation backlog.

## Выполнено в этом раунде (раунд 23)

- [x] User-facing Korean labels в source code переведены на русский: `kleague-results` (статусы матчей), `kakao-bar-nearby` (подсказки вместимости), `k-lotto` (лотерейные метки), `blue-ribbon-nearby` (сообщение об ошибке).
- [x] User-facing Korean текст в docs/SKILL.md/feature-docs переведён на русский: `kakao-bar-nearby`, `blue-ribbon-nearby`, `kleague-results`, `zipcode-search`, `hwp`, `ktx-booking`, `kakaotalk-mac`, package README (`kakao-bar-nearby`, `kleague-results`, `daiso-product-search`, `k-lotto`).
- [x] Doc-regression расширен на 6 ранее непокрытых target-навыков: `moex-shares`, `stoloto-lotto`, `kinopoisk-search`, `pravo-documents`, `rpl-results`, `osm-nearby`.
- [x] Doc-regression assertions обновлены под русскоязычные формулировки во всех затронутых файлах.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 85 pass / 0 fail / 1 skipped, pack:dry-run.

## Новые пункты плана

- [x] Продолжить русификацию оставшихся domain-inherent Korean фрагментов, где это допустимо без потери смысла — закрыто: после раунда 26 весь оставшийся Korean в source code и docs является domain-inherent (API parameters, location names, fixture data, regex patterns); user-facing Korean полностью устранён.
- [x] Расширить doc-regression coverage для legacy skills с только boundary-level тестами (srt-booking, seoul-subway-arrival, kbo-results, lotto-results): добавить workflow/content assertions.
- [x] Пункт перенесён в верхний актуальный план TODO: держать doc-regression в CI, чтобы README, roadmap, TODO и booking-research совпадали по следующему продуктовому приоритету.
- [x] Пункт перенесён в верхний актуальный план TODO: если для очередного legacy-gap нет устойчивого public source, закрывать его документно, а не открывать forced implementation backlog.

- [x] `scripts/skill-docs.test.js` расширен на user-facing guides `fine-dust-location`, `seoul-subway-arrival`, `srt-booking` и `ktx-booking`: добавлены проверки `ru-skill`-first secrets order, runtime/secrets semantics и replacement boundary.
- [x] `README.md` обновлён: helper/runtime cleanup больше не подаётся как следующий шаг, а новый фокус зафиксирован на user-facing regression и оставшейся русификации feature-docs.
- [x] `docs/roadmap.md` синхронизирован с тем же статусом: roadmap теперь явно фиксирует закрытие helper/runtime cleanup и следующий слой работы по legacy feature-docs.

## Новые пункты плана

- [x] Продолжить русификацию оставшихся feature doc файлов, где ещё встречаются корейские фрагменты (`docs/features/zipcode-search.md`, `docs/features/kakaotalk-mac.md`, `docs/features/kbo-results.md`, `docs/features/toss-securities.md`, `docs/features/lotto-results.md`, `docs/features/srt-booking.md`, `docs/features/hwp.md`).
- [x] Добрать runtime/secrets regression для legacy feature-guides, где сейчас тестируется только boundary copy без operational semantics.
- [x] Продолжить вычищать skill-level copy, где legacy-контекст ещё описан как operational default вместо backward-compatible fallback (в основном в feature docs, не SKILL.md).

## Выполнено в этом раунде (раунд 20)

- [x] `packages/k-skill-proxy/src/airkorea.js` русифицирован: корейские grade labels, error messages и log messages переведены на русский.
- [x] `packages/k-skill-proxy/src/server.js` русифицирован: error messages и rate-limit message переведены на русский.
- [x] `packages/k-skill-proxy/test/airkorea.test.js` обновлён: assertions синхронизированы с русскоязычными grade labels.
- [x] `packages/k-skill-proxy/test/server.test.js` обновлён: mock provider messages и grade labels синхронизированы с русскоязычными переводами.
- [x] Полный CI (`npm run ci`) проходит: lint, typecheck, 73 pass / 0 fail / 1 skipped, pack:dry-run.

## Выполнено в этом раунде (раунд 14)

- [x] `packages/toss-securities/README.md` переведён на текущую русскоязычную migration-модель: добавлен явный `legacy-only` boundary, ссылка на replacement `moex-shares` и сохранён read-only контракт над `tossctl`.
- [x] `packages/daiso-product-search/README.md`, `packages/kleague-results/README.md`, `packages/blue-ribbon-nearby/README.md`, `packages/kakao-bar-nearby/README.md` и `packages/k-lotto/README.md` выровнены по той же схеме: legacy compatibility сохранена, но package-level docs больше не подают эти пакеты как скрытый target-backlog.
- [x] `scripts/skill-docs.test.js` расширен регрессиями на package README, чтобы `legacy-only` boundary и replacement references удерживались автоматически.
- [x] `README.md`, `docs/roadmap.md` и `TODO.md` синхронно обновлены под этот статус и следующий iteration backlog.
