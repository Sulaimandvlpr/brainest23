import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { motion } from "framer-motion";

// Mock data for tryout packages
const tryoutPackages = [
  {
    id: "1",
    name: "Tryout Nasional 1",
    description: "Paket tryout pertama dengan soal-soal dasar UTBK",
    subjects: ["Matematika", "B. Indonesia", "B. Inggris", "IPA"],
    duration: "120 menit",
    questions: 100,
    difficulty: "Mudah",
    status: "completed",
    score: 650,
  },
  {
    id: "2",
    name: "Tryout Nasional 2",
    description: "Paket tryout kedua dengan soal-soal menengah UTBK",
    subjects: ["Matematika", "B. Indonesia", "B. Inggris", "IPA"],
    duration: "120 menit",
    questions: 100,
    difficulty: "Menengah",
    status: "completed",
    score: 680,
  },
  {
    id: "3",
    name: "Tryout Nasional 3",
    description: "Paket tryout ketiga dengan soal-soal lanjutan UTBK",
    subjects: ["Matematika", "B. Indonesia", "B. Inggris", "IPA"],
    duration: "120 menit",
    questions: 100,
    difficulty: "Sulit",
    status: "completed",
    score: 720,
  },
  {
    id: "4",
    name: "Tryout Nasional 4",
    description: "Paket tryout keempat dengan soal-soal komprehensif UTBK",
    subjects: ["Matematika", "B. Indonesia", "B. Inggris", "IPA"],
    duration: "120 menit",
    questions: 100,
    difficulty: "Sangat Sulit",
    status: "completed",
    score: 750,
  },
  {
    id: "5",
    name: "Tryout Nasional 5",
    description: "Paket tryout terbaru dengan prediksi soal UTBK tahun ini",
    subjects: ["Matematika", "B. Indonesia", "B. Inggris", "IPA"],
    duration: "120 menit",
    questions: 100,
    difficulty: "Sangat Sulit",
    status: "available",
  },
  {
    id: "6",
    name: "Tryout Khusus Saintek",
    description: "Paket tryout khusus untuk jurusan Saintek",
    subjects: ["Matematika", "Fisika", "Kimia", "Biologi"],
    duration: "90 menit",
    questions: 80,
    difficulty: "Sulit",
    status: "available",
  },
  {
    id: "7",
    name: "Tryout Khusus Soshum",
    description: "Paket tryout khusus untuk jurusan Soshum",
    subjects: ["Ekonomi", "Geografi", "Sosiologi", "Sejarah"],
    duration: "90 menit",
    questions: 80,
    difficulty: "Sulit",
    status: "available",
  },
  {
    id: "8",
    name: "Tryout Pemantapan UTBK",
    description: "Paket tryout final untuk persiapan UTBK",
    subjects: ["Matematika", "B. Indonesia", "B. Inggris"],
    duration: "150 menit",
    questions: 120,
    difficulty: "Sangat Sulit",
    status: "locked",
  },
];

// Mapping subtest SNBT 2024
const subtestMap: Record<string, string> = {
  "Matematika": "Penalaran Matematika (PM)",
  "B. Indonesia": "Literasi Bahasa Indonesia (LBI)",
  "B. Inggris": "Literasi Bahasa Inggris (LBE)",
  "IPA": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Fisika": "Penalaran Umum (PU)",
  "Kimia": "Pengetahuan Kuantitatif (PK)",
  "Biologi": "Pemahaman Bacaan dan Menulis (PBM)",
  "Ekonomi": "Pengetahuan Kuantitatif (PK)",
  "Geografi": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Sosiologi": "Penalaran Umum (PU)",
  "Sejarah": "Pemahaman Bacaan dan Menulis (PBM)",
  "TPS": "Penalaran Umum (PU)"
};

// Fungsi ranking per paket
function getRankingData(packageId: string, userScore: number | undefined) {
  // Ambil data ranking dari localStorage
  const key = `ranking_${packageId}`;
  let rankingData: number[] = [];
  try {
    rankingData = JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    rankingData = [];
  }
  // Jika userScore ada dan belum masuk, tambahkan
  if (userScore && !rankingData.includes(userScore)) {
    rankingData.push(userScore);
    localStorage.setItem(key, JSON.stringify(rankingData));
  }
  // Urutkan skor dari tinggi ke rendah
  rankingData.sort((a, b) => b - a);
  // Hitung ranking user
  const userRank = userScore ? rankingData.indexOf(userScore) + 1 : null;
  // Hitung skor tertinggi, rata-rata, distribusi
  const highest = rankingData[0] || 0;
  const avg = rankingData.length ? Math.round(rankingData.reduce((a, b) => a + b, 0) / rankingData.length) : 0;
  // Distribusi skor (kelompok 50an)
  const dist: Record<string, number> = {};
  rankingData.forEach(s => {
    const group = `${Math.floor(s/50)*50}-${Math.floor(s/50)*50+49}`;
    dist[group] = (dist[group] || 0) + 1;
  });
  return { userRank, total: rankingData.length, highest, avg, dist, userScore };
}

export default function Packages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  // Filter packages based on search and difficulty
  const filteredPackages = tryoutPackages.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === "all" || pkg.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  // Group packages by status
  const availablePackages = filteredPackages.filter((pkg) => pkg.status === "available");
  const completedPackages = filteredPackages.filter((pkg) => pkg.status === "completed");
  const lockedPackages = filteredPackages.filter((pkg) => pkg.status === "locked");

  // Define badge colors for different difficulties
  const difficultyColors = {
    "Mudah": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Menengah": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Sulit": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "Sangat Sulit": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paket Tryout</h2>
        <p className="text-muted-foreground">
          Pilih paket tryout UTBK yang sesuai dengan kebutuhan Anda.
        </p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="w-full md:w-2/3">
          <Label htmlFor="search">Cari Paket Tryout</Label>
          <Input
            id="search"
            placeholder="Cari berdasarkan nama atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Label htmlFor="difficulty">Filter Tingkat Kesulitan</Label>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Semua Tingkat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tingkat</SelectItem>
              <SelectItem value="mudah">Mudah</SelectItem>
              <SelectItem value="menengah">Menengah</SelectItem>
              <SelectItem value="sulit">Sulit</SelectItem>
              <SelectItem value="sangat sulit">Sangat Sulit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="available">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="available" className="flex-1 md:flex-none">
            Tersedia ({availablePackages.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 md:flex-none">
            Selesai ({completedPackages.length})
          </TabsTrigger>
          <TabsTrigger value="locked" className="flex-1 md:flex-none">
            Terkunci ({lockedPackages.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1 md:flex-none">
            Semua ({filteredPackages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          {availablePackages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada paket tryout yang tersedia saat ini.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availablePackages.map((pkg) => (
                <TryoutCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedPackages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Anda belum menyelesaikan tryout apa pun.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completedPackages.map((pkg) => (
                <TryoutCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          {lockedPackages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada paket tryout terkunci.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lockedPackages.map((pkg) => (
                <TryoutCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {filteredPackages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada paket tryout yang sesuai dengan kriteria pencarian Anda.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <TryoutCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TryoutPackage {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  duration: string;
  questions: number;
  difficulty: string;
  status: "available" | "completed" | "locked";
  score?: number;
}

interface TryoutCardProps {
  package: TryoutPackage;
}

function TryoutCard({ package: pkg }: TryoutCardProps) {
  // Define badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Menengah":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Sulit":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Sangat Sulit":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  // Define button props based on status
  const getButtonProps = () => {
    switch (pkg.status) {
      case "available":
        return {
          text: "Mulai Tryout",
          variant: "default" as const,
          href: `/exam/${pkg.id}`
        };
      case "completed":
        return {
          text: "Lihat Hasil",
          variant: "outline" as const,
          href: `/dashboard/history/${pkg.id}`
        };
      case "locked":
        return {
          text: "Terkunci",
          variant: "outline" as const,
          disabled: true,
          href: "#"
        };
      default:
        return {
          text: "Detail",
          variant: "outline" as const,
          href: `#`
        };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="h-full"
    >
      <Card>
        <CardHeader>
          <CardTitle>{pkg.name}</CardTitle>
          <CardDescription>{pkg.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Tingkat Kesulitan</span>
                <Badge className={getDifficultyColor(pkg.difficulty)}>
                  {pkg.difficulty}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Durasi</span>
                <span className="text-sm font-medium">{pkg.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Jumlah Soal</span>
                <span className="text-sm font-medium">{pkg.questions} soal</span>
              </div>
              {pkg.score && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Skor</span>
                  <span className="text-sm font-medium">{pkg.score}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <span className="text-sm font-medium mb-1 block">Mata Pelajaran</span>
              <div className="flex flex-wrap gap-1">
                {pkg.subjects.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">
                    {subtestMap[s] || s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {pkg.status === "completed" && (
            (() => {
              const rank = getRankingData(pkg.id, pkg.score);
              return (
                <div className="mt-2 text-xs">
                  <div>Peringkat Anda: {rank.userRank} dari {rank.total} peserta</div>
                  <div>Skor tertinggi: {rank.highest}</div>
                  <div>Rata-rata skor: {rank.avg}</div>
                  <div>Skor Anda: {rank.userScore}</div>
                  <div>Distribusi Skor:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(rank.dist).map(([range, count]) => (
                      <span key={range}>{range}: {count}</span>
                    ))}
                  </div>
                </div>
              );
            })()
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant={buttonProps.variant} disabled={buttonProps.disabled} className="w-full">
              <Link to={buttonProps.href}>{buttonProps.text}</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
