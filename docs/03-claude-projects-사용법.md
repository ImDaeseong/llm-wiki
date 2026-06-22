# 03. Claude Projects 연동

Claude Projects는 프로젝트 단위로 시스템 프롬프트(지침)와 파일을 설정해 두면, 해당 프로젝트의 모든 대화에 자동으로 컨텍스트가 적용됩니다.

크롬 확장의 **WIKI 주입** 버튼과의 차이:

| 방식 | 장점 | 단점 |
|------|------|------|
| 크롬 확장 주입 | claude.ai 외 ChatGPT, Gemini 등 전 AI 지원 | 매 대화 시작 시 수동 클릭 필요 |
| Claude Projects | claude.ai 프로젝트 내 모든 대화에 자동 적용 | claude.ai 전용 |

---

## 설정 방법

### 1단계 — 컨텍스트 프롬프트 생성

WIKI 앱 → **프롬프트 생성기** 페이지 이동

1. 포함할 항목 선택 (프로필, 기술스택, AI선호 등)
2. AI 대상: **Claude** 선택
3. **전체 복사** 버튼 클릭

### 2단계 — Claude Projects에 적용

1. [claude.ai/projects](https://claude.ai/projects) 접속
2. 기존 프로젝트 선택하거나 **새 프로젝트** 생성
3. 프로젝트 설정 → **지침(Instructions)** 탭
4. 복사한 컨텍스트 붙여넣기

또는 `claude-projects/my-wiki-context.md` 파일을 열어 내용을 붙여넣은 뒤 프로젝트에 **파일로 업로드**할 수도 있습니다.

---

## 추천 프로젝트 구성

개발 분야별로 프로젝트를 분리하면 더 정밀한 컨텍스트를 구성할 수 있습니다.

### 예시: "MFC 개발" 프로젝트

**지침(Instructions)**에 포함할 내용:
```
## 나의 기본 컨텍스트
- 역할: 시니어 VC++/MFC 개발자
- 주 IDE: Visual Studio 2008 / 2019 / 2022
- 주 언어: C++, MFC (주력), Golang, Python (보조)
- 코딩 스타일: 헝가리안 표기법, PascalCase 함수명

## 코딩 지침
- Visual Studio 2008 호환 기준 코드를 우선으로 작성
- 최신 C++17 문법보다 구버전 호환성 우선
- 코드 예제에는 반드시 한국어 주석 포함
- 실용적인 예제 코드 중심으로 설명

## 기술 스택
- MFC (전문가): CDialog, CView, CDocument 패턴
- Win32 API (고급): 메시지 루프, GDI, 소켓
- SQLite (중급): 로컬 DB 연동
```

### 예시: "Go 서버" 프로젝트

```
## 나의 Go 개발 컨텍스트
- 경력: Go 3년, 주로 HTTP API 서버
- 스타일: 표준 라이브러리 우선, 최소 의존성
- 코드: 영어 변수명 + 한국어 주석
```

---

## 컨텍스트 업데이트 주기

WIKI 앱에서 정보를 수정했다면 Claude Projects 지침도 갱신해야 합니다.

1. WIKI 앱 → 프롬프트 생성기 → 전체 복사
2. Claude Projects → 해당 프로젝트 설정 → 지침 수정

크롬 확장을 쓰면 Gist 자동 동기화로 항상 최신 정보가 주입되지만, Claude Projects는 수동 업데이트가 필요합니다. 분기 1회 또는 기술 스택이 크게 바뀔 때 업데이트하는 것을 권장합니다.

---

## 다음 단계

- Obsidian 연동 → [04-obsidian-mcp-사용법.md](04-obsidian-mcp-사용법.md)
