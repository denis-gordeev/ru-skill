---
name: fine-dust-location
description: 에어코리아 기반 미세먼지/초미세먼지를 지역명 또는 위치 힌트로 조회한다. published k-skill-proxy report endpoint는 compatibility default 이며 필요할 때만 override 한다.
license: MIT
metadata:
  category: utility
  locale: ru-RU
  phase: v1
---

# Fine Dust By Location

## What this skill does

기본적으로 published compatibility endpoint `https://k-skill-proxy.nomadamas.org/v1/fine-dust/report` 로 요청해서 PM10 / PM2.5 / 통합대기등급을 요약한다.

## Boundary note

이 스킬은 `ru-skill`의 새로운 target 방향이 아니라 AirKorea + `k-skill-proxy` compatibility layer 를 유지하기 위한 legacy/transition utility 다. 새로운 러시아어 public-source 시나리오 후보처럼 보이면 안 되며, 기본 proxy endpoint 와 legacy naming 역시 호환성 목적이다.

## When to use

- "지금 내 위치 미세먼지 어때?"
- "강남 쪽 초미세먼지 수치 알려줘"
- "여기 공기질 괜찮아?"

## Inputs

- 일반 입력: 지역명/행정구역 힌트
- 재조회 입력: 정확한 측정소명

## Region naming convention

지역명은 아래처럼 **측정소명에 가까운 한국어 행정구역 이름**을 우선 사용한다.

- 좋음: `강남구`, `서울 강남구`, `종로구`, `수원시`
- 애매함: `강남`, `서울 남쪽`, `코엑스 근처`

여러 토큰이 들어오면 helper / proxy 는 보통 **가장 구체적인 토큰**을 우선 본다. 예: `서울 강남구` → `강남구`.

## Default path

추가 client API 레이어는 불필요하다. 그냥 프록시 서버에 HTTP 요청만 넣으면 된다.

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'regionHint=서울 강남구'
```

스크립트 helper 도 같은 report endpoint 를 기본 경로로 사용한다.

```bash
python3 scripts/fine_dust.py report --region-hint '서울 강남구' --json
```

## Credential resolution order

1. 이미 환경변수에 값이 있으면 그대로 사용한다.
2. 별도 secret vault 가 있으면 거기서 값을 꺼내 환경변수로 주입한다.
3. env 가 비어 있으면 먼저 `~/.config/ru-skill/secrets.env`, 그다음 legacy fallback `~/.config/k-skill/secrets.env` 를 찾는다.
4. 그래도 없으면 direct fallback / self-hosted proxy 에 필요한 `AIR_KOREA_OPEN_API_KEY` 를 사용자에게 요청한다. `KSKILL_PROXY_BASE_URL` 는 사용자가 다른 endpoint 를 명시적으로 원할 때만 받는다.

## Ambiguous locations

입력한 지역명이 단일 측정소로 바로 확정되지 않으면 proxy 는 `ambiguous_location` 과 함께 후보 측정소 목록을 돌려준다.

예:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'regionHint=광주 광산구'
```

이때 응답의 `candidate_stations` 중 하나를 골라 다시 `stationName` 으로 조회한다.

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'stationName=우산동(광주)'
```

## Detailed API paths

원본 AirKorea와 비슷한 passthrough 경로(`/B552584/...`)나 direct fallback 상세는 아래 문서만 참고한다.

- `docs/features/fine-dust-location.md`
- `docs/features/k-skill-proxy.md`

## Keep the answer compact

응답에는 아래만 먼저 정리한다.

- 측정소
- 조회 시각
- PM10 값과 등급
- PM2.5 값과 등급
- 통합대기등급
- 조회 방식(`fallback`)

## Failure modes

- regionHint 가 너무 넓거나 단일 측정소를 확정할 수 없는 경우
- 프록시 서버가 내려가 있거나 upstream key가 비어 있는 경우
- 측정소명과 지역명이 달라 직접 fallback 이 필요한 경우

## Notes

- 기본 경로는 항상 `k-skill-proxy.nomadamas.org` 의 report endpoint 다.
- `KSKILL_PROXY_BASE_URL` 는 published compatibility endpoint 를 다른 proxy 로 바꿔야 할 때만 지정하는 optional override 다. credential 자체는 아니다.
- 지역명 조회는 먼저 후보를 얻고, 필요하면 정확한 측정소명으로 재조회한다.
- passthrough / direct AirKorea 구현 세부는 스킬 본문에 길게 반복하지 않는다.
- free API 프록시는 공개 endpoint 를 기본으로 두되, 이 동작이 새로운 target-skill 방향을 뜻하지는 않는다.
