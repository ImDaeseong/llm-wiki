// background.js
importScripts('wiki-core.js');

const GIST_FILENAME = 'llm-wiki-data.json';

async function getWikiSettings() {
  const [{ wikiSettings = {} }, { wikiAuth = {} }] = await Promise.all([
    chrome.storage.local.get('wikiSettings'),
    chrome.storage.session.get('wikiAuth'),
  ]);
  if (!wikiAuth.gistToken && wikiSettings.gistToken) {
    await chrome.storage.session.set({ wikiAuth: { gistToken: wikiSettings.gistToken } });
    const { gistToken: _removed, ...safeSettings } = wikiSettings;
    await chrome.storage.local.set({ wikiSettings: safeSettings });
    return { ...safeSettings, gistToken: wikiSettings.gistToken };
  }
  return { ...wikiSettings, gistToken: wikiAuth.gistToken };
}

function logFailure(callSite, error) {
  console.error(`[${new Date().toISOString()}] ${callSite} ${WikiCore.classifyFailure(error)}`, error);
}

// 설치/업데이트 시 컨텍스트 메뉴 + 주기 알람 등록
chrome.runtime.onInstalled.addListener(() => {
  // 업데이트 시 기존 메뉴 제거 후 재생성 (중복 ID 오류 방지)
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'save-to-wiki',
      title: 'WIKI 노트로 저장',
      contexts: ['selection'],
    });
  });
  // 1시간마다 자동 캐시 갱신 (브라우저 재시작 없이도 최신 유지)
  chrome.alarms.create('refreshWiki', { periodInMinutes: 60 });
});

// 1시간 주기 자동 갱신
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'refreshWiki') {
    fetchWikiData().catch(error => logFailure('refreshWiki', error));
  }
});

// 우클릭 → WIKI 노트 저장
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'save-to-wiki' || !info.selectionText) return;
  appendNote(tab.title || '캡처', info.selectionText, info.pageUrl || tab.url)
    .then(() => {
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#0F6E56' });
      setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);
    })
    .catch(error => {
      logFailure('contextMenu.appendNote', error);
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#A32D2D' });
      setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);
    });
});

// 메시지 핸들러
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'FETCH_WIKI') {
    fetchWikiData()
      .then(data => sendResponse({ ok: true, data }))
      .catch(e   => sendResponse({ ok: false, error: e.message }));
    return true;
  }
  if (msg.type === 'GET_CONTEXT') {
    chrome.storage.local.get(['wikiData', 'wikiSettings'], result => {
      sendResponse({ data: result.wikiData, settings: result.wikiSettings });
    });
    return true;
  }
  if (msg.type === 'SAVE_NOTE') {
    appendNote(msg.title, msg.body, msg.url)
      .then(() => sendResponse({ ok: true }))
      .catch(e  => sendResponse({ ok: false, error: e.message }));
    return true;
  }
});

async function fetchWikiData() {
  const wikiSettings = await getWikiSettings();
  if (!wikiSettings?.gistToken || !wikiSettings?.gistId) {
    throw new Error('Gist 설정이 없습니다. 팝업에서 설정하세요.');
  }
  const res = await fetch(`https://api.github.com/gists/${wikiSettings.gistId}`, {
    headers: { Authorization: `token ${wikiSettings.gistToken}` },
  });
  if (!res.ok) throw new Error('Gist 접근 실패: HTTP ' + res.status);
  const json = await res.json();
  const data = WikiCore.mergeGistData(json.files, GIST_FILENAME);
  await chrome.storage.local.set({ wikiData: data, wikiCachedAt: Date.now() });
  return data;
}

async function appendNote(title, body, url) {
  const wikiSettings = await getWikiSettings();
  if (!wikiSettings?.gistToken || !wikiSettings?.gistId) {
    throw new Error('Gist 설정 없음 — 팝업에서 Token과 Gist ID를 먼저 입력하세요.');
  }
  const note = WikiCore.createNote(title, body, url, new Date(), () => crypto.randomUUID());

  const res = await fetch(`https://api.github.com/gists/${wikiSettings.gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${wikiSettings.gistToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(WikiCore.buildNotePatch(note)),
  });

  if (!res.ok) throw new Error('Gist 저장 실패: HTTP ' + res.status);
  await fetchWikiData();
}
