'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'tongsinmun-maker-v1';
const MONTH_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const SHEET_W = 794;

function todayKorean() {
  const dt = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일 ${days[dt.getDay()]}요일`;
}

function makeDefaults(template) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const common = {
    template,
    date: todayKorean(),
    issueNo: `제 ${y}-00호`,
    year: String(y),
    month: String(m),
    orgName: '○○어린이집',
    teacher: '○○○',
    phone: '02-123-4567',
    homepage: 'www.○○○.kr',
    address: '서울시 ○○구 ○○로 123',
    activities: [
      { img: null, title: '자연을 만나요', emoji: '🌿', desc: '바깥 놀이터에서 자연을 탐색하며\n개미와 풀꽃을 관찰했어요.\n작은 생명도 소중하다는 것을 배웠답니다.' },
      { img: null, title: '창의 미술 활동', emoji: '🎨', desc: '다양한 재료로 자유롭게 표현하며\n상상력을 키우고, 나만의 작품을 완성했어요.\n아이들의 멋진 작품을 기대해 주세요.' },
      { img: null, title: '함께 만드는 즐거움', emoji: '💗', desc: '친구들과 블록을 쌓으며 협동하는 시간을\n가졌어요. 서로 도와가며 더 큰 탑을\n완성하고 뿌듯해했답니다.' },
    ],
    parentsTitle: '부모님께 드리는 말씀',
    parentsMsg: '따뜻한 관심과 사랑으로 가정을 지지해 주시는\n부모님 덕분에 우리 아이들이 매일 밝게 성장하고 있습니다.\n앞으로도 가정과 어린이집이 함께 소통하며\n아이들의 행복한 미래를 만들어 가겠습니다.\n늘 감사합니다.',
    writeTitle: '알려드립니다 / 작성해주세요',
    writeRows: [
      { label: '전달 사항', text: '' },
      { label: '가정에서 협조 부탁드려요', text: '' },
      { label: '기타 안내', text: '' },
      { label: '비고', text: '' },
    ],
    footer: '아이들의 웃음이 가득한 ○○어린이집',
  };

  if (template === 'moon') {
    return {
      ...common,
      topSlogan: '아이들의 꿈이 자라는 행복한 어린이집',
      bottomSlogan: '사랑 · 배움 · 나눔으로 함께 성장하는 우리',
      photoTitle: '우리 반 친구들의 오늘!',
      noticeTitle: '안내드립니다',
      notices: [
        { icon: '📅', label: '행사 안내', text: `${m}월 30일(금) - 원 행사\n다양한 체험 활동이 예정되어 있습니다.` },
        { icon: '👕', label: '준비물 안내', text: '여벌 옷, 개인 물통, 양치 세트\n매일 챙겨 보내주세요.' },
        { icon: '⏰', label: '귀가 시간', text: '귀가 시간은 5시 30분 이전을 권장합니다.\n시간 엄수에 협조 부탁드립니다.' },
        { icon: '🧼', label: '건강 안내', text: '환절기 감기 예방을 위해 손 씻기와\n개인 위생 관리에 신경 써 주세요.' },
      ],
    };
  }

  return {
    ...common,
    topSlogan: '아이들의 오늘이 더 빛나는 내일이 되도록',
    bottomSlogan: '사랑으로 돌보고  배움으로 자라고  함께라서 행복한 우리',
    photoTitle: '우리 원의 따뜻한 오늘',
    noticeTitle: '공지사항',
    notices: [
      { icon: '📅', label: `${m}월 30일(금) - 원 행사`, text: '다양한 체험 활동이 준비되어 있습니다.\n즐거운 하루가 될 수 있도록 많은 참여 부탁드립니다.' },
      { icon: '👕', label: '여벌 옷, 개인 물통, 양치 세트', text: '매일 챙겨 보내주세요.' },
      { icon: '⏰', label: '귀가 시간 안내', text: '귀가 시간은 오후 5시 30분 이전을 권장합니다.\n시간 엄수에 협조 부탁드립니다.' },
      { icon: '🩹', label: '건강 안내', text: '환절기 감기 예방을 위해 손 씻기와\n개인 위생 관리에 신경 써 주세요.' },
      { icon: '🎂', label: `${m}월 생일 친구`, text: '홍길동(1일), 김사랑(18일)\n생일을 축하합니다! 행복한 하루 보내세요!' },
    ],
  };
}

function readPhoto(file, cb) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const max = 1200;
      let w = img.width;
      let h = img.height;
      if (Math.max(w, h) > max) {
        const r = max / Math.max(w, h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      cb(c.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ---------- 그림 요소 ---------- */

function MoonArt() {
  return (
    <svg className="moon-art" viewBox="0 0 150 130" aria-hidden="true">
      <defs>
        <mask id="moon-cut">
          <rect width="150" height="130" fill="#fff" />
          <circle cx="94" cy="42" r="38" fill="#000" />
        </mask>
      </defs>
      <ellipse cx="36" cy="106" rx="27" ry="12" fill="#fff" stroke="#e6dfc6" strokeWidth="2" />
      <ellipse cx="62" cy="112" rx="21" ry="10" fill="#fff" stroke="#e6dfc6" strokeWidth="2" />
      <circle cx="64" cy="62" r="42" fill="#f6d360" mask="url(#moon-cut)" />
      <path d="M34 60 q5 6 10 0" stroke="#c9912e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M52 70 q5 6 10 0" stroke="#c9912e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="72" r="4.5" fill="#f3a94c" opacity="0.45" />
      <text x="112" y="24" fontSize="18">⭐</text>
      <text x="8" y="28" fontSize="13">⭐</text>
      <text x="128" y="72" fontSize="12">✨</text>
    </svg>
  );
}

function Photo({ a }) {
  if (a.img) return <img src={a.img} alt={a.title} />;
  return (
    <div className="ph-placeholder">
      📷<span>사진을 올려주세요</span>
    </div>
  );
}

/* ---------- 디자인 1 : 달님 테마 ---------- */

function MoonSheet({ d }) {
  return (
    <div className="sheet moon">
      <div className="m-topline">
        <span>{d.issueNo}</span>
        <span>{d.date}</span>
      </div>

      <div className="m-header">
        <MoonArt />
        <div className="m-titlebox">
          <div className="m-topslogan">{d.topSlogan}</div>
          <h1 className="sheet-title">가정통신문</h1>
          <div className="m-dots" />
          <div className="m-bottomslogan">♥ {d.bottomSlogan} ♥</div>
        </div>
        <div className="m-info">
          <div className="m-info-name">🏫 {d.orgName}</div>
          <div className="m-info-row">담당교사 : {d.teacher}</div>
          <div className="m-info-row">전화번호 : {d.phone}</div>
          <div className="m-info-row">홈페이지 : {d.homepage}</div>
        </div>
      </div>

      <div className="m-card">
        <div className="m-banner">🌿 {d.photoTitle} 🌿</div>
        <div className="sheet-photos">
          {d.activities.map((a, i) => (
            <div key={i}>
              <div className="m-photo-frame">
                <Photo a={a} />
              </div>
              <div className="m-photo-title">{a.title} {a.emoji}</div>
              <div className="sheet-photo-desc">{a.desc}</div>
            </div>
          ))}
        </div>
        <div className="m-divider" />
        <div className="m-cols">
          <div>
            <h3 className="m-h3">📣 {d.noticeTitle}</h3>
            {d.notices.map((n, i) => (
              <div className="m-notice-row" key={i}>
                <span className="m-chip">{n.label}</span>
                <div className="m-notice-text">{n.text}</div>
              </div>
            ))}
          </div>
          <div className="m-parents">
            <h3 className="m-parents-title">⭐ {d.parentsTitle}</h3>
            <div className="m-parents-text">{d.parentsMsg}</div>
            <div className="m-parents-art">🌳 🏫 🌳</div>
          </div>
        </div>
      </div>

      <div className="m-write">
        <h3 className="m-h3">🌙 {d.writeTitle} ⭐</h3>
        {d.writeRows.map((r, i) => (
          <div className="m-write-row" key={i}>
            <span className="m-chip yellow">{r.label}</span>
            <div className="m-write-line">{r.text}</div>
          </div>
        ))}
        <div className="m-write-moon">🌙</div>
      </div>

      <div className="sheet-footer">♥ {d.footer} ♥</div>
    </div>
  );
}

/* ---------- 디자인 2 : 초록 리본 테마 ---------- */

function RibbonSheet({ d }) {
  const mi = Math.max(1, Math.min(12, parseInt(d.month, 10) || 1));
  return (
    <div className="sheet ribbon">
      <div className="r-date">{d.date}</div>

      <div className="r-header">
        <div className="r-ribbon">
          <div className="r-year">{d.year}</div>
          <div className="r-month">{d.month}</div>
          <div className="r-men">{MONTH_EN[mi - 1]}</div>
        </div>
        <div className="r-titlebox">
          <div className="r-topslogan">{d.topSlogan} 🌿</div>
          <h1 className="sheet-title">가정통신문</h1>
          <div className="r-underline" />
          <div className="r-bottomslogan">♥ {d.bottomSlogan} ♥</div>
        </div>
        <div className="r-info">
          <div className="r-info-name">🏠 {d.orgName}</div>
          <div className="r-info-row">담당교사 : {d.teacher}</div>
          <div className="r-info-row">전화번호 : {d.phone}</div>
          <div className="r-info-row">홈페이지 : {d.homepage}</div>
          <div className="r-info-row">주&nbsp;&nbsp;&nbsp;&nbsp;소 : {d.address}</div>
        </div>
      </div>

      <div className="r-dash" />

      <div className="r-banner-wrap">
        <span>🌞</span>
        <div className="r-banner">🌼 {d.photoTitle} 🌼</div>
        <span>🌸</span>
      </div>

      <div className="sheet-photos">
        {d.activities.map((a, i) => (
          <div key={i}>
            <div className={`r-polaroid p${i % 3}`}>
              <span className="r-tape" />
              <Photo a={a} />
            </div>
            <div className="r-photo-title">{a.title} {a.emoji}</div>
            <div className="sheet-photo-desc">{a.desc}</div>
          </div>
        ))}
      </div>

      <div className="r-lower">
        <div className="r-noticebox">
          <div className="r-boxtag green">{d.noticeTitle} 📣</div>
          {d.notices.map((n, i) => (
            <div className="r-notice-item" key={i}>
              <span className="r-icon">{n.icon}</span>
              <div>
                <div className="r-notice-label">{n.label}</div>
                <div className="r-notice-text">{n.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="r-rightcol">
          <div className="r-parentsbox">
            <div className="r-boxtag pink">{d.parentsTitle} ♥</div>
            <div className="r-parents-inner">
              <div className="r-parents-text">{d.parentsMsg}</div>
              <div className="r-tree">🌸</div>
            </div>
          </div>
          <div className="r-writebox">
            <div className="r-write-head">✏️ {d.writeTitle} 🌼</div>
            {d.writeRows.map((r, i) => (
              <div className="r-write-row" key={i}>
                <span className="r-write-label">{r.label}</span>
                <div className="r-write-line">{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="r-footer-dash" />
      <div className="sheet-footer">♥ {d.footer} ♥</div>
    </div>
  );
}

function Sheet({ d }) {
  return d.template === 'moon' ? <MoonSheet d={d} /> : <RibbonSheet d={d} />;
}

/* ---------- 미리보기 크기 맞추기 ---------- */

function ScaledSheet({ children }) {
  const boxRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [h, setH] = useState(1123);

  useEffect(() => {
    const update = () => {
      if (boxRef.current) setScale(Math.min(1, boxRef.current.clientWidth / SHEET_W));
      if (innerRef.current) setH(innerRef.current.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    if (boxRef.current) ro.observe(boxRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={boxRef} className="scale-box" style={{ height: h * scale }}>
      <div ref={innerRef} className="scale-inner" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- AI 다듬기 버튼 ---------- */

function AiButton({ getText, context, onResult }) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    const text = getText();
    if (!text || !text.trim()) {
      alert('먼저 내용을 간단히 적어주세요.\nAI가 그 내용을 부모님께 보내기 좋은 문장으로 다듬어 드려요.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, context }),
      });
      const data = await res.json();
      if (data.result) onResult(data.result);
      else alert(data.error || 'AI 다듬기에 실패했어요. 다시 시도해주세요.');
    } catch {
      alert('연결에 실패했어요. 인터넷 연결을 확인해주세요.');
    }
    setBusy(false);
  };
  return (
    <button type="button" className="ai-btn" disabled={busy} onClick={run}>
      {busy ? '✨ 다듬는 중…' : '✨ AI 다듬기'}
    </button>
  );
}

/* ---------- 입력칸 공통 ---------- */

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <section className="ed-section">
      <h2 className="ed-title">{title}</h2>
      {children}
    </section>
  );
}

/* ---------- 시작 화면 ---------- */

function StartScreen({ onPick }) {
  const moon = makeDefaults('moon');
  const ribbon = makeDefaults('ribbon');
  return (
    <div className="start">
      <h1 className="start-title">🏫 가정통신문 만들기</h1>
      <p className="start-sub">마음에 드는 디자인을 골라주세요. 내용은 고른 뒤에 채우면 됩니다.</p>
      <div className="start-cards">
        <div className="start-card" onClick={() => onPick('moon')}>
          <div className="mini">
            <div className="mini-inner">
              <MoonSheet d={moon} />
            </div>
          </div>
          <div className="start-name">디자인 1 · 달님과 별 🌙</div>
          <button className="btn primary" type="button">이 디자인으로 시작</button>
        </div>
        <div className="start-card" onClick={() => onPick('ribbon')}>
          <div className="mini">
            <div className="mini-inner">
              <RibbonSheet d={ribbon} />
            </div>
          </div>
          <div className="start-name">디자인 2 · 초록 리본 🎀</div>
          <button className="btn primary" type="button">이 디자인으로 시작</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 메인 ---------- */

export default function Home() {
  const [phase, setPhase] = useState('loading');
  const [d, setD] = useState(null);

  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {}
    if (saved && saved.template) {
      setD(saved);
      setPhase('edit');
    } else {
      setPhase('pick');
    }
  }, []);

  useEffect(() => {
    if (phase === 'edit' && d) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
      } catch {}
    }
  }, [d, phase]);

  const pick = (t) => {
    setD(makeDefaults(t));
    setPhase('edit');
  };

  const reset = () => {
    if (!confirm('작성한 내용이 모두 지워지고 처음 화면으로 돌아갑니다.\n계속할까요?')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setD(null);
    setPhase('pick');
  };

  const switchTemplate = () => {
    setD((p) => ({ ...p, template: p.template === 'moon' ? 'ribbon' : 'moon' }));
  };

  const up = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const upAct = (i, k, v) =>
    setD((p) => ({ ...p, activities: p.activities.map((x, j) => (j === i ? { ...x, [k]: v } : x)) }));
  const upNotice = (i, k, v) =>
    setD((p) => ({ ...p, notices: p.notices.map((x, j) => (j === i ? { ...x, [k]: v } : x)) }));
  const addNotice = () =>
    setD((p) => ({ ...p, notices: [...p.notices, { icon: '📌', label: '안내', text: '' }] }));
  const rmNotice = (i) => setD((p) => ({ ...p, notices: p.notices.filter((_, j) => j !== i) }));
  const upWrite = (i, k, v) =>
    setD((p) => ({ ...p, writeRows: p.writeRows.map((x, j) => (j === i ? { ...x, [k]: v } : x)) }));

  if (phase === 'loading') return <div className="loading">잠시만요…</div>;
  if (phase === 'pick') return <StartScreen onPick={pick} />;

  const isMoon = d.template === 'moon';

  return (
    <div className="app">
      <header className="topbar">
        <h1>🏫 가정통신문 만들기</h1>
        <button className="btn" type="button" onClick={switchTemplate}>
          🔄 디자인 바꾸기 ({isMoon ? '달님' : '초록 리본'} → {isMoon ? '초록 리본' : '달님'})
        </button>
        <button className="btn" type="button" onClick={reset}>🗑️ 처음부터 다시</button>
        <button className="btn primary" type="button" onClick={() => window.print()}>🖨️ 인쇄 / PDF 저장</button>
      </header>

      <div className="main">
        <div className="editor">
          <Section title="1. 기본 정보">
            <Field label="어린이집 이름">
              <input value={d.orgName} onChange={(e) => up('orgName', e.target.value)} />
            </Field>
            <div className="row2">
              <Field label="날짜">
                <input value={d.date} onChange={(e) => up('date', e.target.value)} />
              </Field>
              {isMoon ? (
                <Field label="발행 호수">
                  <input value={d.issueNo} onChange={(e) => up('issueNo', e.target.value)} />
                </Field>
              ) : (
                <div className="row2">
                  <Field label="연도">
                    <input value={d.year} onChange={(e) => up('year', e.target.value)} />
                  </Field>
                  <Field label="월">
                    <input value={d.month} onChange={(e) => up('month', e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
            <div className="row2">
              <Field label="담당교사">
                <input value={d.teacher} onChange={(e) => up('teacher', e.target.value)} />
              </Field>
              <Field label="전화번호">
                <input value={d.phone} onChange={(e) => up('phone', e.target.value)} />
              </Field>
            </div>
            <Field label="홈페이지">
              <input value={d.homepage} onChange={(e) => up('homepage', e.target.value)} />
            </Field>
            {!isMoon && (
              <Field label="주소">
                <input value={d.address} onChange={(e) => up('address', e.target.value)} />
              </Field>
            )}
            <Field label="위쪽 문구 (제목 위 한 줄)">
              <input value={d.topSlogan} onChange={(e) => up('topSlogan', e.target.value)} />
            </Field>
            <Field label="아래쪽 문구 (제목 아래 한 줄)">
              <input value={d.bottomSlogan} onChange={(e) => up('bottomSlogan', e.target.value)} />
            </Field>
            <Field label="맨 아래 마무리 문구">
              <input value={d.footer} onChange={(e) => up('footer', e.target.value)} />
            </Field>
          </Section>

          <Section title="2. 오늘의 활동 (사진 3장)">
            <Field label="사진 부분 제목">
              <input value={d.photoTitle} onChange={(e) => up('photoTitle', e.target.value)} />
            </Field>
            {d.activities.map((a, i) => (
              <div className="ed-card" key={i}>
                <div className="ed-card-head">사진 {i + 1}</div>
                <div className="photo-btns">
                  <input
                    type="file"
                    accept="image/*"
                    id={`photo-${i}`}
                    className="file-hidden"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (f) readPhoto(f, (url) => upAct(i, 'img', url));
                      e.target.value = '';
                    }}
                  />
                  <label htmlFor={`photo-${i}`} className="btn small">📷 사진 올리기</label>
                  {a.img && (
                    <button className="btn small ghost" type="button" onClick={() => upAct(i, 'img', null)}>
                      사진 지우기
                    </button>
                  )}
                  {a.img && <img className="thumb" src={a.img} alt="" />}
                </div>
                <div className="row2">
                  <Field label="활동 이름">
                    <input value={a.title} onChange={(e) => upAct(i, 'title', e.target.value)} />
                  </Field>
                  <Field label="꾸밈 이모지">
                    <input value={a.emoji} onChange={(e) => upAct(i, 'emoji', e.target.value)} />
                  </Field>
                </div>
                <Field label="활동 설명">
                  <textarea value={a.desc} onChange={(e) => upAct(i, 'desc', e.target.value)} />
                </Field>
                <AiButton
                  getText={() => a.desc}
                  context={`오늘의 활동 소개 (${a.title})`}
                  onResult={(t) => upAct(i, 'desc', t)}
                />
              </div>
            ))}
          </Section>

          <Section title="3. 안내사항">
            <Field label="안내 부분 제목">
              <input value={d.noticeTitle} onChange={(e) => up('noticeTitle', e.target.value)} />
            </Field>
            {d.notices.map((n, i) => (
              <div className="ed-card" key={i}>
                <div className="ed-card-head">
                  안내 {i + 1}
                  <button className="btn small ghost" type="button" onClick={() => rmNotice(i)}>삭제</button>
                </div>
                <div className="row2">
                  <Field label="제목 (짧게)">
                    <input value={n.label} onChange={(e) => upNotice(i, 'label', e.target.value)} />
                  </Field>
                  <Field label="아이콘" hint="초록 리본 디자인에서만 보여요">
                    <input value={n.icon} onChange={(e) => upNotice(i, 'icon', e.target.value)} />
                  </Field>
                </div>
                <Field label="내용">
                  <textarea value={n.text} onChange={(e) => upNotice(i, 'text', e.target.value)} />
                </Field>
                <AiButton
                  getText={() => n.text}
                  context={`안내사항 (${n.label})`}
                  onResult={(t) => upNotice(i, 'text', t)}
                />
              </div>
            ))}
            <button className="btn" type="button" onClick={addNotice}>➕ 안내 추가</button>
          </Section>

          <Section title="4. 부모님께 드리는 말씀">
            <Field label="제목">
              <input value={d.parentsTitle} onChange={(e) => up('parentsTitle', e.target.value)} />
            </Field>
            <Field label="내용">
              <textarea
                className="tall"
                value={d.parentsMsg}
                onChange={(e) => up('parentsMsg', e.target.value)}
              />
            </Field>
            <AiButton
              getText={() => d.parentsMsg}
              context="부모님께 드리는 말씀"
              onResult={(t) => up('parentsMsg', t)}
            />
          </Section>

          <Section title="5. 알려드립니다 / 작성해주세요">
            <p className="hint">인쇄한 뒤 손으로 쓰는 칸이에요. 미리 글을 채워 넣을 수도 있어요.</p>
            <Field label="제목">
              <input value={d.writeTitle} onChange={(e) => up('writeTitle', e.target.value)} />
            </Field>
            {d.writeRows.map((r, i) => (
              <div className="row2" key={i}>
                <Field label={`칸 ${i + 1} 이름`}>
                  <input value={r.label} onChange={(e) => upWrite(i, 'label', e.target.value)} />
                </Field>
                <Field label="미리 채울 내용 (비워도 돼요)">
                  <input value={r.text} onChange={(e) => upWrite(i, 'text', e.target.value)} />
                </Field>
              </div>
            ))}
          </Section>
        </div>

        <div className="preview-col">
          <p className="preview-tip">
            👀 아래는 완성 모습 미리보기예요. 왼쪽에 글을 쓰면 바로 바뀌어요.
            다 되면 위의 <b>🖨️ 인쇄 / PDF 저장</b> 버튼을 눌러주세요.
          </p>
          <ScaledSheet>
            <Sheet d={d} />
          </ScaledSheet>
        </div>
      </div>
    </div>
  );
}
