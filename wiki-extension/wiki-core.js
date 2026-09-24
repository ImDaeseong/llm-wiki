// Pure helpers shared by the extension service worker and its regression tests.
(function exposeWikiCore(root) {
  const NOTE_FILE_PREFIX = 'llm-wiki-note-';

  function createNote(title, body, url, now = new Date(), idFactory) {
    const id = idFactory ? idFactory() : `${now.getTime()}-${Math.random().toString(16).slice(2)}`;
    let hostname = 'unknown';
    try { hostname = new URL(url).hostname.replace(/^www\./, ''); } catch {}
    return {
      id,
      title: (title || '캡처').slice(0, 60),
      cat: '캡처',
      body,
      tags: [hostname],
      date: now.toISOString().slice(0, 10),
      source: url,
      trust: 'untrusted_external',
    };
  }

  function buildNotePatch(note) {
    return {
      files: {
        [`${NOTE_FILE_PREFIX}${note.id}.json`]: {
          content: JSON.stringify(note, null, 2),
        },
      },
    };
  }

  function mergeGistData(files, mainFilename) {
    const mainContent = files?.[mainFilename]?.content;
    if (!mainContent) throw new Error('WIKI 데이터 파일 없음');
    const data = JSON.parse(mainContent);
    const notesById = new Map((data.notes || []).map(note => [String(note.id), note]));
    Object.entries(files || {})
      .filter(([name]) => name.startsWith(NOTE_FILE_PREFIX))
      .forEach(([, file]) => {
        const note = JSON.parse(file.content);
        if (!note.id) throw new Error('캡처 노트 ID 없음');
        notesById.set(String(note.id), note);
      });
    return { ...data, notes: [...notesById.values()] };
  }

  function classifyFailure(error) {
    const message = String(error?.message || error);
    if (/HTTP 401|HTTP 403/.test(message)) return 'auth';
    if (/HTTP 429/.test(message)) return 'rate_limit';
    if (/HTTP 5\d\d/.test(message)) return 'provider';
    if (/JSON|데이터 파일|노트 ID/.test(message)) return 'data';
    if (/Failed to fetch|NetworkError|timeout/i.test(message)) return 'network';
    return 'unknown';
  }

  function selectContextNotes(notes, limit = 5) {
    return (notes || []).filter(note => note.trust !== 'untrusted_external').slice(-limit);
  }

  const api = {
    NOTE_FILE_PREFIX,
    createNote,
    buildNotePatch,
    mergeGistData,
    classifyFailure,
    selectContextNotes,
  };
  root.WikiCore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
