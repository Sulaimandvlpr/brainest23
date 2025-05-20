import React, { useState, useEffect } from "react";

const subtests = [
  { name: "Penalaran Umum (PU)", count: 30 },
  { name: "Pengetahuan Kuantitatif (PK)", count: 20 },
  { name: "Penalaran Matematika (PM)", count: 15 },
  { name: "Literasi Bahasa Indonesia (LBI)", count: 15 },
  { name: "Literasi Bahasa Inggris (LBE)", count: 20 },
  { name: "Pengetahuan dan Pemahaman Umum (PPU)", count: 10 },
  { name: "Pemahaman Bacaan dan Menulis (PBM)", count: 10 },
];
const totalSoal = subtests.reduce((a, b) => a + b.count, 0);
const totalDurasi = 120;

const rules = [
  "Dilarang melakukan screenshot, screen recording, atau mengambil gambar soal dalam bentuk apapun.",
  "Dilarang menyalin/copy soal atau jawaban ke media lain.",
  "Dilarang membagi layar (split screen) atau membuka aplikasi/tab lain selama tryout berlangsung.",
  "Dilarang keluar dari halaman tryout sebelum selesai.",
  "Dilarang bekerja sama atau meminta bantuan pihak lain selama tryout.",
  "Setiap pelanggaran akan menyebabkan diskualifikasi hasil tryout.",
  "Jawaban otomatis terkirim jika waktu habis (auto submit).",
  "Jawaban yang tidak diisi akan dianggap kosong dan tidak mendapat nilai.",
];

// Palet warna profesional
const bgMain = "#F5F9FF";
const blueMain = '#4F9DFF'; // biru utama
const blueSoft = '#eaf3fd'; // biru muda/lavender
const bluePastel = '#e3f0ff'; // biru pastel untuk timer dan card
const borderPanel = "#BBDEFB";
const textDark = "#333333";
const ctaBg = "#1A73E8";
const ctaHover = "#1669C1";
const ctaText = "#FFFFFF";
const grayBorder = '#e5e7eb';
const grayText = '#a3a3a3';

// SVG pattern dots dari heropatterns.com (opacity sangat rendah)
const dotsPattern = `url('data:image/svg+xml;utf8,<svg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><circle cx=\'2\' cy=\'2\' r=\'2\' fill=\'%23b3c6e0\' fill-opacity=\'0.05\'/></svg>')`;

// SVG ilustrasi buku (ikon ringan, opacity 0.05)
const bookSVG = (
  <svg width="180" height="180" viewBox="0 0 48 48" fill="none" style={{position:'fixed',right:0,bottom:0,opacity:0.05,zIndex:0,pointerEvents:'none'}} xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="32" rx="4" fill="#1A73E8"/>
    <rect x="10" y="12" width="28" height="24" rx="2" fill="#fff"/>
    <rect x="14" y="16" width="20" height="2" rx="1" fill="#BBDEFB"/>
    <rect x="14" y="20" width="20" height="2" rx="1" fill="#BBDEFB"/>
    <rect x="14" y="24" width="12" height="2" rx="1" fill="#BBDEFB"/>
  </svg>
);

// SVG ikon play untuk tombol
const playIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{marginRight:8}} xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#fff" fillOpacity="0.18"/>
    <path d="M8 7L13 10L8 13V7Z" fill="#fff"/>
  </svg>
);

const ExamInterface = () => {
  // Semua hooks harus di atas!
  const [agreed, setAgreed] = useState(true); // langsung true agar langsung ke pengerjaan
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(35).fill(null));
  const [flags, setFlags] = useState(Array(35).fill(false)); // ragu-ragu
  const [timeLeft, setTimeLeft] = useState(3050); // 50:50
  const [paused, setPaused] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const questions = Array.from({length: 35}, (_, i) => ({
    number: i+1,
    text: i === 0 ? `Pendidikan kita saat ini setidaknya dihadapkan [...] tiga masalah besar. (2) Masalah tersebut terkait dengan mutu, motivasi, dan pemerataan pendidikan. (3) Secara umum, saat ini pendidikan kita lebih menjalankan akumulasi pengetahuan yang bersifat [...], daripada penguasaan keterampilan dan pembentukan kepribadian. (4) Pola motivasi sebagian besar peserta didik lebih kepada penampilan daripada pencapaian. (5) Bentuk motivasi ini lebih mengutamakan ijazah atau gelar daripada [...] yang benar-benar dikuasai atau mampu dikerjakan. (6) Pendidikan kita belum berhasil meningkatkan kualitas hasil belajar sebagian besar peserta didik yang umumnya [...] sedang atau kurang. (7) Pendidikan kita mungkin baru berhasil meningkatkan kemampuan peserta didik yang merupakan bibit unggul.\n\nJudul yang paling tepat untuk melengkapi tulisan di atas adalah....` : `Soal nomor ${i+1} (mock)`,
    options: [
      i === 0 ? 'Keadaan Nyata Pendidikan Indonesia' : 'Pilihan A',
      i === 0 ? 'Masalah Utama Pendidikan Indonesia' : 'Pilihan B',
      i === 0 ? 'Masalah-Masalah Pendidikan Indonesia' : 'Pilihan C',
      i === 0 ? 'Pelaksanaan Program Pendidikan Indonesia' : 'Pilihan D',
      i === 0 ? 'Kekurangan-Kekurangan Program Pendidikan Indonesia' : 'Pilihan E',
    ]
  }));

  // Rekap jumlah soal
  const answeredCount = answers.filter((a, i) => a !== null && !flags[i]).length;
  const raguCount = flags.filter(f => f).length;
  const belumCount = answers.filter((a, i) => a === null && !flags[i]).length;

  const recapBlue = blueMain; // #4F9DFF
  const recapBlueSoft = '#90caf9';
  const recapWhite = '#fff';
  const recapGrayText = grayText;

  useEffect(() => {
    if (paused || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, paused]);

  const formatTime = s => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${ss.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optIdx) => {
    setAnswers(a => {
      const copy = [...a];
      copy[current] = optIdx;
      return copy;
    });
  };
  const handleFlag = () => {
    setFlags(f => {
      const copy = [...f];
      copy[current] = !copy[current];
      return copy;
    });
  };
  const goTo = idx => setCurrent(idx);
  const next = () => setCurrent(c => Math.min(c + 1, questions.length - 1));
  const prev = () => setCurrent(c => Math.max(c - 1, 0));

  // Color logic for palette
  const getPaletteStyle = (idx) => {
    if (current === idx) return {border: `3px solid ${blueMain}`, background: '#fff', color: blueMain, fontWeight: 700};
    if (flags[idx]) return {border: `1.5px solid #90caf9`, background: '#cfe6ff', color: blueMain, fontWeight: 700}; // biru muda ragu
    if (answers[idx] !== null) return {border: `1.5px solid ${blueMain}`, background: blueMain, color: '#fff', fontWeight: 700}; // biru dijawab
    return {border: `1.5px solid ${grayBorder}`, background: '#fff', color: grayText, fontWeight: 700}; // putih belum
  };

  // Main UI
  return (
    <div style={{minHeight:'100vh', background:blueSoft, fontFamily:'Inter, Roboto, Arial, sans-serif', overflow:'hidden'}}>
      {/* Header */}
      <div style={{background:blueMain, height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:20, padding:'0 24px', borderRadius:0, width:'100%'}}>
        <div style={{fontWeight:800, fontSize:22, color:'#fff', letterSpacing:0.5}}>Brainest Indonesia</div>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <button onClick={()=>setPaused(p=>!p)} style={{background:'#fff', color:blueMain, fontWeight:700, fontSize:16, border:'none', borderRadius:10, padding:'8px 28px', marginRight:10, boxShadow:`0 1.5px 6px ${blueMain}22`, cursor:'pointer', minWidth:90}}>{paused ? 'Lanjut' : 'Pause'}</button>
          <button onClick={()=>setShowConfirm(true)} style={{background:'#fff', color:blueMain, fontWeight:700, fontSize:16, border:'none', borderRadius:10, padding:'8px 28px', boxShadow:`0 1.5px 6px ${blueMain}22`, cursor:'pointer', minWidth:120}}>Akhiri Try Out</button>
        </div>
      </div>
      {/* Main Content */}
      <div style={{display:'flex', justifyContent:'center', alignItems:'flex-start', gap:40, maxWidth:1400, margin:'18px auto 0 auto', padding:'0 8px', height:'calc(100vh - 60px - 56px)', boxSizing:'border-box'}}>
        {/* Soal */}
        <div style={{flex:2, maxWidth:800, height:'100%', overflowY:'auto'}}>
          <div style={{background:'#fff', borderRadius:12, boxShadow:`0 1.5px 6px ${blueMain}11`, border:`1px solid ${grayBorder}`, padding:'22px 18px', minHeight:320, height:'auto', marginBottom:24}}>
            <div style={{color:blueMain, fontWeight:700, fontSize:16, marginBottom:8, textTransform:'uppercase', letterSpacing:0.3}}>SOAL NO. {questions[current].number}</div>
            <div style={{color:'#222', fontWeight:400, fontSize:15, marginBottom:12, lineHeight:1.6}}> {questions[current].text.split('\n').map((t,i)=>(<div key={i} style={{marginBottom:4}}>{t}</div>))} </div>
            <div style={{display:'flex', flexDirection:'column', gap:8, margin:'18px 0'}}>
              {questions[current].options.map((opt, idx) => (
                <label key={idx} style={{display:'flex', alignItems:'center', borderRadius:8, border: answers[current]===idx ? `2px solid ${blueMain}` : `1px solid ${grayBorder}`, background: answers[current]===idx ? blueMain : '#f8fbff', padding:'10px 12px', fontWeight:500, fontSize:14, color: answers[current]===idx ? '#fff' : '#222', cursor:'pointer', boxShadow: answers[current]===idx ? `0 1.5px 6px ${blueMain}22` : 'none', transition:'all 0.18s', margin:'0 0 8px 0'}}>
                  <span style={{
                    display:'inline-block',
                    width:18,
                    height:18,
                    minWidth:18,
                    minHeight:18,
                    borderRadius:'50%',
                    border:`2px solid ${blueMain}`,
                    background:'#fff',
                    marginRight:10,
                    position:'relative',
                  }}>
                    {answers[current]===idx && (
                      <span style={{
                        display:'block',
                        width:10,
                        height:10,
                        borderRadius:'50%',
                        background:blueMain,
                        position:'absolute',
                        top:2.5,
                        left:2.5,
                      }}></span>
                    )}
                  </span>
                  {opt}
                </label>
              ))}
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6}}>
              <button
                onClick={handleFlag}
                style={{
                  background: flags[current] ? blueMain : blueSoft,
                  color: flags[current] ? '#fff' : blueMain,
                  fontWeight:600,
                  fontSize:13,
                  border:'none',
                  borderRadius:6,
                  padding:'6px 14px',
                  cursor:'pointer',
                  height:30,
                  transition:'all 0.18s',
                }}
              >
                {flags[current] ? 'Batalkan Ragu-Ragu' : 'Tandai Ragu-Ragu'}
              </button>
            </div>
          </div>
        </div>
        {/* Palette & Legend */}
        <div style={{flex:1, maxWidth:270, minWidth:180, height:'100%', overflowY:'auto'}}>
          {/* Timer Card */}
          <div style={{background:bluePastel, borderRadius:12, padding:'14px 0', marginBottom:14, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <span style={{fontWeight:700, fontSize:28, color:blueMain, letterSpacing:1}}>{formatTime(timeLeft)}</span>
          </div>
          <div style={{background:bluePastel, borderRadius:10, boxShadow:`0 1px 4px ${blueMain}11`, border:`1px solid ${grayBorder}`, padding:'14px 8px 8px 8px', marginBottom:10}}>
            <div style={{fontWeight:600, color:blueMain, fontSize:14, marginBottom:10, textAlign:'center'}}>Navigasi Soal</div>
            <div className="palette-grid" style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:7, justifyItems:'center'}}>
              {questions.map((q, i) => (
                <button key={i} onClick={()=>goTo(i)} style={{width:28, height:28, borderRadius:6, fontWeight:600, fontSize:13, outline:'none', cursor:'pointer', padding:0, margin:0, ...getPaletteStyle(i)}}>{i+1}</button>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div style={{background:bluePastel, borderRadius:10, boxShadow:`0 1px 4px ${blueMain}11`, border:`1px solid ${grayBorder}`, padding:'10px 8px', fontSize:13}}>
            <div style={{fontWeight:600, color:blueMain, marginBottom:6, fontSize:13}}>Keterangan Warna</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 10px'}}>
              <div style={{display:'flex', alignItems:'center', gap:5}}>
                <span style={{width:13, height:13, borderRadius:3, background:blueMain, border:`1.5px solid ${blueMain}`}}></span>
                <span style={{fontWeight:600, color:blueMain}}>Dijawab</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:5}}>
                <span style={{width:13, height:13, borderRadius:3, background:'#fff', border:`1.5px solid ${grayBorder}`}}></span>
                <span style={{fontWeight:600, color:grayText}}>Belum Dijawab</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:5}}>
                <span style={{width:13, height:13, borderRadius:3, background:'#cfe6ff', border:`1.5px solid #90caf9`}}></span>
                <span style={{fontWeight:600, color:blueMain}}>Ragu-ragu</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:5}}>
                <span style={{width:13, height:13, borderRadius:3, background:'#fff', border:`1.5px solid ${blueMain}`}}></span>
                <span style={{fontWeight:600, color:blueMain}}>Posisi Saat Ini</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <div style={{position:'fixed', left:0, bottom:0, width:'100%', background:'#fff', borderTop:`1px solid ${grayBorder}`, boxShadow:`0 -1.5px 8px ${blueMain}11`, display:'flex', alignItems:'center', justifyContent:'space-between', height:56, zIndex:30, padding:'0 24px'}}>
        <button
          onClick={prev}
          disabled={current===0}
          style={{
            background:blueMain,
            color:'#fff',
            fontWeight:600,
            fontSize:15,
            border:'none',
            borderRadius:8,
            padding:'10px 24px',
            height:36,
            margin:'0',
            opacity:current===0?0.5:1,
            cursor:current===0?'not-allowed':'pointer',
            display:'flex',
            alignItems:'center',
            gap:8,
            minWidth:100,
            transition:'all 0.18s',
          }}
          onMouseOver={e => { if (current!==0) { e.currentTarget.style.background = '#2563eb'; } }}
          onMouseOut={e => { if (current!==0) { e.currentTarget.style.background = blueMain; } }}
        >
          <span style={{fontSize:18, display:'inline-block', transform:'rotate(180deg)', color:'#fff'}}>&#10140;</span> <span style={{fontWeight:600}}>Sebelumnya</span>
        </button>
        <div style={{fontWeight:600, fontSize:15, color:blueMain, minWidth:60, textAlign:'center'}}>{current+1} / {questions.length}</div>
        <button
          onClick={next}
          disabled={current===questions.length-1}
          style={{
            background:blueMain,
            color:'#fff',
            fontWeight:600,
            fontSize:15,
            border:'none',
            borderRadius:8,
            padding:'10px 24px',
            height:36,
            margin:'0',
            opacity:current===questions.length-1?0.5:1,
            cursor:current===questions.length-1?'not-allowed':'pointer',
            display:'flex',
            alignItems:'center',
            gap:8,
            minWidth:100,
            transition:'all 0.18s',
          }}
          onMouseOver={e => { if (current!==questions.length-1) { e.currentTarget.style.background = '#2563eb'; } }}
          onMouseOut={e => { if (current!==questions.length-1) { e.currentTarget.style.background = blueMain; } }}
        >
          <span style={{fontWeight:600}}>Selanjutnya</span> <span style={{fontSize:18, color:'#fff'}}>&#10140;</span>
        </button>
      </div>
      {/* Responsive palette grid */}
      <style>{`
        @media (max-width: 900px) {
          .palette-grid { grid-template-columns: repeat(7, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .palette-grid { grid-template-columns: repeat(10, 1fr) !important; overflow-x: auto !important; }
        }
        @media (max-width: 600px) {
          .palette-grid { grid-template-columns: repeat(15, 1fr) !important; overflow-x: auto !important; }
          .palette-grid button { min-width: 22px !important; }
        }
        @media (max-width: 900px) {
          div[style*='maxWidth:1400px'] { flex-direction: column !important; gap: 0 !important; }
          div[style*='maxWidth:800px'] { max-width: 100% !important; }
          div[style*='maxWidth:270px'] { max-width: 100% !important; margin-top: 14px !important; }
        }
        @media (max-width: 600px) {
          div[style*='padding:22px 18px'] { padding: 8px 2px 6px 2px !important; }
          div[style*='padding:14px 8px 8px 8px'] { padding: 4px 2px 2px 2px !important; }
          div[style*='padding:10px 8px'] { padding: 2px 2px !important; }
          .palette-grid { font-size: 11px !important; }
        }
      `}</style>
      {/* Modal Konfirmasi Akhiri Tryout */}
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={()=>setShowConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 36, minWidth: 340, textAlign: 'center', boxShadow: '0 4px 32px #2222', maxWidth: 420 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 12, color: '#222' }}>Apakah Kamu Yakin?</div>
            <div style={{ fontSize: 18, marginBottom: 18, color: '#444' }}>Setelah mengakhiri Try Out, Kamu tidak dapat lagi mengerjakan soal ini.</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 18, fontSize: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: recapBlue, whiteSpace: 'nowrap', fontWeight:700 }}>
                <span style={{fontSize:22,marginRight:2,verticalAlign:'middle',color:recapBlue}}>●</span>
                Dijawab: {answeredCount}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: recapBlueSoft, whiteSpace: 'nowrap', fontWeight:700 }}>
                <span style={{fontSize:22,marginRight:2,verticalAlign:'middle',color:recapBlueSoft}}>●</span>
                Ragu-ragu: {raguCount}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: recapGrayText, whiteSpace: 'nowrap', fontWeight:700 }}>
                <span style={{fontSize:22,marginRight:2,verticalAlign:'middle',color:recapWhite, WebkitTextStroke:'1px #bbb'}}>●</span>
                Tidak Dijawab: {belumCount}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 18 }}>
              <button onClick={()=>setShowConfirm(false)} style={{ background: '#fff', color: blueMain, border: `2px solid ${blueMain}`, borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Batal</button>
              <button onClick={()=>{/* TODO: submit/akhiri tryout */}} style={{ background: blueMain, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>Ya, Akhiri</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface; 