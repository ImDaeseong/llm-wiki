// content_script.js
// claude.ai, chatgpt.com, gemini.google.com, perplexity.ai 에서 자동 실행

(function () {
  'use strict';

  const SITE = (() => {
    const h = location.hostname;
    if (h.includes('claude.ai'))         return 'claude';
    if (h.includes('chatgpt.com'))       return 'chatgpt';
    if (h.includes('gemini.google'))     return 'gemini';
    if (h.includes('perplexity.ai'))     return 'perplexity';
    return null;
  })();

  if (!SITE) return;

  const SELECTORS = {
    claude:      'div[contenteditable="true"][data-placeholder]',
    chatgpt:     '#prompt-textarea',
    gemini:      'div.ql-editor[contenteditable="true"]',
    perplexity:  'textarea[placeholder]',
  };

  let btnAdded = false;
  let wikiContext = '';

  // background에서 WIKI 데이터 로드
  chrome.runtime.sendMessage({ type: 'GET_CONTEXT' }, response => {
    if (chrome.runtime.lastError) {
      console.warn('[WIKI]', chrome.runtime.lastError.message);
      return;
    }
    if (response?.data) {
      wikiContext = buildContext(response.data, response.settings);
    }
  });

  // 입력창 감지 후 버튼 추가
  // SPA 이동 후 버튼이 DOM에서 사라지면 btnAdded를 리셋해 재삽입한다
  const observer = new MutationObserver(() => {
    if (btnAdded && !document.getElementById('wiki-inject-btn')) {
      btnAdded = false;
    }
    if (btnAdded) return;
    if (document.querySelector(SELECTORS[SITE])) {
      addButtons();
      btnAdded = true;
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function addButtons() {
    const injectBtn = makeButton('wiki-inject-btn', 'WIKI 주입', '#534AB7', '80px');
    // 클릭 시 현재 input을 동적으로 조회 (SPA 이동 후 구식 참조 방지)
    injectBtn.addEventListener('click', () => {
      const input = document.querySelector(SELECTORS[SITE]);
      if (input) injectContext(input);
      else alert('입력창을 찾을 수 없습니다. 페이지를 새로고침하세요.');
    });
    document.body.appendChild(injectBtn);

    const saveBtn = makeButton('wiki-save-btn', '선택 저장', '#0F6E56', '130px');
    saveBtn.addEventListener('click', () => saveSelection());
    document.body.appendChild(saveBtn);
  }

  function makeButton(id, text, color, bottom) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.textContent = text;
    btn.title = text;
    Object.assign(btn.style, {
      position:     'fixed',
      bottom:       bottom,
      right:        '20px',
      zIndex:       '99999',
      padding:      '8px 14px',
      fontSize:     '13px',
      fontFamily:   'sans-serif',
      background:   color,
      color:        '#fff',
      border:       'none',
      borderRadius: '20px',
      cursor:       'pointer',
      boxShadow:    '0 2px 8px rgba(0,0,0,0.2)',
      opacity:      '0.9',
    });
    btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
    btn.addEventListener('mouseleave', () => (btn.style.opacity = '0.9'));
    return btn;
  }

  function injectContext(input) {
    if (!wikiContext) {
      chrome.runtime.sendMessage({ type: 'GET_CONTEXT' }, response => {
        if (chrome.runtime.lastError) return;
        if (response?.data) {
          wikiContext = buildContext(response.data, response.settings);
          doInject(input);
        } else {
          alert('WIKI 데이터가 없습니다.\n확장 팝업에서 Gist 설정 후 새로고침하세요.');
        }
      });
    } else {
      doInject(input);
    }
  }

  function doInject(input) {
    if (input.contentEditable === 'true') {
      // ProseMirror(Claude) / Quill(Gemini) — execCommand 방식으로 React state 갱신
      input.focus();
      // execCommand는 deprecated이지만 ProseMirror/Quill이 이 이벤트를 가로채
      // 프레임워크 내부 state를 갱신하므로 대체재가 없다. InputEvent 방식은 미지원.
      // eslint-disable-next-line no-document-execcommand
      // @ts-ignore
      document.execCommand('selectAll', false, null);
      const existing = window.getSelection().toString().trim();
      const text = wikiContext + (existing ? '\n\n---\n\n' + existing : '\n\n---\n\n질문: ');
      // @ts-ignore
      document.execCommand('insertText', false, text);
    } else {
      // textarea 계열 (ChatGPT, Perplexity)
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(input, wikiContext + '\n\n---\n\n질문: ');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
    flashButton('wiki-inject-btn', '주입됨 ✓', '#0F6E56', 'WIKI 주입', '#534AB7');
  }

  function saveSelection() {
    const text = window.getSelection().toString().trim();
    if (!text) {
      alert('저장할 텍스트를 드래그로 선택하세요.');
      return;
    }
    chrome.runtime.sendMessage(
      { type: 'SAVE_NOTE', title: document.title, body: text, url: location.href },
      response => {
        if (chrome.runtime.lastError) {
          alert('저장 실패: ' + chrome.runtime.lastError.message);
          return;
        }
        if (response?.ok) {
          flashButton('wiki-save-btn', '저장됨 ✓', '#0F6E56', '선택 저장', '#0F6E56');
        } else {
          alert('저장 실패: ' + (response?.error || '알 수 없는 오류'));
        }
      }
    );
  }

  function flashButton(id, successText, successColor, originalText, originalColor) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.textContent = successText;
    btn.style.background = successColor;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = originalColor;
    }, 3000);
  }

  function buildContext(data, settings) {
    const p        = data.profile   || {};
    const stack    = data.stack     || [];
    const prefs    = data.prefs     || {};
    const projects = data.projects  || [];
    const notes    = data.notes     || [];

    const inc = settings?.include || { profile: true, stack: true, prefs: true, projects: false, notes: false };

    let ctx = '[나의 LLM WIKI 컨텍스트]\n\n';

    if (inc.profile && p.name) {
      ctx += `## 나의 프로필\n- 역할: ${p.name}\n- 업무: ${p.role || ''}\n- 경력: ${p.exp || ''}\n- IDE: ${p.ide || ''}\n- 언어: ${p.lang || ''}\n`;
      if (p.style) ctx += `\n### 코딩 스타일\n${p.style}\n`;
      if (p.ans)   ctx += `\n### 답변 선호\n${p.ans}\n`;
      ctx += '\n';
    }
    if (inc.stack && stack.length) {
      ctx += `## 기술 스택\n${stack.map(s => `- ${s.name}(${s.level}): ${s.desc}`).join('\n')}\n\n`;
    }
    if (inc.prefs && prefs.common) {
      ctx += `## AI 공통 지침\n${prefs.common}\n\n`;
    }
    if (inc.projects && projects.length) {
      const active = projects.filter(pr => pr.status === '진행중');
      if (active.length) ctx += `## 진행 중인 프로젝트\n${active.map(pr => `- ${pr.name}[${pr.stack}]: ${pr.desc}`).join('\n')}\n\n`;
    }
    if (inc.notes && notes.length) {
      ctx += `## 최근 노트\n${notes.slice(-5).map(n => `- [${n.cat}] ${n.title}`).join('\n')}\n\n`;
    }
    ctx += '---\n위 컨텍스트를 기반으로 답변해주세요.\n\n';
    return ctx;
  }

})();
