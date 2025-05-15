import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
      <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow">Tryout Live</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tryoutLiveList.map((item) => (
          <Card key={item.id} className="relative group shadow-3d border border-cyan/20 bg-blue-3d/80">
            <CardHeader className="flex flex-col gap-2 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                {item.name}
                {item.status === 'live' && <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>}
                {item.status === 'upcoming' && <Badge className="bg-yellow-400 text-yellow-900">Segera</Badge>}
                {item.status === 'finished' && <Badge className="bg-gray-400 text-white">Selesai</Badge>}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-blue-200">
                <Clock className="w-4 h-4" /> {item.date}
                <Users className="w-4 h-4 ml-4" /> {item.peserta} peserta
              </CardDescription>
              {item.status === 'upcoming' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-cyan-300 font-bold">Countdown:</span>
                  <span className="font-mono text-cyan-200 text-lg">{countdowns[item.id] || '00j 00m 00d'}</span>
                  <Button size="icon" variant="outline" onClick={() => handleReminder(item.id)} title="Ingatkan Saya">
                    <Bell className="w-5 h-5" />
                  </Button>
                  {reminder === item.id && <span className="text-green-400 text-xs ml-2 animate-pulse">Reminder diaktifkan!</span>}
                </div>
              )}
              {item.status === 'live' && joined === item.id && (
                <span className="text-green-400 font-bold mt-2">Status: Sudah Join</span>
              )}
              {item.status === 'live' && joined !== item.id && (
                <span className="text-yellow-400 font-bold mt-2">Status: Belum Join</span>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-2 items-center">
              <Button
                onClick={() => handleJoin(item)}
                disabled={item.status === 'finished'}
                className="w-full font-bold"
                variant={item.status === 'live' ? '3d' : 'outline'}
              >
                {item.status === 'live' ? (joined === item.id ? 'Masuk Ruang Tryout' : 'Gabung Sekarang') : item.status === 'upcoming' ? 'Daftar' : 'Selesai'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Modal Leaderboard & Info Tryout Live */}
      {selected && open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selected?.name}</DialogTitle>
            </DialogHeader>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4" /> <span>{selected.date}</span>
                <Users className="w-4 h-4 ml-4" /> <span>{selected.peserta} peserta</span>
                {selected.status === 'live' && <Badge className="bg-red-500 text-white animate-pulse ml-4">LIVE</Badge>}
              </div>
              <div className="mb-2 font-semibold text-blue-900">Leaderboard Real-time</div>
              <div className="space-y-1">
                {selected.leaderboard.map((row, i) => (
                  <div key={row.name} className={`flex items-center gap-2 p-2 rounded ${row.isUser ? 'bg-cyan-100 font-bold' : 'hover:bg-cyan-50'}`}>
                    <span className="w-6 text-center">{i === 0 ? <Trophy className="w-5 h-5 text-yellow-400" /> : i + 1}</span>
                    <span className="flex-1">{row.name}</span>
                    <span className="font-mono text-cyan-700 font-bold">{row.score}</span>
                  </div>
                ))}
              </div>
              {selected.status === 'live' && (
                <div className="mt-4 text-center text-cyan-700 font-semibold">Tryout sedang berlangsung! Selesaikan soal secepatnya untuk naik peringkat.</div>
              )}
              {selected.status === 'upcoming' && (
                <div className="mt-4 text-center text-yellow-700 font-semibold">Tryout akan dimulai pada jadwal yang tertera. Siapkan dirimu!</div>
              )}
              {selected.status === 'finished' && (
                <div className="mt-4 text-center text-gray-700 font-semibold">Tryout telah selesai. Lihat peringkat dan analisis hasilmu!</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 