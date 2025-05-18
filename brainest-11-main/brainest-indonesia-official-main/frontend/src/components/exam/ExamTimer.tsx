import React from 'react';

interface ExamTimerProps {
  seconds: number;
}

export default function ExamTimer({ seconds }: ExamTimerProps) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return (
    <span style={{
      fontWeight: 800,
      fontSize: 40,
      letterSpacing: 2,
      color: '#3F8CFF',
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      background: '#E8F1FF',
      borderRadius: 12,
      padding: '10px 0',
      width: '100%',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: 1.1,
    }}>{mm} : {ss}</span>
  );
} 