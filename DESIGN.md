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

## Key decisions and tradeoffs

- Use a portable source of truth plus provider adapters instead of provider-specific copies.
- Keep tokens local and omit private fields from public context, accepting manual review when context boundaries change.

## Verification and human review

Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/validate_repo.ps1`. A human must review public/private boundaries, token handling, injected context, and provider-specific behavior.

## Evidence basis and limits

This document is informed by [IEEE 1016-2009](https://standards.ieee.org/ieee/1016/4502/), [Kruchten's multi-view and scenario model](https://www.cs.ubc.ca/~gregor/teaching/papers/4%2B1view-architecture.pdf), [Parnas (1972)](https://doi.org/10.1145/361598.361623), [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html), and [NIST SSDF 1.1](https://doi.org/10.6028/NIST.SP.800-218). It does not claim provider equivalence or formal conformance.
