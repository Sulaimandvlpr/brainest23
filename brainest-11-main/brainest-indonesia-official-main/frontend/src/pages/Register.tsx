import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: form lengkap
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('siswa');
  const [nik, setNik] = useState('');
  const [bukti, setBukti] = useState<File | null>(null);
  const [captcha, setCaptcha] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: '',
    nik: '',
    bukti: '',
    captcha: '',
  });

  // Step 1: Email only
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { ...errors, email: '' };
    if (!email.trim()) {
      newErrors.email = 'Email harus diisi';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email tidak valid';
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;
    // Simulasi kirim OTP
    setOtp('123456');
    setOtpSent(true);
    setSuccessMsg('Kode verifikasi telah dikirim ke email Anda. Silakan cek inbox/spam.');
    setStep(2);
  };

  // Step 2: OTP
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== otp) {
      setErrors((err) => ({ ...err, otp: 'Kode verifikasi salah' }));
      return;
    }
    setEmailVerified(true);
    setStep(3);
    setSuccessMsg('Email berhasil diverifikasi. Silakan lengkapi data pendaftaran.');
  };

  // Step 3: Form lengkap
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      otp: '',
      name: '',
      password: '',
      confirmPassword: '',
      nik: '',
      bukti: '',
      captcha: '',
    };
    if (!name.trim()) {
      newErrors.name = 'Nama harus diisi';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password harus diisi';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
      isValid = false;
    }
    if (role === 'guru') {
      if (!nik.trim()) {
        newErrors.nik = 'NIK wajib diisi';
        isValid = false;
      } else if (!/^\d{16}$/.test(nik)) {
        newErrors.nik = 'NIK harus 16 digit angka';
        isValid = false;
      }
    }
    if (role === 'siswa') {
      if (!bukti) {
        newErrors.bukti = 'Bukti pembayaran wajib diupload';
        isValid = false;
      } else if (bukti && !['image/jpeg', 'image/png'].includes(bukti.type)) {
        newErrors.bukti = 'File harus JPG/PNG';
        isValid = false;
      } else if (bukti && bukti.size > 2 * 1024 * 1024) {
        newErrors.bukti = 'Ukuran file max 2MB';
        isValid = false;
      }
    }
    if (!captcha) {
      newErrors.captcha = 'Verifikasi captcha wajib dicentang';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSuccessMsg('Pendaftaran berhasil! Data Anda akan divalidasi oleh admin Brainest Indonesia dalam waktu maksimal 1x24 jam. Silakan cek email Anda secara berkala untuk informasi selanjutnya.');
    // Reset form (opsional)
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
          <CardDescription className="text-center">
            Isi formulir di bawah untuk membuat akun baru
          </CardDescription>
        </CardHeader>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              {successMsg && <div className="text-sm font-semibold text-center border border-cyan-500 rounded-md p-2 bg-cyan-900/30 text-cyan-200 shadow">{successMsg}</div>}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full bg-utbk-blue hover:bg-utbk-blue/90" disabled={isLoading}>Kirim OTP</Button>
              <div className="text-center text-sm">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-utbk-blue hover:text-utbk-blue/90 font-medium">Login</Link>
              </div>
            </CardFooter>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Kode Verifikasi Email</Label>
                <Input id="otp" value={otpInput} onChange={e => setOtpInput(e.target.value)} placeholder="Masukkan kode OTP" className={errors.otp ? 'border-red-500' : ''} />
                {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
              </div>
              {successMsg && <div className="text-sm font-semibold text-center border border-cyan-500 rounded-md p-2 bg-cyan-900/30 text-cyan-200 shadow">{successMsg}</div>}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full bg-utbk-blue hover:bg-utbk-blue/90" disabled={isLoading}>Verifikasi</Button>
              <div className="text-center text-sm">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-utbk-blue hover:text-utbk-blue/90 font-medium">Login</Link>
              </div>
            </CardFooter>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className={errors.password ? 'border-red-500' : ''} />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className={errors.confirmPassword ? 'border-red-500' : ''} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Daftar sebagai</Label>
                <select
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-[#181f2e] border border-cyan-900/40 text-cyan-100 rounded-xl px-4 py-2 shadow focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 placeholder:text-cyan-400"
                >
                  <option value="siswa" className="bg-[#181f2e] text-cyan-100">Murid</option>
                  <option value="guru" className="bg-[#181f2e] text-cyan-100">Guru</option>
                </select>
              </div>
              {role === 'guru' && (
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
                  <Input
                    id="nik"
                    value={nik}
                    onChange={e => setNik(e.target.value)}
                    placeholder="16 digit NIK"
                    maxLength={16}
                    className={
                      (errors.nik ? 'border-red-500 ' : '') +
                      'w-full bg-[#181f2e] border border-cyan-900/40 text-cyan-100 rounded-xl px-4 py-2 shadow focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 placeholder:text-cyan-400'
                    }
                  />
                  {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                </div>
              )}
              {role === 'siswa' && (
                <div className="space-y-2">
                  <Label htmlFor="bukti">Upload Bukti Pembayaran</Label>
                  <div className="w-full flex items-center justify-center bg-[#181f2e] border border-cyan-900/40 text-cyan-100 rounded-xl px-4 py-2 shadow focus-within:ring-2 focus-within:ring-cyan-600 focus-within:border-cyan-600">
                    <label htmlFor="bukti" className="font-bold text-cyan-200 cursor-pointer mr-3">Pilih File</label>
                    <Input
                      id="bukti"
                      type="file"
                      accept="image/jpeg,image/png"
                      ref={fileInputRef}
                      onChange={e => setBukti(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <span className="flex-1 text-cyan-300 text-center">{bukti ? bukti.name : 'Tidak ada file yang dipilih'}</span>
                  </div>
                  {errors.bukti && <p className="text-sm text-destructive">{errors.bukti}</p>}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="captcha" checked={captcha} onChange={e => setCaptcha(e.target.checked)} />
                <label htmlFor="captcha" className="text-sm">Saya bukan robot</label>
              </div>
              {errors.captcha && <p className="text-sm text-destructive">{errors.captcha}</p>}
              {successMsg && <div className="text-sm font-semibold text-center border border-cyan-500 rounded-md p-2 bg-cyan-900/30 text-cyan-200 shadow">{successMsg}</div>}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full bg-utbk-blue hover:bg-utbk-blue/90" disabled={isLoading}>Daftar</Button>
              <div className="text-center text-sm">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-utbk-blue hover:text-utbk-blue/90 font-medium">Login</Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
