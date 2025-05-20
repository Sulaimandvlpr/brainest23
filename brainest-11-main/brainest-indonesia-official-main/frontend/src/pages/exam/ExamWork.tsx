import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Mock data soal
const SOAL = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  text: `Ini adalah soal nomor ${i + 1} untuk subtes Penalaran Umum.`,
  options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D", "Opsi E"].slice(0, i === 0 ? 4 : 5),
}));

const PRIMARY = "#3F8CFF"; // biru utama
const LAVENDER = "#e3edff"; // biru lavender
const BG = "#F7FAFF";
const CARD = "#fff";
const BORDER = "#E3EAFD";
const FONT = "#222";
const GRID = "#e0e7ef";
const GRID_ACTIVE = LAVENDER;
const GRID_RAGU = "#fff";
const GRID_JAWAB = PRIMARY;
const GRID_TEXT = PRIMARY;
const GRID_BG = "#e3edff";
const SOFT_BLUE = LAVENDER;
const SOFT_BORDER = LAVENDER;
const BTN = PRIMARY;
const BTN_TEXT = "#fff";
const BTN_SECONDARY = "#f4f8ff";
const BTN_SECONDARY_TEXT = FONT;
const BTN_DISABLED = "#e3eaff";
const BTN_DISABLED_TEXT = "#b0b8c9";
const KET_BG = LAVENDER;
const KET_BORDER = PRIMARY;
const KET_TEXT = PRIMARY;
const KET_RAGU = PRIMARY;
const KET_RAGU_BG = "#fff";
const KET_RAGU_BORDER = PRIMARY;

export default function ExamWork() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(SOAL.length).fill(null));
  const [ragu, setRagu] = useState(Array(SOAL.length).fill(false));
  const [timer, setTimer] = useState(25 * 60); // 25 menit
  const [showWarning, setShowWarning] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<any>(null);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Fullscreen protection
  useEffect(() => {
    function handleFullscreen() {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setFullscreen(isFull);
      if (!isFull) setShowWarning(true);
    }
    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("webkitfullscreenchange", handleFullscreen);
    document.addEventListener("mozfullscreenchange", handleFullscreen);
    document.addEventListener("MSFullscreenChange", handleFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("webkitfullscreenchange", handleFullscreen);
      document.removeEventListener("mozfullscreenchange", handleFullscreen);
      document.removeEventListener("MSFullscreenChange", handleFullscreen);
    };
  }, []);

  // Tab change protection
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "hidden") setShowTabWarning(true);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Block copy-paste
  useEffect(() => {
    function handlePaste(e: any) {
      e.preventDefault();
      setShowPasteWarning(true);
      setTimeout(() => setShowPasteWarning(false), 2000);
    }
    function handleCopy(e: any) {
      e.preventDefault();
      setShowPasteWarning(true);
      setTimeout(() => setShowPasteWarning(false), 2000);
    }
    document.addEventListener("paste", handlePaste);
    document.addEventListener("copy", handleCopy);
    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  // Enter fullscreen on mount
  useEffect(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  // Format timer
  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");

  // Jawab
  function jawab(idx: number) {
    setAnswers((a) => {
      const b = [...a];
      b[current] = idx;
      return b;
    });
  }

  // Navigasi
  function goTo(idx: number) {
    setCurrent(idx);
  }

  // Ragu
  function toggleRagu() {
    setRagu((r) => {
      const b = [...r];
      b[current] = !b[current];
      return b;
    });
  }

  // Selesai
  function selesai() {
    setShowModal(true);
  }

  // Hitung status soal
  const countDijawab = answers.filter((a, i) => a !== null && !ragu[i]).length;
  const countRagu = ragu.filter((v) => v).length;
  const countBelum = SOAL.length - countDijawab - countRagu;

  // Modal konfirmasi
  function ModalConfirm() {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0007", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: CARD, borderRadius: 24, boxShadow: "0 8px 32px #3f8cff33", padding: 40, minWidth: 380, maxWidth: "90vw", textAlign: "center", fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
          <div style={{ fontWeight: 800, fontSize: 30, color: FONT, marginBottom: 12 }}>Apakah Kamu Yakin?</div>
          <div style={{ color: "#444", fontSize: 18, marginBottom: 28 }}>Setelah mengakhiri Try Out, Kamu tidak dapat lagi mengerjakan soal ini.</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24, fontSize: 18, fontWeight: 700 }}>
            <span style={{ color: "#22bb33", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 900, marginRight: 4 }}>●</span> Dijawab: {countDijawab}
            </span>
            <span style={{ color: "#e6b800", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 900, marginRight: 4 }}>●</span> Ragu-ragu: {countRagu}
            </span>
            <span style={{ color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 900, marginRight: 4 }}>●</span> Tidak Dijawab: {countBelum}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 12 }}>
            <button onClick={() => setShowModal(false)} style={{ background: BTN_SECONDARY, color: PRIMARY, fontWeight: 700, border: `2px solid ${PRIMARY}`, borderRadius: 12, padding: "12px 32px", fontSize: 20, cursor: "pointer", minWidth: 120 }}>Batal</button>
            <button onClick={() => navigate("/exam/result/" + id)} style={{ background: PRIMARY, color: BTN_TEXT, fontWeight: 700, border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 20, cursor: "pointer", minWidth: 120, boxShadow: "0 2px 8px #3f8cff22" }}>Ya, Akhiri</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: 'Inter, Roboto, Arial, sans-serif', color: FONT, padding: 0, margin: 0, paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ background: PRIMARY, color: "#fff", padding: 16, borderRadius: "0", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px #e3eaff33", fontWeight: 800, fontSize: 26 }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 1 }}>Brainest Indonesia</div>
        <div style={{ display: "flex", gap: 18 }}>
          <button style={{ background: "#fff", color: PRIMARY, fontWeight: 700, border: "none", borderRadius: 16, padding: "10px 32px", fontSize: 20, marginRight: 8, cursor: "pointer", boxShadow: "0 2px 8px #e3eaff33" }}>Pause</button>
          <button onClick={selesai} style={{ background: "#fff", color: PRIMARY, fontWeight: 700, border: "none", borderRadius: 16, padding: "10px 32px", fontSize: 20, cursor: "pointer", boxShadow: "0 2px 8px #e3eaff33" }}>Akhiri Try Out</button>
        </div>
      </div>
      {/* Main Card */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: 32, gap: 40 }}>
        <div style={{ flex: 1, maxWidth: 820, background: CARD, borderRadius: 20, boxShadow: "0 4px 32px #e3eaff55", padding: 40, minHeight: 520, marginRight: 0, border: `1.5px solid ${LAVENDER}` }}>
          <div style={{ color: PRIMARY, fontWeight: 800, fontSize: 20, marginBottom: 10, letterSpacing: 0.5 }}>SOAL NO. {current + 1}</div>
          <div style={{ color: FONT, fontWeight: 500, fontSize: 18, marginBottom: 28, lineHeight: 1.7 }}>{SOAL[current].text}</div>
          <div style={{ marginBottom: 36 }}>
            {SOAL[current].options.map((opt, idx) => (
              <div key={idx} style={{ marginBottom: 18, display: 'flex', alignItems: 'center' }}>
                <label style={{ flex: 1, display: "flex", alignItems: "center", background: answers[current] === idx ? LAVENDER : "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 500, color: FONT, fontSize: 18, boxShadow: answers[current] === idx ? `0 2px 8px ${LAVENDER}` : "0 1px 4px #e3eaff22", cursor: "pointer", border: answers[current] === idx ? `2px solid ${PRIMARY}` : `1.5px solid ${LAVENDER}` }}>
                  <input type="radio" checked={answers[current] === idx} onChange={() => jawab(idx)} style={{ marginRight: 18, width: 22, height: 22 }} />
                  <span style={{ fontWeight: 700, fontSize: 20, marginRight: 16 }}>{String.fromCharCode(65 + idx)}.</span> {opt}
                </label>
              </div>
            ))}
            {/* Opsi tambahan: Tandai Jawaban Ragu-Ragu */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
              <button onClick={toggleRagu} style={{ background: ragu[current] ? LAVENDER : "#fff", color: PRIMARY, fontWeight: 700, border: `2px solid ${LAVENDER}`, borderRadius: 12, padding: "12px 32px", fontSize: 18, cursor: "pointer", marginLeft: 0, boxShadow: ragu[current] ? `0 2px 8px ${LAVENDER}` : "0 1px 4px #e3eaff22" }}>Tandai Jawaban Ragu-Ragu</button>
            </div>
          </div>
        </div>
        {/* Grid & Timer */}
        <div style={{ minWidth: 320, background: CARD, borderRadius: 20, boxShadow: "0 4px 32px #e3eaff55", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", border: `1.5px solid ${LAVENDER}` }}>
          <div style={{ fontWeight: 800, fontSize: 38, color: PRIMARY, marginBottom: 24, letterSpacing: 2, background: LAVENDER, borderRadius: 12, width: "100%", textAlign: "center", padding: 12 }}>{mm} : {ss}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }}>
            {SOAL.map((_, idx) => {
              let bg = "#fff", color = PRIMARY, border = `1.5px solid ${LAVENDER}`;
              if (idx === current) { bg = LAVENDER; color = PRIMARY; border = `2.5px solid ${PRIMARY}`; }
              else if (ragu[idx]) { bg = LAVENDER; color = PRIMARY; border = `2px solid ${PRIMARY}`; }
              else if (answers[idx] !== null) { bg = PRIMARY; color = "#fff"; border = `2px solid ${PRIMARY}`; }
              return (
                <button key={idx} onClick={() => goTo(idx)} style={{ width: 40, height: 40, borderRadius: 10, fontWeight: 700, fontSize: 18, background: bg, color, border, cursor: "pointer", boxShadow: "none", outline: "none", transition: "all 0.15s" }}>{idx + 1}</button>
              );
            })}
          </div>
          {/* Keterangan warna */}
          <div style={{ background: KET_BG, borderRadius: 16, padding: 16, fontSize: 16, color: KET_TEXT, fontWeight: 600, width: "100%", marginBottom: 8, marginTop: 8, border: `1.5px solid ${LAVENDER}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 6 }}>
              <span style={{ width: 18, height: 18, background: PRIMARY, display: "inline-block", borderRadius: 6, marginRight: 8 }}></span> Dijawab
              <span style={{ width: 18, height: 18, background: LAVENDER, border: `2px solid ${PRIMARY}`, display: "inline-block", borderRadius: 6, marginRight: 8, marginLeft: 18 }}></span> Ragu-ragu
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ width: 18, height: 18, background: "#fff", border: `1.5px solid ${LAVENDER}`, display: "inline-block", borderRadius: 6, marginRight: 8 }}></span> Belum Dijawab
              <span style={{ width: 18, height: 18, background: "#fff", border: `2.5px solid ${PRIMARY}`, display: "inline-block", borderRadius: 6, marginRight: 8, marginLeft: 18 }}></span> Posisi Saat Ini
            </div>
          </div>
        </div>
      </div>
      {/* Navigasi bawah sticky */}
      <div style={{ position: "fixed", left: 0, bottom: 0, width: "100vw", background: CARD, borderTop: `1.5px solid ${LAVENDER}`, boxShadow: "0 -2px 16px #e3eaff33", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, zIndex: 10 }}>
        <button onClick={() => goTo(current - 1)} disabled={current === 0} style={{ background: BTN_SECONDARY, color: BTN_SECONDARY_TEXT, fontWeight: 700, border: `1.5px solid ${LAVENDER}`, borderRadius: 12, padding: "14px 38px", fontSize: 20, cursor: current === 0 ? "not-allowed" : "pointer", marginRight: 32 }}>← Sebelumnya</button>
        <div style={{ fontWeight: 700, fontSize: 20, margin: "0 32px" }}>{current + 1}/{SOAL.length}</div>
        <button onClick={() => goTo(current + 1)} disabled={current === SOAL.length - 1} style={{ background: BTN, color: BTN_TEXT, fontWeight: 700, border: `1.5px solid ${PRIMARY}`, borderRadius: 12, padding: "14px 38px", fontSize: 20, cursor: current === SOAL.length - 1 ? "not-allowed" : "pointer", marginLeft: 32 }}>Selanjutnya →</button>
      </div>
      {/* Modal Konfirmasi */}
      {showModal && <ModalConfirm />}
      {/* Warning popups */}
      {showWarning && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0008", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: CARD, color: PRIMARY, padding: 40, borderRadius: 20, fontWeight: 700, fontSize: 24, boxShadow: "0 2px 16px #3f8cff33" }}>
            Mode layar penuh dimatikan! Aktifkan kembali fullscreen untuk melanjutkan ujian.
            <div style={{ marginTop: 28 }}>
              <button onClick={() => { document.documentElement.requestFullscreen(); setShowWarning(false); }} style={{ background: PRIMARY, color: "#fff", fontWeight: 700, border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 20, cursor: "pointer" }}>Aktifkan Fullscreen</button>
            </div>
          </div>
        </div>
      )}
      {showTabWarning && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0008", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: CARD, color: PRIMARY, padding: 40, borderRadius: 20, fontWeight: 700, fontSize: 24, boxShadow: "0 2px 16px #3f8cff33" }}>
            Jangan tinggalkan tab ujian! Ujian dapat dihentikan jika Anda keluar dari halaman ini.
            <div style={{ marginTop: 28 }}>
              <button onClick={() => setShowTabWarning(false)} style={{ background: PRIMARY, color: "#fff", fontWeight: 700, border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 20, cursor: "pointer" }}>Saya Mengerti</button>
            </div>
          </div>
        </div>
      )}
      {showPasteWarning && (
        <div style={{ position: "fixed", top: 40, right: 40, background: "#fffbe6", color: "#b88600", padding: 22, borderRadius: 14, fontWeight: 700, fontSize: 20, boxShadow: "0 2px 8px #ffe06655", zIndex: 9999 }}>
          Copy-paste dinonaktifkan selama ujian!
        </div>
      )}
    </div>
  );
} 