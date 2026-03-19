import React, { Component } from 'react'

export function Toggle({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', width: '100%', background: 'none', border: 'none', padding: 0 }}>
      <div className="toggle-track" style={{ background: checked ? 'var(--accent)' : 'var(--bg-elevated)', border: `1px solid ${checked ? 'var(--accent)' : 'var(--border)'}` }}>
        <div className="toggle-thumb" style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'left', flex: 1 }}>{label}</span>
      {checked && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 999 }}>ON</span>}
    </button>
  )
}

export function NumInput({ id, label, value, onChange, error, placeholder, min, max, prefix, hint }: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; min?: number; max?: number; prefix?: string; hint?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label htmlFor={id} style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {prefix && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', color: 'var(--text-muted)', pointerEvents: 'none' }}>{prefix}</span>}
        <input id={id} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} min={min} max={max} step="any" style={{ width: '100%', background: error ? 'var(--danger-bg)' : 'var(--bg-surface)', border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius: '0.75rem', padding: prefix ? '10px 12px 10px 28px' : '10px 12px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'var(--font-sans)' }} />
      </div>
      {hint && !error && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{hint}</p>}
      {error && <p style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 600 }}>⚠ {error}</p>}
    </div>
  )
}

export function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const cfg = { LOW: ['var(--success-bg)', 'var(--success)'], MEDIUM: ['var(--warning-bg)', 'var(--warning)'], HIGH: ['var(--danger-bg)', 'var(--danger)'] }[level]
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: cfg[0], color: cfg[1], fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}><span className="animate-dot-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: cfg[1], display: 'inline-block' }} />{level} Risk</span>
}

export function CircleRing({ value, color, size = 72, stroke = 6 }: { value: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - circ * Math.min(value, 1)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
    </svg>
  )
}

export class ReportBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(p: { children: React.ReactNode }) { super(p); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return <div style={{ padding: 32, textAlign: 'center', color: 'var(--danger)' }}><p style={{ fontWeight: 700 }}>Report error - please retry</p></div>
    return this.props.children
  }
}
