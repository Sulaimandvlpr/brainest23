import React, { useState, useEffect, useRef } from 'react';
import SubtestPage from './SubtestPage';

// Struktur subtes dan jumlah soal sesuai standar UTBK
const SUBTESTS = [
  { key: 'PU', name: 'Penalaran Umum', count: 30 },
  { key: 'PBM', name: 'Pemahaman Bacaan dan Menulis', count: 30 },
  { key: 'PPU', name: 'Pengetahuan dan Pemahaman Umum', count: 20 },
  { key: 'MTK', name: 'Matematika', count: 15 },
  { key: 'LBI', name: 'Literasi Bahasa Indonesia', count: 25 },
  { key: 'LBE', name: 'Literasi Bahasa Inggris', count: 20 },
  { key: 'PM', name: 'Penalaran Matematika', count: 20 },
];

// Data dummy soal per subtes
const DUMMY_SOAL = (count, subtest) => {
  // Contoh khusus untuk PK no 1 dan LBI no 2
  if (subtest.key === 'PK') {
    return [
      {
        id: 'PK-1',
        text: 'Perhatikan gambar berikut!\nSebuah balok memiliki panjang 8 cm, lebar 4 cm, dan tinggi 3 cm. Berapakah volume balok tersebut?',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Rectangular_prism.svg/200px-Rectangular_prism.svg.png',
        options: {
          A: '24 cm³',
          B: '32 cm³',
          C: '48 cm³',
          D: '64 cm³',
          E: '96 cm³',
        },
        answer: 'C',
      },
      ...Array(count-1).fill(null).map((_, i) => ({
        id: `PK-${i+2}`,
        text: `Ini adalah soal nomor ${i+2} untuk subtes ${subtest.name}.`,
        image: '',
        options: {
          A: `Opsi A`,
          B: `Opsi B`,
          C: `Opsi C`,
          D: `Opsi D`,
          E: `Opsi E`,
        },
      }))
    ];
  }
  if (subtest.key === 'LBI') {
    return [
      {
        id: 'LBI-1',
        text: 'Ini adalah soal nomor 1 untuk subtes Literasi Bahasa Indonesia.',
        image: '',
        options: {
          A: 'Opsi A',
          B: 'Opsi B',
          C: 'Opsi C',
          D: 'Opsi D',
          E: 'Opsi E',
        },
      },
      {
        id: 'LBI-2',
        text: 'Bacalah teks berikut!\n\n"Pada suatu hari, Andi pergi ke pasar untuk membeli buah-buahan. Ia membeli 2 kg apel dan 1 kg jeruk. Setelah itu, Andi pulang ke rumah dan membagikan buah tersebut kepada keluarganya."\n\nPertanyaan: Apa yang dilakukan Andi setelah membeli buah-buahan?',
        image: '',
        options: {
          A: 'Andi makan buah di pasar',
          B: 'Andi pulang ke rumah',
          C: 'Andi membeli sayur',
          D: 'Andi pergi ke sekolah',
          E: 'Andi menjual buah',
        },
        answer: 'B',
      },
      ...Array(count-2).fill(null).map((_, i) => ({
        id: `LBI-${i+3}`,
        text: `Ini adalah soal nomor ${i+3} untuk subtes ${subtest.name}.`,
        image: '',
        options: {
          A: `Opsi A`,
          B: `Opsi B`,
          C: `Opsi C`,
          D: `Opsi D`,
          E: `Opsi E`,
        },
      }))
    ];
  }
  // Default
  return Array(count).fill(null).map((_, i) => ({
    id: `${subtest.key}-${i+1}`,
    text: `Ini adalah soal nomor ${i+1} untuk subtes ${subtest.name}.`,
    image: '',
    options: {
      A: `Opsi A`,
      B: `Opsi B`,
      C: `Opsi C`,
      D: `Opsi D`,
      E: `Opsi E`,
    },
  }));
};

function getAuthToken() {
  return localStorage.getItem('authToken') || '';
}

export default function ExamLayout() {
  const [activeSubtest, setActiveSubtest] = useState(0); // index SUBTESTS
  const [lockedSubtests, setLockedSubtests] = useState<boolean[]>(SUBTESTS.map(() => false));
  const [answers, setAnswers] = useState<Record<string, any>>({}); // {subtestKey: {soalIndex: {answer, ragu}}}
  const [timers, setTimers] = useState<number[]>(SUBTESTS.map(() => 0)); // detik
  const [soalPerSubtest, setSoalPerSubtest] = useState<Record<string, any[]>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useDummy, setUseDummy] = useState(false);
  const [cheatCount, setCheatCount] = useState(0);
  const [cheatWarning, setCheatWarning] = useState('');
  const maxCheat = 3;
  const autoSubmitRef = useRef(false);

  useEffect(() => {
    async function fetchSoal() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/tryout/start?category=TPS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.attemptId && data.nextItems) {
          setAttemptId(data.attemptId);
          // Mapping soal ke subtest
          const map: Record<string, any[]> = {};
          SUBTESTS.forEach(st => { map[st.key] = []; });
          data.nextItems.forEach((q: any) => {
            const st = SUBTESTS.find(s => q.subtest && q.subtest.toLowerCase().includes(s.name.toLowerCase()));
            if (st) map[st.key].push(q);
          });
          setSoalPerSubtest(map);
          // Restore state dari localStorage
          const saved = localStorage.getItem(`exam_${data.attemptId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            setAnswers(parsed.answers || {});
            setTimers(parsed.timers || SUBTESTS.map(() => 0));
            setLockedSubtests(parsed.lockedSubtests || SUBTESTS.map(() => false));
            setActiveSubtest(parsed.activeSubtest || 0);
          }
        } else {
          throw new Error('No data');
        }
      } catch (e) {
        // Jika gagal fetch, pakai data dummy
        const map: Record<string, any[]> = {};
        SUBTESTS.forEach(st => { map[st.key] = DUMMY_SOAL(st.count, st); });
        setSoalPerSubtest(map);
        setAttemptId('dummy');
        setUseDummy(true);
      }
      setLoading(false);
    }
    fetchSoal();
  }, []);

  useEffect(() => {
    if (!attemptId) return;
    localStorage.setItem(`exam_${attemptId}`, JSON.stringify({
      answers, timers, lockedSubtests, activeSubtest
    }));
  }, [answers, timers, lockedSubtests, activeSubtest, attemptId]);

  const handleSubmitSubtest = (subtestIdx: number, jawabanSubtes: any, timerSisa: number) => {
    setLockedSubtests(prev => prev.map((v, i) => i === subtestIdx ? true : v));
    setAnswers(prev => ({ ...prev, [SUBTESTS[subtestIdx].key]: jawabanSubtes }));
    setTimers(prev => prev.map((v, i) => i === subtestIdx ? timerSisa : v));
    if (subtestIdx < SUBTESTS.length - 1) {
      setActiveSubtest(subtestIdx + 1);
    } else {
      // TODO: Implementasi halaman hasil
    }
  };

  // Anti-cheat: deteksi tab keluar/tab switch
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        setCheatCount(c => {
          const next = c + 1;
          setCheatWarning(`Peringatan: Anda keluar dari tab/jendela (${next}/${maxCheat}). Jika melebihi batas, ujian akan otomatis disubmit.`);
          return next;
        });
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Anti-cheat: blokir copy, paste, klik kanan
  useEffect(() => {
    function blockEvent(e) {
      e.preventDefault();
      setCheatWarning('Aksi ini diblokir selama ujian berlangsung.');
    }
    document.addEventListener('copy', blockEvent);
    document.addEventListener('paste', blockEvent);
    document.addEventListener('contextmenu', blockEvent);
    return () => {
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('paste', blockEvent);
      document.removeEventListener('contextmenu', blockEvent);
    };
  }, []);

  // Auto-submit jika cheatCount melebihi batas
  useEffect(() => {
    if (cheatCount >= maxCheat && !autoSubmitRef.current) {
      autoSubmitRef.current = true;
      alert('Anda terlalu sering keluar dari tab/jendela. Ujian akan otomatis disubmit.');
      // Simulasikan submit subtest terakhir
      setLockedSubtests(prev => prev.map((v, i) => i === activeSubtest ? true : v));
      // TODO: Implementasi submit ke backend jika sudah ada
    }
  }, [cheatCount, maxCheat, activeSubtest]);

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Memuat soal...</div>;
  if (!attemptId) return <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>Gagal memulai tryout. (Mode UI Dummy Aktif)</div>;

  const subtestKey = SUBTESTS[activeSubtest].key;
  const soal = soalPerSubtest[subtestKey] || [];

  return (
    <div style={{ background: '#F5F6FA', minHeight: '100vh', fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif', color: '#111', width: '100vw', margin: 0, padding: 0 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: cheatCount >= maxCheat ? '#fee2e2' : '#fef9c3', color: cheatCount >= maxCheat ? '#b91c1c' : '#b45309', padding: 12, textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {cheatCount >= maxCheat ? (
          <>
            <span style={{ fontSize: 22 }}>❌</span>
            Anda telah melebihi batas pelanggaran ({cheatCount}/{maxCheat}). Ujian telah otomatis disubmit.
          </>
        ) : cheatWarning ? (
          <>
            <span style={{ fontSize: 22 }}>🚨</span>
            {cheatWarning} ({cheatCount}/{maxCheat})
          </>
        ) : (
          <>
            <span style={{ fontSize: 22 }}>🛡️</span>
            Anti-cheat aktif. Jangan keluar dari tab/jendela atau melakukan aksi terlarang.
          </>
        )}
      </div>
      <SubtestPage
        key={subtestKey}
        subtest={SUBTESTS[activeSubtest]}
        totalSubtest={SUBTESTS.length}
        subtestIdx={activeSubtest}
        locked={lockedSubtests[activeSubtest]}
        onSubmit={handleSubmitSubtest}
        soal={soal}
        attemptId={attemptId}
        answersInit={answers[subtestKey]}
      />
    </div>
  );
} 