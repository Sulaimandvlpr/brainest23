import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Helper untuk countdown
function getCountdown(target: string) {
  const targetDate = new Date(target).getTime();
  const now = Date.now();
  const diff = targetDate - now;
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours}j ${minutes}m ${seconds}d`;
}

// Mock data event tryout live
const initialTryoutLiveList = [
  {
    id: 'live1',
    name: 'Tryout Nasional Live #1',
    date: '2024-07-10 19:00',
    status: 'upcoming',
    peserta: 120,
    leaderboard: [
      { name: 'Adit', score: 750 },
      { name: 'Budi', score: 740 },
      { name: 'Kamu', score: 730, isUser: true },
      { name: 'Citra', score: 720 },
      { name: 'Dewi', score: 710 },
    ],
  },
  {
    id: 'live2',
    name: 'Tryout Nasional Live #2',
    date: '2024-07-15 19:00',
    status: 'live',
    peserta: 98,
    leaderboard: [
      { name: 'Kamu', score: 680, isUser: true },
      { name: 'Fajar', score: 670 },
      { name: 'Gilang', score: 660 },
    ],
  },
  {
    id: 'live3',
    name: 'Tryout Nasional Live #3',
    date: '2024-07-01 19:00',
    status: 'finished',
    peserta: 150,
    leaderboard: [
      { name: 'Ayu', score: 800 },
      { name: 'Kamu', score: 790, isUser: true },
      { name: 'Rizky', score: 780 },
    ],
  },
];

export default function TryoutLive() {
  const [tryoutLiveList, setTryoutLiveList] = useState(initialTryoutLiveList);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof tryoutLiveList[0] | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [countdowns, setCountdowns] = useState<{[id: string]: string | null}>({});

  // Update countdown setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: {[id: string]: string | null} = {};
      tryoutLiveList.forEach(item => {
        if (item.status === 'upcoming') {
          newCountdowns[item.id] = getCountdown(item.date);
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [tryoutLiveList]);

  // Update status event jika countdown habis
  useEffect(() => {
    setTryoutLiveList(list => list.map(item => {
      if (item.status === 'upcoming' && countdowns[item.id] === null) {
        return { ...item, status: 'live' };
      }
      return item;
    }));
  }, [countdowns]);

  // Simulasi update peserta real-time (dummy)
  useEffect(() => {
    const interval = setInterval(() => {
      setTryoutLiveList(list => list.map(item => {
        if (item.status === 'live') {
          // Tambah peserta random 0-3 setiap 5 detik
          return { ...item, peserta: item.peserta + Math.floor(Math.random() * 4) };
        }
        return item;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = (item: typeof tryoutLiveList[0]) => {
    setSelected(item);
    setOpen(true);
    if (item.status === 'live') setJoined(item.id);
  };

  const handleReminder = (id: string) => {
    setReminder(id);
    setTimeout(() => setReminder(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Tryout Live</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tryoutLiveList.filter(item => item.status === 'upcoming' || item.status === 'live').map((item) => (
          <div
            key={item.id}
            className={
              `relative bg-[#11182c] border border-blue-900/40 rounded-3xl shadow-[0_2px_16px_0_rgba(34,211,238,0.07)] p-7 flex flex-col justify-between min-h-[220px] transition-all duration-200 hover:shadow-[0_4px_32px_0_rgba(34,211,238,0.13)]`
            }
          >
            {/* Badge status di pojok kanan atas */}
            <div className="absolute top-5 right-5 z-10">
              {item.status === 'live' && <Badge className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">LIVE</Badge>}
              {item.status === 'upcoming' && <Badge className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold tracking-wide">Segera</Badge>}
              {item.status === 'finished' && <Badge className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">Selesai</Badge>}
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-white mb-2">{item.name}</div>
              <div className="flex items-center gap-6 text-cyan-200 text-base mb-3">
                <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {item.date}</span>
                <span className="flex items-center gap-2"><Users className="w-5 h-5" /> {item.peserta} peserta</span>
              </div>
              {item.status === 'upcoming' && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-cyan-700 font-semibold">Countdown:</span>
                  <span className="font-mono text-cyan-700 text-base">{countdowns[item.id] || '00j 00m 00d'}</span>
                  <Button size="icon" variant="outline" onClick={() => handleReminder(item.id)} title="Ingatkan Saya">
                    <Bell className="w-5 h-5" />
                  </Button>
                  {reminder === item.id && <span className="text-green-600 text-xs ml-2">Reminder diaktifkan!</span>}
                </div>
              )}
              {item.status === 'live' && joined === item.id && (
                <span className="text-green-600 font-semibold mt-2 block">Status: Sudah Join</span>
              )}
              {item.status === 'live' && joined !== item.id && (
                <span className="text-yellow-600 font-semibold mt-2 block">Status: Belum Join</span>
              )}
            </div>
            <div className="mt-8">
              <Button
                onClick={() => handleJoin(item)}
                disabled={item.status === 'finished'}
                className="w-full font-semibold text-lg rounded-full py-3 bg-cyan-500 text-white border-0 shadow-none hover:bg-cyan-400 transition-all duration-150"
                variant="ghost"
              >
                {item.status === 'live' ? (joined === item.id ? 'Masuk Ruang Tryout' : 'Gabung Sekarang') : item.status === 'upcoming' ? 'Daftar' : 'Selesai'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal Leaderboard & Info Tryout Live */}
      {selected && open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg bg-[#11182c] border border-blue-900/40 rounded-3xl shadow-[0_2px_16px_0_rgba(34,211,238,0.07)] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-2">{selected?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-4 mb-4 text-cyan-200 text-base">
              <Clock className="w-5 h-5" /> <span>{selected.date}</span>
              <Users className="w-5 h-5 ml-4" /> <span>{selected.peserta} peserta</span>
              {selected.status === 'live' && <Badge className="bg-red-500 text-white ml-4 px-4 py-1 rounded-full text-sm font-semibold tracking-wide">LIVE</Badge>}
            </div>
            <div className="mb-3 text-lg font-bold text-cyan-400">Leaderboard Real-time</div>
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-cyan-700 text-base">
                    <th className="py-2 pl-4">Peringkat</th>
                    <th className="py-2">Nama</th>
                    <th className="py-2 pr-4 text-right">Skor</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.leaderboard.slice(0, 3).map((row, i) => (
                    <tr
                      key={row.name}
                      className={`transition-all ${row.isUser ? 'bg-cyan-100/20 font-bold text-cyan-200' : 'hover:bg-blue-900/30 text-white'} ${i === 0 ? 'text-yellow-400' : ''}`}
                    >
                      <td className="py-2 pl-4 text-lg">
                        {i === 0 ? <Trophy className="w-6 h-6 inline-block mr-1 align-middle text-yellow-400" /> : i + 1}
                      </td>
                      <td className="py-2">
                        {row.name}
                      </td>
                      <td className="py-2 pr-4 text-right font-mono text-cyan-400 text-lg">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selected.status === 'live' && (
              <div className="mt-6 text-center text-cyan-400 font-semibold text-lg">Tryout sedang berlangsung! Selesaikan soal secepatnya untuk naik peringkat.</div>
            )}
            {selected.status === 'upcoming' && (
              <div className="mt-6 text-center text-yellow-400 font-semibold text-lg">Tryout akan dimulai pada jadwal yang tertera. Siapkan dirimu!</div>
            )}
            {selected.status === 'finished' && (
              <div className="mt-6 text-center text-gray-400 font-semibold text-lg">Tryout telah selesai. Lihat peringkat dan analisis hasilmu!</div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 