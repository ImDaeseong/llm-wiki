# 06. 카파시 LLM Wiki + Graphify (선택, 로컬 파일 접근 AI 전용)

이 문서는 안드레 카파시(Andrej Karpathy, 前 Tesla AI 디렉터)가 공개한 "LLM Wiki" 개념과
Graphify라는 코드베이스 지식그래프 도구를 실제로 검증한 뒤, 이 프로젝트에 어떻게 접목되고
어떻게 접목되지 않는지를 정리한 문서입니다.

> **필수 요건**: [04-obsidian-mcp-사용법.md](04-obsidian-mcp-사용법.md)와 동일 — Claude Desktop
> 또는 Claude Code처럼 로컬 파일을 직접 읽고 쓸 수 있는 AI 환경. 브라우저 확장(`wiki-extension/`)
> 만으로는 이 방식을 쓸 수 없습니다(브라우저는 로컬 폴더에 파일을 스스로 쓸 수 없기 때문).

---

## 이 프로젝트의 기존 방식과 무엇이 다른가

| | 이 프로젝트 (Gist + 확장) | 카파시 LLM Wiki | Graphify |
|---|---|---|---|
| 저장 방식 | GitHub Gist 1개 파일 | 로컬 폴더의 마크다운 여러 장 | 코드/문서를 분석한 그래프 파일 |
| 갱신 주체 | 사람이 WIKI 앱에서 직접 편집 | AI 에이전트가 스스로 ingest/compile | AST 파서가 자동 스캔 |
| 목적 | 여러 AI 사이트에 "내 프로필" 주입 | 관심 주제 지식이 세션마다 누적 | 코드베이스 구조를 토큰 적게 질의 |
| 적용 대상 | 어떤 AI 챗 사이트든 | 로컬 파일 접근 가능한 에이전트만 | 코드/문서/스키마가 있는 리포지토리 |

즉 이 프로젝트가 풀던 문제(여러 AI 사이트에 프로필을 반복 입력하지 않기)와, 카파시가 풀던
문제(같은 주제를 여러 세션에 걸쳐 조사할 때 매번 처음부터 다시 읽지 않기)는 서로 다른 문제입니다.
둘 다 "AI가 매번 처음부터 시작한다"는 증상을 다루지만 원인과 해법이 다릅니다.

---

## 카파시 LLM Wiki — 실제로 확인된 내용

카파시가 직접 공개한 개념이며, 원문 Gist를 WebFetch로 직접 열어 실존·내용을 확인했습니다.
구조는 세 계층입니다: **raw**(원문 소스 — 수정하지 않음), **wiki**(LLM이 생성·관리하는
마크다운 디렉터리, 개념끼리 `[[위키링크]]`로 연결), **schema**(위키가 어떻게 구조화돼 있는지
LLM에게 알려주는 문서 — 카파시 원문의 표현으로는 "Obsidian is the IDE; the LLM is the
programmer; the wiki is the codebase"). 핵심 동작은 세 가지뿐입니다: **ingest**(새 소스
반영), **query**(질문), **lint**(모순·고아 페이지·오래된 주장 점검). 좋은 답변은 다시 위키
페이지로 저장되어 영구 지식이 됩니다.
(Andrej Karpathy, Gist, `gist.github.com/karpathy/442a6bf555914893e9891c11519de94f`,
2026-04-04 작성, 2026-07-31 WebFetch로 원문 직접 확인)

이 프로젝트에는 이미 `obsidian-mcp/`가 있어 Claude Desktop이 로컬 Vault 폴더를 직접 읽고 쓸 수
있습니다 — 즉 카파시 방식을 얹을 substrate가 이미 갖춰져 있습니다. 새 MCP 서버를 추가로 설치할
필요 없이, Vault 안에 아래 지침 파일 하나만 넣으면 됩니다.

### 적용 방법

1. [obsidian-mcp/LLM_WIKI_AGENT.md](../obsidian-mcp/LLM_WIKI_AGENT.md)를 본인 Obsidian Vault
   루트에 복사합니다 — 이 파일 자체가 schema(위키 구조 정의) 역할을 합니다.
2. Vault 안에 `raw/`(소스 원문 보관)와 `wiki/`(AI가 정리한 위키 페이지) 폴더를 만듭니다.
3. Claude Desktop에서 대화 시작 시 "`LLM_WIKI_AGENT.md` 지침대로 위키를 관리해줘"라고 한 번
   알려주면, 이후 대화에서 ingest/query/lint 패턴을 따릅니다.

기존 04번 문서의 "LLM WIKI와 함께 사용하기" 워크플로우(크롬 확장 선택 저장 → Obsidian 붙여넣기)와
병행 가능합니다 — 확장은 웹에서 발견한 내용을 `raw/`로 넣는 입구, 카파시 방식은 그 이후 Vault
안에서 지식을 정리하는 방식으로 역할이 나뉩니다.

---

## Graphify — 실제로 검증된 내용과 이 프로젝트에 적용하지 않는 이유

Graphify는 코드베이스(+문서/SQL 스키마/설정/PDF)를 질의 가능한 지식그래프로 만드는
Claude Code/Cursor/Codex/Gemini CLI용 스킬입니다. 현재 코드 처리는 36개 tree-sitter grammar
(약 40개 언어)를 사용해 로컬에서 결정적으로 수행하지만, 문서·PDF·이미지·영상의 semantic
pass는 AI 에이전트의 모델이나 별도 API를 사용합니다. 벡터 스토어가 아니라 그래프를 만들며,
52개 혼합 파일 예제에서는 원문 전체를 다시 읽는 방식보다 쿼리당 토큰이 71.5배 적었다고
프로젝트의 재현 자료가 보고합니다.
(저장소 `github.com/Graphify-Labs/graphify`, Apache-2.0/MIT 이중 라이선스 —
`LICENSE`와 `LICENSE-MIT` 파일 확인, 2026-07-31. 별점 수치는 문서에 고정 기록하지 않음)

**이 프로젝트에는 지금 적용하지 않습니다.** Graphify는 이 저장소의 JavaScript와 Markdown
링크도 분석할 수 있지만, 현재 규모는 작고 기본 구문·링크 검증만으로 전체를 빠르게 확인할 수
있습니다. 별도 CLI와 생성 그래프를 유지하는 비용이 지금 얻을 구조적 이점보다 큽니다. 파일 수와
연결 관계가 커져 전체 탐색 비용이 실제 문제가 되거나, 코드가 많은 다른 저장소에서 토큰 절감이
필요해지면 그때 별도 도입을 검토합니다 — 지금은 설치하지 않음.

---

## 정리

- 브라우저 확장만 쓴다면 이 문서는 해당 없음 — 기존 01~03번 문서로 충분
- Claude Desktop + Obsidian MCP를 쓴다면 → [obsidian-mcp/LLM_WIKI_AGENT.md](../obsidian-mcp/LLM_WIKI_AGENT.md) 적용
- 코드베이스 토큰 절감이 필요해지면 → Graphify는 별도 코드 프로젝트에서, 이 프로젝트에는 적용 안 함
