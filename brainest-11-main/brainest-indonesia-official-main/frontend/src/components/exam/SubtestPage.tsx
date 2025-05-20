import React, { useState, useEffect } from 'react';
import ExamTimer from './ExamTimer';

interface SubtestPageProps {
  subtest: { key: string; name: string; count: number };
  totalSubtest: number;
  subtestIdx: number;
  locked: boolean;
  onSubmit: (idx: number, jawaban: any, timerSisa: number) => void;
  soal: any[];
  attemptId: string;
  answersInit?: { answers: (string|null)[], ragu: boolean[] };
  onFinish?: () => void;
}

function getLocalKey(attemptId: string, subtestKey: string) {
  return `exam_${attemptId}_${subtestKey}`;
}

export default function SubtestPage({ subtest, totalSubtest, subtestIdx, locked, onSubmit, soal, attemptId, answersInit, onFinish }: SubtestPageProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(answersInit?.answers || Array(subtest.count).fill(null));
  const [ragu, setRagu] = useState<boolean[]>(answersInit?.ragu || Array(subtest.count).fill(false));
  const [timer, setTimer] = useState(() => {
    const saved = localStorage.getItem(getLocalKey(attemptId, subtest.key));
    if (saved) {
      try { return JSON.parse(saved).timer || subtest.count * 90; } catch { return subtest.count * 90; }
    }
    return subtest.count * 90;
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [showPause, setShowPause] = useState(false);

  useEffect(() => {
    if (locked || showPause) return;
    if (timer <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, locked, showPause]);

  useEffect(() => {
    localStorage.setItem(getLocalKey(attemptId, subtest.key), JSON.stringify({ answers, ragu, timer }));
  }, [answers, ragu, timer, attemptId, subtest.key]);

  useEffect(() => {
    const saved = localStorage.getItem(getLocalKey(attemptId, subtest.key));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || Array(subtest.count).fill(null));
        setRagu(parsed.ragu || Array(subtest.count).fill(false));
        setTimer(parsed.timer || subtest.count * 90);
      } catch {}
    }
  }, [attemptId, subtest.key, subtest.count]);

  const goTo = (idx: number) => { setCurrent(idx); setAnimKey(k => k + 1); window.scrollTo({top:0,behavior:'smooth'}); };
  const next = () => { setCurrent(c => Math.min(c + 1, soal.length - 1)); setAnimKey(k => k + 1); window.scrollTo({top:0,behavior:'smooth'}); };
  const prev = () => { setCurrent(c => Math.max(c - 1, 0)); setAnimKey(k => k + 1); window.scrollTo({top:0,behavior:'smooth'}); };
  const answer = (ans: string) => setAnswers(a => a.map((v, i) => i === current ? ans : v));
  const toggleRagu = () => setRagu(r => r.map((v, i) => i === current ? !v : v));
  const handleSubmit = () => setShowConfirm(true);
  const confirmSubmit = async () => {
    setShowConfirm(false);
    onSubmit(subtestIdx, { answers, ragu }, timer);
    if (onFinish) onFinish();
  };

  // UI/UX colors
  const blue = '#3F8CFF';
  const blueLight = '#E8F1FF';
  const blueBorder = '#B3D4FF';
  const lavender = '#E3E6FF';
  const gray = '#F5F6FA';
  const blueDark = '#1565C0';
  const answeredCount = answers.filter(Boolean).length;
  const raguCount = ragu.filter(Boolean).length;
  const belumCount = soal.length - answeredCount;

  return (
    <div style={{ background: gray, minHeight: '100vh', fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ width: '100%', background: blue, color: '#fff', padding: '18px 0 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px #6c3ef522', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 26, marginLeft: 40, letterSpacing: 0.5 }}>Brainest Indonesia</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginRight: 40 }}>
          <button onClick={()=>setShowPause(p=>!p)} style={{ background: '#fff', color: blue, fontWeight: 700, border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: 18, marginRight: 8, boxShadow: 'none', cursor: 'pointer', transition: 'all 0.15s', border: `2px solid ${blue}` }}>
            {showPause ? 'Lanjut' : 'Pause'}
          </button>
          <button style={{ background: '#fff', color: blue, fontWeight: 700, border: `2px solid ${blue}`, borderRadius: 8, padding: '8px 22px', fontSize: 18, boxShadow: 'none', cursor: 'pointer', transition: 'all 0.15s' }} onClick={handleSubmit}>Akhiri Try Out</button>
        </div>
      </div>
      {/* Main content */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 36, width: '100vw', minHeight: 'calc(100vh - 70px)', margin: 0, padding: '0 32px', boxSizing: 'border-box' }}>
        {/* Konten soal utama tanpa card */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 900, padding: 0, margin: 0 }}>
          <div key={animKey} style={{ background: 'transparent', borderRadius: 0, boxShadow: 'none', padding: '36px 0 28px 0', minHeight: 420, marginBottom: 24, animation: 'fadeIn 0.3s' }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: blue, letterSpacing: 0.2 }}>SOAL NO. {current + 1}</div>
            <div style={{ fontSize: 17, marginBottom: 18 }}>{soal[current]?.text}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(soal[current]?.options || {}).map(([label, text]) => (
                <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 8, background: answers[current] === label ? blue : '#f5f5f5', color: answers[current] === label ? '#fff' : '#222', border: answers[current] === label ? `2px solid ${lavender}` : `1px solid ${blueBorder}`, fontWeight: 500, fontSize: 16, cursor: locked ? 'not-allowed' : 'pointer', boxShadow: answers[current] === label ? '0 2px 8px #3F8CFF55' : 'none', transition: 'all 0.15s', marginBottom: 4 }}>
                  <input type="radio" name={`soal_${current}`} checked={answers[current] === label} onChange={()=>!locked && answer(label)} disabled={locked} style={{ accentColor: blue, width: 22, height: 22, marginRight: 8 }} />
                  <span style={{ fontWeight: 700, fontSize: 18, minWidth: 24 }}>{label}.</span>
                  <span style={{ flex: 1 }}>{text}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button onClick={toggleRagu} disabled={locked} style={{ background: ragu[current] ? lavender : '#f5f5f5', color: ragu[current] ? blue : '#333', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: locked ? 'not-allowed' : 'pointer', boxShadow: ragu[current] ? '0 2px 8px #E3E6FF55' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                {ragu[current] ? 'Batal Ragu-Ragu' : 'Tandai Ragu-Ragu'}
              </button>
            </div>
          </div>
          {/* Navigasi bawah sticky */}
          <div style={{ position: 'sticky', bottom: 0, background: 'transparent', borderTop: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', zIndex: 20, boxShadow: 'none' }}>
            <button onClick={prev} disabled={current === 0 || locked} style={{ background: '#f5f5f5', color: '#333', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 18, cursor: current === 0 || locked ? 'not-allowed' : 'pointer', borderWidth: 2, borderColor: blue, marginRight: 8 }}>⟵ Sebelumnya</button>
            <span style={{ fontWeight: 600, fontSize: 18 }}>{current + 1}/{soal.length}</span>
            <button onClick={next} disabled={current === soal.length - 1 || locked} style={{ background: blue, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 18, cursor: current === soal.length - 1 || locked ? 'not-allowed' : 'pointer', marginLeft: 8 }}>Selanjutnya ⟶</button>
          </div>
        </div>
        {/* Panel navigasi soal & timer tanpa card */}
        <div style={{ width: 320, minWidth: 220, background: 'transparent', borderRadius: 0, boxShadow: 'none', padding: '28px 0 18px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, position: 'sticky', right: 0 }}>
          {/* Timer besar */}
          <div style={{ background: blueLight, color: blue, fontWeight: 700, fontSize: 32, borderRadius: 12, padding: '10px 0', width: '100%', textAlign: 'center', marginBottom: 18, letterSpacing: 2 }}>
            <ExamTimer seconds={timer} />
          </div>
          {/* Grid nomor soal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, width: '100%', marginBottom: 12 }}>
            {Array(soal.length).fill(null).map((_, i) => {
              let bg = '#fff', color = blue, border = `2px solid ${blueBorder}`;
              if (i === current) { bg = '#fff'; color = blue; border = `2.5px solid ${blueDark}`; }
              else if (ragu[i]) { bg = lavender; color = blue; border = `2px solid ${lavender}`; }
              else if (answers[i]) { bg = blue; color = '#fff'; border = `2px solid ${blue}`; }
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: 38, height: 38, borderRadius: 8, fontWeight: 700, fontSize: 16, background: bg, color, border, cursor: 'pointer', boxShadow: 'none', outline: 'none', transition: 'all 0.15s',
                  }}
                  aria-label={`Soal ${i + 1}${ragu[i] ? ' (Ragu-ragu)' : answers[i] ? ' (Sudah dijawab)' : ''}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          {/* Keterangan warna */}
          <div style={{ width: '100%', marginTop: 8, background: 'transparent', borderRadius: 10, padding: 12, fontSize: 15, color: '#333', boxShadow: 'none' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Keterangan Warna</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, background: blue, border: `2px solid ${blue}`, borderRadius: 4, marginRight: 4 }}></span>
                Dijawab
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, background: lavender, borderRadius: 4, border: `2px solid ${blue}`, marginRight: 4 }}></span>
                Ragu-ragu
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, background: '#fff', border: `2px solid ${blueBorder}`, borderRadius: 4, marginRight: 4 }}></span>
                Belum Dijawab
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, background: '#fff', border: `2.5px solid ${blueDark}`, borderRadius: 4, marginRight: 4, boxShadow: 'none' }}></span>
                Posisi Saat Ini
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal konfirmasi submit */}
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 36, minWidth: 340, textAlign: 'center', boxShadow: '0 4px 32px #2222', maxWidth: 420 }}>
            <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 12, color: '#222' }}>Apakah Kamu Yakin?</div>
            <div style={{ fontSize: 18, marginBottom: 18, color: '#444' }}>Setelah mengakhiri Try Out, Kamu tidak dapat lagi mengerjakan soal ini.</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 18, fontSize: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'green' }}>● Dijawab: {answeredCount}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ffb300' }}>● Ragu-ragu: {raguCount}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888' }}>● Tidak Dijawab: {belumCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 18 }}>
              <button onClick={()=>setShowConfirm(false)} style={{ background: '#fff', color: blue, border: `2px solid ${blue}`, borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Batal</button>
              <button onClick={confirmSubmit} style={{ background: blue, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Ya, Akhiri</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @media (max-width: 1100px) {
          div[style*='display: flex'][style*='gap: 36px'] { flex-direction: column !important; align-items: stretch !important; gap: 0 !important; padding: 0 12px !important; }
          div[style*='width: 320px'] { width: 100% !important; min-width: 0 !important; margin-top: 24px; padding-right: 0 !important; }
          div[style*='max-width: 900px'] { max-width: 100vw !important; }
        }
        @media (max-width: 700px) {
          div[style*='display: flex'][style*='gap: 36px'] { padding: 0 8px !important; }
          div[style*='max-width: 900px'] { max-width: 100vw !important; }
          div[style*='padding: 36px 0 28px 0'] { padding: 18px 0 12px 0 !important; min-height: 220px !important; }
        }
      `}</style>
    </div>
  );
} 