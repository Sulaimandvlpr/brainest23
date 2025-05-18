import React from 'react';

interface QuestionPanelProps {
  count: number;
  current: number;
  answered: (string | null)[];
  ragu: boolean[];
  goTo: (idx: number) => void;
}

export default function QuestionPanel({ count, current, answered, ragu, goTo }: QuestionPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array(count).fill(null).map((_, i) => {
        let bg = '#eee', color = '#333';
        if (ragu[i]) { bg = '#ffe066'; color = '#b88600'; }
        else if (answered[i]) { bg = '#1976d2'; color = '#fff'; }
        if (i === current) { bg = '#111'; color = '#fff'; }
        return (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: 40, height: 40, borderRadius: '50%', fontWeight: 600, fontSize: 16,
              background: bg, color, border: 'none', marginBottom: 2, cursor: 'pointer', boxShadow: i === current ? '0 0 0 2px #1976d2' : 'none',
              outline: 'none', transition: 'all 0.15s',
            }}
            aria-label={`Soal ${i + 1}${ragu[i] ? ' (Ragu-ragu)' : answered[i] ? ' (Sudah dijawab)' : ''}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
} 