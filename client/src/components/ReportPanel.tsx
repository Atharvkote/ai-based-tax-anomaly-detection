import React, { useState, useEffect, useMemo, useRef } from 'react'
import { RiskBadge, CircleRing, ReportBoundary } from '@/components/PredictionAtoms'
import { ReportCardSkeleton, TableSkeleton } from '@/components/Skeletons'
import type { PredictionResult, HistoryEntry, PredStatus, PredictPayload } from '@/types/prediction'

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
    <div className="animate-count-up" style={{ display:'flex', alignItems:'baseline', gap:2, lineHeight:1 }}>
      <span className="score-digit" style={{ fontSize:'5.5rem', fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.05em' }}>
        {intPart}
      </span>
      <span className="score-digit" style={{ fontSize:'3rem', fontWeight:500, color:'var(--accent)' }}>
        .{decPart}
      </span>
      <span style={{ fontSize:'1.1rem', fontWeight:500, color:'var(--text-muted)', marginLeft:4 }}>/100</span>
    </div>
  )
}

// ── FINAL SCORE CARD ─────────────────────────────────────────────────────────
function FinalScoreCard({ result }: { result: PredictionResult }) {
  const pct = result.final_score * 100
  const accentColor = pct > 66 ? 'var(--danger)' : pct > 33 ? 'var(--warning)' : 'var(--success)'

  return (
    <div style={{ background:'var(--bg-surface)', borderRadius:'1.25rem', border:`1px solid var(--border)`,
      borderLeft:`4px solid ${accentColor}`, padding:'1.75rem', boxShadow:'var(--shadow-md)' }}>
      <p style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:12 }}>
        Final Risk Score
      </p>
      <AnimatedScore target={pct} />
      <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:10 }}>
        Composite score across ML model and rule engine
      </p>
    </div>
  )
}

// ── RISK METER ────────────────────────────────────────────────────────────────
function RiskMeter({ finalScore }: { finalScore: number }) {
  const [width, setWidth] = useState(0)
  const pct = finalScore * 100
  const color = pct > 66 ? 'var(--danger)' : pct > 33 ? 'var(--warning)' : 'var(--success)'

  useEffect(() => { const t = setTimeout(() => setWidth(pct), 60); return () => clearTimeout(t) }, [pct])

  return (
    <div style={{ background:'var(--bg-surface)', borderRadius:'1.25rem', border:'1px solid var(--border)', padding:'1.5rem', boxShadow:'var(--shadow-sm)' }}>
      <p style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:16 }}>Risk Meter</p>
      <div style={{ position:'relative', height:14, background:'var(--bg-elevated)', borderRadius:999, overflow:'visible' }}>
        {/* Zone bg bands */}
        <div style={{ position:'absolute', inset:0, borderRadius:999, overflow:'hidden', display:'flex' }}>
          <div style={{ width:'33%', background:'rgba(34,197,94,0.12)' }} />
          <div style={{ width:'34%', background:'rgba(249,115,22,0.12)' }} />
          <div style={{ width:'33%', background:'rgba(239,68,68,0.12)' }} />
        </div>
        {/* Fill */}
        <div className="risk-bar-fill" style={{ position:'absolute', top:0, left:0, height:'100%', width:`${width}%`, background:`linear-gradient(90deg, var(--success), ${pct>33?'var(--warning)':'var(--success)'} 50%, ${pct>66?'var(--danger)':'transparent'})`, borderRadius:999 }}>
          {/* Pulse dot */}
          <span className="animate-dot-pulse" style={{ position:'absolute', right:-6, top:'50%', transform:'translateY(-50%)', width:14, height:14, borderRadius:'50%', background:color, border:'2px solid var(--bg-surface)', boxShadow:`0 0 0 3px ${color}40` }} />
        </div>
        {/* Lines */}
        {[33,66].map(p => (
          <div key={p} style={{ position:'absolute', top:-4, bottom:-4, left:`${p}%`, width:2, background:'var(--bg-surface)', borderRadius:1 }} />
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, fontSize:'0.72rem', fontWeight:700 }}>
        <span style={{ color:'var(--success)' }}>LOW</span>
        <span style={{ color:'var(--warning)' }}>MEDIUM</span>
        <span style={{ color:'var(--danger)' }}>HIGH</span>
      </div>
    </div>
  )
}

// ── SCORE BREAKDOWN ───────────────────────────────────────────────────────────
function ScoreBreakdown({ mlScore, ruleScore }: { mlScore: number; ruleScore: number }) {
  function card(label: string, value: number, icon: string) {
    const color = value > 0.66 ? 'var(--danger)' : value > 0.33 ? 'var(--warning)' : 'var(--success)'
    return (
      <div style={{ flex:1, background:'var(--bg-elevated)', borderRadius:'1rem', padding:'1.25rem', display:'flex', flexDirection:'column', alignItems:'center', gap:8,
        border:'1.5px solid transparent', transition:'border-color 0.2s, transform 0.2s', cursor:'default' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--accent)'; (e.currentTarget as HTMLDivElement).style.transform='translateY(-2px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor='transparent'; (e.currentTarget as HTMLDivElement).style.transform='none' }}>
        <div style={{ position:'relative', width:72, height:72 }}>
          <CircleRing value={value} color={color} />
          <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{icon}</span>
        </div>
        <div className="score-digit" style={{ fontSize:'1.8rem', fontWeight:700, color, lineHeight:1 }}>
          {(value * 100).toFixed(1)}
        </div>
        <p style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)' }}>{label}</p>
      </div>
    )
  }
  return (
    <div style={{ background:'var(--bg-surface)', borderRadius:'1.25rem', border:'1px solid var(--border)', padding:'1.5rem', boxShadow:'var(--shadow-sm)' }}>
      <p style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:16 }}>Score Breakdown</p>
      <div style={{ display:'flex', gap:12 }}>{card('ML Model', mlScore, '🧠')}{card('Rule Engine', ruleScore, '🛡️')}</div>
    </div>
  )
}

// ── SUSPICION ALERT ───────────────────────────────────────────────────────────
function SuspicionAlert({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="animate-pulse-border animate-fade-up" style={{
      display:'flex', alignItems:'flex-start', gap:14, padding:'1rem 1.25rem',
      background:'var(--danger-bg)', borderRadius:'1rem',
      borderLeft:'4px solid var(--danger)', border:'1px solid var(--danger)',
    }}>
      <span style={{ fontSize:'1.25rem' }}>⚠️</span>
      <div>
        <p style={{ fontWeight:700, color:'var(--danger)', fontSize:'0.875rem' }}>Transaction Flagged as SUSPICIOUS</p>
        <p style={{ color:'var(--danger)', opacity:0.8, fontSize:'0.78rem', marginTop:2 }}>
          Recommend immediate compliance review and audit trail documentation.
        </p>
      </div>
    </div>
  )
}

// ── FEATURE INSIGHTS ──────────────────────────────────────────────────────────
function FeatureInsights({ payload }: { payload: PredictPayload }) {
  const items = useMemo(() => {
    const fields = [
      { key:'tax_gap', label:'Tax Gap', v: Number(payload.tax_gap) },
      { key:'cash_ratio_monthly', label:'Cash Ratio (Monthly)', v: Number(payload.cash_ratio_monthly) },
      { key:'bulk_transaction_ratio', label:'Bulk Transaction Ratio', v: Number(payload.bulk_transaction_ratio) },
      { key:'client_concentration_ratio', label:'Client Concentration', v: Number(payload.client_concentration_ratio) },
      { key:'same_amount_frequency', label:'Same Amount Frequency', v: Number(payload.same_amount_frequency) },
      { key:'discount_frequency', label:'Discount Frequency', v: Number(payload.discount_frequency) },
      { key:'refund_rate', label:'Refund Rate', v: Number(payload.refund_rate) },
      { key:'amount_vs_avg_ratio', label:'Amount vs Avg Ratio', v: Math.min(Number(payload.amount_vs_avg_ratio)/10,1) },
      { key:'transaction_velocity', label:'Transaction Velocity', v: Math.min(Number(payload.transaction_velocity)/50,1) },
      { key:'profit_margin', label:'Low Profit Margin', v: 1 - Number(payload.profit_margin) },
    ]
    return fields.filter(f => !isNaN(f.v)).sort((a,b)=>b.v-a.v).slice(0,5)
  }, [payload])

  return (
    <div style={{ background:'var(--bg-surface)', borderRadius:'1.25rem', border:'1px solid var(--border)', padding:'1.5rem', boxShadow:'var(--shadow-sm)' }}>
      <p style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:16 }}>Top Risk Indicators</p>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {items.map((item, i) => {
          const color = item.v > 0.66 ? 'var(--danger)' : item.v > 0.33 ? 'var(--warning)' : 'var(--accent)'
          return (
            <div key={item.key}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:'0.8rem', fontWeight:500, color:'var(--text-secondary)' }}>{item.label}</span>
                <span className="score-digit" style={{ fontSize:'0.78rem', fontWeight:700, color }}>{(item.v*100).toFixed(0)}%</span>
              </div>
              <div style={{ height:7, background:'var(--bg-elevated)', borderRadius:999, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${item.v*100}%`, background:color, borderRadius:999,
                  transition:`width 1.1s cubic-bezier(0.4,0,0.2,1) ${i*80}ms` }} />
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
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <ReportCardSkeleton />
      <ReportCardSkeleton />
      <ReportCardSkeleton />
    </div>
  )
}

// ── IDLE PANEL ────────────────────────────────────────────────────────────────
function IdlePanel() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, minHeight:400,
      background:`linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))`,
      borderRadius:'1.25rem', border:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
      {/* Decorative blobs */}
      <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%',
        background:'radial-gradient(circle, var(--accent-light), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-30, left:-30, width:140, height:140, borderRadius:'50%',
        background:'radial-gradient(circle, var(--danger-bg), transparent 70%)', pointerEvents:'none' }} />
      <div className="animate-float" style={{ fontSize:'3.5rem', position:'relative', zIndex:1 }}>🛡️</div>
      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <p style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.3rem', color:'var(--text-primary)' }}>Ready to Analyze</p>
        <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginTop:8, maxWidth:260 }}>
          Fill in the transaction details and click "Analyze Transaction"
        </p>
      </div>
    </div>
  )
}

function ErrorPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 260, background: 'var(--danger-bg)', borderRadius: '1.25rem', border: '1px solid var(--danger)' }}>
      <p style={{ fontWeight: 700, color: 'var(--danger)' }}>Prediction failed</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Please verify backend + ML service connectivity and try again.</p>
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
      <div className="animate-fade-up" style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <SuspicionAlert show={result.is_suspicious} />
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <RiskBadge level={result.risk_level} />
          <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
            Analyzed at {new Date().toLocaleTimeString()}
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
    <div style={{ background:'var(--bg-surface)', borderRadius:'1.25rem', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--border-subtle)' }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', color:'var(--text-primary)' }}>Prediction History</h2>
          <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:2 }}>Last {history.length} analyses · newest first</p>
        </div>
        {history.length > 0 && (
          <button onClick={onClear} style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer', padding:'6px 12px', borderRadius:8, transition:'color 0.2s, background 0.2s' }}
            onMouseEnter={e => { (e.currentTarget).style.color='var(--danger)'; (e.currentTarget).style.background='var(--danger-bg)' }}
            onMouseLeave={e => { (e.currentTarget).style.color='var(--text-muted)'; (e.currentTarget).style.background='none' }}>
            Clear History
          </button>
        )}
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : history.length === 0 ? (
        <div style={{ padding:'3rem', textAlign:'center' }}>
          <span style={{ fontSize:'2.5rem' }}>📋</span>
          <p style={{ fontSize:'0.875rem', color:'var(--text-muted)', marginTop:10 }}>No predictions yet</p>
        </div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.82rem' }}>
            <thead>
              <tr style={{ background:'var(--bg-elevated)' }}>
                {['#','Timestamp','Amount','Final Score','Risk Level','ML Score','Rule Score','Suspicious'].map(h => (
                  <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((e, i) => (
                <tr key={e.id} style={{ borderBottom:'1px solid var(--border-subtle)', background: e.is_suspicious ? 'var(--danger-bg)' : 'transparent', transition:'background 0.15s' }}
                  onMouseEnter={ev => { if (!e.is_suspicious) (ev.currentTarget).style.background='var(--bg-hover)' }}
                  onMouseLeave={ev => { (ev.currentTarget).style.background = e.is_suspicious ? 'var(--danger-bg)' : 'transparent' }}>
                  <td style={{ padding:'12px 16px', color:'var(--text-muted)', fontWeight:500 }}>{i+1}</td>
                  <td style={{ padding:'12px 16px', color:'var(--text-secondary)', whiteSpace:'nowrap', fontSize:'0.78rem' }}>{e.timestamp}</td>
                  <td style={{ padding:'12px 16px', fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap' }}>₹{e.amount.toLocaleString('en-IN')}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span className="score-digit" style={{ fontWeight:700, fontSize:'0.875rem',
                      color: e.risk_level==='HIGH'?'var(--danger)':e.risk_level==='MEDIUM'?'var(--warning)':'var(--success)' }}>
                      {(e.final_score*100).toFixed(1)}
                    </span>
                  </td>
                  <td style={{ padding:'12px 16px' }}><RiskBadge level={e.risk_level} /></td>
                  <td style={{ padding:'12px 16px', color:'var(--text-secondary)' }} className="score-digit">{(e.ml_score*100).toFixed(1)}</td>
                  <td style={{ padding:'12px 16px', color:'var(--text-secondary)' }} className="score-digit">{(e.rule_score*100).toFixed(1)}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ fontSize:'0.72rem', fontWeight:700, padding:'3px 10px', borderRadius:999,
                      background: e.is_suspicious?'var(--danger-bg)':'var(--success-bg)',
                      color: e.is_suspicious?'var(--danger)':'var(--success)' }}>
                      {e.is_suspicious?'● YES':'NO'}
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
