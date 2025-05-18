import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Mock data for existing users (for email uniqueness check)
const EXISTING_USERS = [
  "budi@example.com",
  "siti@example.com",
  "anwar@example.com",
  "dewi@example.com",
  "joko@example.com",
];

export default function UserCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    if (!name.trim()) {
      newErrors.name = 'Nama harus diisi';
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = 'Email harus diisi';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email tidak valid';
      isValid = false;
    } else if (EXISTING_USERS.includes(email.trim().toLowerCase())) {
      newErrors.email = 'Email sudah digunakan';
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
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSuccessMsg(`Undangan telah dikirim ke email ${email}. Silakan cek email untuk aktivasi akun admin. Link berlaku 24 jam.`);
    setShow2FA(true);
    // setTimeout(() => navigate('/admin/users'), 1800); // Redirect di-nonaktifkan agar user bisa aktifkan 2FA
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Tambah Admin</CardTitle>
          <CardDescription className="text-center">
            Isi formulir di bawah untuk menambah akun admin baru
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" className={errors.name ? 'border-red-500' : ''} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" className={errors.email ? 'border-red-500' : ''} />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
              <Label htmlFor="role">Role</Label>
              <Input id="role" value="Admin" readOnly className="bg-[#181f2e] border border-cyan-900/40 text-cyan-100 rounded-xl px-4 py-2 shadow" />
            </div>
            {successMsg && <div className="text-sm font-semibold text-center border border-cyan-500 rounded-md p-2 bg-cyan-900/30 text-cyan-200 shadow">{successMsg}</div>}
            {show2FA && (
              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-cyan-200 text-sm">Aktifkan Two-Factor Authentication (2FA) untuk keamanan ekstra?</span>
                <Button
                  type="button"
                  variant={twoFAEnabled ? "default" : "outline"}
                  className={twoFAEnabled ? "bg-green-700 text-white" : "bg-[#181f2e] text-cyan-200 border-cyan-700"}
                  onClick={() => setTwoFAEnabled(v => !v)}
                >
                  {twoFAEnabled ? "2FA Aktif" : "Aktifkan 2FA"}
                </Button>
                {twoFAEnabled && <span className="text-green-400 text-xs">2FA aktif. Kode OTP akan dikirim saat login.</span>}
                <Button type="button" className="mt-2 bg-utbk-blue hover:bg-utbk-blue/90 w-full" onClick={() => navigate('/admin/users')}>Selesai</Button>
              </div>
            )}
          </CardContent>
          {!show2FA && (
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full bg-utbk-blue hover:bg-utbk-blue/90">Tambah Admin</Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
} 