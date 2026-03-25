# 공통 설정 가이드

SRT 예매, KTX 예매, 서울 지하철 도착정보 조회처럼 인증 정보가 필요한 기능은 이 문서를 먼저 보면 된다.

## 이 설정으로 해결하는 것

- `sops + age` 설치
- age key 생성
- 공통 secrets 파일 생성
- 암호화 확인
- 런타임 주입 확인

## 기본 경로

- age key: `~/.config/k-skill/age/keys.txt`
- encrypted secrets file: `~/.config/k-skill/secrets.env`

## 1) 필요한 도구 설치

### macOS

```bash
brew install sops age
```

### Ubuntu / Debian

```bash
sudo apt-get update
sudo apt-get install -y sops age
```

### Arch Linux

```bash
sudo pacman -S sops age
```

### Windows

```powershell
winget install Mozilla.SOPS FiloSottile.age
```

## 2) age key 만들기

```bash
mkdir -p ~/.config/k-skill/age
age-keygen -o ~/.config/k-skill/age/keys.txt
```

출력된 public key를 복사해 둡니다.

## 3) `.sops.yaml` 만들기

```yaml
creation_rules:
  - path_regex: .*secrets\.env(\.plain)?$
    age: age1replace-with-your-public-key
```

## 4) 공통 secrets 파일 만들기

```bash
mkdir -p ~/.config/k-skill
cat > ~/.config/k-skill/secrets.env.plain <<'EOF'
KSKILL_SRT_ID=replace-me
KSKILL_SRT_PASSWORD=replace-me
KSKILL_KTX_ID=replace-me
KSKILL_KTX_PASSWORD=replace-me
SEOUL_OPEN_API_KEY=replace-me
EOF
```

실제 값을 채운 뒤 바로 암호화합니다.

```bash
cd ~/.config/k-skill
sops --encrypt --input-type dotenv --output-type dotenv \
  secrets.env.plain > secrets.env
rm secrets.env.plain
```

## 5) 런타임 주입 확인

```bash
SOPS_AGE_KEY_FILE="$HOME/.config/k-skill/age/keys.txt" \
sops exec-env "$HOME/.config/k-skill/secrets.env" \
  'test -n "$KSKILL_SRT_ID" || test -n "$KSKILL_KTX_ID" || test -n "$SEOUL_OPEN_API_KEY"'
```

또는:

```bash
bash scripts/check-setup.sh
```

## 6) 실행 래퍼 두기

```bash
kskill-run() {
  SOPS_AGE_KEY_FILE="$HOME/.config/k-skill/age/keys.txt" \
  sops exec-env "$HOME/.config/k-skill/secrets.env" "$@"
}
```

## 기능별로 필요한 값

| 기능 | 필요한 값 |
| --- | --- |
| SRT 예매 | `KSKILL_SRT_ID`, `KSKILL_SRT_PASSWORD` |
| KTX 예매 | `KSKILL_KTX_ID`, `KSKILL_KTX_PASSWORD` |
| 서울 지하철 도착정보 조회 | `SEOUL_OPEN_API_KEY` |

## 다음에 볼 문서

- [SRT 예매 가이드](features/srt-booking.md)
- [KTX 예매 가이드](features/ktx-booking.md)
- [서울 지하철 도착정보 가이드](features/seoul-subway-arrival.md)
- [보안/시크릿 정책](security-and-secrets.md)
