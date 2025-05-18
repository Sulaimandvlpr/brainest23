import { useState, useRef } from "react";
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuestionCreate() {
  const [draftSoal, setDraftSoal] = useState([]);
  const [subtest, setSubtest] = useState("");
  const [fileName, setFileName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [duration, setDuration] = useState("");
  const [manualSoal, setManualSoal] = useState({
    pertanyaan: "",
    pertanyaanImg: null as File | null,
    opsi: [
      { text: "", img: null as File | null },
      { text: "", img: null as File | null },
      { text: "", img: null as File | null },
      { text: "", img: null as File | null },
      { text: "", img: null as File | null },
    ],
    jawaban: "A",
    pembahasan: "",
  });
  const pertanyaanImgRef = useRef<HTMLInputElement>(null);
  const opsiImgRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editorSoal, setEditorSoal] = useState('');
  const [editorOpsi, setEditorOpsi] = useState(['', '', '', '', '']);
  const [editorJawaban, setEditorJawaban] = useState('A');
  const [editorPembahasan, setEditorPembahasan] = useState('');

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
      'pertanyaan,pertanyaan_img,opsi_a,opsi_a_img,opsi_b,opsi_b_img,opsi_c,opsi_c_img,opsi_d,opsi_d_img,jawaban,pembahasan\n' +
      'Contoh soal?,https://imgur.com/soal1.png,A,https://imgur.com/opsiA.png,B,,C,,D,,A,Penjelasan singkat';
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

  function getImgPreview(file: File | null) {
    if (!file) return null;
    return URL.createObjectURL(file);
  }

  function handleManualUpload() {
    if (!manualSoal.pertanyaan && !manualSoal.pertanyaanImg) {
      toast.error("Isi teks/gambar pertanyaan!");
      return;
    }
    if (manualSoal.opsi.every(o => !o.text && !o.img)) {
      toast.error("Minimal satu opsi harus diisi teks/gambar!");
      return;
    }
    toast.success("Soal berhasil diupload (dummy, gambar belum diupload ke server)");
    setManualSoal({
      pertanyaan: "",
      pertanyaanImg: null,
      opsi: manualSoal.opsi.map(() => ({ text: "", img: null })),
      jawaban: "A",
      pembahasan: "",
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
          <Button variant="default" size="sm" onClick={() => setShowEditorModal(true)}>
            Buat Soal di Web
          </Button>
        </div>
        <div className="mb-2 text-sm text-cyan-200 bg-cyan-900/10 border border-cyan-700 rounded-lg p-3">
          <b>Best Practice:</b> Untuk soal dengan gambar di tengah-tengah kalimat, gunakan <b>Buat Soal di Web</b>. Import Excel/CSV hanya untuk soal sederhana (gambar di awal/akhir soal/opsi).
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
          className="mb-2 px-3 py-2 rounded-md border-2 border-cyan-700 bg-[#0f172a] text-white w-full shadow-[0_0_8px_0_rgba(34,211,238,0.10)] focus:ring-2 focus:ring-cyan-400 hide-number-spinner"
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
                  <th className="px-2 py-1">Gambar</th>
                  <th className="px-2 py-1">A</th>
                  <th className="px-2 py-1">Gambar</th>
                  <th className="px-2 py-1">B</th>
                  <th className="px-2 py-1">Gambar</th>
                  <th className="px-2 py-1">C</th>
                  <th className="px-2 py-1">Gambar</th>
                  <th className="px-2 py-1">D</th>
                  <th className="px-2 py-1">Gambar</th>
                  <th className="px-2 py-1">Jawaban</th>
                  <th className="px-2 py-1">Pembahasan</th>
                </tr>
              </thead>
              <tbody>
                {validateRows(draftSoal).map((row, i) => (
                  <tr key={i} className={`border-b border-cyan-900 ${row._rowError ? 'bg-red-900/30' : ''}`}> 
                    <td className="px-2 py-1 max-w-[300px] truncate">{row.pertanyaan}</td>
                    <td className="px-2 py-1">{row.pertanyaan_img ? <img src={row.pertanyaan_img} alt="img" className="max-h-12 max-w-[80px] mx-auto" /> : null}</td>
                    <td className="px-2 py-1">{row.opsi_a}</td>
                    <td className="px-2 py-1">{row.opsi_a_img ? <img src={row.opsi_a_img} alt="img" className="max-h-12 max-w-[80px] mx-auto" /> : null}</td>
                    <td className="px-2 py-1">{row.opsi_b}</td>
                    <td className="px-2 py-1">{row.opsi_b_img ? <img src={row.opsi_b_img} alt="img" className="max-h-12 max-w-[80px] mx-auto" /> : null}</td>
                    <td className="px-2 py-1">{row.opsi_c}</td>
                    <td className="px-2 py-1">{row.opsi_c_img ? <img src={row.opsi_c_img} alt="img" className="max-h-12 max-w-[80px] mx-auto" /> : null}</td>
                    <td className="px-2 py-1">{row.opsi_d}</td>
                    <td className="px-2 py-1">{row.opsi_d_img ? <img src={row.opsi_d_img} alt="img" className="max-h-12 max-w-[80px] mx-auto" /> : null}</td>
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

      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#10172a] border border-cyan-900/40 rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">Buat Soal di Web (Editor Visual)</h2>
            <div className="text-white text-base mb-2">Ketik soal, tambahkan gambar di posisi mana saja (upload atau paste link), dan preview langsung.</div>
            <div className="mb-2">
              <label className="block text-cyan-200 font-semibold mb-1">Soal</label>
              <ReactQuill theme="snow" value={editorSoal} onChange={setEditorSoal} className="bg-white rounded" />
            </div>
            <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {[0,1,2,3,4].map(i => (
                <div key={i}>
                  <label className="block text-cyan-200 font-semibold mb-1">Opsi {String.fromCharCode(65+i)}</label>
                  <ReactQuill theme="snow" value={editorOpsi[i]} onChange={v => setEditorOpsi(op => op.map((o,ix) => ix===i?v:o))} className="bg-white rounded" />
                </div>
              ))}
            </div>
            <div className="mb-2">
              <label className="block text-cyan-200 font-semibold mb-1">Jawaban Benar</label>
              <select value={editorJawaban} onChange={e => setEditorJawaban(e.target.value)} className="px-2 py-1 rounded bg-[#0f172a] text-white border border-cyan-700">
                {[0,1,2,3,4].map(i => <option key={i} value={String.fromCharCode(65+i)}>{String.fromCharCode(65+i)}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-cyan-200 font-semibold mb-1">Pembahasan</label>
              <ReactQuill theme="snow" value={editorPembahasan} onChange={setEditorPembahasan} className="bg-white rounded" />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" className="border-cyan-700 hover:bg-cyan-800 hover:text-white transition" onClick={() => setShowEditorModal(false)}>Tutup</Button>
              <Button className="bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-800 hover:to-blue-800 text-white transition" onClick={() => { setShowEditorModal(false); setEditorSoal(''); setEditorOpsi(['','','','','']); setEditorJawaban('A'); setEditorPembahasan(''); toast.success('Soal berhasil disimpan (dummy)!'); }}>
                Simpan Soal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
