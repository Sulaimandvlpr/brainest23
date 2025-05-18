import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { user } = useAuth();
  const [targetScore, setTargetScore] = React.useState(() => {
    return localStorage.getItem('target_score') || '';
  });
  const [editMode, setEditMode] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSave = () => {
    if (!targetScore || isNaN(Number(targetScore)) || Number(targetScore) < 0) {
      setError('Skor target harus berupa angka positif');
      return;
    }
    localStorage.setItem('target_score', targetScore);
    setEditMode(false);
    setError('');
  };

  if (!user) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Profil</h1>
        <p>Data pengguna tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profil Pengguna</h1>
      <div className="flex items-center gap-6 mb-6">
        <Avatar className="w-20 h-20 border-4 border-cyan shadow-3d">
          <AvatarFallback>{user.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-2xl font-bold mb-1">{user.name}</div>
          <div className="text-blue-200 mb-1">{user.email}</div>
          <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.role === 'admin' || user.role === 'guru' 
              ? 'bg-gradient-to-r from-pink-500 to-cyan-400 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
          }`}>
            {user.role === 'admin' ? 'Admin' : user.role === 'guru' ? 'Guru' : 'Siswa'}
          </Badge>
        </div>
      </div>
      <div className="bg-blue-3d/60 rounded-xl p-6 shadow-3d">
        <h2 className="text-lg font-semibold mb-2">Informasi Akun</h2>
        <ul className="space-y-2 text-blue-100">
          <li><span className="font-semibold text-white">Nama:</span> {user.name}</li>
          <li><span className="font-semibold text-white">Email:</span> {user.email}</li>
          <li><span className="font-semibold text-white">Role:</span> {user.role === 'admin' ? 'Admin' : user.role === 'guru' ? 'Guru' : 'Siswa'}</li>
        </ul>
      </div>
      <div className="bg-blue-3d/60 rounded-xl p-6 shadow-3d mt-6">
        <h2 className="text-lg font-semibold mb-2">Skor Target</h2>
        {!editMode ? (
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-cyan-200">{targetScore || 'Belum diatur'}</span>
            <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>Ubah</Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={0}
              value={targetScore}
              onChange={e => setTargetScore(e.target.value)}
              className={error ? 'border-red-500' : ''}
              placeholder="Masukkan skor target (misal: 800)"
              style={{ width: 180 }}
            />
            <Button size="sm" variant="3d" onClick={handleSave}>Simpan</Button>
            <Button size="sm" variant="outline" onClick={() => { setEditMode(false); setError(''); }}>Batal</Button>
          </div>
        )}
        {error && <div className="text-sm text-red-400 mt-1">{error}</div>}
        <div className="text-xs text-blue-200 mt-2">Skor target akan digunakan sebagai acuan pada dashboard dan progress belajar Anda.</div>
      </div>
    </div>
  );
}
