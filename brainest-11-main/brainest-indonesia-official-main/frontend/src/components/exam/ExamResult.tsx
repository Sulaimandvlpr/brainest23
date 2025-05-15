import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for exam answers and results
const mockExams = {
  "5": {
    id: "5",
    name: "Tryout Nasional 5",
    totalQuestions: 100,
    duration: 120,
    subjects: ["Matematika", "B. Indonesia", "B. Inggris", "IPA"],
    subjectsCount: {
      "Matematika": 25,
      "B. Indonesia": 25,
      "B. Inggris": 25,
      "IPA": 25,
    },
    correctAnswers: {},
  },
  "6": {
    id: "6",
    name: "Tryout Khusus Saintek",
    totalQuestions: 80,
    duration: 90,
    subjects: ["Matematika", "Fisika", "Kimia", "Biologi"],
    subjectsCount: {
      "Matematika": 20,
      "Fisika": 20,
      "Kimia": 20,
      "Biologi": 20,
    },
    correctAnswers: {},
  },
};

const subtestMap: Record<string, string> = {
  "Matematika": "Penalaran Matematika (PM)",
  "B. Indonesia": "Literasi Bahasa Indonesia (LBI)",
  "B. Inggris": "Literasi Bahasa Inggris (LBE)",
  "IPA": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Fisika": "Penalaran Umum (PU)",
  "Kimia": "Pengetahuan Kuantitatif (PK)",
  "Biologi": "Pemahaman Bacaan dan Menulis (PBM)"
};

// Generate random correct answers for mock data
Object.keys(mockExams).forEach(examId => {
  const exam = mockExams[examId as keyof typeof mockExams];
  exam.questions = Array(exam.totalQuestions).fill(null).map((_, idx) => ({
    id: `${examId}-${idx + 1}`,
    number: idx + 1,
    question: `Ini adalah pertanyaan nomor ${idx + 1}?`,
    options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E"],
    correctAnswer: Math.floor(Math.random() * 5),
    explanation: `Penjelasan untuk soal nomor ${idx + 1}.`,
    subject: Object.keys(exam.subjectsCount)[idx % Object.keys(exam.subjectsCount).length],
  }));
  
  exam.questions.forEach(q => {
    exam.correctAnswers[q.id] = q.correctAnswer;
  });
});

// UTBK Score Calculation (simplified for demo)
const calculateUTBKScore = (totalCorrect: number, totalQuestions: number) => {
  // Base score 200, max score 1000
  const baseScore = 200;
  const maxAdditionalScore = 800;
  
  // Calculate score based on percentage correct
  const percentageCorrect = totalCorrect / totalQuestions;
  const additionalScore = Math.round(percentageCorrect * maxAdditionalScore);
  
  return baseScore + additionalScore;
};

// Fungsi ranking per paket
function getRankingData(packageId: string, userScore: number | undefined) {
  const key = `ranking_${packageId}`;
  let rankingData: number[] = [];
  try {
    rankingData = JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    rankingData = [];
  }
  if (userScore && !rankingData.includes(userScore)) {
    rankingData.push(userScore);
    localStorage.setItem(key, JSON.stringify(rankingData));
  }
  rankingData.sort((a, b) => b - a);
  const userRank = userScore ? rankingData.indexOf(userScore) + 1 : null;
  const highest = rankingData[0] || 0;
  const avg = rankingData.length ? Math.round(rankingData.reduce((a, b) => a + b, 0) / rankingData.length) : 0;
  const dist: Record<string, number> = {};
  rankingData.forEach(s => {
    const group = `${Math.floor(s/50)*50}-${Math.floor(s/50)*50+49}`;
    dist[group] = (dist[group] || 0) + 1;
  });
  return { userRank, total: rankingData.length, highest, avg, dist, userScore };
}

export default function ExamResult() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const userAnswers = location.state?.answers || {};
  
  const [activeTab, setActiveTab] = useState("summary");
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  
  // Get exam data
  const examData = id ? mockExams[id as keyof typeof mockExams] : null;
  
  // Calculate results
  const calculateResults = () => {
    if (!examData) return null;
    
    let totalCorrect = 0;
    let totalWrong = 0;
    const subjectResults: Record<string, { correct: number, total: number }> = {};
    
    // Initialize subject results
    examData.subjects.forEach(subject => {
      subjectResults[subject] = { correct: 0, total: 0 };
    });
    
    // Calculate correct and wrong answers
    examData.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      const subject = question.subject;
      
      // Increment subject totals
      subjectResults[subject].total += 1;
      
      // If user answered this question
      if (userAnswer !== undefined) {
        if (isCorrect) {
          totalCorrect += 1;
          subjectResults[subject].correct += 1;
        } else {
          totalWrong += 1;
        }
      } else {
        totalWrong += 1; // Count unanswered as wrong
      }
    });
    
    // Calculate UTBK score
    const utbkScore = calculateUTBKScore(totalCorrect, examData.totalQuestions);
    
    // Calculate subject scores
    const subjectScores = Object.keys(subjectResults).map(subject => {
      const { correct, total } = subjectResults[subject];
      const score = calculateUTBKScore(correct, total);
      const percentage = total > 0 ? (correct / total) * 100 : 0;
      
      return {
        subject,
        score,
        percentage: Math.round(percentage),
        correct,
        total,
      };
    });
    
    return {
      totalAnswered: Object.keys(userAnswers).length,
      totalCorrect,
      totalWrong,
      utbkScore,
      subjectScores,
      subjectResults,
      accuracy: Math.round((totalCorrect / examData.totalQuestions) * 100),
    };
  };
  
  const results = calculateResults();
  
  // Toggle explanation visibility
  const toggleExplanation = (questionId: string) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  if (!examData || !results) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Hasil tidak ditemukan</h1>
        <p className="text-muted-foreground mb-8">
          Data hasil tryout tidak tersedia atau telah kedaluwarsa.
        </p>
        <Button asChild className="bg-utbk-blue hover:bg-utbk-blue/90">
          <Link to="/dashboard/packages">Kembali ke Paket Tryout</Link>
        </Button>
      </div>
    );
  }

  // Prepare chart data
  const overviewData = [
    { name: "Benar", value: results.totalCorrect, color: "#10b981" },
    { name: "Salah", value: results.totalWrong, color: "#ef4444" },
  ];
  
  const subjectChartData = results.subjectScores.map(subject => ({
    name: subject.subject,
    score: subject.percentage,
    color: subject.percentage >= 80 ? "#10b981" : subject.percentage >= 60 ? "#f97316" : "#ef4444"
  }));

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{examData.name} - Hasil</h1>
        <p className="text-muted-foreground mt-2">
          Berikut adalah hasil dan analisis dari tryout Anda
        </p>
      </div>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          <TabsTrigger value="subjects">Performa per Mapel</TabsTrigger>
          <TabsTrigger value="questions">Analisis Soal</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className={`border-l-4 ${results.utbkScore >= 700 ? 'border-l-green-500' : results.utbkScore >= 500 ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Skor UTBK</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{results.utbkScore}</div>
                <p className="text-xs text-muted-foreground">dari 1000 poin</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Akurasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{results.accuracy}%</div>
                <p className="text-xs text-muted-foreground">
                  {results.totalCorrect} benar dari {examData.totalQuestions} soal
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Soal Terjawab</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{results.totalAnswered}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((results.totalAnswered / examData.totalQuestions) * 100)}% dari total soal
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Waktu Pengerjaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{examData.duration} menit</div>
                <p className="text-xs text-muted-foreground">Durasi penuh tryout</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Jawaban</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overviewData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {overviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performa per Mata Pelajaran</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Persentase Benar']} />
                      <Bar dataKey="score" name="Persentase Benar">
                        {subjectChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button asChild className="bg-utbk-blue hover:bg-utbk-blue/90">
              <Link to="/dashboard/history">Lihat Semua Riwayat</Link>
            </Button>
          </div>
          
          <div className="mt-6">
            {(() => {
              const rank = getRankingData(examData.id, results.utbkScore);
              return (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Ranking Paket Tryout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm mb-2">Peringkat Anda: {rank.userRank} dari {rank.total} peserta</div>
                    <div className="text-sm mb-2">Skor tertinggi: {rank.highest}</div>
                    <div className="text-sm mb-2">Rata-rata skor: {rank.avg}</div>
                    <div className="text-sm mb-2">Skor Anda: {rank.userScore}</div>
                    <div className="text-sm mb-2">Distribusi Skor:</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(rank.dist).map(([range, count]) => (
                        <span key={range}>{range}: {count}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </TabsContent>
        
        {/* Subjects Tab */}
        <TabsContent value="subjects">
          <div className="grid gap-6 md:grid-cols-2">
            {results.subjectScores.map((subject) => (
              <Card key={subject.subject} className={`border-l-4 ${
                subject.percentage >= 80 ? 'border-l-green-500' : 
                subject.percentage >= 60 ? 'border-l-yellow-500' : 
                'border-l-red-500'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{subject.subject}</span>
                    <Badge className={`${
                      subject.percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      subject.percentage >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {subject.percentage}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Skor UTBK</span>
                        <span className="font-medium">{subject.score}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Jawaban Benar</span>
                        <span className="font-medium">{subject.correct} dari {subject.total}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Persentase</span>
                        <span className="font-medium">{subject.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            subject.percentage >= 80 ? 'bg-green-500' : 
                            subject.percentage >= 60 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium mb-1">Rekomendasi:</p>
                      <p className="text-muted-foreground">
                        {subject.percentage >= 80 
                          ? `Pertahankan pemahaman Anda di bidang ${subject.subject}. Fokus pada materi lain yang masih kurang.`
                          : subject.percentage >= 60 
                          ? `Tingkatkan pemahaman Anda di bidang ${subject.subject} dengan latihan lebih intensif.`
                          : `Anda perlu belajar lebih giat di bidang ${subject.subject}. Fokuskan pada konsep dasar.`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Analisis Detail Soal</h3>
            <Select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-40"
            >
              <option value="summary">Ringkasan</option>
              <option value="subjects">Per Mapel</option>
              <option value="questions">Analisis Soal</option>
            </Select>
          </div>
          
          <div className="space-y-4">
            {examData.questions.map((question) => {
              const userAnswer = userAnswers[question.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = userAnswer === question.correctAnswer;
              const showExplanation = showExplanations[question.id] || false;
              
              return (
                <Card 
                  key={question.id}
                  className={`border-l-4 ${isAnswered 
                    ? (isCorrect ? 'border-l-green-500' : 'border-l-red-500')
                    : 'border-l-gray-400'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge variant="outline" className="mb-2">{question.subject}</Badge>
                        <h4 className="font-medium">Soal {question.number}</h4>
                      </div>
                      <Badge 
                        className={`${!isAnswered
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : isCorrect
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {!isAnswered ? 'Tidak Dijawab' : isCorrect ? 'Benar' : 'Salah'}
                      </Badge>
                    </div>
                    
                    <p className="mb-4 whitespace-pre-line">{question.question}</p>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-md border ${
                            idx === question.correctAnswer
                              ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
                              : idx === userAnswer
                              ? 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700'
                              : 'bg-card border-border'
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          {option}
                          {idx === userAnswer && idx !== question.correctAnswer && (
                            <span className="ml-2 text-red-500">(Jawaban Anda)</span>
                          )}
                          {idx === question.correctAnswer && (
                            <span className="ml-2 text-green-500">(Jawaban Benar)</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleExplanation(question.id)}
                      >
                        {showExplanation ? 'Sembunyikan Penjelasan' : 'Lihat Penjelasan'}
                      </Button>
                      
                      {showExplanation && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-md">
                          <p className="text-sm whitespace-pre-line">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center gap-4 mt-8">
        <Button asChild variant="outline">
          <Link to="/dashboard/packages">Paket Tryout Lainnya</Link>
        </Button>
        <Button asChild className="bg-utbk-blue hover:bg-utbk-blue/90">
          <Link to="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
