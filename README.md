# 나의 LLM WIKI

> Claude, ChatGPT, Gemini 등 **어떤 AI 툴에서도** 나의 컨텍스트를 자동으로 주입하는 개인 세컨드 브레인

**WIKI 앱 바로가기 →** https://imdaeseong.github.io/llm-wiki/

---

## 무엇인가?

AI 툴을 쓸 때마다 "나는 VC++ 개발자입니다, Visual Studio를 씁니다..."를 반복 입력하는 번거로움을 없앤 시스템입니다. 개발 환경·기술 스택·코딩 스타일·진행 프로젝트를 한 곳에 저장해두면 어떤 AI든 자동으로 인식합니다.

---

## 구성

| 폴더 / 파일 | 설명 |
|---|---|
| `index.html` | WIKI 웹 앱 (GitHub Pages로 서비스) |
| `wiki-extension/` | 크롬 확장 — AI 사이트 자동 컨텍스트 주입 |
| `claude-projects/` | Claude Projects용 컨텍스트 파일 |
| `obsidian-mcp/` | Obsidian MCP 설정 템플릿 + 카파시 방식 LLM Wiki 에이전트 지침 |
| `docs/` | 상세 설치 및 사용 가이드 |

---

## 빠른 시작

| 단계 | 내용 | 가이드 |
|---|---|---|
| 1 | WIKI 앱 접속 및 설정 | [01-설치가이드.md](docs/01-설치가이드.md) |
| 2 | 크롬 확장 설치 | [02-크롬확장-사용법.md](docs/02-크롬확장-사용법.md) |
| 3 | Claude Projects 연동 | [03-claude-projects-사용법.md](docs/03-claude-projects-사용법.md) |
| 4 (선택) | Obsidian MCP 연동 | [04-obsidian-mcp-사용법.md](docs/04-obsidian-mcp-사용법.md) |
| 5 (선택) | 집 ↔ 회사 데이터 동기화 | [05-집회사-동기화.md](docs/05-집회사-동기화.md) |
| 6 (선택, Claude Desktop 전용) | 카파시 LLM Wiki 에이전트 | [06-카파시-llm-wiki-graphify.md](docs/06-카파시-llm-wiki-graphify.md) |

---

## 사용 방법 한눈에

```
AI 사이트 접속 (claude.ai / chatgpt.com / gemini.google.com)
  → 우하단 보라색 "WIKI 주입" 버튼 클릭
  → 내 컨텍스트 자동 삽입
  → 질문 입력 후 전송
```

---

## 공식 벤더 기능과의 차이 (2026-07 기준)

2026년 3월부터 Claude(`claude.com/import-memory`, 실험적)와 Gemini(대화기록 ZIP 가져오기, `gemini.google.com/import`)가 자체 크로스벤더 메모리·대화 이전 기능을 제공합니다 — 공식 기능은 벤더 간 **1회성 이전**입니다. 이 프로젝트는 하나의 소스(GitHub Gist)를 계속 최신 상태로 유지하며 Claude/ChatGPT/Gemini/Perplexity 어디서든 클릭 한 번으로 같은 컨텍스트를 주입하는 **상시 동기화**를 풉니다.

- 한 번만 옮기면 된다 → 공식 Import 기능(Claude/Gemini)을 먼저 확인
- 여러 AI를 계속 병행해서 쓰고, 프로필/스택/노트를 한 곳에서 갱신하고 싶다 → 이 프로젝트 유지

---

## 데이터 저장 위치

| 데이터 | 저장 위치 | 비용 |
|---|---|---|
| 노트, 프로필, 프로젝트 | GitHub Gist (비공개) | 무료 |
| WIKI 앱 | GitHub Pages | 무료 |
| API 키 | 브라우저 메모리 (저장 안 됨) | — |

---

## 검증

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/validate_repo.ps1
```

JSON·JavaScript 구문, 확장 참조 파일, Markdown/HTML 로컬 링크, UTF-8, 예제 비밀값과
Obsidian MCP 설정·문서의 일치 여부를 검사합니다.
