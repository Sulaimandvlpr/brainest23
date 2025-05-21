import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Confetti simple
const Confetti = () => (
  <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:9999}}>
    {[...Array(60)].map((_,i)=>(
      <div key={i} style={{position:'absolute',left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,width:10,height:10,borderRadius:3,background:["#4F9DFF","#22c55e","#facc15","#f472b6"][i%4],opacity:0.7,animation:`fall${i%5} 2.5s linear infinite`,animationDelay:`${i*0.1}s`}} />
    ))}
    <style>{`
      @keyframes fall0 { 0%{transform:translateY(-100px);} 100%{transform:translateY(100vh);} }
      @keyframes fall1 { 0%{transform:translateY(-80px);} 100%{transform:translateY(100vh);} }
      @keyframes fall2 { 0%{transform:translateY(-120px);} 100%{transform:translateY(100vh);} }
      @keyframes fall3 { 0%{transform:translateY(-60px);} 100%{transform:translateY(100vh);} }
      @keyframes fall4 { 0%{transform:translateY(-140px);} 100%{transform:translateY(100vh);} }
    `}</style>
  </div>
);

const MOCK_RESULT = {
  kampus: 'Universitas Indonesia',
  jurusan: 'Teknik Informatika',
  score: 720,
  status: 'LULUS',
  nilai: 720,
  passing: 690,
  evaluasi: [
    { no: 1, soal: 'Apa ibu kota Indonesia?', jawabanUser: 'Jakarta', kunci: 'Jakarta', benar: true, pembahasan: 'Ibu kota Indonesia adalah Jakarta.' },
    { no: 2, soal: '2 + 2 = ?', jawabanUser: '5', kunci: '4', benar: false, pembahasan: '2 + 2 = 4. Jawaban kamu salah.' },
    { no: 3, soal: 'Siapa presiden pertama RI?', jawabanUser: 'Soekarno', kunci: 'Soekarno', benar: true, pembahasan: 'Presiden pertama RI adalah Ir. Soekarno.' },
  ],
  analisa: {
    labels: [
      'Penalaran Umum',
      'Pengetahuan & Pemahaman Umum',
      'Pemahaman Bacaan & Menulis',
      'Pengetahuan Kuantitatif',
      'Literasi Indonesia',
      'Literasi Inggris',
      'Penalaran Matematika',
    ],
    data: [60, 70, 55, 80, 65, 50, 75],
  },
  waktuSubtest: [
    { nama: 'Penalaran Umum', waktu: 18*60 },
    { nama: 'Pengetahuan & Pemahaman Umum', waktu: 12*60 },
    { nama: 'Pemahaman Bacaan & Menulis', waktu: 10*60 },
    { nama: 'Pengetahuan Kuantitatif', waktu: 15*60 },
    { nama: 'Literasi Indonesia', waktu: 13*60 },
    { nama: 'Literasi Inggris', waktu: 14*60 },
    { nama: 'Penalaran Matematika', waktu: 18*60 },
  ]
};

const MOCK_LEADERBOARD = [
  { nama: 'Sulaiman', skor: 855, badge: 'Challenger', posisi: 1 },
  { nama: 'Siti', skor: 770, badge: 'Challenger', posisi: 2 },
  { nama: 'Rizky', skor: 765, badge: 'Challenger', posisi: 3 },
  { nama: 'Kamu', skor: 720, badge: 'Master', posisi: 4, isUser: true },
  { nama: 'Edwin', skor: 710, badge: 'Master', posisi: 5 },
  { nama: 'Ayu', skor: 700, badge: 'Gold', posisi: 6 },
  { nama: 'Budi', skor: 690, badge: 'Gold', posisi: 7 },
  { nama: 'Siti', skor: 680, badge: 'Silver', posisi: 8 },
  { nama: 'Rina', skor: 670, badge: 'Silver', posisi: 9 },
  { nama: 'Dewi', skor: 660, badge: 'Bronze', posisi: 10 },
];

const BADGE_COLOR = {
  Challenger: '#facc15',
  Master: '#a78bfa',
  Gold: '#fbbf24',
  Silver: '#60a5fa',
  Bronze: '#f472b6',
};

function formatTime(sec) {
  const m = Math.floor(sec/60); const s = sec%60;
  return `${m}m ${s.toString().padStart(2,'0')}s`;
}

const TABS = ["Nilai", "Pembahasan", "Analisis Kelemahan", "Leaderboard"];

const TryoutSelesai: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answered = 0, flagged = 0, unanswered = 0 } = location.state || {};
  const [tab, setTab] = useState("Nilai");
  const [expand, setExpand] = useState({});
  const isLulus = MOCK_RESULT.status === 'LULUS';

  const radarData = {
    labels: MOCK_RESULT.analisa.labels,
    datasets: [
      {
        label: 'Skor Subtes',
        data: MOCK_RESULT.analisa.data,
        backgroundColor: 'rgba(79,157,255,0.18)',
        borderColor: '#4F9DFF',
        pointBackgroundColor: '#4F9DFF',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4F9DFF',
        borderWidth: 2,
      },
    ],
  };
  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      r: {
        angleLines: { display: true, color: '#e5e7eb' },
        grid: { color: '#e5e7eb' },
        pointLabels: { color: '#334155', font: { size: 14 } },
        min: 0,
        max: 100,
        ticks: { color: '#64748b', stepSize: 20, backdropColor: 'transparent' },
      },
    },
  };

  // Progress bar
  const progress = Math.min(100, Math.round((MOCK_RESULT.nilai / MOCK_RESULT.passing) * 100));
  const userRank = MOCK_LEADERBOARD.find(l => l.isUser)?.posisi || 4;
  const userBadge = MOCK_LEADERBOARD.find(l => l.isUser)?.badge || 'Master';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3eafe 0%, #f8faff 100%)', fontFamily: 'Inter, Poppins, Arial, sans-serif', padding: 0, position:'relative' }}>
      {isLulus && <Confetti />}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 8px 48px 8px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#222', textAlign: 'center', margin: '32px 0 24px 0', letterSpacing: 0.5 }}>Analisa Try Out</h1>
        {/* Tab Navigation */}
        <div style={{ display:'flex', justifyContent:'center', gap:18, marginBottom:32 }}>
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ fontWeight:700, fontSize:17, color:tab===t?'#4F9DFF':'#64748b', background:tab===t?'#eaf3fd':'#fff', border:'none', borderBottom:tab===t?'3px solid #4F9DFF':'2px solid #e5e7eb', borderRadius:8, padding:'10px 28px', cursor:'pointer', transition:'all 0.18s' }}>{t}</button>
          ))}
        </div>
        {/* Tab Content */}
        {tab==="Nilai" && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', alignItems: 'stretch' }}>
            {/* Kiri: Radar Chart + Waktu Subtest */}
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #4F9DFF11', padding: 28, minWidth: 320, flex: 1, maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, color: '#4F9DFF', fontSize: 18, marginBottom: 12 }}>Statistik Subtes</div>
              <div style={{ width: '100%', maxWidth: 340 }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
              <div style={{ marginTop: 18, fontSize: 15, color: '#222', textAlign: 'center' }}>
                <span style={{ fontWeight: 600, color: '#4F9DFF' }}>Dijawab:</span> {answered} &nbsp;|
                <span style={{ fontWeight: 600, color: '#6366f1', marginLeft: 8 }}>Ragu-ragu:</span> {flagged} &nbsp;|
                <span style={{ fontWeight: 600, color: '#aaa', marginLeft: 8 }}>Tidak Dijawab:</span> {unanswered}
              </div>
              {/* Statistik waktu per subtest */}
              <div style={{ marginTop: 18, width:'100%' }}>
                <div style={{ fontWeight:600, color:'#4F9DFF', fontSize:15, marginBottom:6 }}>Waktu Pengerjaan per Subtes</div>
                <table style={{ width:'100%', fontSize:14, borderCollapse:'collapse' }}>
                  <tbody>
                    {MOCK_RESULT.waktuSubtest.map((w,i)=>(
                      <tr key={i}>
                        <td style={{padding:'4px 0',color:'#222'}}>{w.nama}</td>
                        <td style={{padding:'4px 0',color:'#4F9DFF',fontWeight:700,textAlign:'right'}}>{formatTime(w.waktu)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Kanan: Info Kampus/Jurusan/Nilai/Status/Badge/Progress */}
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #4F9DFF11', padding: 28, minWidth: 320, flex: 1, maxWidth: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, color: '#222', fontSize: 20, marginBottom: 8 }}>{MOCK_RESULT.kampus}</div>
              <div style={{ color: '#4F9DFF', fontWeight: 600, fontSize: 16, marginBottom: 12 }}>{MOCK_RESULT.jurusan}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#4F9DFF', marginBottom: 8 }}>{MOCK_RESULT.nilai}</div>
              <div style={{ fontWeight: 600, color: isLulus ? '#22c55e' : '#ef4444', fontSize: 18, marginBottom: 8 }}>{MOCK_RESULT.status}</div>
              <div style={{ color: '#64748b', fontSize: 15, marginBottom: 18 }}>Passing Grade: <span style={{ color: '#4F9DFF', fontWeight: 600 }}>{MOCK_RESULT.passing}</span></div>
              {/* Badge & Progress */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <span style={{ background: BADGE_COLOR[userBadge], color:'#222', fontWeight:700, fontSize:15, borderRadius:8, padding:'6px 18px' }}>{userBadge}</span>
                <span style={{ background:'#eaf3fd', color:'#4F9DFF', fontWeight:700, fontSize:15, borderRadius:8, padding:'6px 18px' }}>#{userRank} Nasional</span>
              </div>
              <div style={{ width:'100%', marginBottom:18 }}>
                <div style={{ fontWeight:600, color:'#64748b', fontSize:14, marginBottom:4 }}>Progress ke Passing Grade</div>
                <div style={{ background:'#eaf3fd', borderRadius:8, height:18, width:'100%', position:'relative', overflow:'hidden' }}>
                  <div style={{ background:'#4F9DFF', width:`${progress}%`, height:'100%', borderRadius:8, transition:'width 0.4s' }}></div>
                  <div style={{ position:'absolute', left:'50%', top:0, transform:'translateX(-50%)', color:'#222', fontWeight:700, fontSize:13, lineHeight:'18px' }}>{progress}%</div>
                </div>
              </div>
              <button onClick={() => navigate("/")} style={{ background: '#4F9DFF', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 12, width: '100%', maxWidth: 260, transition: 'background 0.2s' }}>Kembali ke Beranda</button>
              <button onClick={() => alert('Fitur pembahasan coming soon!')} style={{ background: '#fff', color: '#4F9DFF', border: '2px solid #4F9DFF', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%', maxWidth: 260, transition: 'background 0.2s' }}>Lihat Pembahasan</button>
            </div>
          </div>
        )}
        {tab==="Pembahasan" && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #4F9DFF11', margin: '0 auto', maxWidth: 900, padding: '28px 18px' }}>
            <div style={{ fontWeight: 700, color: '#4F9DFF', fontSize: 18, marginBottom: 18 }}>Pembahasan Soal</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                <thead style={{ background: '#eaf3fd' }}>
                  <tr>
                    <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: 6 }}>No</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: 6 }}>Soal</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: 6 }}>Jawaban Kamu</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: 6 }}>Kunci</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', borderRadius: 6 }}>Status</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', borderRadius: 6 }}>Pembahasan</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RESULT.evaluasi.map((ev, i) => (
                    <React.Fragment key={i}>
                      <tr style={{ background: ev.benar ? '#e0f7fa' : '#ffeaea', cursor:'pointer' }} onClick={()=>setExpand(e=>({...e,[i]:!e[i]}))}>
                        <td style={{ padding: '8px 10px', fontWeight: 700 }}>{ev.no}</td>
                        <td style={{ padding: '8px 10px' }}>{ev.soal}</td>
                        <td style={{ padding: '8px 10px', color: ev.benar ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{ev.jawabanUser}</td>
                        <td style={{ padding: '8px 10px' }}>{ev.kunci}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          {ev.benar ? <span style={{ background: '#bbf7d0', color: '#15803d', padding: '4px 12px', borderRadius: 12, fontWeight: 700 }}>Benar</span> : <span style={{ background: '#fecaca', color: '#b91c1c', padding: '4px 12px', borderRadius: 12, fontWeight: 700 }}>Salah</span>}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color:'#4F9DFF', fontWeight:600 }}>{expand[i] ? 'Tutup' : 'Lihat'}</td>
                      </tr>
                      {expand[i] && (
                        <tr>
                          <td colSpan={6} style={{ background:'#eaf3fd', color:'#222', padding:'14px 18px', borderRadius:8, fontSize:15 }}>{ev.pembahasan}</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab==="Analisis Kelemahan" && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #4F9DFF11', margin: '0 auto', maxWidth: 900, padding: '28px 18px' }}>
            <div style={{ fontWeight: 700, color: '#4F9DFF', fontSize: 18, marginBottom: 18 }}>Analisis Kelemahan</div>
            <div style={{ fontSize:16, color:'#222', marginBottom:12 }}>Subtes dengan skor terendah: <span style={{ color:'#ef4444', fontWeight:700 }}>{MOCK_RESULT.analisa.labels[MOCK_RESULT.analisa.data.indexOf(Math.min(...MOCK_RESULT.analisa.data))]}</span></div>
            <div style={{ fontSize:15, color:'#64748b', marginBottom:18 }}>Saran: Perbanyak latihan dan pelajari materi terkait subtes tersebut. Cek pembahasan soal pada tab <b>Pembahasan</b> untuk memperdalam pemahaman.</div>
            <div style={{ fontWeight:600, color:'#4F9DFF', fontSize:15, marginBottom:6 }}>Distribusi Skor Subtes</div>
            <table style={{ width:'100%', fontSize:14, borderCollapse:'collapse' }}>
              <tbody>
                {MOCK_RESULT.analisa.labels.map((l,i)=>(
                  <tr key={i}>
                    <td style={{padding:'4px 0',color:'#222'}}>{l}</td>
                    <td style={{padding:'4px 0',color:'#4F9DFF',fontWeight:700,textAlign:'right'}}>{MOCK_RESULT.analisa.data[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab==="Leaderboard" && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #4F9DFF11', margin: '0 auto', maxWidth: 900, padding: '28px 18px' }}>
            <div style={{ fontWeight: 700, color: '#4F9DFF', fontSize: 18, marginBottom: 18 }}>Leaderboard Nasional</div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:15 }}>
              <thead style={{ background:'#eaf3fd' }}>
                <tr>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderRadius: 6 }}>Posisi</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: 6 }}>Nama</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderRadius: 6 }}>Skor</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderRadius: 6 }}>Badge</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERBOARD.map((row,i)=>(
                  <tr key={i} style={{ background: row.isUser ? '#e0f2fe' : '#fff', fontWeight: row.isUser ? 700 : 500 }}>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{row.posisi}</td>
                    <td style={{ padding: '8px 10px' }}>{row.nama} {row.isUser && <span style={{ background:'#4F9DFF',color:'#fff',borderRadius:6,padding:'2px 8px',marginLeft:6,fontSize:13 }}>Kamu</span>}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{row.skor}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}><span style={{ background:BADGE_COLOR[row.badge], color:'#222', fontWeight:700, fontSize:14, borderRadius:8, padding:'4px 14px' }}>{row.badge}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          div[style*='maxWidth: 1100px'] { padding: 12px 2vw 32px 2vw !important; }
          div[style*='display: flex'][style*='gap: 32px'] { flex-direction: column !important; gap: 18px !important; }
        }
        @media (max-width: 600px) {
          h1 { font-size: 22px !important; }
          div[style*='padding: 28px 18px'] { padding: 8px 2px !important; }
          div[style*='padding: 28px'] { padding: 12px 4px !important; }
        }
      `}</style>
    </div>
  );
};

export default TryoutSelesai; 