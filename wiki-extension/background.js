// background.js — Gist에서 WIKI 데이터를 읽어 storage에 캐시

const GIST_FILENAME = 'llm-wiki-data.json';

// 팝업에서 "새로고침" 요청 수신
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'FETCH_WIKI') {
    fetchWikiData().then(data => sendResponse({ ok: true, data }))
                   .catch(e  => sendResponse({ ok: false, error: e.message }));
    return true; // 비동기 응답
  }
  if (msg.type === 'GET_CONTEXT') {
    chrome.storage.local.get(['wikiData', 'wikiSettings'], result => {
      sendResponse({ data: result.wikiData, settings: result.wikiSettings });
    });
    return true;
  }
});

async function fetchWikiData() {
  const { wikiSettings } = await chrome.storage.local.get('wikiSettings');
  if (!wikiSettings?.gistToken || !wikiSettings?.gistId) {
    throw new Error('Gist 설정이 없습니다. 팝업에서 설정하세요.');
  }
  const res = await fetch(`https://api.github.com/gists/${wikiSettings.gistId}`, {
    headers: { 'Authorization': `token ${wikiSettings.gistToken}` }
  });
  if (!res.ok) throw new Error('Gist 접근 실패: HTTP ' + res.status);
  const json = await res.json();
  const content = json.files[GIST_FILENAME]?.content;
  if (!content) throw new Error('WIKI 데이터 파일 없음');
  const data = JSON.parse(content);
  await chrome.storage.local.set({ wikiData: data, wikiCachedAt: Date.now() });
  return data;
}

// 브라우저 시작 시 자동 캐시 갱신 (1시간 이상 지난 경우)
chrome.runtime.onStartup.addListener(async () => {
  const { wikiCachedAt } = await chrome.storage.local.get('wikiCachedAt');
  const ONE_HOUR = 60 * 60 * 1000;
  if (!wikiCachedAt || Date.now() - wikiCachedAt > ONE_HOUR) {
    fetchWikiData().catch(() => {});
  }
});
