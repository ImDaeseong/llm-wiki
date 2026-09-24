// Public career facts synchronized from the career repository; no contact details included.
(function exposeCareerContext(root) {
  const CAREER_CONTEXT_VERSION = 5;
  const CAREER_CONTEXT = {
    profile: {
      name: '임대성 / 소프트웨어 엔지니어',
      role: '데스크톱·서버·모바일 전 영역의 상용 서비스 개발·운영',
      exp: '25년 경력. 미디어웹 19년(2007~2026), 초기 경력 6년(2001~2007)',
      company: '미디어웹(2007~2026), 이오소프트, 온세통신, 뉴소프트기술, 노머니커뮤니케이션',
      ide: 'Visual Studio 6.0 / 2008 / 2019 / 2022, VS Code, Android Studio',
      lang: 'C++, C#, Java, Kotlin, Python, Go, VB, ASP, JSP, JavaScript',
      os: 'Windows 데스크톱·서버, Android',
      vcs: 'Git, GitHub',
      tools: 'MFC, ATL, COM, OCX, Win32 API, InstallShield, DevExpress, TChart, Xtreme Toolkit',
      education: '인제대학교 정보컴퓨터학부 컴퓨터네트워크전공 (1993.03~2001.02)',
      cert: '정보처리기사',
      current: '최근에는 AI 바이브 코딩을 중심으로 개인 AI 운영·에이전트·작업 이력·프롬프트·창작 자동화·경력·검수·지식관리·공개 스킬 프로젝트를 개발하고 있다.',
      highlights: [
        'PC방 관리 플랫폼 3종과 IOCP 기반 인증 서버 개발·운영',
        'Android 상용 앱 3개 개발·운영과 주문·결제 연동',
        '인도네시아 현지 서비스 구축·기술 지원·직원 교육 및 관리(2012~2014)',
        '기업용 플랫폼, 통신·보안 서비스, 설치·패치 프로그램 개발',
      ].join('\n'),
      ans: '경력 관련 답변은 공개 이력의 사실만 사용하고, 확인되지 않은 성과·수치·역할은 만들지 않는다.',
    },
    stack: [
      { name: 'C++ / MFC', level: '경력 확인', desc: 'Windows 상용 클라이언트와 플랫폼 개발의 주력 기술' },
      { name: 'ATL / COM / OCX / Win32 API', level: '경력 확인', desc: '업무용 컴포넌트·보안 모듈·라이브러리 개발' },
      { name: 'TCP/IP / 비동기 소켓 / IOCP', level: '경력 확인', desc: '인증 서버와 네트워크 클라이언트 개발' },
      { name: 'C#', level: '경력 확인', desc: '닷넷 기반 공통 컴포넌트·표준 UI·플랫폼 모듈 개발' },
      { name: 'Java / Kotlin / Android', level: '상용 개발·운영', desc: 'Android 상용 앱 3개 개발·운영, O2O·매장관리·주문 및 결제 연동' },
      { name: 'Oracle / MSSQL / MariaDB / MySQL', level: '경력 확인', desc: '기업·플랫폼·모바일 서비스 데이터베이스' },
      { name: 'InstallShield / 패치 시스템', level: '경력 확인', desc: '설치 프로그램과 게임·서비스 패치 시스템 개발' },
      { name: 'Python / Go', level: '경력 확인', desc: '공개 이력의 핵심 기술과 개인 개발 활동에 포함' },
      { name: 'ASP / JSP / JavaScript / DHTML', level: '경력 확인', desc: '웹·무선인터넷·기업용 서비스 개발 경험' },
    ],
    projects: [
      { name: 'PC방 관리 플랫폼', stack: 'C++, MFC, ATL, C#, DevExpress, MSSQL, TCP/IP, IOCP', status: '완료', desc: '피카플레이·피카에어·피카라이브, 카운터 프로그램, 인증 서버, 게임 런처·패치, 운영 관리 도구 개발' },
      { name: 'Android O2O 서비스', stack: 'Android, Java, Kotlin, Oracle, MariaDB', status: '완료', desc: '상용 앱 3개 개발·운영과 O2O·매장관리·주문 및 결제 연동' },
      { name: '인도네시아 서비스 구축', stack: 'C++, 인증 서버, 운영 도구', status: '완료', desc: '현지 버전·인증 서버·피카툴즈 개발, 퍼블리싱 지원, 기술 지원, 직원 교육·관리' },
      { name: 'KT KAPS 시스템', stack: 'VC++, TChart, Xtreme Toolkit, Oracle, InstallShield', status: '완료', desc: 'GUI·차트 컴포넌트·라이브러리·설치 프로그램 개발' },
      { name: '가상주민번호 시스템', stack: 'C++, Java, VB, XML, ASP, JSP, IOCP', status: '완료', desc: '모듈·시스템 UI·패치 프로그램, 모바일 연동 프로토콜과 서버 개발' },
      { name: '업무용·닷넷 플랫폼', stack: 'MFC, ATL, C#, VB, Java, Oracle, MSSQL', status: '완료', desc: 'ERP 브라우저, 업무용 컴포넌트, 보안 모듈, 공통 컴포넌트와 표준 UI 개발' },
      { name: '웹·무선인터넷 서비스', stack: 'ASP, JSP, Java, JavaScript, DHTML, VB, C++', status: '완료', desc: '무선 포털·관리 도구와 리포트·음악메일·복권·쇼핑몰·게임·배너 자동화 서비스 개발' },
      { name: 'ai-workspace', stack: 'Markdown, AI 운영 문서', status: '최근 개발', desc: '목표별 컨텍스트, 결정, 우선순위, HANDOFF와 일지를 관리하는 개인 AI 운영 작업공간' },
      { name: 'ai_agent', stack: 'Python, JavaScript, LLM API, 로컬 AI', status: '최근 개발', desc: '근거·추적·평가·사람 승인 경계를 갖춘 검증 가능한 AI 에이전트와 연구 도구 모음' },
      { name: 'ai_history_dashboard', stack: 'Python, HTML, JavaScript', status: '최근 개발', desc: 'Claude Code·Codex 세션, Git 작업 이력, qa_manager 검증 근거를 연결하는 로컬 대시보드' },
      { name: 'ai_prompt', stack: 'Markdown, 프롬프트, 스킬', status: '최근 개발', desc: '코딩·분석·창작에 재사용하는 프롬프트, 페르소나, 스킬과 바이브 코딩 규칙 저장소' },
      { name: 'ai_test', stack: 'Python, Go, C++, React, FFmpeg', status: '최근 개발', desc: '음악·영상·자동화·보안·Windows 유틸리티를 실제 실행 도구로 구현한 다중 프로젝트 작업공간' },
      { name: 'ai_test1', stack: 'Python, JavaScript, FFmpeg, AI API', status: '최근 개발', desc: '웹소설·시나리오·가사·음악·뮤직비디오 제작 흐름을 자동화하는 창작 프로젝트 모음' },
      { name: 'ai_test2', stack: 'Python, JavaScript, Next.js, AI API', status: '최근 개발', desc: 'AI 이미지·영상 프롬프트, CapCut 제작, YouTube 조사, 음악 분석, 채용 적합도 분석 도구 모음' },
      { name: 'career', stack: 'HTML, JavaScript, Markdown', status: '최근 개발', desc: '공개 이력서와 비공개 경력 근거·지원 결과를 분리해 관리하는 경력 저장소' },
      { name: 'hermes-agents', stack: 'Python, PowerShell, MCP, 에이전트 규칙', status: '최근 개발', desc: 'Claude Code·Codex 공통 운영 규칙, MCP 설정, 검증 가드와 목표별 실행 원장을 관리하는 기반 저장소' },
      { name: 'llm-wiki', stack: 'HTML, JavaScript, Chrome Extension', status: '최근 개발', desc: '개인 지식과 경력·프로젝트 컨텍스트를 관리하고 여러 AI 도구에 선택적으로 주입하는 세컨드 브레인' },
      { name: 'qa_manager', stack: 'Python, YAML, HTML', status: '최근 개발', desc: '여러 독립 프로젝트의 요구사항·검사 결과·수정 재시도·출시 준비 상태를 추적하는 검수 시스템' },
      { name: 'skills', stack: 'Markdown, Claude Skills', status: '최근 개발', desc: '사업·문서·영상·개발·마케팅·커리어 작업을 위한 검증된 공개 AI 스킬 컬렉션' },
    ],
    prefs: {
      common: '경력·기술·프로젝트에 관한 답변은 저장된 공개 이력을 근거로 작성한다. 기록에 없는 성과, 수치, 직책, 자격은 추정하지 않고 미확인으로 표시한다.',
    },
  };

  const LEGACY_DEFAULT_STACK = new Set(['C++ / MFC', 'Visual Studio', 'Golang', 'Python', 'Android']);
  const STALE_ANDROID_HIGHLIGHT = 'Android O2O 서비스 4종과 주문·결제 연동 개발';
  const STALE_ANDROID_PROJECT = '피카플레이·쌤카페·피카오더·피카매장관리 Pro와 주문·결제 연동 개발';
  const LEGACY_AI_PROJECT = {
    name: '개인 프로젝트·AI 활용 개발 연구',
    desc: '개인 프로젝트 개발과 AI를 활용한 개발 방법 연구',
  };

  function mergeNamed(existing, incoming, removeLegacyDefaults = false) {
    const incomingByName = new Map(incoming.map(item => [item.name, item]));
    const kept = (existing || []).filter(item => {
      if (removeLegacyDefaults && LEGACY_DEFAULT_STACK.has(item.name)) return false;
      const managed = incomingByName.get(item.name);
      if (removeLegacyDefaults && managed && item.desc === managed.desc && item.level !== managed.level) return false;
      if (item.name === 'Java / Kotlin / Android' && item.desc === 'O2O·매장관리·주문 및 결제 앱 개발') return false;
      if (item.name === 'Android O2O 서비스' && item.desc === STALE_ANDROID_PROJECT) return false;
      if (item.name === LEGACY_AI_PROJECT.name && item.desc === LEGACY_AI_PROJECT.desc) return false;
      return true;
    });
    const names = new Set(kept.map(item => item.name));
    return [...kept, ...incoming.filter(item => !names.has(item.name))];
  }

  function mergeNonEmpty(defaults, existing) {
    const result = { ...defaults };
    Object.entries(existing || {}).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) result[key] = value;
    });
    return result;
  }

  function mergeCareerContext(current) {
    const profile = mergeNonEmpty(CAREER_CONTEXT.profile, current.profile);
    if (profile.highlights?.includes(STALE_ANDROID_HIGHLIGHT)) {
      profile.highlights = profile.highlights.replace(
        STALE_ANDROID_HIGHLIGHT,
        'Android 상용 앱 3개 개발·운영과 주문·결제 연동',
      );
    }
    const prefs = mergeNonEmpty(CAREER_CONTEXT.prefs, current.prefs);
    return {
      profile,
      prefs,
      stack: mergeNamed(current.stack, CAREER_CONTEXT.stack, true),
      projects: mergeNamed(current.projects, CAREER_CONTEXT.projects),
    };
  }

  const api = { CAREER_CONTEXT_VERSION, CAREER_CONTEXT, mergeCareerContext };
  root.CareerContext = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
