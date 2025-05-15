
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X } from "lucide-react";

// Form schema
const formSchema = z.object({
  name: z.string().min(5, {
    message: "Nama paket harus minimal 5 karakter",
  }),
  description: z.string().min(10, {
    message: "Deskripsi harus minimal 10 karakter",
  }),
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

export default function PackageCreate() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([
    "1",
    "2",
    "3",
  ]);

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
    // In a real app, this would be an API call
    console.log(values);
    console.log("Selected Questions:", selectedQuestionIds);
    toast.success("Paket tryout berhasil dibuat");
    navigate("/admin/packages");
  }

  const removeQuestion = (id: string) => {
    setSelectedQuestionIds(selectedQuestionIds.filter((qId) => qId !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Buat Paket Tryout Baru
        </h2>
        <p className="text-muted-foreground">
          Susun soal-soal ke dalam paket tryout
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Paket</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: UTBK Saintek 2023"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Deskripsi singkat paket tryout..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Duration */}
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Durasi (menit)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Question Count */}
                      <FormField
                        control={form.control}
                        name="questionCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Soal</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                defaultValue={selectedQuestionIds.length}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Difficulty */}
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tingkat Kesulitan</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mudah">Mudah</SelectItem>
                                <SelectItem value="sedang">Sedang</SelectItem>
                                <SelectItem value="sulit">Sulit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/packages")}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Soal Terpilih</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari soal..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute right-1 top-1 h-7"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah
                  </Button>
                </div>

                <div className="border rounded-md p-3 space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="border rounded p-2 text-sm flex justify-between items-start gap-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{q.question}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{q.subject}</Badge>
                          <Badge variant="outline">{q.category}</Badge>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-500"
                        onClick={() => removeQuestion(q.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
