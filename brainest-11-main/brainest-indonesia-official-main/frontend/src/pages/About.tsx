import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/30 min-h-screen font-display px-4 md:px-12 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow">Tentang Brainest</h1>
          <p className="text-blue-200 text-lg">
            Platform tryout UTBK online terpercaya untuk memaksimalkan persiapan ujian Anda
          </p>
        </div>
        <Separator />
        <Card className="rounded-2xl shadow-3d bg-blue-3d/80 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold drop-shadow">Misi Kami</CardTitle>
            <CardDescription className="text-blue-200">Membantu siswa di seluruh Indonesia mendapatkan hasil terbaik dalam UTBK</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>
              Brainest didirikan dengan satu tujuan: membantu siswa mempersiapkan UTBK dengan lebih efektif dan efisien. 
              Kami percaya bahwa persiapan yang baik adalah kunci keberhasilan dalam ujian, dan kami berkomitmen untuk 
              menyediakan platform tryout online yang tidak hanya meniru pengalaman UTBK asli, tetapi juga menyediakan 
              analisis mendalam yang membantu siswa mengidentifikasi dan memperbaiki kelemahan mereka.
            </p>
            <p>
              Tim kami terdiri dari para pendidik berpengalaman dan pengembang teknologi yang bersemangat untuk 
              menciptakan alat pembelajaran yang inovatif dan efektif. Bersama-sama, kami berusaha untuk membuat 
              persiapan UTBK menjadi lebih mudah diakses dan lebih produktif bagi semua siswa.
            </p>
          </CardContent>
        </Card>
        <Separator />
        <Card className="rounded-2xl shadow-3d bg-blue-3d/80 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold drop-shadow">Keunggulan Kami</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-full bg-cyan/30 flex items-center justify-center shrink-0 shadow-3d">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Simulasi Realistis</h3>
                  <p className="text-blue-200">
                    Paket tryout kami dirancang untuk meniru UTBK asli dalam hal format, tingkat kesulitan, 
                    dan pengelolaan waktu, membantu siswa menyesuaikan diri dengan kondisi ujian sebenarnya.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-full bg-purple-400/30 flex items-center justify-center shrink-0 shadow-3d">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Evaluasi Komprehensif</h3>
                  <p className="text-blue-200">
                    Setelah setiap tryout, siswa menerima analisis terperinci tentang kinerja mereka, 
                    termasuk bidang yang perlu ditingkatkan dan rekomendasi untuk studi selanjutnya.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-full bg-orange-400/30 flex items-center justify-center shrink-0 shadow-3d">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                    <path d="M18 8a6 6 0 0 1 0 12h-3" />
                    <path d="M6 8a6 6 0 0 0 0 12h3" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="m4 12 8-4 8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Anti-Kecurangan Canggih</h3>
                  <p className="text-blue-200">
                    Sistem keamanan kami menjamin keaslian hasil tryout dengan mendeteksi aktivitas mencurigakan 
                    dan memastikan siswa fokus pada ujian mereka.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-full bg-green-400/30 flex items-center justify-center shrink-0 shadow-3d">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Soal Berkualitas</h3>
                  <p className="text-blue-200">
                    Soal-soal kami dikembangkan oleh tim ahli pendidikan dan diperbarui secara teratur 
                    untuk mencerminkan tren dan pola ujian terkini.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Separator />
        <Card className="rounded-2xl shadow-3d bg-blue-3d/80 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold drop-shadow">Hubungi Kami</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>
              Kami selalu siap membantu dengan pertanyaan, umpan balik, atau masalah yang mungkin Anda miliki.
              Silakan hubungi kami melalui:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="https://wa.me/6281949231254" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 hover:underline transition-colors">
                  0819-4923-1254
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:brainest.indonesia@gmail.com" className="hover:text-cyan-400 hover:underline transition-colors">
                  brainest.indonesia@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Jl. Pegangsaan Timur No 2A, Jakarta Selatan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
