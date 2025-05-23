import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Select from 'react-select';

// Dummy data universitas dan prodi
const universitasList = [
  { label: "Universitas Indonesia (UI)", value: "ui", logo: "https://www.pngkit.com/png/full/406-4061748_logo-ui-png-universitas-indonesia.png" },
  { label: "Institut Teknologi Bandung (ITB)", value: "itb", logo: "https://upload.wikimedia.org/wikipedia/id/0/0a/Lambang_ITB.png" },
  { label: "Universitas Gadjah Mada (UGM)", value: "ugm", logo: "https://upload.wikimedia.org/wikipedia/id/9/9f/Logo_Universitas_Gadjah_Mada.png" },
];
const prodiList = {
  ui: [
    { label: "Teknik Informatika", value: "informatika" },
    { label: "Kedokteran", value: "kedokteran" },
    { label: "Hukum", value: "hukum" },
  ],
  itb: [
    { label: "Teknik Elektro", value: "elektro" },
    { label: "Teknik Sipil", value: "sipil" },
    { label: "Arsitektur", value: "arsitektur" },
  ],
  ugm: [
    { label: "Teknik Mesin", value: "mesin" },
    { label: "Kedokteran", value: "kedokteran" },
    { label: "Ilmu Komputer", value: "ilkom" },
  ],
};

export default function Profile() {
  const { user } = useAuth();
  const [targetScore, setTargetScore] = React.useState(() => {
    return localStorage.getItem('target_score') || '';
  });
  const [universitas, setUniversitas] = React.useState(() => {
    const u = localStorage.getItem('universitas');
    return universitasList.find(x => x.value === u) || null;
  });
  const [jurusan, setJurusan] = React.useState(() => {
    const j = localStorage.getItem('jurusan');
    if (!j) return null;
    if (!universitas) return null;
    return prodiList[universitas.value]?.find(x => x.value === j) || null;
  });
  const [editMode, setEditMode] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSave = () => {
    if (!targetScore || isNaN(Number(targetScore)) || Number(targetScore) < 0) {
      setError('Skor target harus berupa angka positif');
      return;
    }
    if (!universitas) {
      setError('Pilih universitas tujuan');
      return;
    }
    if (!jurusan) {
      setError('Pilih jurusan tujuan');
      return;
    }
    localStorage.setItem('target_score', targetScore);
    localStorage.setItem('universitas', universitas.value);
    localStorage.setItem('jurusan', jurusan.value);
    setEditMode(false);
    setError('');
  };

  React.useEffect(() => {
    // Reset jurusan jika universitas berubah
    setJurusan(null);
  }, [universitas?.value]);

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
        {/* Avatar = logo universitas tujuan */}
        <div className="w-20 h-20 rounded-full border-4 border-cyan shadow-3d flex items-center justify-center bg-white overflow-hidden">
          {universitas && universitas.logo ? (
            <img src={universitas.logo} alt={universitas.label} className="object-contain w-full h-full" />
          ) : (
            <span className="text-cyan-700 text-3xl font-bold">?</span>
          )}
        </div>
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
        <h2 className="text-lg font-semibold mb-2">Tujuan Pendidikan</h2>
        <div className="mb-4 flex flex-col gap-4">
          <Select
            className="text-black"
            placeholder="Universitas Tujuan"
            options={universitasList}
            value={universitas}
            onChange={setUniversitas}
            isClearable
            isSearchable
          />
          <Select
            className="text-black"
            placeholder="Jurusan Tujuan"
            options={universitas ? prodiList[universitas.value] : []}
            value={jurusan}
            onChange={setJurusan}
            isClearable
            isSearchable
            isDisabled={!universitas}
          />
        </div>
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
