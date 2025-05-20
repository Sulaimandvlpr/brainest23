import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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

// Data mock hasil
const MOCK_RESULT = {
  name: 'UTBK Saintek 2023',
  score: 720,
  benar: 15,
  salah: 5,
  peringkat: 12,
  totalPeserta: 120,
  evaluasi: [
    { no: 1, soal: 'Apa ibu kota Indonesia?', jawabanUser: 'Jakarta', kunci: 'Jakarta', benar: true },
    { no: 2, soal: '2 + 2 = ?', jawabanUser: '5', kunci: '4', benar: false },
    { no: 3, soal: 'Siapa presiden pertama RI?', jawabanUser: 'Soekarno', kunci: 'Soekarno', benar: true },
    // ... tambahkan data mock lain sesuai kebutuhan
  ],
  analisa: {
    labels: [
      'Penalaran Umum',
      'Pengetahuan dan Pemahaman Umum',
      'Kemampuan Memahami Bacaan dan Menulis',
      'Pengetahuan Kuantitatif',
      'Literasi dalam Bahasa Indonesia',
      'Literasi dalam Bahasa Inggris',
      'Penalaran Matematika',
    ],
    data: [60, 70, 55, 80, 65, 50, 75], // skor per subtes (0-100)
  }
};

export default function ExamResultFull() {
  const radarData = {
    labels: MOCK_RESULT.analisa.labels,
    datasets: [
      {
        label: 'Skor Subtes',
        data: MOCK_RESULT.analisa.data,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: 'rgba(34,211,238,1)',
        pointBackgroundColor: 'rgba(34,211,238,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34,211,238,1)',
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

  return (
    <div className="container mx-auto p-6 flex flex-col items-center min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Hasil Tryout: {MOCK_RESULT.name}</h2>
        <div className="flex justify-around mb-8 gap-4 flex-wrap">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-cyan-600 mb-1">{MOCK_RESULT.score}</div>
            <div className="text-sm text-gray-500">Skor Akhir</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{MOCK_RESULT.benar}</div>
            <div className="text-sm text-gray-500">Benar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{MOCK_RESULT.salah}</div>
            <div className="text-sm text-gray-500">Salah</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-700 mb-1">#{MOCK_RESULT.peringkat}</div>
            <div className="text-sm text-gray-500">Peringkat dari {MOCK_RESULT.totalPeserta}</div>
          </div>
        </div>
        {/* Analisa Tryout */}
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Analisa Tryout</h3>
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md bg-white rounded-xl p-4 shadow border border-cyan-100">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Evaluasi Jawaban</h3>
        <div className="overflow-x-auto rounded-lg border border-cyan-100 mb-6">
          <table className="min-w-full text-sm">
            <thead className="bg-cyan-50">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Soal</th>
                <th className="px-3 py-2 text-left">Jawaban Kamu</th>
                <th className="px-3 py-2 text-left">Kunci</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RESULT.evaluasi.map((ev, i) => (
                <tr key={i} className={ev.benar ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="px-3 py-2 font-bold">{ev.no}</td>
                  <td className="px-3 py-2">{ev.soal}</td>
                  <td className={`px-3 py-2 ${ev.benar ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}`}>{ev.jawabanUser}</td>
                  <td className="px-3 py-2">{ev.kunci}</td>
                  <td className="px-3 py-2 text-center">
                    {ev.benar ? <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">Benar</span> : <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full font-semibold">Salah</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button asChild className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl">
          <Link to="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  );
} 