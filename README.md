# 나의 LLM WIKI

> Claude, ChatGPT, Gemini 등 어떤 AI 툴에서도 나의 컨텍스트를 자동으로 주입하는 세컨드 브레인

## 접속 주소
https://imdaeseong.github.io/llm-wiki/

## 구성 파일

```
llm-wiki/
├── index.html          ← WIKI 앱 (GitHub Pages)
├── README.md           ← 이 파일
└── wiki-extension/     ← 크롬 확장 프로그램
    ├── manifest.json
    ├── background.js
    ├── content_script.js
    └── popup.html
```

## 설치 순서

### 1. WIKI 앱 접속
https://imdaeseong.github.io/llm-wiki/ 접속

### 2. GitHub Token 발급 (Gist 동기화용)
- GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- gist 권한 체크 → 생성 → 토큰 복사 (ghp_xxxx...)

### 3. Anthropic API Key 발급
- https://console.anthropic.com → API Keys → Create

### 4. WIKI 앱 초기 설정
- 좌측 하단 GitHub Token 입력
- Anthropic API Key 입력
- 프로필, 기술스택, AI 선호도 입력 → 저장
- 저장 버튼 클릭 → Gist 자동 생성

### 5. 크롬 확장 설치
- chrome://extensions/ → 개발자 모드 ON
- "압축해제된 확장 프로그램 로드" → wiki-extension 폴더 선택
- 확장 아이콘 클릭 → Token + Gist ID 입력 → 동기화

### 6. Claude Projects 설정
- WIKI 앱 → 프롬프트 생성기 → 전체 복사 → my-wiki.md 저장
- claude.ai → Projects → New Project → 파일 업로드

### 7. Claude Desktop + Obsidian MCP (선택)
- https://claude.ai/download → Claude Desktop 설치
- npm install -g obsidian-mcp
- claude_desktop_config.json에 vault 경로 추가

## 사용 방법

| 상황 | 방법 |
|---|---|
| claude.ai 사용 시 | 크롬 확장 "WIKI 주입" 버튼 클릭 |
| ChatGPT 사용 시 | 크롬 확장 "WIKI 주입" 버튼 클릭 |
| Claude Projects | 자동으로 컨텍스트 포함 |
| Claude Desktop | Obsidian vault 직접 연동 |

## 데이터 저장 위치
- 노트, 프로필, 프로젝트 → GitHub Gist (무료, 암호화)
- API 키 → 브라우저 메모리 (새로고침 시 초기화, 저장 안 됨)
