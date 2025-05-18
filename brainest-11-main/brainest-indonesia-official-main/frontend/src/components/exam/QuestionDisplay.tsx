import React from 'react';

interface QuestionDisplayProps {
  soal: { number: number; text: string; image?: string };
}

export default function QuestionDisplay({ soal }: QuestionDisplayProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>{soal.text}</div>
      {soal.image && (
        <div style={{ margin: '12px 0' }}>
          <img src={soal.image} alt={`Gambar soal ${soal.number}`} style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 8, boxShadow: '0 2px 8px #eee' }} />
        </div>
      )}
    </div>
  );
} 