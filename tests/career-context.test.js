const test = require('node:test');
const assert = require('node:assert/strict');
const { CAREER_CONTEXT, mergeCareerContext } = require('../career-context.js');
const fs = require('node:fs');
const path = require('node:path');

test('career context covers public profile, education, credential, skills, and projects', () => {
  assert.match(CAREER_CONTEXT.profile.exp, /25년 경력/);
  assert.match(CAREER_CONTEXT.profile.education, /컴퓨터네트워크전공/);
  assert.equal(CAREER_CONTEXT.profile.cert, '정보처리기사');
  const android = CAREER_CONTEXT.stack.find(item => item.name === 'Java / Kotlin / Android');
  assert.equal(android.level, '상용 개발·운영');
  assert.match(android.desc, /상용 앱 3개 개발·운영/);
  assert.ok(CAREER_CONTEXT.stack.filter(item => item !== android).every(item => item.level === '경력 확인'));
  assert.ok(CAREER_CONTEXT.stack.some(item => item.name.includes('IOCP')));
  assert.ok(CAREER_CONTEXT.projects.some(item => item.name === '인도네시아 서비스 구축'));
  assert.match(CAREER_CONTEXT.profile.current, /AI 바이브 코딩/);
  const recentProjects = CAREER_CONTEXT.projects.filter(item => item.status === '최근 개발');
  assert.deepEqual(recentProjects.map(item => item.name), [
    'ai-workspace', 'ai_agent', 'ai_history_dashboard', 'ai_prompt',
    'ai_test', 'ai_test1', 'ai_test2', 'career', 'hermes-agents',
    'llm-wiki', 'qa_manager', 'skills',
  ]);
});

test('career context excludes unnecessary contact details', () => {
  const serialized = JSON.stringify(CAREER_CONTEXT);
  assert.doesNotMatch(serialized, /@|mailto:|cs93059/);
});

test('extension includes approved career fields but no contact fields', () => {
  const contentScript = fs.readFileSync(path.join(__dirname, '../wiki-extension/content_script.js'), 'utf8');
  assert.match(contentScript, /p\.education/);
  assert.match(contentScript, /p\.cert/);
  assert.match(contentScript, /p\.highlights/);
  assert.match(contentScript, /p\.current/);
  assert.match(contentScript, /'최근 개발'/);
  assert.doesNotMatch(contentScript, /p\.email|p\.phone|p\.contact/);
});

test('migration fills blanks while preserving user-authored values', () => {
  const merged = mergeCareerContext({
    profile: { name: '사용자 지정 이름', education: '' },
    prefs: { common: '사용자 지침' },
    stack: [{ name: '사용자 기술', level: '고급', desc: '보존' }],
    projects: [{ name: '사용자 프로젝트', status: '진행중', stack: '', desc: '보존' }],
  });
  assert.equal(merged.profile.name, '사용자 지정 이름');
  assert.match(merged.profile.education, /인제대학교/);
  assert.equal(merged.prefs.common, '사용자 지침');
  assert.ok(merged.stack.some(item => item.name === '사용자 기술'));
  assert.ok(merged.projects.some(item => item.name === '사용자 프로젝트'));
});

test('migration replaces only the original sample stack', () => {
  const merged = mergeCareerContext({
    stack: [
      { name: 'C++ / MFC', level: '전문가', desc: 'old sample' },
      { name: 'Visual Studio', level: '전문가', desc: 'old sample' },
    ],
    projects: [],
  });
  assert.equal(merged.stack.filter(item => item.name === 'C++ / MFC').length, 1);
  assert.equal(merged.stack.some(item => item.name === 'Visual Studio'), false);
  assert.ok(merged.stack.some(item => item.name.includes('IOCP')));
});

test('migration replaces the stale Android beginner classification', () => {
  const merged = mergeCareerContext({
    profile: { highlights: `첫 항목\nAndroid O2O 서비스 4종과 주문·결제 연동 개발\n마지막 항목` },
    stack: [{ name: 'Java / Kotlin / Android', level: '경력 확인', desc: 'O2O·매장관리·주문 및 결제 앱 개발' }],
    projects: [{
      name: 'Android O2O 서비스',
      stack: 'old',
      status: '완료',
      desc: '피카플레이·쌤카페·피카오더·피카매장관리 Pro와 주문·결제 연동 개발',
    }],
  });
  const android = merged.stack.find(item => item.name === 'Java / Kotlin / Android');
  assert.equal(android.level, '상용 개발·운영');
  assert.match(android.desc, /상용 앱 3개/);
  assert.doesNotMatch(merged.profile.highlights, /4종/);
  assert.match(merged.profile.highlights, /상용 앱 3개 개발·운영/);
  assert.match(merged.projects.find(item => item.name === 'Android O2O 서비스').desc, /상용 앱 3개/);
});

test('managed seed levels are refreshed without replacing custom descriptions', () => {
  const merged = mergeCareerContext({
    stack: [
      { name: 'C#', level: '고급', desc: '닷넷 기반 공통 컴포넌트·표준 UI·플랫폼 모듈 개발' },
      { name: 'Python / Go', level: '전문가', desc: '사용자가 직접 작성한 설명' },
    ],
    projects: [],
  });
  assert.equal(merged.stack.find(item => item.name === 'C#').level, '경력 확인');
  assert.equal(merged.stack.find(item => item.name === 'Python / Go').level, '전문가');
});

test('migration replaces the generic AI activity seed with the verified repository portfolio', () => {
  const merged = mergeCareerContext({
    projects: [{
      name: '개인 프로젝트·AI 활용 개발 연구',
      stack: 'Python, Go, AI 도구',
      status: '진행중',
      desc: '개인 프로젝트 개발과 AI를 활용한 개발 방법 연구',
    }],
  });
  assert.equal(merged.projects.some(item => item.name === '개인 프로젝트·AI 활용 개발 연구'), false);
  assert.equal(merged.projects.filter(item => item.status === '최근 개발').length, 12);
});

test('migration preserves a user-edited project that only reuses the legacy name', () => {
  const merged = mergeCareerContext({
    projects: [{
      name: '개인 프로젝트·AI 활용 개발 연구',
      stack: '사용자 스택',
      status: '진행중',
      desc: '사용자가 직접 작성한 설명',
    }],
  });
  assert.ok(merged.projects.some(item => item.desc === '사용자가 직접 작성한 설명'));
});
