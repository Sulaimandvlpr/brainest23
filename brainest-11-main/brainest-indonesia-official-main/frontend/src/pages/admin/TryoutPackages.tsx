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
    createdBy: "Admin User",
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
    createdBy: "Admin User",
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
    createdBy: "Editor User",
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
    createdBy: "Editor User",
    enrolled: 78,
    completed: 65,
    avgScore: 68.9
  },
];

export default function TryoutPackages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [packages, setPackages] = useState(PACKAGES);

  const handlePublish = (id: string) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, status: "published" } : pkg
    ));
    toast.success("Paket berhasil dipublikasikan");
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
      toast.success("Paket berhasil diduplikasi");
    }
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success("Paket berhasil dihapus");
  };

  const filteredPackages = packages.filter(pkg => {
    // Filter by search term
    if (searchTerm && !pkg.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (statusFilter && pkg.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Paket Tryout</h2>
        <Link to="/admin/packages/create">
          <Button className="flex gap-2">
            <FilePlus className="h-4 w-4" />
            Buat Paket Baru
          </Button>
        </Link>
      </div>

      {/* Filters */}
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
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    {pkg.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{pkg.questionCount} soal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{pkg.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{pkg.enrolled} pendaftar</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {pkg.subjects.slice(0, 3).map((subject, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {pkg.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pkg.subjects.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/packages/${pkg.id}/edit`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/packages/${pkg.id}`}>
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
                      <DropdownMenuContent align="end">
                        {pkg.status === "draft" && (
                          <DropdownMenuItem onClick={() => handlePublish(pkg.id)}>
                            Publikasikan
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(pkg.id)}>
                          Duplikasi
                        </DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <span className="text-red-500">Hapus</span>
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Hapus Paket</DialogTitle>
                              <DialogDescription>
                                Apakah Anda yakin ingin menghapus paket "{pkg.name}"? Tindakan ini tidak dapat dibatalkan.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Batal</Button>
                              <Button variant="destructive" onClick={() => handleDelete(pkg.id)}>
                                Hapus
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="bg-[#1e293b] rounded-md shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cyan-900">
                <thead className="bg-[#164e63]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-cyan-100 uppercase tracking-wider">Nama Paket</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-cyan-100 uppercase tracking-wider">Soal</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-cyan-100 uppercase tracking-wider">Durasi</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-cyan-100 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-cyan-100 uppercase tracking-wider">Pendaftar</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-cyan-100 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1e293b] divide-y divide-cyan-900">
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-cyan-950/60 transition">
                      <td className="px-4 py-3 whitespace-nowrap max-w-[220px]">
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-white">{pkg.name}</div>
                          <div className="text-xs text-cyan-200 truncate max-w-[180px]">{pkg.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-white text-sm">{pkg.questionCount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-white text-sm">{pkg.duration}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow
                          ${pkg.status === "published" ? "bg-cyan-200 text-cyan-900" : "bg-gray-200 text-gray-700"}
                        `}>
                          {pkg.status === "published" ? "Dipublikasikan" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-white text-sm">{pkg.enrolled}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" className="rounded-full bg-blue-900/60 hover:bg-cyan-700/80 border border-cyan-700 p-2 shadow-lg" asChild title="Edit">
                            <Link to={`/admin/packages/${pkg.id}/edit`}><Pencil className="w-5 h-5 text-cyan-200" /></Link>
                          </Button>
                          <Button size="icon" variant="ghost" className="rounded-full bg-blue-900/60 hover:bg-cyan-700/80 border border-cyan-700 p-2 shadow-lg" asChild title="Lihat">
                            <Link to={`/admin/packages/${pkg.id}`}><Eye className="w-5 h-5 text-cyan-200" /></Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="rounded-full bg-blue-900/60 hover:bg-pink-700/80 border border-pink-700 p-2 shadow-lg" title="Lainnya">
                                ...
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {pkg.status === "draft" && (
                                <DropdownMenuItem onClick={() => handlePublish(pkg.id)}>
                                  Publikasikan
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDuplicate(pkg.id)}>
                                Duplikasi
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <span className="text-red-500">Hapus</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Hapus Paket</DialogTitle>
                                    <DialogDescription>
                                      Apakah Anda yakin ingin menghapus paket "{pkg.name}"? Tindakan ini tidak dapat dibatalkan.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline">Batal</Button>
                                    <Button variant="destructive" onClick={() => handleDelete(pkg.id)}>
                                      Hapus
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
