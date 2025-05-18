import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X } from "lucide-react";

// Form schema
const formSchema = z.object({
  name: z.string().min(5, {
    message: "Nama paket harus minimal 5 karakter",
  }),
  description: z.string().optional(),
  duration: z.string().min(1, {
    message: "Durasi harus diisi",
  }),
  questionCount: z.string().min(1, {
    message: "Jumlah soal harus diisi",
  }),
  difficulty: z.string({
    required_error: "Pilih tingkat kesulitan",
  }),
});

// Mock data for selected questions
const selectedQuestions = [
  {
    id: "1",
    question: "Jika 2x + 5 = 15, maka nilai x adalah...",
    subject: "Matematika",
    category: "TPS",
  },
  {
    id: "2",
    question: "Bila x^2 - 2x + 1 = 0, maka nilai x adalah...",
    subject: "Matematika",
    category: "TPS",
  },
  {
    id: "3",
    question: "Planet terbesar dalam tata surya kita adalah...",
    subject: "IPA",
    category: "TKA Saintek",
  },
];

// List subtest konsisten
const subtestList = [
  "Penalaran Matematika (PM)",
  "Literasi Bahasa Indonesia (LBI)",
  "Literasi Bahasa Inggris (LBE)",
  "Penalaran Umum (PU)",
  "Pengetahuan Kuantitatif (PK)",
  "Pemahaman Bacaan dan Menulis (PBM)",
  "Pengetahuan dan Pemahaman Umum (PPU)"
];

// Mock list guru
const guruList = [
  "Pak Budi",
  "Bu Sari",
  "Pak Andi",
  "Bu Lina",
  "Pak Joko"
];

export default function PackageCreate() {
  const navigate = useNavigate();
  const [selectedSubtests, setSelectedSubtests] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [preview, setPreview] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      questionCount: "",
      difficulty: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedSubtests.length === 0) {
      toast.error("Pilih minimal 1 subtest!");
      return;
    }
    setPreview(true);
  }

  function handleFinalSubmit() {
    setShowConfirmModal(false);
    setPreview(false);
    toast.success("Paket tryout berhasil dibuat!");
    form.reset();
    setSelectedSubtests([]);
    setTimeout(() => navigate("/admin/packages"), 1200);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <Card className="w-full max-w-2xl bg-[#10172a] border border-cyan-900/40 rounded-2xl shadow-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-white font-bold">Buat Paket Tryout Baru</CardTitle>
            <p className="text-cyan-200/80 text-base font-normal mt-1">Lengkapi data berikut untuk membuat paket tryout baru.</p>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            <Form {...form}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Paket Tryout *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: UTBK Saintek 2023"
                        className="bg-[#1e293b] border-cyan-900/40 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi <span className="text-xs text-cyan-400 font-normal">(Opsional)</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deskripsi singkat paket tryout..."
                        className="min-h-[80px] bg-[#1e293b] border-cyan-900/40 text-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi (menit) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Contoh: 120"
                          className="bg-[#1e293b] border-cyan-900/40 text-white hide-number-spinner"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Soal *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Contoh: 60"
                          className="bg-[#1e293b] border-cyan-900/40 text-white hide-number-spinner"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tingkat Kesulitan *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-[#1e293b] border-cyan-900/40 text-white">
                          <SelectValue placeholder="Pilih Kesulitan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mudah">Mudah</SelectItem>
                          <SelectItem value="sedang">Sedang</SelectItem>
                          <SelectItem value="sulit">Sulit</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
            <div className="space-y-2">
              <label className="font-semibold text-cyan-200">Pilih Subtest *</label>
              <div className="flex flex-wrap gap-2">
                {subtestList.map((subtest) => (
                  <button
                    type="button"
                    key={subtest}
                    className={`px-4 py-2 rounded-full border-2 text-xs font-semibold transition-all focus:outline-none ${
                      selectedSubtests.includes(subtest)
                        ? "border-cyan-500 bg-cyan-900/40 text-cyan-200 shadow"
                        : "border-cyan-900/40 bg-[#1e293b] text-cyan-400 hover:border-cyan-700"
                    }`}
                    onClick={() => {
                      setSelectedSubtests((prev) =>
                        prev.includes(subtest)
                          ? prev.filter((s) => s !== subtest)
                          : [...prev, subtest]
                      );
                    }}
                  >
                    {subtest}
                  </button>
                ))}
              </div>
              {preview && selectedSubtests.length === 0 && (
                <div className="text-red-400 text-xs mt-1">Pilih minimal 1 subtest!</div>
              )}
            </div>
            {preview && (
              <div className="bg-cyan-900/10 border border-cyan-900/30 rounded-xl p-4 mt-4">
                <div className="font-bold text-cyan-200 mb-2">Preview Ringkasan Paket</div>
                <ul className="text-cyan-100 text-sm space-y-1">
                  <li><b>Nama:</b> {form.getValues().name}</li>
                  <li><b>Deskripsi:</b> {form.getValues().description}</li>
                  <li><b>Durasi:</b> {form.getValues().duration} menit</li>
                  <li><b>Jumlah Soal:</b> {form.getValues().questionCount}</li>
                  <li><b>Tingkat Kesulitan:</b> {form.getValues().difficulty}</li>
                  <li><b>Subtest:</b> {selectedSubtests.join(", ")}</li>
                </ul>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setPreview(false)} className="border-cyan-700 text-cyan-200">Edit</Button>
                  <Button onClick={() => setShowConfirmModal(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 font-bold">Simpan Paket</Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/packages")}
              className="border-cyan-700 text-cyan-200 hover:bg-cyan-900/20"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 font-bold"
            >
              Preview & Simpan
            </Button>
          </CardFooter>
        </form>
      </Card>
      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#10172a] border border-cyan-900/40 rounded-2xl p-8 w-full max-w-md flex flex-col gap-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">Konfirmasi Pembuatan Paket</h2>
            <div className="text-white text-base mb-4">Apakah Anda sudah yakin data paket sudah benar? Silakan cek kembali sebelum menyimpan.</div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" className="border-cyan-700 hover:bg-cyan-800 hover:text-white transition" onClick={() => setShowConfirmModal(false)}>Cek Lagi</Button>
              <Button className="bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-800 hover:to-blue-800 text-white transition" onClick={handleFinalSubmit}>
                Simpan & Buat Paket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
