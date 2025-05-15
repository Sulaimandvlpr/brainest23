import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle } from "lucide-react";

// Mock data
const difficultyData = [
  { name: "Mudah", value: 75 },
  { name: "Sedang", value: 65 },
  { name: "Sulit", value: 45 },
];

const subtestMap: Record<string, string> = {
  "Matematika": "Penalaran Matematika (PM)",
  "B. Indonesia": "Literasi Bahasa Indonesia (LBI)",
  "B. Inggris": "Literasi Bahasa Inggris (LBE)",
  "IPA": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Fisika": "Penalaran Umum (PU)",
  "Kimia": "Pengetahuan Kuantitatif (PK)",
  "Biologi": "Pemahaman Bacaan dan Menulis (PBM)",
  "Geografi": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Ekonomi": "Pengetahuan Kuantitatif (PK)",
  "Sejarah": "Pemahaman Bacaan dan Menulis (PBM)",
  "Sosiologi": "Penalaran Umum (PU)"
};

const subjectData = [
  { name: "Penalaran Matematika (PM)", correct: 68, incorrect: 32 },
  { name: "Literasi Bahasa Indonesia (LBI)", correct: 75, incorrect: 25 },
  { name: "Literasi Bahasa Inggris (LBE)", correct: 62, incorrect: 38 },
  { name: "Penalaran Umum (PU)", correct: 58, incorrect: 42 },
  { name: "Pengetahuan Kuantitatif (PK)", correct: 50, incorrect: 50 },
  { name: "Pemahaman Bacaan dan Menulis (PBM)", correct: 55, incorrect: 45 },
  { name: "Pengetahuan dan Pemahaman Umum (PPU)", correct: 60, incorrect: 40 },
];

const packageData = [
  { name: "TPS Batch 1", attempted: 120, completed: 105, avgScore: 72 },
  { name: "TKA Saintek", attempted: 98, completed: 85, avgScore: 68 },
  { name: "TKA Soshum", attempted: 86, completed: 76, avgScore: 71 },
  { name: "UTBK Lengkap", attempted: 140, completed: 115, avgScore: 65 },
];

const scoreDistribution = [
  { score: "0-10", count: 5 },
  { score: "11-20", count: 8 },
  { score: "21-30", count: 12 },
  { score: "31-40", count: 20 },
  { score: "41-50", count: 35 },
  { score: "51-60", count: 45 },
  { score: "61-70", count: 60 },
  { score: "71-80", count: 42 },
  { score: "81-90", count: 28 },
  { score: "91-100", count: 15 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const subtestShortMap = {
  "Penalaran Matematika (PM)": "PM",
  "Literasi Bahasa Indonesia (LBI)": "LBI",
  "Literasi Bahasa Inggris (LBE)": "LBE",
  "Penalaran Umum (PU)": "PU",
  "Pengetahuan Kuantitatif (PK)": "PK",
  "Pemahaman Bacaan dan Menulis (PBM)": "PBM",
  "Pengetahuan dan Pemahaman Umum (PPU)": "PPU",
};

const validSubtests = [
  "Penalaran Matematika (PM)",
  "Literasi Bahasa Indonesia (LBI)",
  "Literasi Bahasa Inggris (LBE)",
  "Penalaran Umum (PU)",
  "Pengetahuan Kuantitatif (PK)",
  "Pemahaman Bacaan dan Menulis (PBM)",
  "Pengetahuan dan Pemahaman Umum (PPU)",
];

const subjectDataFiltered = subjectData.filter(item => validSubtests.includes(item.name));
const subjectDataShort = subjectDataFiltered.map(item => ({
  ...item,
  name: subtestShortMap[item.name] || item.name,
}));

export default function GuruStatistics() {
  const [selectedPackage, setSelectedPackage] = useState("all");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Statistik Tryout Guru</h2>
        <p className="text-muted-foreground">
          Analisis performa soal dan hasil peserta tryout (khusus guru)
        </p>
      </div>
      <div className="flex justify-end">
        <Select defaultValue="all" onValueChange={setSelectedPackage}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Pilih paket" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Paket</SelectItem>
            <SelectItem value="tps">TPS Batch 1</SelectItem>
            <SelectItem value="saintek">TKA Saintek</SelectItem>
            <SelectItem value="soshum">TKA Soshum</SelectItem>
            <SelectItem value="utbk">UTBK Lengkap</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md border border-cyan-900 bg-[#10172a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" /> Rata-Rata Skor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-white">68.5/100</div>
            <div className="text-sm text-muted-foreground mt-1 font-medium">+5% dari minggu lalu</div>
          </CardContent>
        </Card>
        <Card className="shadow-md border border-cyan-900 bg-[#10172a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" /> Tingkat Penyelesaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-white">85%</div>
            <div className="text-sm text-muted-foreground mt-1 font-medium">Stabil, mayoritas peserta menyelesaikan</div>
          </CardContent>
        </Card>
        <Card className="shadow-md border border-cyan-900 bg-[#10172a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" /> Soal Tersulit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">Penalaran Matematika #42</div>
            <div className="text-sm text-muted-foreground mt-1 font-medium">Hanya 23% peserta menjawab benar</div>
          </CardContent>
        </Card>
        <Card className="shadow-md border border-cyan-900 bg-[#10172a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" /> Soal Termudah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">Penalaran Umum #12</div>
            <div className="text-sm text-muted-foreground mt-1 font-medium">98% peserta menjawab benar</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Persentase Jawaban Benar per Mata Pelajaran</CardTitle>
            <CardDescription>
              Persentase jawaban benar dan salah pada setiap subtest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectDataShort} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#cbd5e1" fontWeight={600} />
                <YAxis stroke="#cbd5e1" fontWeight={600} />
                <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} cursor={{ fill: '#0ea5e933' }} />
                <Legend />
                <Bar dataKey="correct" fill="#22d3ee" name="Benar" />
                <Bar dataKey="incorrect" fill="#f87171" name="Salah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Skor Peserta</CardTitle>
            <CardDescription>
              Distribusi skor peserta pada semua paket tryout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="score" stroke="#cbd5e1" fontWeight={600} />
                <YAxis stroke="#cbd5e1" fontWeight={600} />
                <RechartsTooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} cursor={{ fill: '#0ea5e933' }} />
                <Bar dataKey="count" fill="#38bdf8" name="Jumlah Peserta" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 