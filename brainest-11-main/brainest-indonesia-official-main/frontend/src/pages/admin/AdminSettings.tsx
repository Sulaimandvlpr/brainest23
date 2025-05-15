import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Lock, UserCheck, UserX, AreaChart, Bell, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

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

export default function AdminSettings() {
  const [tab, setTab] = useState("user");
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
        <TabsList className="mb-6 flex flex-wrap gap-2 bg-[#10172a] border border-cyan-900/40 rounded-xl shadow-lg">
          <TabsTrigger value="user">Manajemen User</TabsTrigger>
          <TabsTrigger value="irt">IRT & Penilaian</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring & Statistik</TabsTrigger>
          <TabsTrigger value="pengumuman">Pengumuman & Notifikasi</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="keamanan">Keamanan</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <h2 className="text-xl font-bold mb-6">Manajemen User</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Input
              placeholder="Cari pengguna..."
              className="w-72 bg-[#181f2e] border border-cyan-900/40 text-cyan-100 focus:ring-2 focus:ring-cyan-400 rounded-xl shadow"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="rounded-xl px-3 py-2 bg-[#181f2e] border border-cyan-900/40 text-cyan-100 focus:ring-2 focus:ring-cyan-400 shadow"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              {roleOptions.map(r => (
                <option key={r} value={r}>{r === "all" ? "Filter berdasarkan role" : r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-cyan-900/40 bg-[#10172a] shadow-xl">
            <Table className={tableClassName}>
              <TableHeader className={headerClassName}>
                <TableRow>
                  <TableHead className={cellClassName}>Nama</TableHead>
                  <TableHead className={cellClassName}>Email</TableHead>
                  <TableHead className={cellClassName}>Role</TableHead>
                  <TableHead className={cellClassName}>Tanggal Daftar</TableHead>
                  <TableHead className={cellClassName}>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow className={rowClassName}>
                    <TableCell colSpan={5} className={cellClassName + " text-center text-muted-foreground"}>Tidak ada user ditemukan.</TableCell>
                  </TableRow>
                ) : filteredUsers.map(user => (
                  <TableRow key={user.id} className={rowClassName}>
                    <TableCell className={cellClassName + " font-bold text-white text-base"}>{user.name}</TableCell>
                    <TableCell className={cellClassName + " text-cyan-100"}>{user.email}</TableCell>
                    <TableCell className={cellClassName}>
                      <span className={`inline-block px-4 py-1 rounded-full text-base ${roleBadgeColor(user.role)}`}>{user.role === "admin" ? "Admin" : user.role === "editor" ? "Editor" : "User"}</span>
                    </TableCell>
                    <TableCell className={cellClassName + " text-cyan-100"}>2023-05-01</TableCell>
                    <TableCell className={cellClassName + " flex gap-2"}>
                      <Button size="icon" variant="ghost" className="bg-[#181f2e] text-cyan-200 hover:bg-cyan-800/30 shadow"><Lock className="w-5 h-5" /></Button>
                      <Button size="sm" className="bg-[#181f2e] text-cyan-100 hover:bg-cyan-700/80 rounded-full font-bold shadow">Reset</Button>
                      <Button size="icon" variant="ghost" className="bg-[#181f2e] text-pink-400 hover:bg-pink-900/30 shadow"><UserX className="w-5 h-5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="irt">
          <h2 className="text-xl font-bold mb-4">IRT & Penilaian</h2>
          <form
            className="max-w-xl bg-[#10172a] border border-cyan-900/40 rounded-lg p-6 space-y-4"
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
                <input type="number" step="0.01" min="0" placeholder="a (discriminasi)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-32" />
                <input type="number" step="0.01" min="0" placeholder="b (kesulitan)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-32" />
                <input type="number" step="0.01" min="0" placeholder="c (tebakan)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-32" />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Bobot Skor</label>
              <input type="number" min="0" placeholder="Bobot skor benar" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-40" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Passing Grade</label>
              <input type="number" min="0" max="100" placeholder="Passing grade (%)" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-40" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Skema Penilaian</label>
              <input type="text" placeholder="Contoh: Benar +4, Salah 0, Kosong 0" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-full" />
            </div>
            <button type="submit" className="mt-2 px-6 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 font-bold text-white shadow">Simpan Pengaturan</button>
          </form>
        </TabsContent>
        <TabsContent value="monitoring">
          <h2 className="text-xl font-bold mb-4">Monitoring & Statistik</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#10172a] border border-cyan-900/40 rounded-lg p-4 flex flex-col items-center">
              <AreaChart className="w-8 h-8 text-cyan-400 mb-2" />
              <div className="text-2xl font-bold">1.234</div>
              <div className="text-sm text-cyan-200">Total User Aktif</div>
            </div>
            <div className="bg-[#10172a] border border-cyan-900/40 rounded-lg p-4 flex flex-col items-center">
              <Clock className="w-8 h-8 text-cyan-400 mb-2" />
              <div className="text-2xl font-bold">87</div>
              <div className="text-sm text-cyan-200">Sedang Tryout</div>
            </div>
            <div className="bg-[#10172a] border border-cyan-900/40 rounded-lg p-4 flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-cyan-400 mb-2" />
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm text-cyan-200">Sesi Aman</div>
            </div>
          </div>
          <div className="bg-[#10172a] border border-cyan-900/40 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2">Aktivitas Live</h3>
            <ul className="text-sm text-white space-y-1">
              <li>👤 Siswa A mengerjakan Tryout Nasional 5</li>
              <li>👤 Siswa B mengerjakan Tryout Saintek</li>
              <li>👤 Guru Satu sedang membuat soal baru</li>
            </ul>
          </div>
          <div className="bg-[#10172a] border border-cyan-900/40 rounded-lg p-4">
            <h3 className="font-bold mb-2">Grafik Aktivitas (Mock)</h3>
            <div className="h-32 flex items-center justify-center text-cyan-300">[Grafik Placeholder]</div>
          </div>
        </TabsContent>
        <TabsContent value="pengumuman">
          <h2 className="text-xl font-bold mb-4">Pengumuman & Notifikasi</h2>
          <div className="mb-4 flex gap-2">
            <Button className="bg-cyan-700 hover:bg-cyan-800">+ Tambah Pengumuman</Button>
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
        <TabsContent value="keamanan">
          <h2 className="text-xl font-bold mb-4">Keamanan</h2>
          <form className="max-w-xl bg-[#10172a] border border-cyan-900/40 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Switch id="2fa" />
              <label htmlFor="2fa" className="text-white font-semibold">Aktifkan Two-Factor Authentication (2FA)</label>
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1">Session Timeout (menit)</label>
              <input type="number" min="1" max="180" placeholder="Contoh: 30" className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-32" />
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1">Pengaturan Keamanan Lainnya</label>
              <input type="text" placeholder="Keterangan tambahan..." className="px-3 py-2 rounded-md bg-[#0f172a] border-2 border-cyan-900/40 text-white w-full" />
            </div>
            <button type="submit" className="mt-2 px-6 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 font-bold text-white shadow">Simpan Pengaturan</button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
} 