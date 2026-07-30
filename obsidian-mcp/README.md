# Obsidian MCP 설정

## 사용 방법

1. `claude_desktop_config.json` 파일을 아래 경로에 복사합니다:
   ```
   C:\Users\사용자명\AppData\Roaming\Claude\claude_desktop_config.json
   ```

2. 파일 안의 `사용자명`과 `MyVault` 부분을 본인 경로로 수정합니다:
   ```json
   {
     "mcpServers": {
       "obsidian": {
         "command": "cmd",
         "args": [
           "/c",
           "npx",
           "-y",
           "@modelcontextprotocol/server-filesystem",
           "C:\\Users\\실제사용자명\\Documents\\실제Vault명"
         ]
       }
     }
   }
   ```

3. Claude Desktop 재시작

상세 내용: [docs/04-obsidian-mcp-사용법.md](../docs/04-obsidian-mcp-사용법.md)

## LLM Wiki 에이전트로 확장 (선택)

[LLM_WIKI_AGENT.md](LLM_WIKI_AGENT.md)를 Vault 루트에 복사하면 카파시(Andrej Karpathy)
방식의 ingest/query/lint 패턴으로 Vault를 자가 관리형 위키로 운영할 수 있습니다. 배경:
[docs/06-카파시-llm-wiki-graphify.md](../docs/06-카파시-llm-wiki-graphify.md)
