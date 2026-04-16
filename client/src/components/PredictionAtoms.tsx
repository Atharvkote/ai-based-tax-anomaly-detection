import React, { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export function Toggle({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button 
      id={id} 
      type="button" 
      role="switch" 
      aria-checked={checked} 
      onClick={() => onChange(!checked)} 
      className="flex items-center gap-3 cursor-pointer w-full bg-transparent border-none p-0 group"
    >
      <div 
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 border ${
          checked ? 'bg-accent border-accent' : 'bg-secondary border-border'
        }`}
      >
        <div 
          className={`absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          }`} 
        />
      </div>
      <span className="text-[0.875rem] font-medium text-text-secondary text-left flex-1 group-hover:text-primary transition-colors">{label}</span>
      {checked && (
        <span className="text-[0.65rem] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
          ENABLED
        </span>
      )}
    </button>
  )
}

export function NumInput({ id, label, value, onChange, error, placeholder, min, max, prefix, hint }: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; min?: number; max?: number; prefix?: string; hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label htmlFor={id} className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted px-0.5">
        {label}
      </label>
      <div className="relative group">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.875rem] text-text-muted font-medium pointer-events-none group-focus-within:text-accent transition-colors">
            {prefix}
          </span>
        )}
        <input 
          id={id} 
          type="number" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder} 
          min={min} 
          max={max} 
          step="any" 
          className={`w-full bg-background border-[1.5px] rounded-xl text-[0.875rem] font-medium text-primary outline-none transition-all duration-200 font-sans shadow-sm focus:ring-2 focus:ring-accent/10 ${
            error 
              ? 'bg-danger/5 border-danger focus:border-danger' 
              : 'border-border focus:border-accent'
          } ${prefix ? 'pl-7 pr-3 py-2.5' : 'px-3 py-2.5'}`} 
        />
      </div>
      {hint && !error && <p className="text-[0.65rem] text-text-muted mt-0.5 opacity-80">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1.5 text-[0.7rem] text-danger font-bold mt-1">
          <AlertTriangle size={12} /> {error}
        </p>
      )}
    </div>
  )
}

export function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const configs = {
    LOW: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success', label: 'LOW RISK' },
    MEDIUM: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', label: 'ELEVATED' },
    HIGH: { bg: 'bg-danger/10', text: 'text-danger', dot: 'bg-danger', label: 'CRITICAL' }
  }
  const config = configs[level] || configs.LOW
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} font-extrabold text-[0.7rem] tracking-widest border border-current opacity-90`}>
      <span className={`w-2 h-2 rounded-full animate-dot-pulse ${config.dot}`} />
      {config.label}
    </span>
  )
}

export function CircleRing({ value, color, size = 72, stroke = 6 }: { value: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - circ * Math.min(value, 1)
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={r} 
        fill="none" 
        stroke="var(--bg-elevated)" 
        strokeWidth={stroke} 
      />
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={r} 
        fill="none" 
        stroke={color} 
        strokeWidth={stroke} 
        strokeDasharray={circ} 
        strokeDashoffset={offset} 
        strokeLinecap="round" 
        className="transition-[stroke-dashoffset] duration-1000 ease-out"
      />
    </svg>
  )
}

export class ReportBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(p: { children: React.ReactNode }) { 
    super(p)
    this.state = { hasError: false } 
  }
  
  static getDerivedStateFromError() { 
    return { hasError: true } 
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-danger/5 rounded-xl border border-danger/20 text-danger space-y-2">
          <AlertTriangle size={32} className="mx-auto" />
          <p className="font-bold">Execution Context Error</p>
          <p className="text-xs opacity-80 leading-relaxed">Failed to render prediction report. Please check if all 15 parameters are valid and try again.</p>
        </div>
      )
    }
    return this.props.children
  }
}
