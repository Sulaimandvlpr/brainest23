import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, UserCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

import DashboardGuru from "./DashboardGuru";
import AdminDashboard from "../admin/AdminDashboard";

// Mock data for progress
const progressData = [
  { name: "Tryout 1", score: 650, average: 600 },
  { name: "Tryout 2", score: 680, average: 620 },
  { name: "Tryout 3", score: 720, average: 640 },
  { name: "Tryout 4", score: 750, average: 660 },
];

const subtestMap: Record<string, string> = {
  "Matematika": "Penalaran Matematika (PM)",
  "B. Indonesia": "Literasi Bahasa Indonesia (LBI)",
  "B. Inggris": "Literasi Bahasa Inggris (LBE)",
  "Fisika": "Penalaran Umum (PU)",
  "Kimia": "Pengetahuan Kuantitatif (PK)",
  "Biologi": "Pemahaman Bacaan dan Menulis (PBM)",
  "Geografi": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Ekonomi": "Pengetahuan Kuantitatif (PK)",
  "Sejarah": "Pemahaman Bacaan dan Menulis (PBM)",
  "Sosiologi": "Penalaran Umum (PU)"
};

// Mock data for subject performance
const subjectData = [
  { subject: "Penalaran Matematika (PM)", score: 75 },
  { subject: "Literasi Bahasa Indonesia (LBI)", score: 85 },
  { subject: "Literasi Bahasa Inggris (LBE)", score: 80 },
  { subject: "Penalaran Umum (PU)", score: 70 },
  { subject: "Pengetahuan Kuantitatif (PK)", score: 65 },
  { subject: "Pemahaman Bacaan dan Menulis (PBM)", score: 90 },
  { subject: "Pengetahuan dan Pemahaman Umum (PPU)", score: 75 },
];

// Mock data for recent tryouts
const recentTryouts = [
  {
    id: "1",
    name: "Tryout Nasional 4",
    date: "2023-05-01",
    score: 750,
    status: "completed",
  },
  {
    id: "2",
    name: "Tryout Nasional 3",
    date: "2023-04-15",
    score: 720,
    status: "completed",
  },
  {
    id: "3",
    name: "Tryout Nasional 2",
    date: "2023-04-01",
    score: 680,
    status: "completed",
  },
];

// Mock data for upcoming tryouts
const upcomingTryouts = [
  {
    id: "5",
    name: "Tryout Nasional 5",
    date: "2023-05-15",
    duration: "120 menit",
    subjects: ["Penalaran Matematika (PM)", "Penalaran Umum (PU)", "Pengetahuan Kuantitatif (PK)", "Pemahaman Bacaan dan Menulis (PBM)"],
  },
  {
    id: "6",
    name: "Tryout Khusus Saintek",
    date: "2023-05-20",
    duration: "90 menit",
    subjects: ["Penalaran Umum (PU)", "Pengetahuan Kuantitatif (PK)", "Pemahaman Bacaan dan Menulis (PBM)", "Pengetahuan dan Pemahaman Umum (PPU)"],
  },
];

// Custom Tooltip untuk chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 text-white rounded-lg px-4 py-2 shadow-lg border border-blue-500">
        <div className="font-bold">{label}</div>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <span style={{ color: item.color }}>{item.name}:</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Avatar kartun (bisa diganti dengan gambar SVG/PNG open source)
  const cartoonAvatars = [
    "https://raw.githubusercontent.com/itsjonq/figma-open-peeps/master/png/peep-4.png", // Laki-laki rambut panjang kulit putih
    "https://raw.githubusercontent.com/itsjonq/figma-open-peeps/master/png/peep-1.png", // Laki-laki rambut pendek kulit putih
    "https://raw.githubusercontent.com/itsjonq/figma-open-peeps/master/png/peep-3.png", // Perempuan rambut panjang
    "https://avatars.githubusercontent.com/u/109138962?s=400&u=2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e&v=4", // Perempuan berhijab
  ];

  // Load avatar dari localStorage saat mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem("user_avatar");
    const savedPhoto = localStorage.getItem("user_photo");
    if (savedAvatar) setSelectedAvatar(savedAvatar);
    if (savedPhoto) setUploadedPhoto(savedPhoto);
  }, []);

  // Simpan avatar ke localStorage
  const handleSaveAvatar = () => {
    if (uploadedPhoto) {
      localStorage.setItem("user_photo", uploadedPhoto);
      localStorage.removeItem("user_avatar");
    } else if (selectedAvatar) {
      localStorage.setItem("user_avatar", selectedAvatar);
      localStorage.removeItem("user_photo");
    }
    setShowEdit(false);
  };

  // Handle upload foto
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedPhoto(ev.target?.result as string);
        setSelectedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Leaderboard mock data
  const leaderboard = [
    { name: "Kamu", score: 750 },
    { name: "Rizky", score: 740 },
    { name: "Ayu", score: 730 },
    { name: "Budi", score: 720 },
    { name: "Siti", score: 710 },
  ];

  // Progress bar (contoh: 80% progress)
  const progress = 80;

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  if (user?.role === 'guru') {
    return <DashboardGuru />;
  }

  // Dashboard siswa/guru seperti biasa
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/30 font-display">
      {/* Header dengan avatar dan tombol edit */}
      <div className="flex justify-between items-center py-6 px-4 md:px-12">
        <div className="flex items-center gap-6">
          <Dialog open={showEdit} onOpenChange={setShowEdit}>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group">
                <Avatar className="w-20 h-20 border-4 border-cyan shadow-3d">
                  {uploadedPhoto ? (
                    <AvatarImage src={uploadedPhoto} alt="Foto Profil" />
                  ) : selectedAvatar ? (
                    <AvatarImage src={selectedAvatar} alt="Avatar Kartun" />
                  ) : (
                    <AvatarFallback>
                      <UserCircle className="w-12 h-12 text-white" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-cyan rounded-full p-2 text-white text-xs opacity-80 group-hover:opacity-100 shadow-3d">
                  Edit
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-blue-3d text-white border-cyan shadow-3d rounded-2xl">
              <DialogHeader>
                <DialogTitle>Edit Foto Profil / Avatar</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Foto Profil</label>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-blue-200" title="Pilih foto profil" />
                  {uploadedPhoto && (
                    <img src={uploadedPhoto} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover border-2 border-cyan shadow-3d" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Atau Pilih Avatar Kartun</label>
                  <div className="flex gap-3">
                    {cartoonAvatars.map((src, idx) => (
                      <img
                        key={src}
                        src={src}
                        alt={`Avatar ${idx + 1}`}
                        className={`w-16 h-16 rounded-full border-2 cursor-pointer shadow-3d ${selectedAvatar === src ? 'border-cyan' : 'border-gray-300'} ${uploadedPhoto ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => {
                          setSelectedAvatar(src);
                          setUploadedPhoto(null);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEdit(false)} className="px-4 py-2 rounded-full">Batal</Button>
                  <Button variant="3d" onClick={handleSaveAvatar} className="px-4 py-2 rounded-full">Simpan</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        <div>
            <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow">Dashboard</h2>
            <p className="text-blue-200 mb-2 mt-2 text-left text-lg">
              Selamat datang kembali, {user?.name || "User"}! Berikut adalah ringkasan performa tryout Anda.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <Sun className="w-5 h-5 text-yellow-400" />
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          <Moon className="w-5 h-5 text-blue-400" /> */}
        </div>
      </div>

      {/* Progress Bar dengan gradient dan animasi */}
      <div className="mx-4 md:mx-12 my-6">
        <div className="rounded-2xl bg-blue-3d/60 shadow-3d p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white drop-shadow">Progress Tryout</h2>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-5 bg-blue-3d-light/30 rounded-xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-600 rounded-xl shadow-lg transition-all duration-500 flex items-center justify-end pr-3"
              style={{ width: `${progress}%` }}
            >
              <span className="text-xs text-white font-bold drop-shadow">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards statistik dengan ikon dan warna berbeda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-12 my-8">
        {[
          { icon: '📝', iconBg: 'from-blue-400 to-cyan-400', title: "Total Tryout", value: 4, desc: "+1 dari bulan lalu" },
          { icon: '⭐', iconBg: 'from-yellow-400 to-yellow-300', title: "Rata-rata Skor", value: 700, desc: "+50 dari rata-rata awal" },
          { icon: '🏆', iconBg: 'from-yellow-700 to-yellow-500', title: "Skor Tertinggi", value: 750, desc: "Tryout Nasional 4" },
          { icon: '🎯', iconBg: 'from-green-500 to-cyan-400', title: "Skor Target", value: 800, desc: "Perlu peningkatan 50 poin" },
        ].map((item, idx) => (
          <Card key={item.title} className="rounded-2xl shadow-3d border border-cyan/20 bg-blue-3d-light/60 p-6 flex flex-col gap-2 items-start hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-3d bg-gradient-to-br ${item.iconBg}`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <span className="font-bold text-lg text-white">{item.title}</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{item.value}</div>
            <div className="text-sm text-blue-200">{item.desc}</div>
          </Card>
        ))}
      </div>

      {/* Grafik Perkembangan Skor & Performa Mata Pelajaran */}
      <div className="grid gap-8 md:grid-cols-2 px-4 md:px-12 my-8">
        <Card className="bg-blue-3d/80 rounded-2xl shadow-3d">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white drop-shadow">Perkembangan Skor</CardTitle>
            <CardDescription className="text-blue-200">
              Perkembangan nilai tryout Anda dibandingkan dengan rata-rata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#cbd5e1" fontWeight={600} />
                <YAxis domain={[500, 1000]} stroke="#cbd5e1" fontWeight={600} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#fff", stroke: "#3b82f6", strokeWidth: 3, filter: "drop-shadow(0 0 6px #3b82f6)" }}
                  activeDot={{ r: 8, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                  name="Skor Anda"
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#fff", stroke: "#8b5cf6", strokeWidth: 3, filter: "drop-shadow(0 0 6px #8b5cf6)" }}
                  activeDot={{ r: 8, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                  name="Rata-rata"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-blue-3d/80 rounded-2xl shadow-3d">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white drop-shadow">Performa Berdasarkan Mata Pelajaran</CardTitle>
            <CardDescription className="text-blue-200">
              Nilai per mata pelajaran dari tryout terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="subject" stroke="#cbd5e1" fontWeight={600} />
                <YAxis domain={[0, 100]} stroke="#cbd5e1" fontWeight={600} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="score"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Skor"
                  isAnimationActive={true}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Tryout Terbaru */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
        <Card className="rounded-2xl shadow-3d border border-cyan/20 bg-blue-3d/70">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white drop-shadow">Tryout Terbaru</CardTitle>
            <CardDescription className="text-blue-200">Riwayat 3 tryout terakhir yang telah Anda kerjakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTryouts.map((tryout) => (
                <div key={tryout.id} className="flex items-center justify-between bg-blue-3d-light/60 border border-cyan/10 rounded-xl p-4 shadow-inner hover:scale-[1.01] transition-all">
                  <div>
                    <div className="font-bold text-lg text-white">{tryout.name}</div>
                    <div className="text-blue-200 text-xs">
                      {new Date(tryout.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-2xl font-bold text-white">{tryout.score}</span>
                    <span className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow">Selesai</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="3d" asChild className="w-full rounded-full font-bold text-white shadow-3d">
                <Link to="/dashboard/history">Lihat Semua Riwayat</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Tryout Mendatang */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
        <Card className="rounded-2xl shadow-3d border border-cyan/20 bg-blue-3d/70">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white drop-shadow">Tryout Mendatang</CardTitle>
            <CardDescription className="text-blue-200">Paket tryout yang tersedia untuk Anda kerjakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingTryouts.map((tryout) => (
                <div key={tryout.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-blue-3d-light/60 border border-cyan/10 rounded-xl p-4 shadow-inner gap-2 hover:scale-[1.01] transition-all">
                  <div>
                    <div className="font-bold text-lg text-white">{tryout.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tryout.subjects.map((subject, i) => (
                        <span key={i} className="bg-blue-900/80 text-blue-200 px-2 py-1 rounded-full text-xs font-semibold border border-blue-700">{subject}</span>
                      ))}
                    </div>
                    <div className="text-blue-200 text-xs mt-1">{tryout.duration}</div>
                  </div>
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full px-6 py-2 shadow hover:scale-105 transition">
                    <Link to={`/dashboard/packages/${tryout.id}`}>Mulai</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="3d" asChild className="w-full rounded-full font-bold text-white shadow-3d">
                <Link to="/dashboard/packages">Lihat Semua Paket</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}
