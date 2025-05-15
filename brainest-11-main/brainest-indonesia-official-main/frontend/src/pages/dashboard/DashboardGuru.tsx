import React from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const stats = [
  {
    icon: <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 13v5m4-9v9m4-5v5" /></svg>,
    title: "Jumlah Siswa",
    value: 120,
    desc: "Total siswa bimbingan",
    color: "text-cyan-400"
  },
  {
    icon: <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    title: "Sudah Tryout Terbaru",
    value: 24,
    desc: "Siswa sudah mengerjakan paket tryout terbaru",
    color: "text-green-400"
  },
  {
    icon: <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
    title: "Belum Tryout Terbaru",
    value: 96,
    desc: "Siswa belum mengerjakan paket tryout terbaru",
    color: "text-red-400"
  },
];

// Mock data grafik nilai rata-rata tryout terbaru
const grafikTryoutTerbaru = [
  { nama: "Siswa 1", nilai: 720 },
  { nama: "Siswa 2", nilai: 700 },
  { nama: "Siswa 3", nilai: 690 },
  { nama: "Siswa 4", nilai: 750 },
  { nama: "Siswa 5", nilai: 710 },
  { nama: "Siswa 6", nilai: 705 },
];

// Card tambahan: Jumlah Siswa Lulus Tryout Terbaru
const jumlahLulus = 18;

export default function DashboardGuru() {
  const { user } = useAuth();

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/30 font-display">
      <h1 className="text-2xl font-bold mb-6">Dashboard Guru</h1>
      <p className="mb-8">Selamat datang, {user?.name}! Berikut adalah ringkasan aktivitas dan statistik Anda sebagai guru.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl shadow-3d border border-cyan/20 bg-[#10172a] min-h-[170px] flex flex-col justify-between p-6 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              {item.icon}
              <span className={`font-bold text-lg ${item.color}`}>{item.title}</span>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">{item.value}</div>
            <div className="text-sm text-blue-200 font-medium">{item.desc}</div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Monitoring Siswa</h2>
        <div className="bg-blue-3d/80 rounded-2xl shadow-3d p-6 w-full max-w-4xl mx-auto">
          <h3 className="text-lg font-bold mb-2 text-white">Grafik Nilai Rata-rata Tryout Terbaru</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={grafikTryoutTerbaru}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="nama" stroke="#cbd5e1" fontWeight={600} />
              <YAxis domain={[600, 800]} stroke="#cbd5e1" fontWeight={600} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} cursor={{ fill: '#0ea5e933' }} />
              <Line type="monotone" dataKey="nilai" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 3 }} activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} name="Nilai" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 