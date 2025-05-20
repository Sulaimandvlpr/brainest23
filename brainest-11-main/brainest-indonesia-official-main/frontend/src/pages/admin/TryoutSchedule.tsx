import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar, Edit, Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PACKAGES } from "./TryoutPackages";

// Mock data jadwal tryout
const MOCK_SCHEDULES = [
  {
    id: '1',
    name: 'Tryout Nasional Live #1',
    start: '2024-07-10T19:00',
    end: '2024-07-10T21:00',
    peserta: 120,
    packageId: '1',
  },
  {
    id: '2',
    name: 'Tryout Nasional Live #2',
    start: '2024-07-15T19:00',
    end: '2024-07-15T21:00',
    peserta: 138,
    packageId: '2',
  },
  {
    id: '3',
    name: 'Tryout Nasional Live #3',
    start: '2024-07-01T19:00',
    end: '2024-07-01T21:00',
    peserta: 150,
    packageId: '3',
  },
  {
    id: '4',
    name: 'Tryout Nasional Live #4',
    start: '2025-07-20T19:00',
    end: '2025-07-20T21:00',
    peserta: 0,
    packageId: '4',
  },
];

function getStatus(start: string, end: string) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'live';
  return 'selesai';
}

function formatDateTime(dt: string) {
  const d = new Date(dt);
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\.\d{2}$/,'');
}

function formatDateTimeDisplay(dt: string) {
  const d = new Date(dt);
  const tanggal = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const jam = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(':', '.');
  return { tanggal, jam: jam + ' WIB' };
}

export default function TryoutSchedule() {
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    start: '',
    end: '',
    peserta: '',
    packageId: '',
  });

  const handleOpenAdd = () => {
    setEditData(null);
    setForm({ name: '', start: '', end: '', peserta: '', packageId: '' });
    setOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditData(item);
    setForm({
      name: item.name,
      start: item.start,
      end: item.end,
      peserta: String(item.peserta),
      packageId: item.packageId,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.start || !form.end) {
      toast.error('Nama, tanggal mulai, dan tanggal selesai wajib diisi');
      return;
    }
    if (editData) {
      setSchedules(schedules.map(s => s.id === editData.id ? { ...editData, ...form, peserta: Number(form.peserta) || 0 } : s));
      toast.success('Jadwal berhasil diupdate');
    } else {
      setSchedules([
        ...schedules,
        { id: String(Date.now()), ...form, peserta: Number(form.peserta) || 0 },
      ]);
      toast.success('Jadwal berhasil ditambahkan');
    }
    setOpen(false);
  };

  const handleDelete = () => {
    setSchedules(schedules.filter(s => s.id !== deleteId));
    setDeleteId(null);
    toast.success('Jadwal berhasil dihapus');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-7 h-7 text-cyan-400" /> Jadwal Live Tryout
        </h1>
        <Button onClick={handleOpenAdd} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 flex gap-2">
          <Plus className="w-5 h-5" /> Tambah Jadwal
        </Button>
      </div>
      <Table className="min-w-full bg-[#0f172a]">
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Nama Tryout</TableHead>
            <TableHead className="text-white text-center">Tanggal Mulai</TableHead>
            <TableHead className="text-white text-center">Tanggal Selesai</TableHead>
            <TableHead className="text-white text-center">Paket Tryout</TableHead>
            <TableHead className="text-white text-center">Peserta</TableHead>
            <TableHead className="text-white text-center">Status</TableHead>
            <TableHead className="text-white text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((item) => {
            const cleanName = item.name.replace(/\s*#\d+$/, '').trim();
            const mulai = formatDateTimeDisplay(item.start);
            const selesai = formatDateTimeDisplay(item.end);
            const pkg = PACKAGES.find(pkg => pkg.id === item.packageId);
            return (
              <TableRow key={item.id}>
                <TableCell className="text-cyan-100 font-semibold align-top py-4">{cleanName}</TableCell>
                <TableCell className="text-cyan-100 align-top py-4 whitespace-nowrap text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span>{mulai.tanggal}</span>
                    <span className="text-xs text-cyan-200 font-mono">{mulai.jam}</span>
                  </div>
                </TableCell>
                <TableCell className="text-cyan-100 align-top py-4 whitespace-nowrap text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span>{selesai.tanggal}</span>
                    <span className="text-xs text-cyan-200 font-mono">{selesai.jam}</span>
                  </div>
                </TableCell>
                <TableCell className="text-cyan-100 text-center align-top py-4">{pkg ? pkg.name : '-'}</TableCell>
                <TableCell className="text-cyan-100 text-center align-top py-4">{item.peserta}</TableCell>
                <TableCell className="align-top py-4">
                  {getStatus(item.start, item.end) === 'upcoming' && <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap">Akan Datang</span>}
                  {getStatus(item.start, item.end) === 'live' && <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap">Sedang Berlangsung</span>}
                  {getStatus(item.start, item.end) === 'selesai' && <span className="bg-gray-400 text-white px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap">Selesai</span>}
                </TableCell>
                <TableCell className="flex gap-2 justify-end align-top py-4">
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(item)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(item.id)}><Trash className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal Tambah/Edit Jadwal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg bg-[#11182c] border border-blue-900/40 rounded-3xl shadow p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white mb-2">{editData ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nama Tryout" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-cyan-200 mb-1">Tanggal Mulai</label>
                <Input type="datetime-local" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} />
              </div>
              <div className="flex-1">
                <label className="block text-cyan-200 mb-1">Tanggal Selesai</label>
                <Input type="datetime-local" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} />
              </div>
            </div>
            <select
              className="w-full rounded-md border border-cyan-700 bg-[#0f172a] text-white px-3 py-2"
              value={form.packageId || ''}
              onChange={e => setForm(f => ({ ...f, packageId: e.target.value }))}
            >
              <option value="">Pilih Paket Tryout</option>
              {PACKAGES.map(pkg => (
                <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
              ))}
            </select>
            <Input placeholder="Jumlah Peserta (opsional)" type="text" value={form.peserta} onChange={e => setForm(f => ({ ...f, peserta: e.target.value }))} />
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editData ? 'Simpan Perubahan' : 'Tambah Jadwal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi Hapus */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-md bg-[#11182c] border border-blue-900/40 rounded-3xl shadow p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white mb-2">Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="text-cyan-200 mb-4">Apakah Anda yakin ingin menghapus jadwal tryout ini?</div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 