# Sources

Этот документ фиксирует внешние поверхности, на которые уже опирается `ru-skill`, и источники, которые рассматриваются как база для русскоязычной миграции.

## Что здесь важно

- Основная цель репозитория сейчас: постепенно уходить от корейско-специфичных сценариев к российским и русскоязычным.
- Legacy-источники ниже сохраняются, чтобы не ломать уже существующие навыки и тесты.
- Для новых функций предпочтение отдаётся бесплатным, публичным и официальным поверхностям с понятными условиями использования.

## Базовые источники по платформе и экосистеме

- Vercel agent skills package structure: https://vercel.com/kb/guide/agent-skills-creating-installing-and-sharing-reusable-agent-context

## Источники для текущих legacy-навыков

### Железные дороги и транспорт

- `SRTrain` / `ryanking13/SRT`: https://github.com/ryanking13/SRT
- `korail2` / `carpedm20/korail2`: https://github.com/carpedm20/korail2
- `korail2` anti-bot bypass PR #54: https://github.com/carpedm20/korail2/pull/54
- Seoul real-time subway arrival API: https://www.data.go.kr/data/15058052/openapi.do

### Спорт

- `kbo-game`: https://github.com/vkehfdl1/kbo-game
- K League schedule/results JSON: https://www.kleague.com/getScheduleList.do
- K League standings JSON: https://www.kleague.com/record/teamRank.do

### Финансы

- tossinvest-cli: https://github.com/JungHoonGhae/tossinvest-cli

### Документы и приложения

- `@ohah/hwpjs`: https://github.com/ohah/hwpjs
- `hwp-mcp`: https://github.com/jkf87/hwp-mcp
- `silver-flight-group/kakaocli`: https://github.com/silver-flight-group/kakaocli
- KakaoTalk Mac install reference via `mas`: https://velog.io/@bonjugi/%EB%A7%A5%EB%B6%81-M1%EC%97%90-homebrew%EB%A1%9C-node-vscode-%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0

### Лотереи, адреса и доставка

- Dhlottery result page: https://www.dhlottery.co.kr/lt645/result
- Dhlottery past rounds JSON: https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do
- Korea Post postcode lookup: https://parcel.epost.go.kr/parcel/comm/zipcode/comm_newzipcd_list.jsp
- CJ Logistics tracking page: https://www.cjlogistics.com/ko/tool/parcel/tracking
- CJ Logistics tracking detail JSON: https://www.cjlogistics.com/ko/tool/parcel/tracking-detail
- Korea Post tracking summary: https://service.epost.go.kr/trace.RetrieveRegiPrclDeliv.postal?sid1=
- Korea Post tracking detail HTML: https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm

### Локации, еда и товары

- Daiso store search: https://www.daisomall.co.kr/api/ms/msg/selStr
- Daiso store search keywords: https://www.daisomall.co.kr/api/ms/msg/selStrSrchKeyword
- Daiso store details: https://www.daisomall.co.kr/api/dl/dla-api/selStrInfo
- Daiso product search page: https://www.daisomall.co.kr/ssn/search/Search
- Daiso product search JSON: https://www.daisomall.co.kr/ssn/search/SearchGoods
- Daiso product summary JSON: https://www.daisomall.co.kr/ssn/search/GoodsMummResult
- Daiso pickup stock JSON: https://www.daisomall.co.kr/api/pd/pdh/selStrPkupStck
- Daiso online stock JSON: https://www.daisomall.co.kr/api/pdo/selOnlStck
- Blue Ribbon Survey main site: https://www.bluer.co.kr/
- Blue Ribbon zone search: https://www.bluer.co.kr/search/zone
- Blue Ribbon nearby restaurants JSON: https://www.bluer.co.kr/restaurants/map
- Kakao Map mobile search: https://m.map.kakao.com/actions/searchView
- Kakao Map place panel JSON: https://place-api.map.kakao.com/places/panel3/<confirmId>

### Экология и погода

- AirKorea air quality API: https://www.data.go.kr/data/15073861/openapi.do
- AirKorea station info API: https://www.data.go.kr/data/15073877/openapi.do

## Источники-кандидаты для русскоязычной миграции

Этот блок не означает, что соответствующие навыки уже реализованы. Он нужен, чтобы следующий раунд разработки опирался на заранее зафиксированные классы источников.

## Первый выбранный русскоязычный источник

### Банк России: официальные курсы валют

- Страница с описанием XML-сервисов Банка России: https://www.cbr.ru/development/SXML/
- Ежедневные курсы валют XML: https://www.cbr.ru/scripts/XML_daily.asp
- Динамика курса по валюте: https://www.cbr.ru/scripts/XML_dynamic.asp

Почему этот источник выбран первым:

- Это официальный источник Банка России, а не сторонний агрегатор.
- Доступ read-only и публичный, без логина и без пользовательских секретов.
- Минимальный сценарий полезен сам по себе: курс на сегодня, курс на дату, краткая динамика.
- Для первого нового навыка не нужен proxy или обход нестабильного веб-интерфейса.

Минимальный scope первого навыка:

- Вход: код валюты (`USD`, `EUR`, `CNY`) и необязательная дата.
- Выход: номинал, курс ЦБ РФ, дата публикации, изменение к предыдущему доступному значению.
- Технический baseline: skill + небольшой read-only package с fixture-based тестом на нормализацию XML.
- Рабочее имя-кандидат: `cbr-rates` или `bank-of-russia-rates`.

Что не входит в первый scope:

- Конвертация по пользовательским банковским курсам.
- Исторические графики и длинная аналитика.
- Любые write-операции, авторизация или пользовательские кабинеты.

## Второй выбранный русскоязычный источник

### Московская биржа: ISS API по акциям

- Страница ISS API: https://www.moex.com/a8531
- Публичный endpoint по тикеру акции: https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER.json
- Публичный список акций на основной доске: https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json

Почему этот источник выбран следующим:

- Это официальный публичный интерфейс Московской биржи, а не сторонний парсер котировок.
- Сценарий остаётся read-only и не требует логина, токенов или proxy.
- Источник хорошо дополняет `cbr-rates`: один пакет покрывает официальные курсы ЦБ РФ, второй - публичный рынок акций MOEX.
- Для минимального MVP достаточно двух стабильных чтений: карточка тикера и список инструментов.

Минимальный scope второго навыка:

- Вход: тикер MOEX (`SBER`, `GAZP`, `LKOH`) и необязательный `board`, по умолчанию `TQBR`.
- Выход: `shortName`, `ISIN`, `lotSize`, предыдущая цена, delayed `lastPrice`, изменение и время обновления.
- Дополнительно: первая страница тикеров для основной доски без секретов.
- Технический baseline: skill + read-only package + fixture-based тесты на JSON-нормализацию ISS.

Что не входит во второй scope:

- Реалтайм-подписки, websocket и торговые операции.
- Облигации, валютный рынок, фьючерсы и опционы.
- Пользовательские портфели, брокерские кабинеты и авторизация.

### Бытовые и городские данные

- Официальные погодные и климатические API с публичным доступом или бесплатным тарифом
- Источники по качеству воздуха и предупреждениям, пригодные для read-only proxy
- Официальные или общедоступные источники по адресам и индексам
- Официальные расписания транспорта и железнодорожные веб-интерфейсы, допускающие аккуратный read-only доступ

### Электронная коммерция и геопоиск

- Публичные карточки магазинов и поисковые страницы маркетплейсов
- Официальные страницы магазинов с адресами, режимом работы и контактами
- Каталоги товаров и availability-страницы, которые можно использовать без приватных API и без логина

### Финансы и гос-сценарии

- Read-only веб-поверхности с официальной документацией или стабильным пользовательским UX
- Пошаговые официальные инструкции, которые можно превращать в skill-гайды без хранения чувствительных данных

## Правила отбора новых источников

- Берём только то, что можно использовать легально и без обхода платных ограничений.
- Для proxy-поверхностей приоритет у бесплатных API и официальных open data.
- Если источник требует секрет, этот секрет должен жить только на серверной стороне или в локальном окружении пользователя.
- Если источник нестабилен, в репозиторий добавляется фикстура или явная документация о рисках.

## Legacy reference block

Этот блок сохранён в исходном виде, потому что текущие regression-тесты и часть legacy-документации опираются на точные формулировки.

- Vercel skills package 구조: https://vercel.com/kb/guide/agent-skills-creating-installing-and-sharing-reusable-agent-context
- `SRTrain` / `ryanking13/SRT`: https://github.com/ryanking13/SRT
- `korail2` / `carpedm20/korail2`: https://github.com/carpedm20/korail2
- `korail2` anti-bot bypass PR #54: https://github.com/carpedm20/korail2/pull/54
- `kbo-game`: https://github.com/vkehfdl1/kbo-game
- tossinvest-cli: https://github.com/JungHoonGhae/tossinvest-cli
- K League 일정/결과 JSON: https://www.kleague.com/getScheduleList.do
- K League 팀 순위 JSON: https://www.kleague.com/record/teamRank.do
- `@ohah/hwpjs`: https://github.com/ohah/hwpjs
- `hwp-mcp`: https://github.com/jkf87/hwp-mcp
- `silver-flight-group/kakaocli`: https://github.com/silver-flight-group/kakaocli
- KakaoTalk Mac 설치 참고(`mas`): https://velog.io/@bonjugi/%EB%A7%A5%EB%B6%81-M1%EC%97%90-homebrew%EB%A1%9C-node-vscode-%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0
- 동행복권 로또 결과 페이지: https://www.dhlottery.co.kr/lt645/result
- 동행복권 지난 회차 JSON 표면: https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do
- 다이소몰 매장 검색: https://www.daisomall.co.kr/api/ms/msg/selStr
- 다이소몰 매장 검색어 목록: https://www.daisomall.co.kr/api/ms/msg/selStrSrchKeyword
- 다이소몰 매장 상세: https://www.daisomall.co.kr/api/dl/dla-api/selStrInfo
- 다이소몰 상품 검색 요약: https://www.daisomall.co.kr/ssn/search/Search
- 다이소몰 상품 검색 목록: https://www.daisomall.co.kr/ssn/search/SearchGoods
- 다이소몰 상품 요약 목록: https://www.daisomall.co.kr/ssn/search/GoodsMummResult
- 다이소몰 매장 픽업 재고: https://www.daisomall.co.kr/api/pd/pdh/selStrPkupStck
- 다이소몰 온라인 재고: https://www.daisomall.co.kr/api/pdo/selOnlStck
- 블루리본 메인: https://www.bluer.co.kr/
- 블루리본 지역 검색: https://www.bluer.co.kr/search/zone
- 블루리본 주변 맛집 JSON: https://www.bluer.co.kr/restaurants/map
- 카카오맵 모바일 검색: https://m.map.kakao.com/actions/searchView
- 카카오맵 장소 패널 JSON: https://place-api.map.kakao.com/places/panel3/<confirmId>
- 서울특별시 지하철 실시간 도착정보: https://www.data.go.kr/data/15058052/openapi.do
- 에어코리아 대기오염정보: https://www.data.go.kr/data/15073861/openapi.do
- 에어코리아 측정소정보: https://www.data.go.kr/data/15073877/openapi.do
- 우체국 도로명주소 검색: https://parcel.epost.go.kr/parcel/comm/zipcode/comm_newzipcd_list.jsp
- CJ대한통운 배송조회: https://www.cjlogistics.com/ko/tool/parcel/tracking
- CJ대한통운 배송상세 JSON: https://www.cjlogistics.com/ko/tool/parcel/tracking-detail
- 우체국 배송조회: https://service.epost.go.kr/trace.RetrieveRegiPrclDeliv.postal?sid1=
- 우체국 배송상세 HTML: https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm
