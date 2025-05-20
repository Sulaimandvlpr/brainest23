import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface PerformanceData {
  date: string;
  score: number;
  timeSpent: number;
  accuracy: number;
}

interface SubjectPerformance {
  subject: string;
  score: number;
  averageScore: number;
  percentile: number;
}

interface PerformanceAnalysisProps {
  tryoutId: string;
  userId: string;
}

export function PerformanceAnalysis({ tryoutId, userId }: PerformanceAnalysisProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [overallStats, setOverallStats] = useState({
    averageScore: 0,
    highestScore: 0,
    totalTimeSpent: 0,
    totalAccuracy: 0
  });

  useEffect(() => {
    // Fetch performance data
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tryout/${tryoutId}/performance/${userId}`);
        const data = await response.json();
        
        setPerformanceData(data.history);
        setSubjectPerformance(data.subjects);
        setOverallStats(data.overall);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchData();
  }, [tryoutId, userId]);

  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card className="bg-blue-3d/70 border-cyan/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Analisis Performa Keseluruhan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-3d-light/60 p-4 rounded-xl">
              <h3 className="text-blue-200 text-sm">Rata-rata Skor</h3>
              <p className="text-2xl font-bold text-white">{overallStats.averageScore}</p>
            </div>
            <div className="bg-blue-3d-light/60 p-4 rounded-xl">
              <h3 className="text-blue-200 text-sm">Skor Tertinggi</h3>
              <p className="text-2xl font-bold text-white">{overallStats.highestScore}</p>
            </div>
            <div className="bg-blue-3d-light/60 p-4 rounded-xl">
              <h3 className="text-blue-200 text-sm">Total Waktu</h3>
              <p className="text-2xl font-bold text-white">{overallStats.totalTimeSpent}m</p>
            </div>
            <div className="bg-blue-3d-light/60 p-4 rounded-xl">
              <h3 className="text-blue-200 text-sm">Akurasi</h3>
              <p className="text-2xl font-bold text-white">{overallStats.totalAccuracy}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance History Chart */}
      <Card className="bg-blue-3d/70 border-cyan/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Riwayat Performa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                <XAxis dataKey="date" stroke="#93c5fd" />
                <YAxis stroke="#93c5fd" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e3a8a',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card className="bg-blue-3d/70 border-cyan/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Performa per Subjek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-3d-light/60 p-4 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{subject.subject}</h3>
                    <p className="text-blue-200 text-sm">
                      Rata-rata: {subject.averageScore} | Percentile: {subject.percentile}%
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-white">{subject.score}</div>
                </div>
                <div className="mt-2 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${subject.percentile}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 