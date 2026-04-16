import React, { useState, useEffect, useMemo, useRef } from 'react'
import { RiskBadge, CircleRing, ReportBoundary } from '@/components/PredictionAtoms'
import { TableSkeleton } from '@/components/Skeletons'
import type { PredictionResult, HistoryEntry, PredStatus, PredictPayload } from '@/types/prediction'
import { Shield, Brain, AlertTriangle, FileText, Database, Cpu } from 'lucide-react'

// ── ANIMATED SCORE NUMBER ────────────────────────────────────────────────────
function AnimatedScore({ target }: { target: number }) {
  const [val, setVal] = useState(0)
  const frame = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 1000
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setVal(parseFloat((eased * target).toFixed(1)))
      if (p < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target])

  const intPart = String(Math.floor(val)).padStart(2, ' ')
  const decPart = val.toFixed(1).split('.')[1]

  return (
    <div className="animate-count-up flex items-baseline gap-0.5 leading-none">
      <span className="score-digit text-[5.5rem] font-bold text-primary tracking-tighter">
        {intPart}
      </span>
      <span className="score-digit text-[3rem] font-medium text-accent">
        .{decPart}
      </span>
      <span className="text-[1.1rem] font-medium text-text-muted ml-1">/100</span>
    </div>
  )
}

// ── FINAL SCORE CARD ─────────────────────────────────────────────────────────
function FinalScoreCard({ result }: { result: PredictionResult }) {
  const pct = result.final_score * 100
  const borderLeftColor = pct > 66 ? 'border-l-danger' : pct > 33 ? 'border-l-warning' : 'border-l-success'

  return (
    <div className={`bg-card rounded-xl border border-border ${borderLeftColor} border-l-4 p-7 shadow-md`}>
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-3">
        Final Risk Score
      </p>
      <AnimatedScore target={pct} />
      <p className="text-[0.78rem] text-text-secondary mt-2 opacity-80">
        Composite risk calculated from AI models and deterministic rules
      </p>
    </div>
  )
}

// ── RISK METER ────────────────────────────────────────────────────────────────
function RiskMeter({ finalScore }: { finalScore: number }) {
  const [width, setWidth] = useState(0)
  const pct = finalScore * 100
  const colorClass = pct > 66 ? 'bg-danger' : pct > 33 ? 'bg-warning' : 'bg-success'

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 60)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-4">Risk Exposure</p>
      <div className="relative h-3 w-full bg-secondary rounded-full">
        {/* Zone highlights */}
        <div className="absolute inset-0 rounded-full overflow-hidden flex opacity-10">
          <div className="w-1/3 bg-success" />
          <div className="w-1/3 bg-warning" />
          <div className="w-1/3 bg-danger" />
        </div>
        {/* Fill */}
        <div
          className="risk-bar-fill absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, var(--success), ${pct > 40 ? 'var(--warning)' : 'var(--success)'} 60%, ${pct > 75 ? 'var(--danger)' : 'transparent'})`
          }}
        >
          {/* Knob */}
          <span className={`animate-dot-pulse absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-card shadow-sm ${colorClass}`} />
        </div>
        {/* Break lines */}
        <div className="absolute left-1/3 top-[-4px] bottom-[-4px] w-[2px] bg-card rounded-full" />
        <div className="absolute left-2/3 top-[-4px] bottom-[-4px] w-[2px] bg-card rounded-full" />
      </div>
      <div className="flex justify-between mt-3 text-[0.7rem] font-bold tracking-tight">
        <span className="text-success opacity-80">STABLE</span>
        <span className="text-warning opacity-80">MODERATE</span>
        <span className="text-danger opacity-80">CRITICAL</span>
      </div>
    </div>
  )
}

// ── SCORE BREAKDOWN ───────────────────────────────────────────────────────────
function ScoreBreakdown({ mlScore, ruleScore }: { mlScore: number; ruleScore: number }) {
  function card(label: string, value: number, Icon: typeof Brain) {
    const pct = value * 100
    const color = pct > 66 ? 'var(--danger)' : pct > 33 ? 'var(--warning)' : 'var(--success)'
    const colorText = pct > 66 ? 'text-danger' : pct > 33 ? 'text-warning' : 'text-success'

    return (
      <div className="flex-1 bg-secondary rounded-xl p-5 flex flex-col items-center gap-2 border-[1.5px] border-transparent hover:border-accent/30 hover:-translate-y-1 transition-all duration-200 group">
        <div className="relative w-16 h-16 pointer-events-none">
          <CircleRing value={value} color={color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={24} className="group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div className={`score-digit text-2xl font-bold font-mono leading-none mt-1 ${colorText}`}>
          {(value * 100).toFixed(1)}
        </div>
        <p className="text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-4">Signal Breakdown</p>
      <div className="flex gap-3">
        {card('ML Analytics', mlScore, Brain)}
        {card('Enforcement Rules', ruleScore, Shield)}
      </div>
    </div>
  )
}

// ── SUSPICION ALERT ───────────────────────────────────────────────────────────
function SuspicionAlert({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="animate-pulse-border animate-fade-up flex items-start gap-4 p-4 rounded-xl bg-danger/5 border border-danger/30 border-l-4 border-l-danger shadow-sm">
      <AlertTriangle size={24} className="text-danger shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-extrabold text-danger text-[0.875rem] uppercase tracking-tight">Anomalous Activity Detected</p>
        <p className="text-danger/80 text-[0.78rem] leading-relaxed">
          This transaction exhibit patterns consistent with reported fraud cases. Immediate compliance review is mandatory.
        </p>
      </div>
    </div>
  )
}

// ── FEATURE INSIGHTS ──────────────────────────────────────────────────────────
function FeatureInsights({ payload }: { payload: PredictPayload }) {
  const items = useMemo(() => {
    const fields = [
      { key: 'tax_gap', label: 'Tax Discrepancy', v: Math.min(Number(payload.tax_gap) / 50000, 1) },
      { key: 'cash_ratio_monthly', label: 'Monthly Cash Intensity', v: Number(payload.cash_ratio_monthly) },
      { key: 'bulk_transaction_ratio', label: 'Large Volume Skew', v: Number(payload.bulk_transaction_ratio) },
      { key: 'client_concentration_ratio', label: 'Entity Concentration', v: Number(payload.client_concentration_ratio) },
      { key: 'same_amount_frequency', label: 'Amount Repetition', v: Number(payload.same_amount_frequency) },
      { key: 'discount_frequency', label: 'High Vol Discounting', v: Number(payload.discount_frequency) },
      { key: 'refund_rate', label: 'Abnormal Refund Rate', v: Number(payload.refund_rate) },
      { key: 'amount_vs_avg_ratio', label: 'Departure from Norm', v: Math.min(Number(payload.amount_vs_avg_ratio) / 10, 1) },
      { key: 'transaction_velocity', label: 'Account Velocity', v: Math.min(Number(payload.transaction_velocity) / 50, 1) },
      { key: 'profit_margin', label: 'Suppressed Margins', v: 1 - Number(payload.profit_margin) },
    ]
    return fields.filter(f => !isNaN(f.v)).sort((a, b) => b.v - a.v).slice(0, 5)
  }, [payload])

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted mb-4">Risk Contribution Factors</p>
      <div className="space-y-5">
        {items.map((item, i) => {
          const colorClass = item.v > 0.66 ? 'bg-danger' : item.v > 0.33 ? 'bg-warning' : 'bg-accent'
          const textColorClass = item.v > 0.66 ? 'text-danger' : item.v > 0.33 ? 'text-warning' : 'text-accent'
          return (
            <div key={item.key} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[0.8rem] font-semibold text-text-secondary">{item.label}</span>
                <span className={`score-digit text-[0.78rem] font-extrabold ${textColorClass}`}>{(item.v * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
                  style={{ width: `${item.v * 100}%`, transitionDelay: `${i * 100}ms` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── LOADING OVERLAY ───────────────────────────────────────────────────────────
function LoadingPanel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-xl border border-border shadow-md relative overflow-hidden gap-6 p-8">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full border-2 border-border animate-[spinRing_3s_linear_infinite]">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_var(--accent)]" />
        </div>
        <div className="absolute inset-4 rounded-full border-2 border-dashed border-accent/40 animate-[spinRing_4s_linear_infinite_reverse]" />
        <div className="absolute inset-8 rounded-full bg-secondary border border-border flex items-center justify-center z-10 shadow-sm animate-pulse">
          <Cpu size={36} className="text-accent" />
        </div>
      </div>

      <div className="text-center z-10 space-y-2">
        <p className=" font-extrabold text-xl text-primary leading-tight">
          Risk Synthesis Engine
        </p>
        <p className="text-[0.85rem] text-text-secondary flex items-center gap-2 justify-center opacity-70">
          <Database size={14} className="animate-spin" /> Correlating 15 data streams…
        </p>
      </div>

      <div className="flex items-end justify-center gap-1.5 mt-2 h-10 w-full max-w-[200px] opacity-40">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-2 bg-accent rounded-t-sm animate-pulse"
            style={{ height: `${20 + Math.sin(i) * 15 + 15}px`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ── IDLE PANEL ────────────────────────────────────────────────────────────────
function IdlePanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[400px] bg-gradient-to-br from-card to-secondary rounded-xl border border-border relative overflow-hidden p-8">
      {/* Decorative gradients */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-accent/10 blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-danger/5 blur-[50px] pointer-events-none" />

      <div className="animate-float relative z-10">
        <div className="p-4 bg-card rounded-2xl shadow-xl border border-border/50">
          <Shield size={64} className="text-accent/60" />
        </div>
      </div>

      <div className="text-center relative z-10 space-y-3">
        <h3 className=" font-extrabold text-xl text-primary">Intelligence Ready</h3>
        <p className="text-[0.85rem] text-text-muted max-w-[260px] leading-relaxed">
          Input operational parameters to generate a comprehensive risk audit report.
        </p>
      </div>
    </div>
  )
}

function ErrorPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[260px] bg-danger/5 rounded-xl border border-danger/40 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center border border-danger/20 mb-2">
        <AlertTriangle size={24} className="text-danger" />
      </div>
      <div className="space-y-1">
        <p className="font-extrabold text-danger uppercase tracking-tight">Analysis Engine Failure</p>
        <p className="text-[0.8rem] text-text-secondary leading-relaxed max-w-[240px]">
          Unable to reach ML microservices. Please check your network or server status.
        </p>
      </div>
    </div>
  )
}

// ── REPORT PANEL ──────────────────────────────────────────────────────────────
export function ReportPanel({ status, result, payload }: { status: PredStatus; result: PredictionResult | null; payload: PredictPayload | null }) {
  if (status === 'loading') return <LoadingPanel />
  if (status === 'idle') return <IdlePanel />
  if (status === 'error') return <ErrorPanel />
  if (!result || !payload) return null

  return (
    <ReportBoundary>
      <div className="animate-fade-up flex flex-col gap-4">
        <SuspicionAlert show={result.is_suspicious} />
        <div className="flex items-center justify-between px-1">
          <RiskBadge level={result.risk_level} />
          <span className="text-[0.7rem] font-bold text-text-muted bg-secondary px-3 py-1 rounded-full border border-border/50 uppercase tracking-tighter">
            Ref: {Math.random().toString(36).substring(7).toUpperCase()}
          </span>
        </div>
        <FinalScoreCard result={result} />
        <RiskMeter finalScore={result.final_score} />
        <ScoreBreakdown mlScore={result.ml_score} ruleScore={result.rule_score} />
        <FeatureInsights payload={payload} />
      </div>
    </ReportBoundary>
  )
}

// ── HISTORY TABLE ─────────────────────────────────────────────────────────────
function HistoryTableInner({ history, onClear, isLoading = false }: { history: HistoryEntry[]; onClear: () => void; isLoading?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className=" font-bold text-lg text-primary tracking-tight">Detection History</h2>
          <p className="text-[0.75rem] text-text-muted mt-0.5">Showing last {history.length} transactions in chronological order.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-[0.75rem] font-bold text-text-muted hover:text-danger hover:bg-danger/5 px-4 py-2 rounded-lg border border-transparent hover:border-danger/10 transition-all cursor-pointer"
          >
            Clear Records
          </button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : history.length === 0 ? (
        <div className="py-24 text-center flex flex-col items-center gap-4 bg-secondary/30">
          <div className="w-16 h-16 rounded-full bg-border/40 flex items-center justify-center">
            <FileText size={32} className="text-text-muted opacity-40" />
          </div>
          <div className="space-y-1">
            <p className="text-[0.95rem] font-bold text-text-secondary">No Audit History</p>
            <p className="text-[0.8rem] text-text-muted max-w-[200px]">Perform your first analysis to see data logs here.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.82rem]">
            <thead>
              <tr className="bg-secondary text-left">
                {['#', 'Timestamp', 'Amount', 'Score', 'Risk', 'ML', 'Rules', 'Flag'].map(h => (
                  <th key={h} className="px-5 py-3 text-[0.68rem] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((e, i) => (
                <tr
                  key={e.id}
                  className={`transition-colors hover:bg-secondary/50 ${e.is_suspicious ? 'bg-danger/[0.03]' : ''}`}
                >
                  <td className="px-5 py-4 text-text-muted font-bold font-mono text-xs">{i + 1}</td>
                  <td className="px-5 py-4 text-text-secondary whitespace-nowrap text-[0.78rem]">{e.timestamp}</td>
                  <td className="px-5 py-4 font-extrabold text-primary whitespace-nowrap">₹{e.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span className={`score-digit font-extrabold text-[0.875rem] font-mono ${e.risk_level === 'HIGH' ? 'text-danger' : e.risk_level === 'MEDIUM' ? 'text-warning' : 'text-success'
                      }`}>
                      {(e.final_score * 100).toFixed(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4"><RiskBadge level={e.risk_level} /></td>
                  <td className="px-5 py-4 text-text-secondary font-mono text-xs">{(e.ml_score * 100).toFixed(1)}</td>
                  <td className="px-5 py-4 text-text-secondary font-mono text-xs">{(e.rule_score * 100).toFixed(1)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-[0.7rem] font-extrabold px-3 py-1 rounded-full border ${e.is_suspicious
                        ? 'bg-danger/10 text-danger border-danger/20'
                        : 'bg-success/10 text-success border-success/20'
                      }`}>
                      {e.is_suspicious ? <><AlertTriangle size={10} /> YES</> : 'NO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export const HistoryTable = React.memo(HistoryTableInner)
