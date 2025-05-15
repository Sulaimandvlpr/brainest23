import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-3d via-blue-3d-light to-cyan/30 font-display">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="py-20 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-utbk-blue to-utbk-purple bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(59,130,246,0.4)]">
              Persiapkan UTBK Lebih Efektif Bersama Brainest
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Platform tryout online yang dirancang khusus untuk membantu persiapan UTBK dengan keamanan tinggi dan evaluasi komprehensif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button asChild size="lg" variant="3d">
                  <Link to="/dashboard">Lihat Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" variant="3d">
                    <Link to="/register">Daftar Sekarang</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="py-16 px-4 pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 overflow-visible">
          <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-16 overflow-visible">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.04, y: -8, boxShadow: "0 8px 40px 0 rgba(34,211,238,0.18)" }}
                className="h-full flex flex-col"
              >
                {i === 0 && (
                  <Card className="p-8 flex flex-col items-center text-center min-h-[430px] h-full justify-between">
                    <CardContent className="flex flex-col items-center text-center flex-1 justify-between">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-3d/40 to-cyan-400/30 flex items-center justify-center mb-5 shadow-3d">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-utbk-blue">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Sistem Anti-Kecurangan</h3>
                        <p className="text-blue-200 mb-2">
                  Mode layar penuh otomatis, deteksi perpindahan tab, dan fitur keamanan lainnya untuk menjamin keaslian hasil tryout.
                </p>
                        <p className="text-blue-300 text-sm mb-2">Keamanan data dan hasil tryout Anda terjamin dengan sistem monitoring real-time.</p>
                        <p className="text-blue-300 text-sm">Sistem kami juga mendukung pelaporan otomatis jika terdeteksi aktivitas mencurigakan selama ujian berlangsung.</p>
                      </div>
              </CardContent>
            </Card>
                )}
                {i === 1 && (
                  <Card className="p-8 flex flex-col items-center text-center min-h-[430px] h-full justify-between">
                    <CardContent className="flex flex-col items-center text-center flex-1 justify-between">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-utbk-purple/40 to-cyan-400/30 flex items-center justify-center mb-5 shadow-3d">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-utbk-purple">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Simulasi UTBK Realistis</h3>
                        <p className="text-blue-200 mb-2">
                  Merasakan pengalaman ujian yang menyerupai UTBK asli dengan waktu hitung mundur dan format soal yang serupa.
                </p>
                        <p className="text-blue-300 text-sm mb-2">Soal dan tampilan dibuat semirip mungkin dengan UTBK asli, lengkap dengan timer otomatis.</p>
                        <p className="text-blue-300 text-sm">Latihan dengan simulasi ini membantu Anda membiasakan diri dengan tekanan waktu dan suasana ujian sebenarnya.</p>
                      </div>
              </CardContent>
            </Card>
                )}
                {i === 2 && (
                  <Card className="p-8 flex flex-col items-center text-center min-h-[430px] h-full justify-between">
                    <CardContent className="flex flex-col items-center text-center flex-1 justify-between">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-utbk-orange/40 to-cyan-400/30 flex items-center justify-center mb-5 shadow-3d">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-utbk-orange">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Evaluasi Komprehensif</h3>
                        <p className="text-blue-200 mb-2">
                  Dapatkan analisis mendalam tentang performa Anda dengan penjelasan untuk setiap jawaban salah.
                </p>
                        <p className="text-blue-300 text-sm mb-2">Laporan hasil tryout lengkap dengan grafik dan rekomendasi belajar personal.</p>
                        <p className="text-blue-300 text-sm">Evaluasi ini membantu Anda mengetahui kelemahan dan kelebihan, serta strategi belajar yang lebih efektif.</p>
                      </div>
              </CardContent>
            </Card>
                )}
                {i === 3 && (
                  <Card className="p-8 flex flex-col items-center text-center min-h-[430px] h-full justify-between">
                    <CardContent className="flex flex-col items-center text-center flex-1 justify-between">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-3d/40 to-cyan-400/30 flex items-center justify-center mb-5 shadow-3d">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-utbk-blue">
                    <path d="M20 7h-9" />
                    <path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Lacak Perkembangan</h3>
                        <p className="text-blue-200 mb-2">
                  Pantau kemajuan belajar Anda dari waktu ke waktu dengan visualisasi grafik yang mudah dipahami.
                </p>
                        <p className="text-blue-300 text-sm mb-2">Fitur progress tracker membantu Anda tetap termotivasi dan konsisten belajar.</p>
                        <p className="text-blue-300 text-sm">Setiap pencapaian akan tercatat, sehingga Anda bisa melihat perkembangan secara nyata dari waktu ke waktu.</p>
                      </div>
              </CardContent>
            </Card>
                )}
                {i === 4 && (
                  <Card className="p-8 flex flex-col items-center text-center min-h-[430px] h-full justify-between">
                    <CardContent className="flex flex-col items-center text-center flex-1 justify-between">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-utbk-purple/40 to-cyan-400/30 flex items-center justify-center mb-5 shadow-3d">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-utbk-purple">
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Akses Multiplatform</h3>
                        <p className="text-blue-200 mb-2">
                  Akses platform dari laptop, tablet, atau smartphone untuk belajar di mana saja dan kapan saja.
                </p>
                        <p className="text-blue-300 text-sm mb-2">Optimasi UI/UX untuk semua perangkat, belajar jadi fleksibel tanpa hambatan.</p>
                        <p className="text-blue-300 text-sm">Tidak perlu install aplikasi tambahan, cukup akses lewat browser favorit Anda.</p>
                      </div>
              </CardContent>
            </Card>
                )}
                {i === 5 && (
                  <Card className="p-8 flex flex-col items-center text-center min-h-[430px] h-full justify-between">
                    <CardContent className="flex flex-col items-center text-center flex-1 justify-between">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-utbk-orange/40 to-cyan-400/30 flex items-center justify-center mb-5 shadow-3d">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-utbk-orange">
                    <path d="M2 12h20" />
                    <path d="M12 2v20" />
                    <path d="m4.93 4.93 14.14 14.14" />
                    <path d="m19.07 4.93-14.14 14.14" />
                  </svg>
                </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">Mode Gelap</h3>
                        <p className="text-blue-200 mb-2">
                  Belajar di malam hari dengan nyaman menggunakan mode gelap yang menjaga kesehatan mata.
                </p>
                        <p className="text-blue-300 text-sm mb-2">Tampilan gelap yang elegan, nyaman untuk belajar lama tanpa membuat mata lelah.</p>
                        <p className="text-blue-300 text-sm">Mode gelap juga membantu menghemat baterai perangkat Anda dan mengurangi silau layar.</p>
                      </div>
              </CardContent>
            </Card>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="py-16 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white drop-shadow">Siap Menghadapi UTBK?</h2>
            <p className="text-lg text-blue-200">
              Mulai persiapan UTBK Anda sekarang dengan platform tryout online kami yang terpercaya.
            </p>
            {user ? (
              <Button asChild size="lg" variant="3d">
                <Link to="/dashboard/packages">Lihat Paket Tryout</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="3d">
                <Link to="/register">Mulai Sekarang</Link>
              </Button>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
