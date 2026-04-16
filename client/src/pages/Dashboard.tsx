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
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-[1px] bg-border" />
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-text-muted whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-border" />
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
    <div className="bg-background  min-h-screen flex flex-col">
      <Navbar apiStatus={apiStatus} />

      {/* Page header */}
      <div className="bg-card border-b border-border pt-[62px]">
        <div className="max-w-[1280px] mx-auto p-6 sm:p-8">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <p className="text-[0.72rem] font-bold uppercase tracking-widest text-accent mb-1">
                Risk Intelligence
              </p>
              <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-primary leading-tight">
                Transaction Risk Analyzer
              </h1>
              <p className="text-[0.85rem] text-text-secondary">
                Submit 15 parameters to get an instant ML + rule-based risk assessment
              </p>
            </div>

            {/* Mini stats */}
            <div className="flex gap-3">
              {status === 'loading' ? <StatsSkeleton /> : [
                { label: 'Total Analyzed', value: stats.total },
                { label: 'High Risk', value: stats.highRisk },
                { label: 'Suspicious', value: stats.suspicious },
              ].map(s => (
                <div key={s.label} className="bg-secondary rounded-[14px] border border-border px-5 py-3 text-center min-w-[80px] shadow-sm hover:border-accent/40 transition-colors">
                  <div className={` text-2xl font-bold ${s.label === 'Suspicious' && s.value > 0 ? 'text-danger' :
                    s.label === 'High Risk' && s.value > 0 ? 'text-warning' : 'text-primary'
                    }`}>
                    {s.value}
                  </div>
                  <div className="text-[0.67rem] text-text-muted font-bold mt-0.5 uppercase tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-[1280px] mx-auto p-6 sm:p-8 w-full">
        {/* Analyzer grid */}
        <SectionLabel label="Analyzer" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: sticky form */}
          <div className="lg:sticky lg:top-[82px] z-10 bg-background/80 backdrop-blur-sm rounded-xl">
            <TransactionForm
              form={form} errors={errors} setField={setField}
              loadSample={loadSample} resetForm={resetForm}
              onSubmit={handleSubmit} isLoading={status === 'loading'}
            />
          </div>
          {/* RIGHT: report */}
          <div className="min-h-[400px]">
            <ReportPanel status={status} result={result} payload={lastPayload} />
          </div>
        </div>

        {/* History */}
        <div className="mt-12">
          <SectionLabel label="Prediction History" />
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <HistoryTable history={history} onClear={clearHistory} isLoading={status === 'loading'} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
