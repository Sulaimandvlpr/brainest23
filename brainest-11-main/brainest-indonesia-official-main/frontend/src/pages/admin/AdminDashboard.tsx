import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, Book, FileText, CheckCircle2, Plus, Activity, TrendingUp, UserCheck, UserPlus, AlertCircle, Mail } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart, Legend } from "recharts";
import { useAuth } from "@/hooks/useAuth";

// Mock data for the dashboard
const recentUsers = [
  { id: 1, name: "Budi Santoso", email: "budi@example.com", date: "2023-05-01" },
  { id: 2, name: "Siti Rahayu", email: "siti@example.com", date: "2023-05-02" },
  { id: 3, name: "Anwar Ibrahim", email: "anwar@example.com", date: "2023-05-03" },
  { id: 4, name: "Dewi Lestari", email: "dewi@example.com", date: "2023-05-04" },
];

const packageStats = [
  { name: 'TPS Batch 1', users: 120 },
  { name: 'TKA Saintek', users: 98 },
  { name: 'TKA Soshum', users: 86 },
  { name: 'UTBK Lengkap', users: 140 },
  { name: 'Kebumian', users: 40 },
];

// Mock data summary
const summary = [
  { icon: <Users className="w-7 h-7 text-cyan-400" />, label: "Total Pengguna", value: 1200 },
  { icon: <Book className="w-7 h-7 text-blue-400" />, label: "Paket Tryout", value: 24 },
  { icon: <FileText className="w-7 h-7 text-purple-400" />, label: "Total Soal", value: 3200 },
  { icon: <Mail className="w-7 h-7 text-green-400" />, label: "Inbox", value: 5 },
];

// Mock data grafik
const userGrowth = [
  { month: "Jan", siswa: 200, guru: 10 },
  { month: "Feb", siswa: 300, guru: 15 },
  { month: "Mar", siswa: 400, guru: 18 },
  { month: "Apr", siswa: 500, guru: 22 },
  { month: "Mei", siswa: 600, guru: 25 },
  { month: "Jun", siswa: 700, guru: 30 },
];
const tryoutActivity = [
  { week: "M1", tryout: 120 },
  { week: "M2", tryout: 150 },
  { week: "M3", tryout: 180 },
  { week: "M4", tryout: 210 },
];
const scoreDist = [
  { range: "600-650", jumlah: 40 },
  { range: "651-700", jumlah: 80 },
  { range: "701-750", jumlah: 120 },
  { range: "751-800", jumlah: 60 },
  { range: "801-850", jumlah: 20 },
];
const topPackages = [
  { name: "Tryout Nasional 1", peserta: 320 },
  { name: "Tryout Saintek", peserta: 280 },
  { name: "Tryout Soshum", peserta: 250 },
  { name: "Tryout Pemantapan", peserta: 200 },
  { name: "Tryout Mini", peserta: 180 },
];
const topSiswa = [
  { name: "Sulaiman", tryout: 12 },
  { name: "Siti", tryout: 11 },
  { name: "Rizky", tryout: 10 },
  { name: "Edwin", tryout: 9 },
  { name: "Kimberly", tryout: 8 },
];
const topGuru = [
  { name: "Pak Budi", paket: 8 },
  { name: "Bu Sari", paket: 7 },
  { name: "Pak Andi", paket: 6 },
  { name: "Bu Lina", paket: 5 },
  { name: "Pak Joko", paket: 4 },
];
const activityLog = [
  { user: "Sulaiman", action: "Mengerjakan Tryout Nasional 1", time: "2 menit lalu" },
  { user: "Pak Budi", action: "Menambah Paket Tryout Saintek", time: "10 menit lalu" },
  { user: "Siti", action: "Mendaftar Akun", time: "30 menit lalu" },
  { user: "Admin", action: "Verifikasi Paket Tryout", time: "1 jam lalu" },
  { user: "Kimberly", action: "Mengerjakan Tryout Soshum", time: "2 jam lalu" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Inbox otomatis update jika ada tiket bantuan baru
  const inbox = [
    { id: 1, title: "Tiket Bantuan Baru", content: "Ada 2 tiket bantuan baru yang belum diproses.", time: "5 menit lalu" },
    { id: 2, title: "Permintaan Reset Password", content: "3 user meminta reset password hari ini.", time: "10 menit lalu" },
    { id: 3, title: "Paket Tryout Baru", content: "Paket Tryout 'UTBK 2025' telah dibuat.", time: "30 menit lalu" },
    { id: 4, title: "Laporan Error Sistem", content: "Sistem mendeteksi error pada modul penilaian.", time: "1 jam lalu" },
    { id: 5, title: "Pengingat Maintenance", content: "Maintenance server malam ini pukul 22:00.", time: "2 jam lalu" },
  ];
  
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/20 font-display">
      <h1 className="text-4xl font-extrabold mb-2 text-white drop-shadow">Dashboard Admin</h1>
      <div className="text-blue-200 text-lg mb-8">Selamat datang, Admin! Berikut adalah ringkasan aktivitas dan statistik platform.</div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {summary.map((item) => (
          <Card key={item.label} className="bg-[#16213e] rounded-xl shadow-md border-none px-6 py-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              {item.icon}
              <span className="font-semibold text-base text-white">{item.label}</span>
            </div>
              <div className="text-3xl font-extrabold text-cyan-300">{item.value}</div>
          </Card>
        ))}
      </div>
      {/* Inbox dan Log Aktivitas Terbaru berdampingan */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Inbox Section */}
        <Card className="bg-[#16213e] rounded-xl shadow-md border-none px-6 py-5 w-full">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-white">Inbox</span>
            <span className="text-xs text-cyan-200 cursor-pointer">Lihat semua</span>
          </div>
          <ul className="space-y-3">
            {inbox.slice(0, 3).map((msg) => (
              <li key={msg.id} className="flex flex-col md:flex-row md:items-center md:gap-4 bg-[#1b2945] rounded-lg p-3">
                <div className="flex-1">
                  <div className="font-semibold text-cyan-200 mb-1">{msg.title}</div>
                  <div className="text-white text-sm mb-1">{msg.content}</div>
                  <div className="text-xs text-blue-200">{msg.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        {/* Log Aktivitas Terbaru */}
        <Card className="bg-[#16213e] rounded-xl shadow-md border-none px-6 py-5 w-full">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-white">Log Aktivitas Terbaru</span>
          </div>
          <ul className="space-y-3">
            {activityLog.map((log, i) => (
              <li key={i} className="flex items-center gap-4 text-white font-medium py-2 border-b border-cyan-900/30 last:border-0">
                <Activity className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-cyan-200 mr-2">{log.user}</span>
                  <span className="text-blue-100">{log.action}</span>
                </div>
                <span className="text-cyan-300 text-xs whitespace-nowrap">{log.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
