// content_script.js
// claude.ai, chatgpt.com, gemini.google.com 에서 자동 실행
// 새 대화 시작 시 나의 WIKI 컨텍스트를 입력창에 주입

(function() {
  'use strict';

  const SITE = (() => {
    const h = location.hostname;
    if (h.includes('claude.ai'))   return 'claude';
    if (h.includes('chatgpt.com')) return 'chatgpt';
    if (h.includes('gemini'))      return 'gemini';
    return null;
  })();

  if (!SITE) return;

  // 각 사이트별 입력창 셀렉터
  const SELECTORS = {
    claude:   'div[contenteditable="true"][data-placeholder]',
    chatgpt:  '#prompt-textarea',
    gemini:   'div.ql-editor[contenteditable="true"]',
  };

  let injected = false;
  let wikiContext = '';

  // background에서 WIKI 데이터 가져오기
  chrome.runtime.sendMessage({ type: 'GET_CONTEXT' }, response => {
    if (response?.data) {
      wikiContext = buildContext(response.data, response.settings);
    }
  });

  // 입력창 감지 후 버튼 추가
  const observer = new MutationObserver(() => {
    const input = document.querySelector(SELECTORS[SITE]);
    if (input && !document.getElementById('wiki-inject-btn')) {
      addInjectButton(input);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function addInjectButton(input) {
    const btn = document.createElement('button');
    btn.id = 'wiki-inject-btn';
    btn.textContent = 'WIKI 주입';
    btn.title = '나의 LLM WIKI 컨텍스트를 입력창에 추가합니다';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      zIndex: '99999',
      padding: '8px 14px',
      fontSize: '13px',
      fontFamily: 'sans-serif',
      background: '#534AB7',
      color: '#fff',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      opacity: '0.9',
    });
    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '0.9');
    btn.addEventListener('click', () => injectContext(input));
    document.body.appendChild(btn);
  }

  function injectContext(input) {
    if (!wikiContext) {
      // 데이터 없으면 다시 요청
      chrome.runtime.sendMessage({ type: 'GET_CONTEXT' }, response => {
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
    if (SITE === 'claude' || SITE === 'gemini') {
      // contenteditable
      input.focus();
      const existing = input.innerText.trim();
      input.innerText = wikiContext + (existing ? '\n\n---\n\n' + existing : '\n\n---\n\n질문: ');
      // 커서를 끝으로
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (SITE === 'chatgpt') {
      // textarea
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, wikiContext + '\n\n---\n\n질문: ');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
    // 버튼 상태 변경
    const btn = document.getElementById('wiki-inject-btn');
    if (btn) {
      btn.textContent = '주입됨 ✓';
      btn.style.background = '#0F6E56';
      setTimeout(() => {
        btn.textContent = 'WIKI 주입';
        btn.style.background = '#534AB7';
      }, 3000);
    }
  }

  function buildContext(data, settings) {
    const p = data.profile || {};
    const stack = data.stack || [];
    const prefs = data.prefs || {};
    const projects = data.projects || [];
    const notes = data.notes || [];

    // 설정에서 포함 항목 결정 (기본값: 프로필 + 스택 + 공통지침)
    const inc = settings?.include || { profile: true, stack: true, prefs: true, projects: false, notes: false };

    let ctx = '[나의 LLM WIKI 컨텍스트]\n\n';
    if (inc.profile && p.name) {
      ctx += `## 나의 프로필\n- 역할: ${p.name}\n- 업무: ${p.role||''}\n- 경력: ${p.exp||''}\n- IDE: ${p.ide||''}\n- 언어: ${p.lang||''}\n`;
      if (p.style) ctx += `\n### 코딩 스타일\n${p.style}\n`;
      if (p.ans)   ctx += `\n### 답변 선호\n${p.ans}\n`;
      ctx += '\n';
    }
    if (inc.stack && stack.length) {
      ctx += `## 기술 스택\n${stack.map(s=>`- ${s.name}(${s.level}): ${s.desc}`).join('\n')}\n\n`;
    }
    if (inc.prefs && prefs.common) {
      ctx += `## AI 공통 지침\n${prefs.common}\n\n`;
    }
    if (inc.projects && projects.length) {
      ctx += `## 진행 중인 프로젝트\n${projects.filter(p=>p.status==='진행중').map(p=>`- ${p.name}[${p.stack}]: ${p.desc}`).join('\n')}\n\n`;
    }
    if (inc.notes && notes.length) {
      ctx += `## 최근 노트\n${notes.slice(-5).map(n=>`- [${n.cat}] ${n.title}`).join('\n')}\n\n`;
    }
    ctx += '---\n위 컨텍스트를 기반으로 답변해주세요.\n\n';
    return ctx;
  }

})();
