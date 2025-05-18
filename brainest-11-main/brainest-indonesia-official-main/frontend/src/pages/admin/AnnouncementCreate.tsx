import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function AnnouncementCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '', startDate: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', content: '', startDate: '' };
    if (!title.trim()) {
      newErrors.title = 'Judul harus diisi';
      isValid = false;
    }
    if (!content.trim()) {
      newErrors.content = 'Isi pengumuman harus diisi';
      isValid = false;
    }
    if (!startDate) {
      newErrors.startDate = 'Tanggal tayang harus diisi';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSuccessMsg('Pengumuman berhasil ditambahkan!');
    setTimeout(() => navigate('/admin/settings?tab=pengumuman'), 1200);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Tambah Pengumuman</CardTitle>
          <CardDescription className="text-center">
            Isi formulir di bawah untuk mengirim pengumuman ke seluruh pengguna
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul pengumuman" className={errors.title ? 'border-red-500' : ''} />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Isi Pengumuman</Label>
              <textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Tulis isi pengumuman di sini..." rows={5} className={`w-full rounded-md border px-3 py-2 bg-[#181f2e] text-cyan-100 border-cyan-900/40 shadow focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 placeholder:text-cyan-400 ${errors.content ? 'border-red-500' : ''}`} />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Pengguna</Label>
              <select id="target" value={target} onChange={e => setTarget(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-[#181f2e] text-cyan-100 border-cyan-900/40 shadow focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600">
                <option value="all">Semua Pengguna</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="startDate">Tanggal Tayang</Label>
                <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={errors.startDate ? 'border-red-500' : ''} />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="endDate">Tanggal Berakhir <span className="text-xs text-cyan-400">(Opsional)</span></Label>
                <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
            {successMsg && <div className="text-sm font-semibold text-center border border-cyan-500 rounded-md p-2 bg-cyan-900/30 text-cyan-200 shadow">{successMsg}</div>}
          </CardContent>
          <CardFooter className="flex gap-4 justify-between">
            <Button type="button" variant="outline" className="w-1/2" onClick={() => navigate(-1)}>Batal</Button>
            <Button type="submit" className="w-1/2 bg-utbk-blue hover:bg-utbk-blue/90">Simpan</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 