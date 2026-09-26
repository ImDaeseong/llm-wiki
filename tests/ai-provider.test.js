const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildRequest, responseText, parseAssistantPayload } = require('../ai-provider.js');

test('Anthropic request uses only its required authorization header', () => {
  const request = buildRequest('anthropic', 'temporary-anthropic-key', 'system', 'question');
  assert.equal(request.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(request.options.headers['x-api-key'], 'temporary-anthropic-key');
  assert.equal(request.options.headers.Authorization, undefined);
});

test('OpenAI request uses the Responses API and bearer authorization', () => {
  const request = buildRequest('openai', 'temporary-openai-key', 'system', 'question');
  const body = JSON.parse(request.options.body);
  assert.equal(request.url, 'https://api.openai.com/v1/responses');
  assert.equal(request.options.headers.Authorization, 'Bearer temporary-openai-key');
  assert.equal(body.model, 'gpt-5');
  assert.equal(body.instructions, 'system');
  assert.equal(body.input, 'question');
  assert.equal(body.store, false);
  assert.equal(body.text.format.type, 'json_schema');
  assert.equal(body.text.format.strict, true);
});

test('assistant payload parser accepts JSON and fenced JSON', () => {
  const sent = { answer: '정상 답변', keyPoints: ['핵심'], obsidian: '# 메모' };
  const expected = { ...sent, truncated: false };
  assert.deepEqual(parseAssistantPayload(JSON.stringify(sent)), expected);
  assert.deepEqual(parseAssistantPayload(`\`\`\`json\n${JSON.stringify(sent)}\n\`\`\``), expected);
});

test('truncated JSON displays the partial answer without exposing the JSON wrapper', () => {
  const parsed = parseAssistantPayload('{"answer":"첫째 줄\\n둘째 줄의 일부');
  assert.equal(parsed.answer, '첫째 줄\n둘째 줄의 일부');
  assert.doesNotMatch(parsed.answer, /\{"answer"/);
  assert.deepEqual(parsed.keyPoints, []);
  // 2026-09-26 독립 리뷰 발견: 이 복구 경로는 완전한 성공 응답과 똑같은 모양을
  // 반환해서, 호출자가 잘림 여부를 구분할 방법이 전혀 없었다.
  assert.equal(parsed.truncated, true, 'recovery path must flag the response as possibly incomplete');
});

test('a fully-parsed JSON response is never flagged as truncated', () => {
  const parsed = parseAssistantPayload(JSON.stringify({ answer: '완전한 답변', keyPoints: [], obsidian: '' }));
  assert.equal(parsed.truncated, false);
});

test('provider response text is normalized', () => {
  assert.equal(responseText('anthropic', { content: [{ text: 'Claude answer' }] }), 'Claude answer');
  assert.equal(responseText('openai', {
    output: [{ content: [{ type: 'output_text', text: 'OpenAI answer' }] }],
  }), 'OpenAI answer');
});

test('API keys stay out of persistent browser storage and are cleared on pagehide', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.match(html, /addEventListener\('pagehide', clearEphemeralKeys\)/);
  assert.match(html, /id="openai-key"[^>]*autocomplete="off"/);
  assert.doesNotMatch(html, /LS\.set\([^\n]*(claude-key|openai-key)|localStorage\.setItem\([^\n]*(claude|openai).*key/i);
});

test('the selected provider key is cleared after both successful and failed requests', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const ask = html.match(/async function askAI\(\) \{[\s\S]*?\n\}/)?.[0] || '';
  assert.match(ask, /finally\s*\{[\s\S]*clearProviderKey\(provider\)/);
});
