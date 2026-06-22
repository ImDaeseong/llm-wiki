# 04. Obsidian MCP 연동 (선택)

Obsidian MCP(Model Context Protocol)를 사용하면 Claude Desktop이 로컬 Obsidian Vault를 직접 읽어 대화 중에 노트 내용을 참조할 수 있습니다.

> **필수 요건**: Claude Desktop 앱 (claude.ai 웹이 아닌 데스크탑 앱)

---

## MCP란?

MCP는 Claude가 외부 도구(파일시스템, DB, API 등)에 접근할 수 있게 해주는 프로토콜입니다. Obsidian Vault의 마크다운 파일들을 Claude가 직접 읽을 수 있어, 별도로 내용을 복사해서 붙여넣지 않아도 됩니다.

---

## 설치

### 1단계 — Obsidian MCP 서버 설치

Node.js가 설치된 환경에서 실행합니다.

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

또는 직접 파일시스템 MCP를 사용합니다 (Obsidian Vault 폴더를 허용 경로로 지정).

### 2단계 — Claude Desktop 설정

Claude Desktop 설정 파일을 엽니다.

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

`obsidian-mcp/claude_desktop_config.json` 의 내용을 참고해 아래와 같이 수정합니다:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/사용자명/Documents/ObsidianVault"
      ]
    }
  }
}
```

`C:/Users/사용자명/Documents/ObsidianVault` 부분을 실제 Vault 경로로 변경합니다.

### 3단계 — Claude Desktop 재시작

설정 저장 후 Claude Desktop을 완전히 종료하고 다시 실행합니다.

---

## 사용 방법

Claude Desktop을 열면 도구 아이콘(망치 모양)에 Obsidian 도구가 표시됩니다.

### 대화 예시

```
사용자: 내 Obsidian에서 "MFC 소켓" 관련 노트를 찾아서 요약해줘

Claude: (Vault에서 파일 검색 후) "MFC 소켓.md" 파일을 찾았습니다.
        내용 요약: ...
```

```
사용자: 지난번에 정리한 SQLite 연동 방법 다시 알려줘

Claude: (Vault 검색) "SQLite-MFC-연동.md" 에서 ...
```

---

## LLM WIKI와 함께 사용하기

Obsidian MCP + 크롬 확장을 함께 사용하는 권장 워크플로우:

1. **개발 중 발견한 내용** → 크롬 확장 **선택 저장** → WIKI 노트로 저장
2. **중요한 노트** → WIKI 앱에서 Obsidian 마크다운 형식으로 복사
3. **Obsidian Vault에 붙여넣기** → Claude Desktop에서 Vault 검색 가능

AI에게 묻기 페이지의 **Obsidian 저장** 버튼을 누르면 Claude의 답변을 Obsidian 마크다운 형식으로 변환해 복사할 수 있습니다.

---

## 주의 사항

- MCP는 **Claude Desktop 전용** — claude.ai 웹이나 크롬 확장에서는 사용 불가
- Vault 전체 경로를 허용하면 Claude가 모든 노트에 접근 가능 — 민감한 정보가 있는 폴더는 별도 Vault로 분리 권장
- MCP 서버가 실행 중이어야 Claude Desktop에서 Vault를 읽을 수 있음

---

## 문제 해결

| 증상 | 해결 방법 |
|------|-----------|
| 도구가 보이지 않음 | Claude Desktop 완전 재시작 |
| "서버에 연결할 수 없음" | npx 경로 및 Vault 경로 확인 |
| Node.js 없음 오류 | nodejs.org 에서 Node.js LTS 설치 |
