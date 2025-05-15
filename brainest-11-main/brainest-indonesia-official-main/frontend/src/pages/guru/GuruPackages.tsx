import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePlus, Eye, Pencil, Calendar, Clock, UserPlus, Tag, BookOpen } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for packages
const PACKAGES = [
  {
    id: "1",
    name: "UTBK Saintek 2023",
    description: "Terdiri dari 60 soal Penalaran Matematika, Penalaran Umum, dan Pengetahuan Kuantitatif.",
    subjects: ["Penalaran Matematika (PM)", "Penalaran Umum (PU)", "Pengetahuan Kuantitatif (PK)", "Pemahaman Bacaan dan Menulis (PBM)"],
    questionCount: 60,
    duration: "120 menit",
    status: "published",
    createdAt: "2023-05-01",
    createdBy: "Guru User",
    enrolled: 156,
    completed: 134,
    avgScore: 76.5
  },
  {
    id: "2",
    name: "UTBK Soshum 2023",
    description: "Terdiri dari 60 soal Pengetahuan dan Pemahaman Umum, Pengetahuan Kuantitatif, dan Penalaran Umum.",
    subjects: ["Pengetahuan dan Pemahaman Umum (PPU)", "Pengetahuan Kuantitatif (PK)", "Penalaran Umum (PU)", "Pemahaman Bacaan dan Menulis (PBM)"],
    questionCount: 60,
    duration: "120 menit",
    status: "published",
    createdAt: "2023-05-15",
    createdBy: "Guru User",
    enrolled: 98,
    completed: 87,
    avgScore: 72.3
  },
  {
    id: "3",
    name: "TPS Lengkap",
    description: "Fokus pada soal-soal TPS dengan tingkat kesulitan bervariasi.",
    subjects: ["Penalaran Umum (PU)", "Pemahaman Bacaan dan Menulis (PBM)", "Pengetahuan Kuantitatif (PK)", "Pengetahuan dan Pemahaman Umum (PPU)"],
    questionCount: 40,
    duration: "90 menit",
    status: "draft",
    createdAt: "2023-06-01",
    createdBy: "Guru User",
    enrolled: 0,
    completed: 0,
    avgScore: 0
  },
  {
    id: "4",
    name: "Matematika Dasar",
    description: "Kumpulan soal Penalaran Matematika untuk persiapan UTBK.",
    subjects: ["Penalaran Matematika (PM)"],
    questionCount: 30,
    duration: "60 menit",
    status: "published",
    createdAt: "2023-06-10",
    createdBy: "Guru User",
    enrolled: 78,
    completed: 65,
    avgScore: 68.9
  },
];

export default function GuruPackages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [packages, setPackages] = useState(PACKAGES);

  const handlePublish = (id: string) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, status: "published" } : pkg
    ));
    toast.success("Paket berhasil dipublikasikan (dummy)");
  };

  const handleDuplicate = (id: string) => {
    const packageToDuplicate = packages.find(pkg => pkg.id === id);
    if (packageToDuplicate) {
      const newPackage = {
        ...packageToDuplicate,
        id: String(Date.now()),
        name: `${packageToDuplicate.name} (Salinan)`,
        status: "draft",
        createdAt: new Date().toISOString().split('T')[0],
        enrolled: 0,
        completed: 0,
        avgScore: 0
      };
      setPackages([...packages, newPackage]);
      toast.success("Paket berhasil diduplikasi (dummy)");
    }
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success("Paket berhasil dihapus (dummy)");
  };

  const filteredPackages = packages.filter(pkg => {
    if (searchTerm && !pkg.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && pkg.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Paket Tryout Guru</h2>
        <Link to="/guru/packages/create">
          <Button className="flex gap-2">
            <FilePlus className="h-4 w-4" />
            Buat Paket Baru
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            placeholder="Cari paket tryout..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter berdasarkan status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="published">Dipublikasikan</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list">
              List View
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            Showing {filteredPackages.length} packages
          </div>
        </div>
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <Badge variant={pkg.status === "published" ? "default" : "secondary"}>
                      {pkg.status === "published" ? "Dipublikasikan" : "Draft"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{pkg.description}</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pkg.subjects.map((sub, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-semibold">{sub}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-cyan-200">
                    <span><BookOpen className="inline w-4 h-4 mr-1" /> {pkg.questionCount} Soal</span>
                    <span><Clock className="inline w-4 h-4 mr-1" /> {pkg.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 items-center text-sm text-cyan-300">
                    Dibuat oleh: {pkg.createdBy}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/guru/packages/${pkg.id}/edit`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/guru/packages/${pkg.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Lihat
                        </Link>
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {pkg.status !== "published" && (
                          <DropdownMenuItem onClick={() => handlePublish(pkg.id)}>
                            Publikasikan
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(pkg.id)}>
                          Duplikasi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(pkg.id)} className="text-red-500">
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-white">
              <thead>
                <tr className="bg-[#164e63]">
                  <th className="px-2 py-1">Nama Paket</th>
                  <th className="px-2 py-1">Deskripsi</th>
                  <th className="px-2 py-1">Jumlah Soal</th>
                  <th className="px-2 py-1">Durasi</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-2 py-1 font-bold text-cyan-200">{pkg.name}</td>
                    <td className="px-2 py-1">{pkg.description}</td>
                    <td className="px-2 py-1">{pkg.questionCount}</td>
                    <td className="px-2 py-1">{pkg.duration}</td>
                    <td className="px-2 py-1">
                      <Badge variant={pkg.status === "published" ? "default" : "secondary"}>
                        {pkg.status === "published" ? "Dipublikasikan" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/guru/packages/${pkg.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/guru/packages/${pkg.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              ...
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {pkg.status !== "published" && (
                              <DropdownMenuItem onClick={() => handlePublish(pkg.id)}>
                                Publikasikan
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDuplicate(pkg.id)}>
                              Duplikasi
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(pkg.id)} className="text-red-500">
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 