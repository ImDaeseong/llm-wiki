// Builds provider-specific requests without persisting or logging API keys.
(function exposeAiProvider(root) {
  const PROVIDERS = {
    anthropic: {
      label: 'Anthropic',
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-sonnet-4-6',
    },
    openai: {
      label: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/responses',
      model: 'gpt-5',
    },
  };

  function buildRequest(provider, key, system, input) {
    if (!PROVIDERS[provider]) throw new Error('지원하지 않는 AI 제공자입니다.');
    if (!key) throw new Error(`${PROVIDERS[provider].label} API 키를 입력하세요.`);
    if (provider === 'anthropic') {
      return {
        url: PROVIDERS.anthropic.endpoint,
        options: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: PROVIDERS.anthropic.model,
            max_tokens: 2500,
            system,
            messages: [{ role: 'user', content: input }],
          }),
        },
      };
    }
    return {
      url: PROVIDERS.openai.endpoint,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: PROVIDERS.openai.model,
          max_output_tokens: 4000,
          store: false,
          instructions: system,
          input,
          text: {
            format: {
              type: 'json_schema',
              name: 'wiki_answer',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  answer: { type: 'string' },
                  keyPoints: { type: 'array', items: { type: 'string' } },
                  obsidian: { type: 'string' },
                },
                required: ['answer', 'keyPoints', 'obsidian'],
                additionalProperties: false,
              },
            },
          },
        }),
      },
    };
  }

  function responseText(provider, data) {
    if (provider === 'anthropic') return data?.content?.[0]?.text || '';
    return (data?.output || [])
      .flatMap(item => item?.content || [])
      .filter(item => item?.type === 'output_text')
      .map(item => item.text || '')
      .join('\n');
  }

  function extractJsonString(text, property) {
    const match = new RegExp(`"${property}"\\s*:\\s*"`).exec(text);
    if (!match) return '';
    let result = '';
    for (let index = match.index + match[0].length; index < text.length; index += 1) {
      const char = text[index];
      if (char === '"') break;
      if (char !== '\\') {
        result += char;
        continue;
      }
      const escaped = text[index + 1];
      if (escaped === undefined) break;
      const replacements = { n: '\n', r: '\r', t: '\t', '"': '"', '\\': '\\', '/': '/' };
      if (escaped === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(index + 2, index + 6))) {
        result += String.fromCharCode(parseInt(text.slice(index + 2, index + 6), 16));
        index += 5;
      } else {
        result += replacements[escaped] ?? escaped;
        index += 1;
      }
    }
    return result;
  }

  function parseAssistantPayload(text) {
    const cleaned = String(text || '').replace(/```json|```/gi, '').trim();
    const candidates = [cleaned];
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) candidates.push(cleaned.slice(firstBrace, lastBrace + 1));
    for (const candidate of candidates) {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed.answer === 'string') {
          return {
            answer: parsed.answer,
            keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
            obsidian: typeof parsed.obsidian === 'string' ? parsed.obsidian : '',
            truncated: false,
          };
        }
      } catch { /* Try the next safe fallback. */ }
    }
    // Neither the full response nor its brace-trimmed substring parsed as
    // JSON -- this is the character-scan recovery path, reached when the
    // response was cut off (e.g. hit max_tokens) or otherwise malformed.
    // `truncated: true` lets the caller tell the user their answer may be
    // incomplete, instead of silently rendering a partial answer with no
    // key points/Obsidian note as if it were a complete, successful reply
    // (2026-09-26 independent review).
    const partialAnswer = extractJsonString(cleaned, 'answer');
    return { answer: partialAnswer || cleaned, keyPoints: [], obsidian: '', truncated: true };
  }

  const api = { PROVIDERS, buildRequest, responseText, parseAssistantPayload };
  root.AiProvider = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
