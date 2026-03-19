import React, { useState, useCallback } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useTransactionForm } from '@/hooks/useTransactionForm'
import { usePrediction } from '@/hooks/usePrediction'
import { useHistory } from '@/hooks/useHistory'
import { TransactionForm } from '../components/TransactionForm'
import { ReportPanel, HistoryTable } from '../components/ReportPanel'
import { computeDashboardStats } from '@/services/transaction.service'
import { StatsSkeleton } from '@/components/Skeletons'
import type { PredictPayload } from '@/types/prediction'

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 1.5rem 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{
        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.14em', color: 'var(--text-muted)', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

export default function Dashboard() {
  const { form, errors, setField, loadSample, resetForm, validate, payload } = useTransactionForm()
  const { status, result, apiStatus, predict } = usePrediction()
  const { history, clearHistory } = useHistory()
  const [lastPayload, setLastPayload] = useState<PredictPayload | null>(null)
  const stats = computeDashboardStats(history)

  const handleSubmit = useCallback(async () => {
    if (!validate()) return
    setLastPayload(payload)
    await predict(payload)
  }, [validate, payload, predict])

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar apiStatus={apiStatus} />

      {/* Page header */}
      <div style={{
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
        paddingTop: 62,  // offset for fixed navbar
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-dark)', marginBottom: 6 }}>
                Risk Intelligence
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.03em',
                color: 'var(--text-primary)', lineHeight: 1.15,
              }}>
                Transaction Risk Analyzer
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                Submit 15 parameters to get an instant ML + rule-based risk assessment
              </p>
            </div>
            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 12 }}>
              {status === 'loading' ? <StatsSkeleton /> : [
                { label: 'Total Analyzed', value: stats.total },
                { label: 'High Risk', value: stats.highRisk },
                { label: 'Suspicious', value: stats.suspicious },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg-elevated)', borderRadius: '0.875rem',
                  border: '1px solid var(--border)', padding: '0.75rem 1.25rem',
                  textAlign: 'center', minWidth: 80,
                }}>
                  <div className="score-digit" style={{
                    fontSize: '1.5rem', fontWeight: 700,
                    color: s.label === 'Suspicious' && s.value > 0 ? 'var(--danger)' :
                      s.label === 'High Risk' && s.value > 0 ? 'var(--warning)' : 'var(--text-primary)',
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
        {/* Analyzer grid */}
        <SectionLabel label="Analyzer" />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 20, alignItems: 'start',
        }}>
          {/* LEFT: sticky form */}
          <div style={{ position: 'sticky', top: 78 }}>
            <TransactionForm
              form={form} errors={errors} setField={setField}
              loadSample={loadSample} resetForm={resetForm}
              onSubmit={handleSubmit} isLoading={status === 'loading'}
            />
          </div>
          {/* RIGHT: report */}
          <ReportPanel status={status} result={result} payload={lastPayload} />
        </div>

        {/* History */}
        <div style={{ marginTop: 40 }}>
          <SectionLabel label="Prediction History" />
          <HistoryTable history={history} onClear={clearHistory} isLoading={status === 'loading'} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
