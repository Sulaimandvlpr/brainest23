import React from 'react';

interface ExamActionsProps {
  onPrev: () => void;
  onNext: () => void;
  onRagu: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
  ragu: boolean;
  locked: boolean;
}

export default function ExamActions({ onPrev, onNext, onRagu, onSubmit, isFirst, isLast, ragu, locked }: ExamActionsProps) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
      <button onClick={onPrev} disabled={isFirst || locked} style={{ padding: '10px 20px', borderRadius: 6, background: '#eee', color: '#333', fontWeight: 600, border: 'none', cursor: isFirst || locked ? 'not-allowed' : 'pointer' }}>Sebelumnya</button>
      <button onClick={onNext} disabled={isLast || locked} style={{ padding: '10px 20px', borderRadius: 6, background: '#eee', color: '#333', fontWeight: 600, border: 'none', cursor: isLast || locked ? 'not-allowed' : 'pointer' }}>Selanjutnya</button>
      <button onClick={onRagu} disabled={locked} style={{ padding: '10px 20px', borderRadius: 6, background: ragu ? '#ffe066' : '#f5f5f5', color: ragu ? '#b88600' : '#333', fontWeight: 600, border: 'none', cursor: locked ? 'not-allowed' : 'pointer' }}>{ragu ? 'Batal Ragu-Ragu' : 'Tandai Ragu-Ragu'}</button>
      <button onClick={onSubmit} disabled={locked} style={{ padding: '10px 24px', borderRadius: 6, background: '#1976d2', color: '#fff', fontWeight: 700, border: 'none', marginLeft: 'auto', cursor: locked ? 'not-allowed' : 'pointer' }}>Kumpulkan Subtes</button>
    </div>
  );
} 