import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email tidak valid!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Kode verifikasi dikirim ke email!");
      setStep(2);
    }, 1000);
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Kode harus 6 digit!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Kode benar, silakan buat password baru.");
      setStep(3);
    }, 1000);
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPass.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password berhasil direset! Silakan login dengan password baru.");
      setStep(1);
      setEmail(""); setOtp(""); setNewPass(""); setConfirmPass("");
    }, 1000);
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Masukkan email akun Anda" autoFocus />
              </div>
              <Button type="submit" className="w-full bg-utbk-blue hover:bg-utbk-blue/90" disabled={loading}>{loading ? "Mengirim..." : "Kirim Kode"}</Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block mb-1 font-semibold">Kode Verifikasi</label>
                <Input id="otp" type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ""))} maxLength={6} placeholder="Masukkan 6 digit kode" autoFocus />
              </div>
              <Button type="submit" className="w-full bg-utbk-blue hover:bg-utbk-blue/90" disabled={loading}>{loading ? "Memverifikasi..." : "Verifikasi Kode"}</Button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPass" className="block mb-1 font-semibold">Password Baru</label>
                <Input id="newPass" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Password baru" autoFocus />
              </div>
              <div>
                <label htmlFor="confirmPass" className="block mb-1 font-semibold">Konfirmasi Password</label>
                <Input id="confirmPass" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Ulangi password baru" />
              </div>
              <Button type="submit" className="w-full bg-utbk-blue hover:bg-utbk-blue/90" disabled={loading}>{loading ? "Menyimpan..." : "Reset Password"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 