import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';

const MOCK_PACKAGES = [
  { id: '1', name: 'UTBK Saintek 2023', totalQuestions: 60, status: 'published' },
  { id: '2', name: 'TPS Lengkap', totalQuestions: 40, status: 'draft' },
];

export default function GuruPackages() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-4">Paket Tryout Saya</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PACKAGES.map(pkg => (
          <Card key={pkg.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-cyan-200">Jumlah Soal: {pkg.totalQuestions}</div>
              <div className="mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${pkg.status === 'published' ? 'bg-green-700 text-white' : 'bg-yellow-600 text-white'}`}>{pkg.status === 'published' ? 'Published' : 'Draft'}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" />Lihat</Button>
                <Button size="sm" variant="outline"><Pencil className="w-4 h-4 mr-1" />Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
