import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, BarChart2, TrendingUp, Award, CheckCircle, AlertCircle } from "lucide-react";

// Mock data aktivitas tryout
const activityHistory = [
  {
    id: "1",
    name: "Tryout Nasional 4",
    date: "2023-05-01",
    totalScore: 750,
    ranking: 1,
    trophy: "gold",
    subtests: [
      { name: "Penalaran Matematika (PM)", score: 80 },
      { name: "Literasi Bahasa Indonesia (LBI)", score: 90 },
      { name: "Literasi Bahasa Inggris (LBE)", score: 85 },
      { name: "Penalaran Umum (PU)", score: 75 },
    ],
    status: "Selesai"
  },
  {
    id: "2",
    name: "Tryout Nasional 3",
    date: "2023-04-15",
    totalScore: 720,
    ranking: 3,
    trophy: "bronze",
    subtests: [
      { name: "Penalaran Matematika (PM)", score: 75 },
      { name: "Literasi Bahasa Indonesia (LBI)", score: 85 },
      { name: "Literasi Bahasa Inggris (LBE)", score: 80 },
      { name: "Penalaran Umum (PU)", score: 70 },
    ],
    status: "Selesai"
  },
  {
    id: "3",
    name: "Tryout Nasional 2",
    date: "2023-04-01",
    totalScore: 680,
    ranking: 5,
    trophy: null,
    subtests: [
      { name: "Penalaran Matematika (PM)", score: 70 },
      { name: "Literasi Bahasa Indonesia (LBI)", score: 80 },
      { name: "Literasi Bahasa Inggris (LBE)", score: 75 },
      { name: "Penalaran Umum (PU)", score: 65 },
    ],
    status: "Selesai"
  },
];

// Statistik ringkas
const totalAktivitas = activityHistory.length;
const skorTertinggi = Math.max(...activityHistory.map(a => a.totalScore));
const rataRataSkor = Math.round(activityHistory.reduce((a, b) => a + b.totalScore, 0) / totalAktivitas);

export default function ActivityLog() {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Fungsi untuk render trophy
  const renderTrophy = (trophy: string | null) => {
    if (trophy === "gold") return <span title="Juara 1" className="ml-2 text-2xl">🥇</span>;
    if (trophy === "silver") return <span title="Juara 2" className="ml-2 text-2xl">🥈</span>;
    if (trophy === "bronze") return <span title="Juara 3" className="ml-2 text-2xl">🥉</span>;
    return null;
  };

  // Koleksi trophy user
  const trophyCollection = activityHistory
    .map(a => a.trophy)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <div className="p-4 md:p-8 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 drop-shadow">Riwayat Aktivitas</h1>
      <p className="text-blue-200 mb-6">Lihat riwayat aktivitas tryout Anda beserta detail skor, ranking, dan koleksi trophy leaderboard.</p>

      {/* Statistik Ringkas & Koleksi Trophy */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {/* Total Aktivitas */}
        <Card className="border border-cyan-700/40 bg-[#10172a]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-cyan-400">
              <BarChart2 className="w-5 h-5" /> Total Aktivitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">{totalAktivitas}</div>
            <div className="text-sm text-muted-foreground mt-1">Jumlah aktivitas tryout yang sudah Anda lakukan</div>
          </CardContent>
        </Card>
        {/* Rata-rata Skor */}
        <Card className="border border-blue-700/40 bg-[#10172a]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-400">
              <TrendingUp className="w-5 h-5" /> Rata-rata Skor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">{rataRataSkor}</div>
            <div className="text-sm text-blue-300 mt-1">+5% dari aktivitas sebelumnya</div>
          </CardContent>
        </Card>
        {/* Skor Tertinggi */}
        <Card className="border border-green-700/40 bg-[#10172a]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-green-400">
              <CheckCircle className="w-5 h-5" /> Skor Tertinggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">{skorTertinggi}</div>
            <div className="text-sm text-green-300 mt-1">Skor terbaik yang pernah Anda raih</div>
          </CardContent>
        </Card>
        {/* Koleksi Trophy */}
        <Card className="border border-yellow-700/40 bg-[#10172a]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-yellow-400">
              <AlertCircle className="w-5 h-5" /> Koleksi Trophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-2xl items-center mt-2">
              {trophyCollection.length === 0 && <span className="text-blue-200 text-base">Belum ada trophy</span>}
              {trophyCollection.includes("gold") && <span title="Juara 1">🥇</span>}
              {trophyCollection.includes("silver") && <span title="Juara 2">🥈</span>}
              {trophyCollection.includes("bronze") && <span title="Juara 3">🥉</span>}
            </div>
            <div className="text-sm text-yellow-300 mt-1">Trophy dari leaderboard tryout</div>
          </CardContent>
        </Card>
      </div>

      {/* List Aktivitas */}
      <div className="space-y-4">
        {activityHistory.map((activity) => (
          <Card key={activity.id} className="bg-blue-3d/80 border-cyan/20 shadow-3d">
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === activity.id ? null : activity.id)}>
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                  {activity.name}
                  {renderTrophy(activity.trophy)}
                </CardTitle>
                <CardDescription className="text-blue-200">{new Date(activity.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white font-bold">{activity.status}</Badge>
                <span className="text-2xl font-extrabold text-white">{activity.totalScore}</span>
                <span className="text-lg font-bold text-yellow-300">Peringkat {activity.ranking}</span>
                {expanded === activity.id ? <ChevronUp className="w-6 h-6 text-cyan-400" /> : <ChevronDown className="w-6 h-6 text-cyan-400" />}
              </div>
            </CardHeader>
            {expanded === activity.id && (
              <CardContent>
                <div className="mt-2">
                  <div className="font-semibold text-blue-200 mb-2">Detail Skor per Subtest:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {activity.subtests.map((sub, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-blue-3d-light/40 rounded-lg px-4 py-2">
                        <span className="text-white font-medium">{sub.name}</span>
                        <span className="text-lg font-bold text-cyan-300">{sub.score}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-blue-200">Ranking:</span>
                    <span className="text-lg font-bold text-yellow-300">{activity.ranking}</span>
                    {renderTrophy(activity.trophy)}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 