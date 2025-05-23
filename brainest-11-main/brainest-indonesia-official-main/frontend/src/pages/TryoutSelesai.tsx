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

const UNIVERSITY_LOGOS = {
  'Universitas Indonesia': 'https://www.pngkit.com/png/full/406-4061748_logo-ui-png-universitas-indonesia.png',
  // Tambahkan mapping lain sesuai kebutuhan
};

const SUBTEST_SHORT = [
  'PU', // Penalaran Umum
  'PPU', // Pengetahuan & Pemahaman Umum
  'PBM', // Pemahaman Bacaan & Menulis
  'PK', // Pengetahuan Kuantitatif
  'LI', // Literasi Indonesia
  'LE', // Literasi Inggris
  'PM', // Penalaran Matematika
];

const TryoutSelesai: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answered = 0, flagged = 0, unanswered = 0 } = location.state || {};
  const [tab, setTab] = useState("Nilai");
  const [expand, setExpand] = useState({});
  const isLulus = MOCK_RESULT.status === 'LULUS';

  const benar = MOCK_RESULT.evaluasi.filter(e => e.benar).length;
  const salah = MOCK_RESULT.evaluasi.filter(e => e.benar === false).length;
  const kosong = MOCK_RESULT.evaluasi.filter(e => !e.jawabanUser).length;

  const radarData = {
    labels: SUBTEST_SHORT,
    datasets: [
      {
        label: 'Skor Subtes',
        data: MOCK_RESULT.analisa.data,
        backgroundColor: 'rgba(34,211,238,0.18)',
        borderColor: '#22d3ee',
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#22d3ee',
        borderWidth: 3,
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
        angleLines: { display: true, color: '#38bdf8' },
        grid: { color: '#334155' },
        pointLabels: { color: '#fff', font: { size: 18, weight: 'bold' } },
        min: 0,
        max: 100,
        ticks: { color: '#cbd5e1', stepSize: 20, backdropColor: 'transparent', font: { size: 14 } },
      },
    },
  };

  const progress = Math.min(100, Math.round((MOCK_RESULT.nilai / MOCK_RESULT.passing) * 100));
  const userRank = MOCK_LEADERBOARD.find(l => l.isUser)?.posisi || 4;
  const minIdx = MOCK_RESULT.analisa.data.indexOf(Math.min(...MOCK_RESULT.analisa.data));
  const maxIdx = MOCK_RESULT.analisa.data.indexOf(Math.max(...MOCK_RESULT.analisa.data));
  const subtestLemah = SUBTEST_SHORT[minIdx];
  const subtestKuat = SUBTEST_SHORT[maxIdx];
  const waktuLama = MOCK_RESULT.waktuSubtest.reduce((a,b)=>a.waktu>b.waktu?a:b);
  const waktuCepat = MOCK_RESULT.waktuSubtest.reduce((a,b)=>a.waktu<b.waktu?a:b);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/30 font-display p-0 flex flex-col items-center justify-start">
      <div className="max-w-4xl w-full mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 drop-shadow text-center tracking-tight">Analisa Try Out</h1>
        {/* Tab Navigation */}
        <div className="flex justify-center gap-3 mb-8 sticky top-0 z-20 bg-transparent">
          {["Nilai", "Pembahasan", "Analisis Kemampuan"].map(t => (
            <button
              key={t}
              onClick={()=>setTab(t)}
              className={`px-5 py-2 md:px-8 md:py-2.5 rounded-lg font-bold text-base transition-all duration-200 shadow-md border-2 ${tab===t ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white border-cyan-400 scale-105 shadow-cyan-400/30' : 'bg-[#10172a]/70 text-cyan-200 border-cyan-800 hover:bg-cyan-900/30 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        {tab==="Nilai" && (
          <div className="bg-[#10172a]/90 rounded-2xl shadow-2xl border-2 border-cyan-400 p-8 flex flex-col items-center w-full max-w-3xl mx-auto mt-12">
            {/* Logo & Info Kampus */}
            <img
              src={UNIVERSITY_LOGOS[MOCK_RESULT.kampus] || ''}
              alt={MOCK_RESULT.kampus}
              className="w-28 h-28 object-contain mb-4 drop-shadow-lg"
              style={{background:'#fff',borderRadius:24,padding:14}}
            />
            <div className="font-bold text-white text-2xl mb-1 text-center">{MOCK_RESULT.kampus}</div>
            <div className="text-cyan-300 font-semibold text-lg mb-2 text-center">{MOCK_RESULT.jurusan}</div>
            <div className="text-5xl font-extrabold text-cyan-400 mb-1 text-center">{MOCK_RESULT.nilai}</div>
            <div className={`font-bold text-lg mb-1 text-center ${isLulus ? 'text-green-400' : 'text-red-400'}`}>{MOCK_RESULT.status}</div>
            <div className="text-cyan-200 text-base mb-2 text-center">Passing Grade: <span className="text-cyan-400 font-bold">{MOCK_RESULT.passing}</span></div>
            <div className="bg-cyan-900/60 text-cyan-200 font-bold text-sm rounded-lg px-5 py-1.5 shadow border border-cyan-700 mb-2">#{userRank} Nasional</div>
            {/* Statistik Jawaban */}
            <div className="mt-2 mb-4 flex flex-wrap gap-6 justify-center items-center text-lg font-bold">
              <span className="text-cyan-400">Benar: {benar}</span>
              <span className="text-pink-400">Salah: {salah}</span>
            </div>
            {/* Statistik Subtes (Radar) */}
            <div className="font-bold text-cyan-400 text-xl mt-12 mb-4 text-center">Statistik Subtes</div>
            <div className="w-full max-w-xl mb-8 flex flex-col items-center">
              <Radar data={radarData} options={{
                ...radarOptions,
                scales: {
                  ...radarOptions.scales,
                  r: {
                    ...radarOptions.scales.r,
                    pointLabels: {
                      ...radarOptions.scales.r.pointLabels,
                      font: { size: 20, weight: 700 },
                    },
                    ticks: {
                      ...radarOptions.scales.r.ticks,
                      font: { size: 14 },
                    },
                  },
                },
              }} />
            </div>
            <div className="w-full max-w-md mx-auto">
              <div className="font-semibold text-cyan-400 text-base mb-2 text-center">Waktu Pengerjaan per Subtes</div>
              <table className="w-full text-base">
                <tbody>
                  {MOCK_RESULT.waktuSubtest.map((w,i)=>(
                    <tr key={i}>
                      <td className="py-2 text-cyan-100 text-base font-bold text-center">{SUBTEST_SHORT[i]}</td>
                      <td className="py-2 text-right font-bold text-cyan-300 text-base">{formatTime(w.waktu)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab==="Pembahasan" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            {MOCK_RESULT.evaluasi.map((row,i)=>(
              <div key={i} className="bg-[#10172a]/90 rounded-xl shadow-xl border-2 border-cyan-400 p-6 flex flex-col gap-2">
                <div className="font-bold text-cyan-400 text-base mb-1">SOAL NO. {row.no}</div>
                <div className="text-white text-sm mb-2">{row.soal}</div>
                <div className="flex flex-wrap gap-3 items-center mb-2">
                  <span className={`px-3 py-1 rounded-lg font-bold text-sm ${row.benar ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>Status: {row.benar ? 'BENAR' : 'SALAH'}</span>
                  <span className="text-cyan-200 font-semibold text-sm">Jawaban Kamu: <span className="font-bold text-white">{row.jawabanUser}</span></span>
                  <span className="text-cyan-200 font-semibold text-sm">Jawaban Benar: <span className="font-bold text-white">{row.kunci}</span></span>
                </div>
                <div className="text-cyan-100 text-sm"><span className="font-bold">Pembahasan:</span> {row.pembahasan}</div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all border border-cyan-900 text-base text-center"
                onClick={()=>alert('Fitur download PDF akan segera tersedia!')}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
        {tab==="Analisis Kemampuan" && (
          <div className="bg-[#10172a]/90 rounded-xl shadow-xl border-2 border-cyan-400 p-6 max-w-3xl mx-auto text-white">
            <div className="font-bold text-cyan-400 text-lg mb-3">Analisis Kemampuan</div>
            <div className="mb-3">
              <span className="font-bold text-cyan-300">Kelebihan:</span>
              <ul className="list-disc pl-5 text-cyan-100 space-y-1 text-sm">
                <li>Kuat di subtes <span className="text-cyan-400 font-bold">{subtestKuat}</span> (skor tertinggi).</li>
                <li>Waktu tercepat di subtes <span className="text-cyan-400 font-bold">{waktuCepat.nama}</span> ({formatTime(waktuCepat.waktu)}).</li>
                <li>Sudah memenuhi passing grade.</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-pink-300">Kekurangan:</span>
              <ul className="list-disc pl-5 text-pink-100 space-y-1 text-sm">
                <li>Perlu latihan lebih pada subtes <span className="text-pink-400 font-bold">{subtestLemah}</span> (skor terendah).</li>
                <li>Waktu terlalu lama di subtes <span className="text-pink-400 font-bold">{waktuLama.nama}</span> ({formatTime(waktuLama.waktu)}).</li>
                <li>Perbanyak latihan soal dan review pembahasan untuk subtes lemah.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      {/* Tombol Kembali ke Dashboard di bawah semua konten */}
      <div className="w-full flex justify-center mt-12 mb-6 z-10">
        <a
          href="/dashboard"
          className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all border border-cyan-900 text-base text-center"
        >
          Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
};

export default TryoutSelesai; 