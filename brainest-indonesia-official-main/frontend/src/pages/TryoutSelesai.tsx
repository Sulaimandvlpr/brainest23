import React, { useState } from "react";

// Data dummy leaderboard
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

const TABS = ["Nilai", "Pembahasan", "Analisis Kelemahan", "Leaderboard"];

const TryoutSelesai = () => {
  const [tab, setTab] = useState("Nilai");

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ display:'flex', justifyContent:'center', gap:18, marginBottom:32 }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontWeight:700,
              fontSize:17,
              color:tab===t?'#4F9DFF':'#64748b',
              background:tab===t?'#eaf3fd':'#fff',
              border:'none',
              borderBottom:tab===t?'3px solid #4F9DFF':'2px solid #e5e7eb',
              borderRadius:8,
              padding:'10px 28px',
              cursor:'pointer',
              transition:'all 0.18s'
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {tab === "Nilai" && (
        <div>
          {/* ...kode tab Nilai... */}
        </div>
      )}
      {tab === "Pembahasan" && (
        <div>
          {/* ...kode tab Pembahasan... */}
        </div>
      )}
      {tab === "Analisis Kelemahan" && (
        <div>
          {/* ...kode tab Analisis Kelemahan... */}
        </div>
      )}
      {tab === "Leaderboard" && (
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
  );
};

export default TryoutSelesai; 