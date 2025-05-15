import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const mataPelajaranList = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Fisika",
  "Kimia",
  "Biologi",
  "Ekonomi",
  "Geografi",
  "Sosiologi",
  // Tambahkan sesuai kebutuhan
];

export default function GuruSettings() {
  const [name, setName] = useState("");
  const [email] = useState("guru@email.com"); // readonly, contoh
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [subject, setSubject] = useState("");
  const [notif, setNotif] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPhotoName(e.target.files[0].name);
    }
  };

  const handleCustomFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Profil berhasil diperbarui!");
    // TODO: Integrasi API update profil
  };

  return (
    <div className="min-h-screen flex flex-col items-start bg-transparent p-0 md:p-8">
      <div className="w-full max-w-5xl mx-auto mt-0">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-[#10172a] border border-cyan-900/40 rounded-2xl shadow-2xl px-4 md:px-8 py-6 flex flex-col gap-6 items-stretch">
            {/* Header & Subjudul di dalam card */}
            <div className="mb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1 text-left">Pengaturan Akun Guru</h1>
              <p className="text-white text-sm md:text-base text-left">Kelola data profil, keamanan, dan preferensi akun Anda dengan mudah dan aman.</p>
            </div>
            {/* Konten Profil */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
              {/* Kiri: Foto Profil */}
              <div className="flex flex-col items-center justify-center w-full md:w-1/3 gap-3 md:gap-4">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-cyan-900/30 flex items-center justify-center overflow-hidden border-4 border-cyan-700 shadow-lg">
                  {photo ? (
                    <img src={URL.createObjectURL(photo)} alt="Preview Foto Profil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl md:text-4xl text-cyan-300 font-bold">G</span>
                  )}
                </div>
                <div className="flex flex-col items-center w-full mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={handleCustomFileClick}
                    className="rounded-full bg-cyan-800 hover:bg-cyan-600 text-white px-6 py-2 text-base font-semibold shadow border-2 border-cyan-700 transition w-40 h-12"
                  >
                    Pilih Foto
                  </Button>
                </div>
              </div>
              {/* Kanan: Form Data */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
                <div className="flex flex-col gap-1">
                  <label className="block font-semibold mb-1 text-base text-white">Nama Lengkap</label>
                  <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full text-base py-2 px-4 bg-[#0f172a] border-cyan-800 focus:border-cyan-400 focus:ring-cyan-400/30 text-white h-12" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block font-semibold mb-1 text-base text-white">Email</label>
                  <Input type="email" value={email} readOnly className="w-full bg-gray-800 text-gray-400 cursor-not-allowed text-base py-2 px-4 border-cyan-800 h-12" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block font-semibold mb-1 text-base text-white">Nomor HP</label>
                  <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full text-base py-2 px-4 bg-[#0f172a] border-cyan-800 focus:border-cyan-400 focus:ring-cyan-400/30 text-white h-12" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block font-semibold mb-1 text-base text-white">&nbsp;</label>
                  <Button type="button" variant="outline" className="text-base px-6 py-3 border-cyan-700 hover:bg-cyan-800 hover:text-white transition w-full h-12 font-semibold" onClick={() => setShowPasswordModal(true)}>
                    Ganti Password
                  </Button>
                </div>
                <div className="flex items-center gap-4 col-span-2 mt-1">
                  <Switch id="notif" checked={notif} onCheckedChange={setNotif} />
                  <label htmlFor="notif" className="text-white font-semibold text-base">Aktifkan Notifikasi Email/WA</label>
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <Button type="submit" className="w-full md:w-auto px-10 py-3 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-800 hover:to-blue-800 text-white font-extrabold text-base shadow-lg transition h-12">
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </form>
            </div>
      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#10172a] border border-cyan-900/40 rounded-2xl p-8 w-full max-w-md flex flex-col gap-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">Ganti Password</h2>
            <Input type="password" placeholder="Password Lama" className="w-full text-lg py-3 px-4 bg-[#0f172a] border-cyan-800 focus:border-cyan-400 focus:ring-cyan-400/30 text-white" />
            <Input type="password" placeholder="Password Baru" className="w-full text-lg py-3 px-4 bg-[#0f172a] border-cyan-800 focus:border-cyan-400 focus:ring-cyan-400/30 text-white" />
            <Input type="password" placeholder="Konfirmasi Password Baru" className="w-full text-lg py-3 px-4 bg-[#0f172a] border-cyan-800 focus:border-cyan-400 focus:ring-cyan-400/30 text-white" />
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" className="border-cyan-700 hover:bg-cyan-800 hover:text-white transition" onClick={() => setShowPasswordModal(false)}>Batal</Button>
              <Button className="bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-800 hover:to-blue-800 text-white transition" onClick={() => { setShowPasswordModal(false); toast.success('Password berhasil diganti!'); }}>Simpan</Button>
            </div>
          </div>
          </div>
      )}
    </div>
  );
} 