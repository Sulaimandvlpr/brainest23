import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";

// Types
type SubtestStatus = 'belum_diisi' | 'sudah_diisi' | 'butuh_revisi';
type PackageStatus = 'draft' | 'published' | 'locked';
type DifficultyLevel = 'mudah' | 'sedang' | 'sulit';

interface SubtestData {
  id: string;
  name: string;
  status: SubtestStatus;
  guru?: {
    id: string;
    name: string;
  };
  questionCount: number;
  uploadedAt?: string;
}

interface TryoutPackage {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: DifficultyLevel;
  totalQuestions: number;
  status: PackageStatus;
  createdAt: string;
  createdBy: string;
  subtests: SubtestData[];
  stats: {
    enrolled: number;
    completed: number;
    averageScore: number;
  };
}

// List of available subtests
const AVAILABLE_SUBTESTS: SubtestData[] = [
  { id: 'st1', name: 'Penalaran Matematika (PM)', status: 'belum_diisi', questionCount: 0 },
  { id: 'st2', name: 'Literasi Bahasa Indonesia (LBI)', status: 'belum_diisi', questionCount: 0 },
  { id: 'st3', name: 'Literasi Bahasa Inggris (LBE)', status: 'belum_diisi', questionCount: 0 },
  { id: 'st4', name: 'Penalaran Umum (PU)', status: 'belum_diisi', questionCount: 0 },
  { id: 'st5', name: 'Pengetahuan Kuantitatif (PK)', status: 'belum_diisi', questionCount: 0 },
  { id: 'st6', name: 'Pemahaman Bacaan dan Menulis (PBM)', status: 'belum_diisi', questionCount: 0 },
  { id: 'st7', name: 'Pengetahuan dan Pemahaman Umum (PPU)', status: 'belum_diisi', questionCount: 0 }
];

// Mock data for packages
const PACKAGES: TryoutPackage[] = [
  {
    id: "1",
    name: "UTBK Saintek 2023",
    description: "Paket tryout lengkap untuk persiapan UTBK Saintek dengan soal-soal terbaru dan prediktif.",
    duration: 120,
    difficulty: "sedang",
    totalQuestions: 60,
    status: "published",
    createdAt: "2023-05-01",
    createdBy: "Admin User",
    subtests: [
      { id: "st1", name: "Penalaran Matematika (PM)", status: "sudah_diisi", questionCount: 20, guru: { id: "g1", name: "Pak Budi" }, uploadedAt: "2023-05-01" },
      { id: "st2", name: "Penalaran Umum (PU)", status: "sudah_diisi", questionCount: 20, guru: { id: "g2", name: "Bu Sari" }, uploadedAt: "2023-05-02" },
      { id: "st3", name: "Pengetahuan Kuantitatif (PK)", status: "belum_diisi", questionCount: 0 },
      { id: "st4", name: "Pemahaman Bacaan dan Menulis (PBM)", status: "belum_diisi", questionCount: 0 },
      { id: "st5", name: "Literasi Bahasa Indonesia (LBI)", status: "belum_diisi", questionCount: 0 },
      { id: "st6", name: "Literasi Bahasa Inggris (LBE)", status: "belum_diisi", questionCount: 0 },
      { id: "st7", name: "Pengetahuan dan Pemahaman Umum (PPU)", status: "belum_diisi", questionCount: 0 }
    ],
    stats: {
    enrolled: 156,
    completed: 134,
      averageScore: 76.5
    }
  },
  {
    id: "2",
    name: "UTBK Soshum 2023",
    description: "Terdiri dari 60 soal Pengetahuan dan Pemahaman Umum, Pengetahuan Kuantitatif, dan Penalaran Umum.",
    duration: 120,
    difficulty: "sedang",
    totalQuestions: 60,
    status: "published",
    createdAt: "2023-05-15",
    createdBy: "Admin User",
    subtests: [
      { id: "st8", name: "Pengetahuan dan Pemahaman Umum (PPU)", status: "belum_diisi", questionCount: 0 },
      { id: "st9", name: "Pengetahuan Kuantitatif (PK)", status: "belum_diisi", questionCount: 0 },
      { id: "st10", name: "Penalaran Umum (PU)", status: "belum_diisi", questionCount: 0 },
      { id: "st11", name: "Pemahaman Bacaan dan Menulis (PBM)", status: "belum_diisi", questionCount: 0 },
    ],
    stats: {
    enrolled: 98,
    completed: 87,
      averageScore: 72.3
    }
  },
  {
    id: "3",
    name: "TPS Lengkap",
    description: "Fokus pada soal-soal TPS dengan tingkat kesulitan bervariasi.",
    duration: 90,
    difficulty: "sedang",
    totalQuestions: 40,
    status: "draft",
    createdAt: "2023-06-01",
    createdBy: "Editor User",
    subtests: [],
    stats: {
    enrolled: 0,
    completed: 0,
      averageScore: 0
    }
  },
  {
    id: "4",
    name: "Matematika Dasar",
    description: "Kumpulan soal Penalaran Matematika untuk persiapan UTBK.",
    duration: 60,
    difficulty: "mudah",
    totalQuestions: 30,
    status: "published",
    createdAt: "2023-06-10",
    createdBy: "Editor User",
    subtests: [],
    stats: {
    enrolled: 78,
    completed: 65,
      averageScore: 68.9
    }
  },
];

// Tambahkan mock data subtest yang sudah diupload guru
type Subtest = {
  id: string;
  name: string;
  guru: string;
  questionCount: number;
};

const SUBTESTS: Subtest[] = [
  { id: 'st1', name: 'Penalaran Matematika (PM)', guru: 'Pak Budi', questionCount: 20 },
  { id: 'st2', name: 'Literasi Bahasa Indonesia (LBI)', guru: 'Bu Sari', questionCount: 20 },
  { id: 'st3', name: 'Literasi Bahasa Inggris (LBE)', guru: 'Pak Andi', questionCount: 20 },
  { id: 'st4', name: 'Penalaran Umum (PU)', guru: 'Bu Lina', questionCount: 20 },
  { id: 'st5', name: 'Pengetahuan Kuantitatif (PK)', guru: 'Pak Joko', questionCount: 20 },
];

// List 7 subtest utama
const SUBTEST_NAMES = [
  "Penalaran Matematika (PM)",
  "Literasi Bahasa Indonesia (LBI)",
  "Literasi Bahasa Inggris (LBE)",
  "Penalaran Umum (PU)",
  "Pengetahuan Kuantitatif (PK)",
  "Pemahaman Bacaan dan Menulis (PBM)",
  "Pengetahuan dan Pemahaman Umum (PPU)"
];

// Update the PackageProgressCard component
const PackageProgressCard = ({ 
  pkg,
  onPublish,
  onLock,
  onDraft
}: { 
  pkg: TryoutPackage;
  onPublish: (id: string) => void;
  onLock: (id: string) => void;
  onDraft: (id: string) => void;
}) => {
  const uploadedSubtests = pkg.subtests.filter(st => st.status === "sudah_diisi");
  const progress = (uploadedSubtests.length / pkg.subtests.length) * 100;

  return (
    <Card className="overflow-hidden rounded-2xl bg-[#10172a] border border-cyan-900/40 shadow-lg">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg text-white font-bold mb-1">{pkg.name}</CardTitle>
          <p className="text-xs text-cyan-200/80 font-normal mb-1">{pkg.description}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-cyan-200/70 font-medium">Progress</span>
          <span className="text-cyan-200 font-semibold">{uploadedSubtests.length}/{pkg.subtests.length} Subtest</span>
        </div>
        <div className="w-full h-2 bg-cyan-900/30 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-cyan-200/70 font-medium">Subtest Terupload</span>
            <span className="text-cyan-200 font-semibold">{uploadedSubtests.length}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {uploadedSubtests.length === 0 ? (
              <span className="text-cyan-400 italic text-xs">Belum ada subtest yang diupload.</span>
            ) : (
              uploadedSubtests.slice(0, 3).map((st) => (
                <Badge 
                  key={st.id}
                  variant="outline"
                  className="text-xs px-2 py-1 border-cyan-700 text-cyan-200 font-medium"
                >
                  {st.name}
                </Badge>
              ))
            )}
            {uploadedSubtests.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 border-cyan-700 text-cyan-200 font-medium">
                +{uploadedSubtests.length - 3}
              </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-cyan-200/80 mb-2">
          <div className="flex items-center gap-1">
            <span>📝</span>
            <span>{pkg.totalQuestions} soal</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{pkg.duration} menit</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{pkg.createdAt}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {pkg.status === "draft" && uploadedSubtests.length === pkg.subtests.length && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLock(pkg.id)}
              className="border-cyan-700 text-cyan-200 hover:bg-cyan-900/20"
            >
              Kunci
            </Button>
            <Button
              size="sm"
              onClick={() => onPublish(pkg.id)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              Publish
            </Button>
          </>
        )}
        {pkg.status === "locked" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDraft(pkg.id)}
            className="border-cyan-700 text-cyan-200 hover:bg-cyan-900/20"
          >
            Draft
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Update the MonitoringSection component
const MonitoringSection = ({ 
  packages,
  onPublish,
  onLock,
  onDraft
}: { 
  packages: TryoutPackage[];
  onPublish: (id: string) => void;
  onLock: (id: string) => void;
  onDraft: (id: string) => void;
}) => {
  const [statusFilter, setStatusFilter] = useState<PackageStatus | "all">("all");

  const filteredPackages = packages.filter(pkg => 
    statusFilter === "all" || pkg.status === statusFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Monitoring Progress</h2>
        <Select
          value={statusFilter}
          onValueChange={(value: PackageStatus | "all") => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px] bg-[#1e293b] border-cyan-900/40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map(pkg => (
          <PackageProgressCard 
            key={pkg.id} 
            pkg={pkg}
            onPublish={onPublish}
            onLock={onLock}
            onDraft={onDraft}
          />
        ))}
      </div>
    </div>
  );
};

export default function TryoutPackages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [packages, setPackages] = useState<TryoutPackage[]>(PACKAGES);
  const [selectedSubtestIds, setSelectedSubtestIds] = useState<string[]>([]);
  const [newPackageName, setNewPackageName] = useState("");
  const [newPackageDesc, setNewPackageDesc] = useState("");
  const [newPackageDuration, setNewPackageDuration] = useState("");
  const [notifiedGuru, setNotifiedGuru] = useState<string | null>(null);
  const [inbox, setInbox] = useState<{ paket: string; subtest: string; waktu: string }[]>([]);

  // Publish otomatis jika semua subtest sudah diisi
  useEffect(() => {
    setPackages(pkgs => pkgs.map(pkg => {
      const allFilled = pkg.subtests && pkg.subtests.length > 0 && pkg.subtests.every(st => st.status === "sudah_diisi");
      if (allFilled && pkg.status !== "published") {
        toast.success(`Paket '${pkg.name}' otomatis dipublish karena semua subtest sudah diisi!`);
        return { ...pkg, status: "published" };
      }
      return pkg;
    }));
  }, [packages]);

  const handlePublish = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, status: "published" as PackageStatus }
        : pkg
    ));
    toast.success("Paket tryout berhasil dipublish!");
  };

  const handleDuplicate = (id: string) => {
    const packageToDuplicate = packages.find(pkg => pkg.id === id);
    if (packageToDuplicate) {
      const newPackage = {
        ...packageToDuplicate,
        id: String(Date.now()),
        name: `${packageToDuplicate.name} (Salinan)`,
        status: "draft" as PackageStatus,
        createdAt: new Date().toISOString().split('T')[0],
        subtests: packageToDuplicate.subtests.map(st => ({ ...st, status: "belum_diisi" as SubtestStatus })),
        stats: {
        enrolled: 0,
        completed: 0,
          averageScore: 0
        }
      };
      setPackages([...packages, newPackage]);
      toast.success("Paket berhasil diduplikasi");
    }
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success("Paket berhasil dihapus");
  };

  const handleCombineSubtests = () => {
    if (selectedSubtestIds.length === 0) {
      toast.error("Pilih minimal satu subtest!");
      return;
    }

    if (!newPackageName || !newPackageDuration) {
      toast.error("Nama dan durasi paket harus diisi!");
      return;
    }

    const newPkg: TryoutPackage = {
      id: String(Date.now()),
      name: newPackageName,
      description: newPackageDesc,
      duration: parseInt(newPackageDuration),
      difficulty: "sedang",
      totalQuestions: 0,
      status: "draft" as PackageStatus,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: "Admin User",
      subtests: selectedSubtestIds.map(id => {
        const subtest = AVAILABLE_SUBTESTS.find(st => st.id === id);
        return {
          id: subtest!.id,
          name: subtest!.name,
          status: "belum_diisi" as SubtestStatus,
          questionCount: subtest!.questionCount
        };
      }),
      stats: {
        enrolled: 0,
        completed: 0,
        averageScore: 0
      }
    };

    setPackages(prev => [...prev, newPkg]);
    setSelectedSubtestIds([]);
    setNewPackageName("");
    setNewPackageDesc("");
    setNewPackageDuration("");
    toast.success("Paket tryout berhasil dibuat!");
  };

  // Add missing handler functions
  const handleLock = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, status: "locked" as PackageStatus }
        : pkg
    ));
    toast.success("Paket tryout berhasil dikunci!");
  };

  const handleDraft = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, status: "draft" as PackageStatus }
        : pkg
    ));
    toast.success("Paket tryout berhasil diubah ke draft!");
  };

  // Handler untuk menandai subtest butuh revisi
  const handleRevisi = (pkgId: string, subtestName: string) => {
    setPackages(pkgs => pkgs.map(pkg =>
      pkg.id === pkgId
        ? { ...pkg, subtests: pkg.subtests.map(st => st.name === subtestName ? { ...st, status: "butuh_revisi" } : st) }
        : pkg
    ));
    setNotifiedGuru(subtestName);
    setTimeout(() => setNotifiedGuru(null), 2000);
    toast.info(`Notifikasi revisi dikirim ke guru penanggung jawab subtest '${subtestName}'. (mock)`);
  };

  // Fungsi simulasi upload subtest oleh guru (ubah status dan tambahkan notifikasi)
  function handleUploadSubtest(pkgId: string, subtestName: string) {
    setPackages(pkgs => pkgs.map(pkg =>
      pkg.id === pkgId
        ? {
            ...pkg,
            subtests: pkg.subtests.map(st =>
              st.name === subtestName && st.status !== "sudah_diisi"
                ? { ...st, status: "sudah_diisi" }
                : st
            )
          }
        : pkg
    ));
    setInbox(inbox => [
      { paket: pkgId, subtest: subtestName, waktu: new Date().toLocaleString() },
      ...inbox
    ]);
  }

  // Pastikan setiap paket selalu punya 7 subtest (jika belum, tambahkan status 'belum_diisi')
  useEffect(() => {
    setPackages(pkgs => pkgs.map(pkg => {
      if (!pkg.subtests || pkg.subtests.length < 7) {
        const existing = pkg.subtests ? pkg.subtests.map(st => st.name) : [];
        return {
          ...pkg,
          subtests: SUBTEST_NAMES.map((name, idx) => {
            const found = pkg.subtests && pkg.subtests.find(st => st.name === name);
            if (found) return found;
            // Tambahkan id dan questionCount agar sesuai tipe SubtestData
            return { id: `auto-${idx}`, name, status: "belum_diisi", questionCount: 0 };
          })
        };
      }
      return pkg;
    }));
  }, []);

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Paket Tryout</h1>
        <Link to="/admin/packages/create">
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">Buat Paket Baru</Button>
        </Link>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="bg-[#1e293b] border border-cyan-900/40">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="packages">Paket Tryout</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <MonitoringSection 
            packages={packages}
            onPublish={handlePublish}
            onLock={handleLock}
            onDraft={handleDraft}
          />
        </TabsContent>

        <TabsContent value="packages">
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Paket Tryout</h2>
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
                    <Badge variant={pkg.status === "published" ? "success" : pkg.status === "locked" ? "warning" : "secondary"} className="text-xs px-3 py-1 rounded-full font-sans">
                      {pkg.status === "published" ? "Published" : pkg.status === "locked" ? "Locked" : "Draft"}
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
                            <span>{pkg.totalQuestions} soal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{pkg.duration} menit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{pkg.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{pkg.stats.enrolled} pendaftar</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                          {(pkg.subtests || []).slice(0, 3).map((subject, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                              {subject.name}
                      </Badge>
                    ))}
                          {pkg.subtests && pkg.subtests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                              +{pkg.subtests.length - 3}
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
                        {pkg.status === "draft" && pkg.subtests.every(st => st.status === "sudah_diisi") && (
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
                      <td className="px-4 py-3 whitespace-nowrap text-white text-sm">{pkg.totalQuestions}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-white text-sm">{pkg.duration} menit</td>
                      <td className="px-4 py-3 whitespace-nowrap text-white text-sm">{pkg.stats.enrolled}</td>
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
                              {pkg.status === "draft" && pkg.subtests.every(st => st.status === "sudah_diisi") && (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
