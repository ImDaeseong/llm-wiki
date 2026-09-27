# LLM Wiki Design

Updated: 2026-09-27

## Purpose

Give multiple AI interfaces the same user-maintained context through an explicit, portable personal wiki.

## Stakeholders, concerns, and scenarios

- User: reuse current context across providers without repeatedly disclosing private details.
- Maintainer: update one context source while preserving provider adapters.
- Privacy reviewer: verify public/private separation and token handling.
- Representative scenario: update public-safe context, validate it, sync through the selected adapter, and confirm the receiving AI saw only the intended fields.

## Boundaries

- Public career context is separated from private contact, employer, and customer information.
- Browser storage holds local tokens; tokens are not committed or embedded in generated content.
- Provider adapters normalize transport but do not guarantee equivalent model behavior.

## Main components

- `index.html`: public wiki interface.
- `wiki-extension/`: browser context injection.
- `claude-projects/` and `obsidian-mcp/`: provider-specific integration assets.
- `career-context.js` and `ai-provider.js`: public context and provider abstraction.

## Detailed structure and views

### Component and data-flow view

```text
career-context.js / user-edited public context
  -> index.html wiki presentation
  -> wiki-extension content script
  -> provider-specific page injection

selected notes
  -> extension background/local storage
  -> explicit later reuse
```

- `wiki-extension/` owns browser permissions, content scripts, injection controls, and local token/note storage.
- `claude-projects/` and `obsidian-mcp/` are provider-specific integration assets; `ai-provider.js` normalizes only the repository's supported provider interactions.
- `scripts/` and `tests/` validate manifest, public/private markers, links, and static entry points.

The browser is the deployment boundary. Context injection is user-triggered and provider-specific; local storage is not a secret vault, and public context must exclude employer, customer, contact, and credential data before it reaches the static site or another provider.

## Key decisions and tradeoffs

- Use a portable source of truth plus provider adapters instead of provider-specific copies.
- Keep tokens local and omit private fields from public context, accepting manual review when context boundaries change.

## Verification and human review

Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/validate_repo.ps1`. A human must review public/private boundaries, token handling, injected context, and provider-specific behavior.

## Evidence basis and limits

This document is informed by [IEEE 1016-2009](https://standards.ieee.org/ieee/1016/4502/), [Kruchten's multi-view and scenario model](https://www.cs.ubc.ca/~gregor/teaching/papers/4%2B1view-architecture.pdf), [Parnas (1972)](https://doi.org/10.1145/361598.361623), [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html), and [NIST SSDF 1.1](https://doi.org/10.6028/NIST.SP.800-218). It does not claim provider equivalence or formal conformance.

The choice of detailed views is also guided by [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html), whose public abstract specifies architecture descriptions, viewpoints, and model kinds, and the [SEI Views and Beyond approach](https://www.sei.cmu.edu/library/views-and-beyond-the-sei-approach-for-architecture-documentation/), which organizes documentation around views selected for stakeholder use. Only views supported by current repository evidence are included; omitted views are not implied.
