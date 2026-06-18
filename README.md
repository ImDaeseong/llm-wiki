# 나의 LLM WIKI

> Claude, ChatGPT, Gemini 등 **어떤 AI 툴에서도** 나의 컨텍스트를 자동으로 주입하는 개인 세컨드 브레인

**WIKI 앱 바로가기 →** https://imdaeseong.github.io/llm-wiki/

---

## 무엇인가?

AI 툴을 쓸 때마다 "나는 VC++ 개발자입니다, Visual Studio를 씁니다..." 를 반복 입력하는 번거로움을 없앤 시스템입니다.

나의 개발 환경, 기술 스택, 코딩 스타일, 진행 프로젝트를 한 곳에 저장하고 어떤 AI든 자동으로 인식하게 만듭니다.

---

## 구성

| 폴더 / 파일 | 설명 |
|---|---|
| `index.html` | WIKI 웹 앱 (GitHub Pages로 서비스) |
| `wiki-extension/` | 크롬 확장 — AI 사이트 자동 컨텍스트 주입 |
| `claude-projects/` | Claude Projects용 컨텍스트 파일 |
| `obsidian-mcp/` | Obsidian MCP 설정 템플릿 |
| `docs/` | 상세 설치 및 사용 가이드 |

---

## 빠른 시작

### 1단계 — WIKI 앱 접속 및 설정
→ [01-설치가이드.md](docs/01-설치가이드.md)

### 2단계 — 크롬 확장 설치
→ [02-크롬확장-사용법.md](docs/02-크롬확장-사용법.md)

### 3단계 — Claude Projects 연동
→ [03-claude-projects-사용법.md](docs/03-claude-projects-사용법.md)

### 4단계 — Obsidian MCP 연동 (선택)
→ [04-obsidian-mcp-사용법.md](docs/04-obsidian-mcp-사용법.md)

### 집 ↔ 회사 데이터 동기화
→ [05-집회사-동기화.md](docs/05-집회사-동기화.md)

---

## 사용 방법 한눈에

```
AI 사이트 접속 (claude.ai / chatgpt.com / gemini.google.com)
  → 우하단 보라색 "WIKI 주입" 버튼 클릭
  → 내 컨텍스트 자동 삽입
  → 질문 입력 후 전송
```

---

## 데이터 저장 위치

| 데이터 | 저장 위치 | 비용 |
|---|---|---|
| 노트, 프로필, 프로젝트 | GitHub Gist (비공개) | 무료 |
| WIKI 앱 | GitHub Pages | 무료 |
| API 키 | 브라우저 메모리 (저장 안 됨) | — |
