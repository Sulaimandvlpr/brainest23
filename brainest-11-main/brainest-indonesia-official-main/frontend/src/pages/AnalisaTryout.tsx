import React from "react";
import { useNavigate } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const radarData = {
  labels: [
    "Penalaran Umum",
    "Pengetahuan dan Pemahaman Umum",
    "Kemampuan Memahami Bacaan dan Menulis",
    "Pengetahuan Kuantitatif",
    "Literasi dalam Bahasa Indonesia",
    "Literasi dalam Bahasa Inggris",
    "Penalaran Matematika",
  ],
  datasets: [
    {
      label: "Nilai Subtest",
      data: [80, 70, 90, 85, 75, 60, 95],
      backgroundColor: "rgba(79, 157, 255, 0.15)",
      borderColor: "#4F9DFF",
      pointBackgroundColor: "#4F9DFF",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#4F9DFF",
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
      angleLines: { display: false },
      suggestedMin: 0,
      suggestedMax: 100,
      pointLabels: {
        font: { size: 13, family: 'Inter, Roboto, Arial, sans-serif' },
        color: '#444',
      },
      ticks: {
        display: false,
      },
      grid: {
        color: '#e5e7eb',
      },
    },
  },
};

const AnalisaTryout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', padding: '0 0 48px 0' }}>
      <div style={{ fontWeight: 800, fontSize: 32, color: '#222', margin: '0 0 32px 0', padding: '32px 0 0 48px', letterSpacing: 0.5 }}>
        Analisa Try Out
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'stretch', background: 'none', flexWrap: 'wrap' }}>
        {/* Card utama */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px #3f8cff11', padding: 32, display: 'flex', gap: 32, width: '100%', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {/* Radar Chart */}
          <div style={{ flex: 1, minWidth: 320, maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radar data={radarData} options={radarOptions} style={{ maxWidth: 380, maxHeight: 380 }} />
          </div>
          {/* Info Kampus/Jurusan/Nilai/Status */}
          <div style={{ flex: 1, minWidth: 320, maxWidth: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 18, color: '#444', marginBottom: 6 }}>Target Perguruan Tinggi</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#222', marginBottom: 16, lineHeight: 1.3 }}>UNIVERSITAS INDONESIA</div>
            <div style={{ fontSize: 18, color: '#444', marginBottom: 6 }}>Target Jurusan</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 24 }}>ILMU KOMPUTER</div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ background: '#f4f7fa', borderRadius: 12, padding: '18px 32px', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 16, color: '#888', fontWeight: 600, marginBottom: 4 }}>Nilai</div>
                <div style={{ fontWeight: 800, fontSize: 32, color: '#222' }}>800</div>
              </div>
              <div style={{ background: '#f4f7fa', borderRadius: 12, padding: '18px 32px', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 16, color: '#888', fontWeight: 600, marginBottom: 4 }}>Status</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#fff', background: '#22bb33', borderRadius: 8, padding: '4px 18px', display: 'inline-block' }}>LULUS</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <button onClick={() => navigate('/')} style={{ background: '#4F9DFF', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>Kembali ke Beranda</button>
              <button onClick={() => navigate('/tryout-selesai')} style={{ background: '#fff', color: '#4F9DFF', border: '2px solid #4F9DFF', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>Lihat Pembahasan</button>
            </div>
          </div>
        </div>
      </div>
      {/* Detail Hasil (dummy) */}
      <div style={{ maxWidth: 1200, margin: '36px auto 0 auto', padding: '0 16px' }}>
        <div style={{ fontWeight: 800, fontSize: 28, color: '#222', margin: '32px 0 18px 0' }}>Detail Hasil</div>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #3f8cff11', padding: 32, marginBottom: 24 }}>
          <div style={{ color: '#5B3DF6', fontWeight: 700, fontSize: 18, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>SOAL NO. 1</div>
          <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 8 }}>[...]</div>
          <div style={{ color: '#444', fontWeight: 400, fontSize: 15, marginBottom: 12, lineHeight: 1.6 }}>
            (1) Pendidikan kita saat ini setidaknya dihadapkan [...] tiga masalah besar. (2) Masalah tersebut terkait dengan mutu, motivasi, dan pemerataan pendidikan. (3) Secara umum, saat ini pendidikan kita lebih menjalankan akumulasi pengetahuan yang bersifat [...], daripada penguasaan keterampilan dan pembentukan kepribadian. (4) Pola motivasi sebagian besar peserta didik lebih kepada penampilan daripada pencapaian. (5) Bentuk motivasi ini lebih mengutamakan ijazah atau gelar daripada [...] yang benar-benar dikuasai atau mampu dikerjakan. (6) Pendidikan kita belum berhasil meningkatkan kualitas hasil belajar sebagian besar peserta didik yang umumnya [...] sedang atau kurang. (7) Pendidikan kita mungkin baru berhasil meningkatkan kemampuan peserta didik yang merupakan bibit unggul.
          </div>
          <a href="#" style={{ color: '#3B82F6', fontWeight: 700, fontSize: 15, textDecoration: 'none', marginBottom: 12, display: 'inline-block' }}>Selengkapnya</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
            <span style={{ fontWeight: 600, color: '#888', fontSize: 15 }}>Status:</span>
            <span style={{ background: '#C6F6D5', color: '#22bb33', fontWeight: 700, borderRadius: 6, padding: '4px 16px', fontSize: 15 }}>BENAR</span>
            <span style={{ fontWeight: 600, color: '#888', fontSize: 15 }}>Jawaban Kamu:</span>
            <span style={{ fontWeight: 700, color: '#222', fontSize: 15 }}>B</span>
          </div>
        </div>
        {/* Tambah soal lain jika perlu */}
      </div>
    </div>
  );
};

export default AnalisaTryout; 