import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Lock, UserCheck, UserX, AreaChart, Bell, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Link } from 'react-router-dom';

// Mock data user
const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@email.com", role: "admin", status: "active" },
  { id: 2, name: "Guru Satu", email: "guru1@email.com", role: "guru", status: "active" },
  { id: 3, name: "Siswa A", email: "siswaa@email.com", role: "siswa", status: "suspended" },
  { id: 4, name: "Siswa B", email: "siswab@email.com", role: "siswa", status: "active" },
];

const roleOptions = ["all", "admin", "guru", "siswa"];

// Tambahkan style helper
const roleBadgeColor = (role: string) => {
  if (role === "admin" || role === "guru") return "bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold";
  return "bg-gray-200 text-gray-900 font-bold";
};

// Helper badge kesulitan
const difficultyBadge = (level: string) => {
  if (level === "Mudah") return "bg-cyan-200 text-cyan-900 font-bold";
  if (level === "Sedang") return "bg-yellow-100 text-yellow-900 font-bold";
  if (level === "Sulit") return "bg-pink-100 text-red-700 font-bold";
  return "bg-gray-200 text-gray-900 font-bold";
};

// Dummy data statistik user
const userStats = [
  { role: 'Admin', jumlah: 5 },
  { role: 'Guru', jumlah: 12 },
  { role: 'Siswa', jumlah: 120 },
];

export default function AdminSettings() {
  const [tab, setTab] = useState("irt");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  // Filtered users
  const filteredUsers = mockUsers.filter(u =>
    (role === "all" || u.role === role) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Terapkan style pada semua tabel di semua TabsContent
  const tableClassName = "w-full bg-gradient-to-b from-[#10172a] via-[#151e34] to-[#0f172a] border border-cyan-900/40 rounded-2xl shadow-xl";
  const rowClassName = "hover:bg-cyan-900/10 transition";
  const headerClassName = "bg-[#181f2e] text-cyan-200 text-lg font-bold";
  const cellClassName = "py-3 px-4";

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Admin</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6 flex justify-center gap-8 bg-[#10172a] border border-cyan-900/40 rounded-xl shadow-lg px-4 py-2">
          <TabsTrigger value="irt">IRT & Penilaian</TabsTrigger>
          <TabsTrigger value="pengumuman">Pengumuman & Notifikasi</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>
        <TabsContent value="irt">
          <div className="flex flex-col md:flex-row gap-8">
            <form
              className="max-w-xl bg-[#10172a] border border-cyan-900/40 rounded-lg p-6 space-y-4 flex-1"
              onSubmit={e => {
                e.preventDefault();
                toast.success("Pengaturan IRT & Penilaian berhasil disimpan!");
              }}
            >
              <div>
                <label className="block font-semibold mb-1">Aktifkan Model IRT</label>
                <div className="flex gap-6 mb-2">
                  <div className="flex items-center gap-2">
                    <Switch id="1pl" />
                    <label htmlFor="1pl" className="text-white">1PL (Rasch)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="2pl" />
                    <label htmlFor="2pl" className="text-white">2PL</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="3pl" />
                    <label htmlFor="3pl" className="text-white">3PL</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Parameter IRT</label>
                <div className="flex gap-2">
                  <input type="number" step="0.01" min="0" placeholder="a (discriminasi)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-32 hide-number-spinner" />
                  <input type="number" step="0.01" min="0" placeholder="b (kesulitan)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-32 hide-number-spinner" />
                  <input type="number" step="0.01" min="0" placeholder="c (tebakan)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-32 hide-number-spinner" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Bobot Skor</label>
                <input type="number" min="0" placeholder="Bobot skor benar" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-40 hide-number-spinner" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Passing Grade</label>
                <input type="number" min="0" max="100" placeholder="Passing grade (%)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-40 hide-number-spinner" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Skema Penilaian</label>
                <input type="text" placeholder="Contoh: Benar +4, Salah 0, Kosong 0" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-full" />
              </div>
              <button type="submit" className="mt-2 px-6 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 font-bold text-white shadow">Simpan Pengaturan</button>
            </form>
            <div className="hidden md:block flex-1 bg-[#10172a] border border-cyan-900/40 rounded-lg p-6 h-fit">
              <h3 className="text-lg font-bold mb-2 text-cyan-300">Tips & Info IRT</h3>
              <ul className="list-disc ml-5 text-cyan-100 text-sm space-y-2">
                <li><b>Apa itu IRT?</b> IRT (Item Response Theory) adalah metode penilaian modern yang mengukur kemampuan siswa berdasarkan karakteristik soal dan respons siswa, bukan sekadar jumlah benar.</li>
                <li><b>Model IRT:</b>
                  <ul className="list-disc ml-6">
                    <li><b>1PL (Rasch):</b> Hanya mempertimbangkan tingkat kesulitan soal (b). Cocok untuk penilaian sederhana.</li>
                    <li><b>2PL:</b> Mempertimbangkan kesulitan (b) dan diskriminasi soal (a). Cocok untuk soal dengan variasi kualitas.</li>
                    <li><b>3PL:</b> Menambah parameter tebakan (c). Cocok untuk tes dengan kemungkinan menebak (misal: pilihan ganda).</li>
                  </ul>
                </li>
                <li><b>Rekomendasi Pengisian Parameter (standar UTBK):</b>
                  <ul className="list-disc ml-6">
                    <li><b>a (Diskriminasi):</b> 0.8–1.5</li>
                    <li><b>b (Kesulitan):</b> -3.0 (mudah) sampai +3.0 (sulit), rata-rata 0</li>
                    <li><b>c (Tebakan):</b> 0.25 (untuk 4 opsi pilihan ganda)</li>
                  </ul>
                </li>
                <li><b>Tips Pemilihan Model:</b>
                  <ul className="list-disc ml-6">
                    <li>Gunakan <b>1PL</b> jika ingin sederhana dan adil.</li>
                    <li>Gunakan <b>2PL</b> jika ingin membedakan kualitas soal.</li>
                    <li>Gunakan <b>3PL</b> untuk tes dengan banyak soal pilihan ganda.</li>
                  </ul>
                </li>
                <li><b>Passing Grade & Skema Penilaian:</b> Passing grade UTBK biasanya 50–60%. Skema umum: Benar +4, Salah 0, Kosong 0.</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="pengumuman">
          <h2 className="text-xl font-bold mb-4">Pengumuman & Notifikasi</h2>
          <div className="mb-4 flex gap-2">
            <Link to="/admin/announcements/create">
              <Button className="bg-cyan-700 hover:bg-cyan-800">+ Tambah Pengumuman</Button>
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg border border-cyan-900/40 bg-[#10172a]">
            <Table className={tableClassName}>
              <TableHeader className={headerClassName}>
                <TableRow>
                  <TableHead className={cellClassName}>Judul</TableHead>
                  <TableHead className={cellClassName}>Isi</TableHead>
                  <TableHead className={cellClassName}>Tanggal</TableHead>
                  <TableHead className={cellClassName}>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className={rowClassName}>
                  <TableCell className={cellClassName}>Maintenance Server</TableCell>
                  <TableCell className={cellClassName}>Server akan maintenance 12 Juni 2024 pukul 22.00 WIB</TableCell>
                  <TableCell className={cellClassName}>10 Juni 2024</TableCell>
                  <TableCell className={cellClassName + " flex gap-2"}>
                    <Button size="icon" variant="ghost" className="text-cyan-400 hover:bg-cyan-900/30"><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-pink-400 hover:bg-pink-900/30"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow className={rowClassName}>
                  <TableCell className={cellClassName}>Update Fitur</TableCell>
                  <TableCell className={cellClassName}>Penambahan fitur IRT & keamanan baru</TableCell>
                  <TableCell className={cellClassName}>5 Juni 2024</TableCell>
                  <TableCell className={cellClassName + " flex gap-2"}>
                    <Button size="icon" variant="ghost" className="text-cyan-400 hover:bg-cyan-900/30"><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-pink-400 hover:bg-pink-900/30"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="audit">
          <h2 className="text-xl font-bold mb-4">Audit Log</h2>
          <div className="overflow-x-auto rounded-lg border border-cyan-900/40 bg-[#10172a]">
            <Table className={tableClassName}>
              <TableHeader className={headerClassName}>
                <TableRow>
                  <TableHead className={cellClassName}>Waktu</TableHead>
                  <TableHead className={cellClassName}>User</TableHead>
                  <TableHead className={cellClassName}>Aksi</TableHead>
                  <TableHead className={cellClassName}>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className={rowClassName}>
                  <TableCell className={cellClassName}>2024-06-10 10:12</TableCell>
                  <TableCell className={cellClassName}>Admin User</TableCell>
                  <TableCell className={cellClassName}>Edit Soal</TableCell>
                  <TableCell className={cellClassName}>Soal ID 123 diubah</TableCell>
                </TableRow>
                <TableRow className={rowClassName}>
                  <TableCell className={cellClassName}>2024-06-09 15:30</TableCell>
                  <TableCell className={cellClassName}>Guru Satu</TableCell>
                  <TableCell className={cellClassName}>Tambah Paket</TableCell>
                  <TableCell className={cellClassName}>Paket Tryout Nasional 5</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 