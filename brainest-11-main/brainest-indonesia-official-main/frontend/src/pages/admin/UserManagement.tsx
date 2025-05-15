import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Key, UserX } from "lucide-react";
import { toast } from "sonner";

// Mock data for users
const USERS = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi@example.com",
    role: "user",
    registered: "2023-05-01",
  },
  {
    id: "2",
    name: "Siti Rahayu",
    email: "siti@example.com",
    role: "admin",
    registered: "2023-04-15",
  },
  {
    id: "3",
    name: "Anwar Ibrahim",
    email: "anwar@example.com",
    role: "editor",
    registered: "2023-05-03",
  },
  {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi@example.com",
    role: "user",
    registered: "2023-04-20",
  },
  {
    id: "5",
    name: "Joko Widodo",
    email: "joko@example.com",
    role: "user",
    registered: "2023-05-05",
  },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  const resetPassword = (id: string, name: string) => {
    toast.success(`Reset password link sent to ${name}`);
  };

  const deleteUser = (id: string, name: string) => {
    toast.success(`User ${name} deleted successfully`);
  };

  const addAdmin = () => {
    toast.success("Admin invitation sent successfully");
  };

  const filteredUsers = USERS.filter((user) => {
    // Filter by search term
    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by role
    if (roleFilter && user.role !== roleFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
        <Button className="flex gap-2" onClick={addAdmin}>
          <UserPlus className="h-4 w-4" />
          Tambah Admin/Editor
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengguna..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter berdasarkan role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="siswa">Siswa</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="guru">Guru</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] rounded-2xl border border-[#10182a] overflow-hidden shadow-none">
        <Table className="min-w-full bg-[#0f172a]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-white text-lg font-bold">Nama</TableHead>
              <TableHead className="text-white text-lg font-bold">Email</TableHead>
              <TableHead className="text-white text-lg font-bold">Role</TableHead>
              <TableHead className="text-white text-lg font-bold">Tanggal Daftar</TableHead>
              <TableHead className="text-white text-lg font-bold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-cyan-900/10 transition">
                <TableCell className="font-medium text-white text-base">{user.name}</TableCell>
                <TableCell className="text-cyan-100">{user.email}</TableCell>
                <TableCell>
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold
                    ${user.role === "admin" || user.role === "guru" ? "bg-purple-100 text-purple-700" : ""}
                    ${user.role === "siswa" ? "bg-gray-100 text-gray-700" : ""}
                  `}>
                    {user.role === "admin"
                      ? "Admin"
                      : user.role === "guru"
                      ? "Guru"
                      : "Siswa"}
                  </span>
                </TableCell>
                <TableCell className="text-cyan-100">{user.registered}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetPassword(user.id, user.name)}
                      className="bg-[#19213a] text-white border-none shadow-none hover:bg-cyan-900/20"
                    >
                      <Key className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#19213a] text-red-400 border-none shadow-none hover:bg-pink-900/20"
                      onClick={() => deleteUser(user.id, user.name)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
