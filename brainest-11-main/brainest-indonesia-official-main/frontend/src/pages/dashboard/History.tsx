import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const MOCK_HISTORY = [
  { id: '1', name: 'UTBK Saintek 2023', date: '2024-05-10', score: 720, status: 'selesai' },
  { id: '2', name: 'TPS Lengkap', date: '2024-04-20', score: 650, status: 'selesai' },
  { id: '3', name: 'UTBK Soshum 2023', date: '2024-03-15', score: null, status: 'belum' },
];

export default function History() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-4">Riwayat Tryout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_HISTORY.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-cyan-200">Tanggal: {item.date}</div>
              <div className="mb-2 text-cyan-200">Skor: {item.score !== null ? item.score : '-'}</div>
              <div className="mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'selesai' ? 'bg-green-700 text-white' : 'bg-yellow-600 text-white'}`}>{item.status === 'selesai' ? 'Selesai' : 'Belum Selesai'}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" />Lihat Hasil</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
