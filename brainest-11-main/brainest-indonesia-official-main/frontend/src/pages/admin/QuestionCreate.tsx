import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Download, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuestionCreate() {
  const [draftSoal, setDraftSoal] = useState([]);
  const [subtest, setSubtest] = useState("");
  const [fileName, setFileName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [duration, setDuration] = useState("");

  const subtestList = [
    "Penalaran Matematika (PM)",
    "Literasi Bahasa Indonesia (LBI)",
    "Literasi Bahasa Inggris (LBE)",
    "Pengetahuan dan Pemahaman Umum (PPU)",
    "Penalaran Umum (PU)",
    "Pengetahuan Kuantitatif (PK)",
    "Pemahaman Bacaan dan Menulis (PBM)"
  ];

  const REQUIRED_COLUMNS = ["pertanyaan", "opsi_a", "opsi_b", "opsi_c", "opsi_d", "jawaban"];

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setDraftSoal(data);
    };
    reader.readAsBinaryString(file);
  }

  function handleUpload() {
    // TODO: Kirim draftSoal, subtest, packageName, dan duration ke backend
    toast.success(`Soal berhasil diupload ke bank soal pada paket "${packageName}"! Waktu pengerjaan: ${duration} menit.`);
    setDraftSoal([]);
    setFileName("");
    setSubtest("");
    setPackageName("");
    setDuration("");
  }

  function downloadTemplate() {
    const csv =
      'pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan\nContoh soal?,A,B,C,D,A,Penjelasan singkat';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_soal.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function validateRows(rows) {
    return rows.map(row => {
      const errors = REQUIRED_COLUMNS.filter(col => !row[col] || row[col].toString().trim() === "");
      return { ...row, _rowError: errors.length > 0, _missing: errors };
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Import Soal dari Excel atau CSV</h2>
        <p className="text-muted-foreground mb-2">Satu file untuk satu subtest. Format kolom: pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban, pembahasan. File yang didukung: <b>Excel (.xlsx)</b> atau <b>CSV (.csv)</b>.</p>
        <div className="flex gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-1" /> Download Template CSV
          </Button>
          {fileName && (
            <Button variant="ghost" size="sm" onClick={() => { setFileName(""); setDraftSoal([]); }}>
              <X className="w-4 h-4 mr-1" /> Reset File
            </Button>
          )}
        </div>
        <div
          className="mb-2 border-2 border-dashed border-cyan-400 rounded-lg p-4 text-center cursor-pointer bg-[#0f172a] hover:bg-cyan-900/20 transition"
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile({ target: { files: [e.dataTransfer.files[0]] } });
            }
          }}
          onClick={() => document.getElementById('file-upload-input')?.click()}
          style={{ minHeight: 60 }}
        >
          {fileName ? (
            <span className="text-cyan-300">File: {fileName}</span>
          ) : (
            <span className="text-cyan-200">Drag & drop file di sini, atau klik untuk pilih file</span>
          )}
          <input
            id="file-upload-input"
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFile}
            className="hidden"
          />
        </div>
        <input
          type="text"
          className="mb-2 px-3 py-2 rounded-md border-2 border-cyan-700 bg-[#0f172a] text-white w-full shadow-[0_0_8px_0_rgba(34,211,238,0.10)] focus:ring-2 focus:ring-cyan-400"
          placeholder="Nama Paket UTBK (wajib)"
          value={packageName}
          onChange={e => setPackageName(e.target.value)}
        />
        <input
          type="number"
          min="1"
          className="mb-2 px-3 py-2 rounded-md border-2 border-cyan-700 bg-[#0f172a] text-white w-full shadow-[0_0_8px_0_rgba(34,211,238,0.10)] focus:ring-2 focus:ring-cyan-400"
          placeholder="Waktu Pengerjaan (menit)"
          value={duration}
          onChange={e => setDuration(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <Select value={subtest} onValueChange={setSubtest}>
          <SelectTrigger className="mb-4 px-3 py-2 rounded-md border-2 border-cyan-700 bg-[#0f172a] text-white text-base font-semibold shadow-[0_0_8px_0_rgba(34,211,238,0.10)] focus:ring-2 focus:ring-cyan-400">
            <SelectValue placeholder="Pilih Subtest" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f172a] border-[#10182a] text-white z-50" side="bottom" sideOffset={4} avoidCollisions={false}>
            <SelectGroup>
              <SelectLabel className="text-white text-base font-bold">Subtest</SelectLabel>
              {subtestList.map((s, i) => (
                <SelectItem key={i} value={s} className="text-base text-white focus:bg-cyan-700 focus:text-white data-[state=checked]:bg-cyan-700 data-[state=checked]:text-white">
                  {s}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {draftSoal.length > 0 && (
        <div className="bg-[#1e293b] rounded-lg p-4 shadow space-y-4">
          <h3 className="text-xl font-bold mb-2 text-cyan-200">Preview Draft Soal</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-white">
              <thead>
                <tr className="bg-[#164e63]">
                  <th className="px-2 py-1">Pertanyaan</th>
                  <th className="px-2 py-1">A</th>
                  <th className="px-2 py-1">B</th>
                  <th className="px-2 py-1">C</th>
                  <th className="px-2 py-1">D</th>
                  <th className="px-2 py-1">Jawaban</th>
                  <th className="px-2 py-1">Pembahasan</th>
                </tr>
              </thead>
              <tbody>
                {validateRows(draftSoal).map((row, i) => (
                  <tr key={i} className={`border-b border-cyan-900 ${row._rowError ? 'bg-red-900/30' : ''}`}> 
                    <td className="px-2 py-1 max-w-[300px] truncate">{row.pertanyaan}</td>
                    <td className="px-2 py-1">{row.opsi_a}</td>
                    <td className="px-2 py-1">{row.opsi_b}</td>
                    <td className="px-2 py-1">{row.opsi_c}</td>
                    <td className="px-2 py-1">{row.opsi_d}</td>
                    <td className="px-2 py-1 font-bold text-cyan-300">{row.jawaban}</td>
                    <td className="px-2 py-1 max-w-[300px] truncate">{row.pembahasan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {validateRows(draftSoal).some(row => row._rowError) && (
              <div className="text-red-400 mt-2 text-sm">Ada baris yang belum lengkap. Kolom wajib: pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban.</div>
            )}
          </div>
          <Button className="utbk-button-primary mt-4" onClick={handleUpload} disabled={!packageName || !subtest || !duration || validateRows(draftSoal).some(row => row._rowError)}>
            Upload ke Bank Soal
          </Button>
        </div>
      )}
    </div>
  );
}
