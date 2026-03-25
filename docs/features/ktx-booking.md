# KTX 예매 가이드

## 이 기능으로 할 수 있는 일

- KTX/Korail 열차 조회
- 좌석 가능 여부 확인
- 예약 진행
- 예약 내역 확인
- 예약 취소

## 먼저 필요한 것

- Python 3.10+
- `python -m pip install korail2`
- [공통 설정 가이드](../setup.md) 완료
- [보안/시크릿 정책](../security-and-secrets.md) 확인

## 필요한 시크릿

- `KSKILL_KTX_ID`
- `KSKILL_KTX_PASSWORD`

## 입력값

- 출발역
- 도착역
- 날짜: `YYYYMMDD`
- 희망 시작 시각: `HHMMSS`
- 인원 수와 승객 유형
- 좌석 선호

## 기본 흐름

1. 먼저 열차를 조회합니다.
2. 후보 열차의 출발/도착 시각, KTX 여부, 좌석 여부, 가격을 보여줍니다.
3. 대상 열차가 명확할 때만 예약합니다.
4. 예약 확인/취소는 대상 예약을 다시 식별한 뒤 진행합니다.

## 예시

```bash
SOPS_AGE_KEY_FILE="$HOME/.config/k-skill/age/keys.txt" \
sops exec-env "$HOME/.config/k-skill/secrets.env" 'python - <<'"'"'PY'"'"'
import os
from korail2 import Korail, TrainType

korail = Korail(
    os.environ["KSKILL_KTX_ID"],
    os.environ["KSKILL_KTX_PASSWORD"],
)
trains = korail.search_train(
    "서울",
    "부산",
    "20260328",
    "090000",
    train_type=TrainType.KTX,
)

for idx, train in enumerate(trains[:5], start=1):
    print(idx, train)
PY
'
```

## 주의할 점

- SRT 예매와는 별도 표면이므로 혼용하지 않습니다.
- 평문 비밀번호 전달은 금지합니다.
- 결제 완료까지 자동화하는 범위는 아닙니다.
