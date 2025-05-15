import React, { useEffect, useRef } from "react";
import { Trophy, User, Star, BarChart2, CheckCircle2, AlertTriangle, Smile } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock data leaderboard
const leaderboard = [
  { name: "Sulaiman", score: 855, rank: "Challenger", trophy: true, university: "Universitas Indonesia", major: "Ilmu Komputer", avatar: "/avatars/WhatsApp Image 2025-05-10 at 07.15.42.jpeg" },
  { name: "Siti", score: 770, rank: "Challenger", trophy: true, university: "Universitas Gadjah Mada", major: "Kedokteran", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Rizky", score: 765, rank: "Challenger", trophy: false, university: "Institut Teknologi Bandung", major: "Teknik Sipil", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Edwin", score: 760, rank: "Master", trophy: false, university: "Universitas Brawijaya", major: "Teknik Elektro", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
  { name: "FlyWithMe", score: 755, rank: "Master", trophy: false, university: "Universitas Diponegoro", major: "Teknik Kimia", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { name: "BigBoi007", score: 750, rank: "Grandmaster", trophy: false, university: "Institut Pertanian Bogor", major: "Agroteknologi", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
  { name: "Pudge", score: 740, rank: "Gold", trophy: false, university: "Universitas Padjadjaran", major: "Kedokteran Gigi", avatar: "https://randomuser.me/api/portraits/men/89.jpg" },
  { name: "n0nameplayer", score: 730, rank: "Gold", trophy: false, university: "Universitas Hasanuddin", major: "Teknik Mesin", avatar: "https://randomuser.me/api/portraits/women/55.jpg" },
  { name: "Kimberly", score: 720, rank: "Silver", trophy: false, university: "Universitas Sebelas Maret", major: "Psikologi", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Afni", score: 640, rank: "Bronze", trophy: false, university: "Universitas Negeri Malang", major: "Pendidikan Matematika", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Kamu", score: 650, rank: "Bronze", trophy: false, isUser: true, position: 80, university: "Universitas Airlangga", major: "Manajemen", avatar: "https://randomuser.me/api/portraits/men/99.jpg" },
];

// Warna badge rank yang lebih soft dan readable
const rankColors = {
  Challenger: "bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-400 dark:text-yellow-900 dark:border-yellow-300",
  Grandmaster: "bg-pink-200 text-pink-800 border-pink-300 dark:bg-pink-400 dark:text-pink-900 dark:border-pink-300",
  Master: "bg-purple-200 text-purple-800 border-purple-300 dark:bg-purple-400 dark:text-purple-900 dark:border-purple-300",
  Gold: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-200 dark:text-yellow-900 dark:border-yellow-300",
  Silver: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-200 dark:text-blue-900 dark:border-blue-300",
  Bronze: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-200 dark:text-orange-900 dark:border-orange-300",
};

export default function GuruLeaderboard() {
  const { user: authUser } = useAuth();
  // Top 3
  const top3 = leaderboard.slice(0, 3);
  let rest = leaderboard.slice(3).filter((u) => !u.isUser);
  let user = leaderboard.find((u) => u.isUser);
  if (authUser && (authUser.role === 'guru' || authUser.role === 'admin')) {
    rest = leaderboard.slice(3, 10).map((row) => {
      if (row.isUser) {
        const siswaPengganti = leaderboard.find((u) => u.name === 'Afni' && !u.isUser) || leaderboard.find((u) => !u.isUser);
        return siswaPengganti || row;
      }
      return row;
    });
    user = undefined;
  }

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/30 font-display flex flex-col items-center w-full">
      <h1 className="text-4xl font-extrabold mb-2 text-center drop-shadow">Leaderboard</h1>
      <div className="text-blue-400 dark:text-blue-200 text-lg text-center mb-4 font-bold tracking-wide uppercase flex items-center justify-center gap-2">
        PERINGKAT 10 BESAR SISWA TERBAIK DI TRYOUT TERBARU!
        <Trophy className="w-6 h-6 text-yellow-400" />
      </div>
      {/* Top 3 Card Horizontal */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-8 justify-center items-stretch">
        {top3.map((user, i) => (
          <div
            key={user.name}
            className={`flex-1 rounded-2xl shadow-xl border-2 bg-[#10172a]/90 border-cyan-400 flex flex-col items-center justify-center py-8 px-4 md:px-8 min-w-[220px] max-w-xs mx-auto transition-all`}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 mb-3 rounded-full object-cover border-4 border-cyan-400 bg-white shadow" />
            ) : (
              <User className="w-12 h-12 mb-3 text-cyan-400" />
            )}
            <div className="font-extrabold text-3xl mb-1 text-center text-white">{user.name}</div>
            <div className="text-lg text-cyan-200 mb-1 text-center font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {user.university || 'Belum diatur'}
            </div>
            <div className="text-base text-cyan-400 mb-3 text-center font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {user.major || 'Belum diatur'}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-4 py-2 rounded-full text-base font-bold bg-yellow-400 text-yellow-900 flex items-center gap-2 shadow border border-yellow-300">{user.rank} <Trophy className="w-5 h-5 text-yellow-700" /></span>
            </div>
            <div className="text-2xl font-extrabold text-white">Skor: {user.score}</div>
          </div>
        ))}
      </div>
      {/* Tabel Leaderboard */}
      <div className="relative z-10 w-full rounded-3xl shadow-2xl border-2 bg-[#10172a]/90 dark:bg-blue-950/80 border-cyan-400 dark:border-cyan-700 backdrop-blur-md px-0 py-0 flex flex-col items-center animate-cardpop overflow-x-auto overflow-hidden">
        <table className="w-full text-base md:text-lg rounded-3xl overflow-hidden">
          <thead>
            <tr className="bg-[#10172a]/90 border-b-2 border-cyan-400">
              <th className="px-6 py-3 text-center text-cyan-200 font-bold">Posisi</th>
              <th className="px-6 py-3 text-center text-cyan-200 font-bold">Nama</th>
              <th className="px-6 py-3 text-center text-cyan-200 font-bold">Skor</th>
              <th className="px-6 py-3 text-center text-cyan-200 font-bold">Universitas Tujuan</th>
              <th className="px-6 py-3 text-center text-cyan-200 font-bold">Jurusan Tujuan</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((row, i) => (
              <tr
                key={row.name}
                className="transition-all bg-[#10172a]/90 border-b border-cyan-400"
              >
                <td className="px-6 py-3 text-center font-bold text-cyan-200">{i + 4}</td>
                <td className="px-6 py-3 text-center flex items-center justify-center gap-2 text-cyan-200 font-bold">
                  {row.avatar ? (
                    <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400 bg-white" />
                  ) : (
                    <User className="w-5 h-5 text-cyan-400" />
                  )}
                  <span className="font-bold">{row.name}</span>
                </td>
                <td className="px-6 py-3 text-center font-mono text-cyan-200">{row.score}</td>
                <td className="px-6 py-3 text-center text-cyan-200 max-w-xs whitespace-normal break-words">{row.university || 'Belum diatur'}</td>
                <td className="px-6 py-3 text-center text-cyan-200 max-w-xs whitespace-normal break-words">{row.major || 'Belum diatur'}</td>
              </tr>
            ))}
            {/* Baris user sendiri hanya untuk siswa */}
            {authUser?.role === 'siswa' && user && (
              <tr className="bg-cyan-900/40 dark:bg-cyan-900/80 font-bold text-cyan-200 border-2 border-cyan-400 shadow-lg animate-glow">
                <td className="px-6 py-3 text-center text-lg">{user.position}</td>
                <td className="px-6 py-3 text-center flex items-center justify-center gap-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400 bg-white" />
                  ) : (
                    <User className="w-5 h-5 text-cyan-400" />
                  )}
                  <span className="font-bold">{user.name}</span>
                  <span className="ml-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Kamu</span>
                </td>
                <td className="px-6 py-3 text-center font-mono font-bold">{user.score}</td>
                <td className="px-6 py-3 text-center font-bold text-cyan-200 max-w-xs whitespace-normal break-words">{user.university || 'Belum diatur'}</td>
                <td className="px-6 py-3 text-center font-bold text-cyan-200 max-w-xs whitespace-normal break-words">{user.major || 'Belum diatur'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-blue-700 dark:text-blue-200 text-lg text-center">
        Leaderboard akan di-reset setiap ada paket tryout baru. Siswa yang masuk leaderboard sebelum reset akan mendapatkan trophy di profil.
      </div>
      <style>{`
        .animate-glow { animation: glow 1.5s infinite alternate; }
        @keyframes glow {
          from { box-shadow: 0 0 0px #22d3ee; }
          to { box-shadow: 0 0 16px #22d3ee; }
        }
        .animate-cardpop {
          animation: cardPop 0.7s cubic-bezier(.23,1.01,.32,1) 0.1s both;
        }
        @keyframes cardPop {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
} 