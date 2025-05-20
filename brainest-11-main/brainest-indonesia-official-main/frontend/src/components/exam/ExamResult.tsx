import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MOCK_RESULT = {
  name: 'UTBK Saintek 2023',
  score: 720,
  status: 'Lulus',
};

export default function ExamResult() {
  return (
    <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full">
              <CardHeader>
          <CardTitle className="text-2xl text-center">Hasil Tryout</CardTitle>
              </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-lg font-bold text-cyan-300">{MOCK_RESULT.name}</div>
          <div className="text-4xl font-extrabold text-white">{MOCK_RESULT.score}</div>
          <div className={`px-4 py-2 rounded-full text-lg font-bold ${MOCK_RESULT.status === 'Lulus' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>{MOCK_RESULT.status}</div>
          <Button className="mt-4" asChild>
            <Link to="/dashboard">Kembali ke Dashboard</Link>
                      </Button>
                  </CardContent>
                </Card>
    </div>
  );
}
