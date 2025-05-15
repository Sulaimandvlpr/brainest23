import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSecureExam } from "@/hooks/useSecureExam";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { useRef } from 'react';

// Mock data for exam questions
const mockExams = {
  "5": {
    id: "5",
    name: "Tryout Nasional 5",
    totalQuestions: 100,
    duration: 120, // in minutes
    subjects: ["Penalaran Matematika (PM)", "Penalaran Umum (PU)", "Pengetahuan Kuantitatif (PK)", "Pemahaman Bacaan dan Menulis (PBM)"],
    questions: Array(100).fill(null).map((_, idx) => ({
      id: `5-${idx + 1}`,
      number: idx + 1,
      question: `Ini adalah pertanyaan nomor ${idx + 1} untuk Tryout Nasional 5?`,
      options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E"],
      subject: idx % 4 === 0 ? "Penalaran Matematika (PM)" : 
              idx % 4 === 1 ? "Penalaran Umum (PU)" : 
              idx % 4 === 2 ? "Pengetahuan Kuantitatif (PK)" : 
              "Pemahaman Bacaan dan Menulis (PBM)",
    })),
  },
  "6": {
    id: "6",
    name: "Tryout Khusus Saintek",
    totalQuestions: 80,
    duration: 90, // in minutes
    subjects: ["Penalaran Umum (PU)", "Pengetahuan Kuantitatif (PK)", "Pemahaman Bacaan dan Menulis (PBM)", "Pengetahuan dan Pemahaman Umum (PPU)"],
    questions: Array(80).fill(null).map((_, idx) => ({
      id: `6-${idx + 1}`,
      number: idx + 1,
      question: `Ini adalah pertanyaan nomor ${idx + 1} untuk Tryout Khusus Saintek?`,
      options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E"],
      subject: idx % 4 === 0 ? "Penalaran Umum (PU)" : 
              idx % 4 === 1 ? "Pengetahuan Kuantitatif (PK)" : 
              idx % 4 === 2 ? "Pemahaman Bacaan dan Menulis (PBM)" : 
              "Pengetahuan dan Pemahaman Umum (PPU)",
    })),
  },
};

interface ExamQuestion {
  id: string;
  number: number;
  question: string;
  options: string[];
  subject: string;
}

interface Exam {
  id: string;
  name: string;
  totalQuestions: number;
  duration: number;
  subjects: string[];
  questions: ExamQuestion[];
}

const subtestMap: Record<string, string> = {
  "Matematika": "Penalaran Matematika (PM)",
  "B. Indonesia": "Literasi Bahasa Indonesia (LBI)",
  "B. Inggris": "Literasi Bahasa Inggris (LBE)",
  "IPA": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Fisika": "Penalaran Umum (PU)",
  "Kimia": "Pengetahuan Kuantitatif (PK)",
  "Biologi": "Pemahaman Bacaan dan Menulis (PBM)",
  "Geografi": "Pengetahuan dan Pemahaman Umum (PPU)",
  "Ekonomi": "Pengetahuan Kuantitatif (PK)",
  "Sejarah": "Pemahaman Bacaan dan Menulis (PBM)",
  "Sosiologi": "Penalaran Umum (PU)"
};

export default function ExamInterface() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the exam data
  const examData = id ? (mockExams[id as keyof typeof mockExams] as Exam) : null;
  
  // State for the exam
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remainingTime, setRemainingTime] = useState(examData ? examData.duration * 60 : 0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Anti-cheating security hooks
  const { 
    isFullScreen,
    startSecureExam,
    endSecureExam,
    isExamActive,
  } = useSecureExam({
    onExamTerminated: () => {
      handleSubmitExam();
    },
    onFullScreenExit: () => {
      toast({
        title: "Peringatan",
        description: "Mode layar penuh dimatikan. Harap aktifkan kembali untuk melanjutkan ujian.",
        variant: "destructive",
      });
    },
  });

  // Effect to redirect if exam not found
  useEffect(() => {
    if (!examData) {
      navigate('/dashboard/packages', { replace: true });
    }
  }, [examData, navigate]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isExamStarted && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && isExamStarted) {
      handleSubmitExam();
    }

    return () => clearInterval(interval);
  }, [isExamStarted, remainingTime]);

  // Exam start handler
  const handleStartExam = async () => {
    await startSecureExam();
    setIsExamStarted(true);
    toast({
      title: "Ujian Dimulai",
      description: `Ujian ${examData?.name} telah dimulai. Tetap fokus dan jangan tinggalkan halaman.`,
    });
  };

  // Answer selection handler
  const handleAnswerSelect = (optionIndex: number) => {
    if (!isExamStarted || isExamSubmitted) return;

    const questionId = examData?.questions[currentQuestion].id;
    if (!questionId) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Navigation handlers
  const handleNextQuestion = () => {
    if (currentQuestion < (examData?.totalQuestions || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Jump to question handler
  const handleJumpToQuestion = (questionNumber: number) => {
    setCurrentQuestion(questionNumber - 1);
  };

  // Submit exam handler
  const handleSubmitExam = () => {
    if (showConfirmation) {
      setIsExamSubmitted(true);
      endSecureExam();
      
      // Calculate result (in real app, this would be sent to the server)
      const totalAnswered = Object.keys(answers).length;
      
      toast({
        title: "Ujian Selesai",
        description: `Anda telah menyelesaikan ${totalAnswered} dari ${examData?.totalQuestions} soal.`,
      });
      
      // Store result in localStorage (temporary, in a real app it would be sent to a server)
      if (examData) {
        const resultData = {
          examId: examData.id,
          examName: examData.name,
          totalQuestions: examData.totalQuestions,
          totalAnswered,
          answers,
          date: new Date().toISOString(),
        };
        
        const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]');
        localStorage.setItem('examResults', JSON.stringify([...existingResults, resultData]));
      }
      
      // Navigate to result page
      navigate(`/exam/result/${id}`, { state: { answers } });
    } else {
      setShowConfirmation(true);
    }
  };

  // Cancel submission
  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  // Format remaining time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!examData) {
    return null;
  }

  if (!isExamStarted) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="border-2 border-utbk-blue/20">
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-3xl font-bold">{examData.name}</h1>
              <p className="text-muted-foreground">
                Siap untuk memulai tryout? Pastikan koneksi internet Anda stabil dan tidak terganggu.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jumlah Soal:</p>
                <p className="font-medium">{examData.totalQuestions} soal</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Durasi:</p>
                <p className="font-medium">{examData.duration} menit</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Mata Pelajaran:</p>
                <div className="flex flex-wrap gap-2">
                  {examData.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Alert className="mb-8">
              <AlertTitle>Petunjuk Tryout</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>1. Tryout akan dilakukan dalam mode layar penuh untuk mencegah kecurangan.</p>
                <p>2. Jangan meninggalkan halaman atau membuka tab lain selama ujian berlangsung.</p>
                <p>3. Jawaban Anda akan tersimpan otomatis.</p>
                <p>4. Ujian akan berakhir secara otomatis ketika waktu habis.</p>
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <Button 
                onClick={handleStartExam} 
                className="bg-utbk-blue hover:bg-utbk-blue/90 px-8"
                size="lg"
              >
                Mulai Tryout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = examData.questions[currentQuestion];
  const selectedAnswer = answers[question.id];
  const isAnswered = selectedAnswer !== undefined;
  const isFlaggedForReview = false; // This could be a future feature
  const answeredCount = Object.keys(answers).length;
  const questionsMap = examData.questions.map((q) => ({
    number: q.number,
    isAnswered: answers[q.id] !== undefined,
    isFlagged: false, // For future feature
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Warning for fullscreen mode */}
      {!isFullScreen && isExamActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Mode Layar Penuh Diperlukan</h3>
            <p className="mb-4">
              Anda harus mengaktifkan mode layar penuh untuk melanjutkan tryout.
            </p>
            <Button onClick={startSecureExam} className="w-full bg-utbk-blue hover:bg-utbk-blue/90">
              Aktifkan Mode Layar Penuh
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Pengumpulan</h3>
            <p className="mb-2">
              Anda yakin ingin mengumpulkan tryout ini?
            </p>
            <p className="mb-4 text-muted-foreground text-sm">
              Anda telah menjawab {answeredCount} dari {examData.totalQuestions} soal.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleCancelSubmit} variant="outline" className="w-1/2">
                Batal
              </Button>
              <Button onClick={handleSubmitExam} className="w-1/2 bg-utbk-blue hover:bg-utbk-blue/90">
                Ya, Kumpulkan
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        {/* Sidebar for question navigation */}
        <div className="lg:col-span-1 bg-muted/30 overflow-y-auto lg:h-screen p-4 border-r">
          <div className="sticky top-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Navigasi Soal</h2>
              <Badge variant={remainingTime < 300 ? "destructive" : "secondary"}>
                {formatTime(remainingTime)}
              </Badge>
            </div>
            
            <div className="p-2 bg-card rounded-md text-sm">
              <div className="flex justify-between">
                <span>Total: {examData.totalQuestions}</span>
                <span>Dijawab: {answeredCount}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {questionsMap.map((q) => (
                <Button
                  key={q.number}
                  variant={q.isAnswered ? "default" : "outline"}
                  className={`h-10 p-0 ${q.number === currentQuestion + 1 ? "border-2 border-utbk-orange" : ""} ${
                    q.isAnswered ? "bg-utbk-blue hover:bg-utbk-blue/90" : ""
                  } ${q.isFlagged ? "border-yellow-500" : ""}`}
                  onClick={() => handleJumpToQuestion(q.number)}
                >
                  {q.number}
                </Button>
              ))}
            </div>
            
            <div className="flex flex-col space-y-2 pt-4">
              <Button onClick={handleSubmitExam} className="bg-utbk-orange hover:bg-utbk-orange/90">
                Kumpulkan Tryout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3 p-6 overflow-y-auto">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <Badge variant="outline">{question.subject}</Badge>
              <h2 className="text-lg font-semibold mt-1">
                Soal {currentQuestion + 1} dari {examData.totalQuestions}
              </h2>
            </div>
            <Badge variant={remainingTime < 300 ? "destructive" : "secondary"} className="lg:hidden">
              {formatTime(remainingTime)}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="whitespace-pre-line">{question.question}</p>
            </CardContent>
          </Card>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 border rounded-md transition-colors ${
                  selectedAnswer === index 
                  ? "bg-utbk-blue text-white border-utbk-blue"
                  : "bg-card border-border hover:border-utbk-blue"
                }`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevQuestion}
              variant="outline"
              disabled={currentQuestion === 0}
            >
              Sebelumnya
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestion === examData.totalQuestions - 1}
              className="bg-utbk-blue hover:bg-utbk-blue/90"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
