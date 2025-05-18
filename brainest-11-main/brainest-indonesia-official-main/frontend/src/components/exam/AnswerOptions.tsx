import React from 'react';

interface Option {
  label: string;
  text: string;
  image?: string;
}

interface AnswerOptionsProps {
  options: Option[];
  selected: string | null;
  onSelect: (ans: string) => void;
  disabled?: boolean;
}

export default function AnswerOptions({ options, selected, onSelect, disabled }: AnswerOptionsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
      {options.map(opt => (
        <button
          key={opt.label}
          onClick={() => !disabled && onSelect(opt.label)}
          style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 8,
            background: selected === opt.label ? '#1976d2' : '#f5f5f5',
            color: selected === opt.label ? '#fff' : '#222',
            border: '1px solid #ddd', fontWeight: 500, fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow: selected === opt.label ? '0 2px 8px #1976d2aa' : 'none',
            transition: 'all 0.15s',
          }}
          aria-pressed={selected === opt.label}
          disabled={disabled}
        >
          <span style={{ fontWeight: 700, fontSize: 18, minWidth: 24 }}>{opt.label}.</span>
          <span style={{ flex: 1 }}>{opt.text}</span>
          {opt.image && <img src={opt.image} alt={`Opsi ${opt.label}`} style={{ maxHeight: 48, maxWidth: 120, borderRadius: 4, marginLeft: 12 }} />}
        </button>
      ))}
    </div>
  );
} 