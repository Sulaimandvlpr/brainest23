import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Dummy ilustrasi SVG
const ExamIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mx-auto mb-6">
    <rect x="10" y="30" width="100" height="60" rx="12" fill="#38bdf8" opacity="0.15" />
    <rect x="25" y="45" width="70" height="30" rx="6" fill="#38bdf8" opacity="0.3" />
    <circle cx="60" cy="60" r="12" fill="#0ea5e9" opacity="0.5" />
    <rect x="50" y="80" width="20" height="8" rx="2" fill="#0ea5e9" opacity="0.7" />
  </svg>
);

export default function ExamRules() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rules, setRules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy fetch, ganti ke endpoint asli jika sudah ada
    setLoading(true);
    setTimeout(() => {
      setRules([
        'Dilarang membuka tab lain selama ujian berlangsung.',
        'Waktu ujian berjalan otomatis dan tidak dapat dijeda.',
        'Refresh atau keluar dari halaman akan mengurangi waktu ujian.',
        'Pastikan koneksi internet stabil.',
        'Setelah waktu habis, jawaban akan otomatis dikumpulkan.',
      ]);
      setLoading(false);
    }, 600);
  }, [id]);

  const handleStart = () => {
    navigate(`/exam/${id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/30 p-4">
      <Card className="max-w-xl w-full mx-auto p-8 rounded-2xl shadow-2xl border-2 border-cyan-400 bg-[#10172a]/90 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-300 mb-2 text-center">Peraturan Ujian</h1>
        <div className="text-cyan-100 text-lg mb-6 text-center">Baca dan pahami tata tertib sebelum memulai tryout.</div>
        <ExamIllustration />
        {loading ? (
          <div className="text-cyan-200 text-center my-8">Memuat peraturan...</div>
        ) : (
          <ul className="list-decimal pl-6 text-cyan-100 space-y-2 mb-8 w-full text-left">
            {rules.map((rule, i) => (
              <li key={i} className="text-base md:text-lg">{rule}</li>
            ))}
          </ul>
        )}
        <Button
          size="lg"
          className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all border border-cyan-900 text-xl mt-2"
          onClick={handleStart}
          disabled={loading}
        >
          Mulai Ujian
        </Button>
      </Card>
    </div>
  );
} 