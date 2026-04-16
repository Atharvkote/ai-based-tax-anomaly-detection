import React, { useCallback } from 'react'
import type { FormData } from '@/types/prediction'
import { Toggle, NumInput } from '@/components/PredictionAtoms'
import { Zap, Loader2, Search, RotateCcw } from 'lucide-react'

interface Props {
  form: FormData
  errors: Partial<Record<keyof FormData, string>>
  setField: (k: keyof FormData, v: string | boolean) => void
  loadSample: () => void
  resetForm: () => void
  onSubmit: () => void
  isLoading: boolean
}

function GroupHeading({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-1 h-4 rounded-full ${colorClass} shrink-0`} />
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>
    </div>
  )
}

function TransactionFormInner({ form, errors, setField, loadSample, resetForm, onSubmit, isLoading }: Props) {
  const handleSubmit = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onSubmit()
  }, [onSubmit])

  return (
    <div className="bg-card rounded-2xl border border-border flex flex-col h-full shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-secondary/30 flex items-center justify-between pointer-events-auto">
        <div>
          <h2 className=" font-extrabold text-lg text-primary tracking-tight">
            Assessment Input
          </h2>
          <p className="text-[0.7rem] text-text-muted mt-0.5 font-medium">15 Risk Vectors • 3 Intelligence Groups</p>
        </div>
        <div className="flex gap-2">
          <button
            id="load-sample-btn"
            type="button"
            onClick={loadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all cursor-pointer active:scale-95"
          >
            <Zap size={14} /> Sample
          </button>
          <button
            id="reset-btn"
            type="button"
            onClick={resetForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-text-muted border border-border hover:bg-border/40 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Scrollable fields */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10 custom-scrollbar pointer-events-auto">

        {/* Group 1: Basics */}
        <section className="animate-fade-up">
          <GroupHeading colorClass="bg-accent" label="Group 1 • Transaction Foundation" />
          <div className="flex flex-col gap-5">
            <NumInput
              id="amount"
              label="Transaction Amount"
              value={form.amount}
              onChange={v => setField('amount', v)}
              error={errors.amount}
              placeholder="e.g. 250,000"
              min={0}
              prefix="₹"
              hint="Main transaction value for baseline modeling"
            />
            <div className="bg-secondary/40 rounded-xl p-4 flex flex-col gap-4 border border-border/50">
              <Toggle id="cash_flag" checked={form.cash_flag} onChange={v => setField('cash_flag', v)} label="Physical Cash Settlement" />
              <Toggle id="is_round_amount" checked={form.is_round_amount} onChange={v => setField('is_round_amount', v)} label="Rounded Figure (Anomaly)" />
              <Toggle id="duplicate_flag" checked={form.duplicate_transaction_flag} onChange={v => setField('duplicate_transaction_flag', v)} label="Duplicate Signature Detected" />
            </div>
          </div>
        </section>

        {/* Group 2: Behavior */}
        <section className="animate-fade-up delay-100">
          <GroupHeading colorClass="bg-warning" label="Group 2 • Behavioral Analytics" />
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <NumInput id="tx_velocity" label="Tx Velocity" value={form.transaction_velocity} onChange={v => setField('transaction_velocity', v)} error={errors.transaction_velocity} placeholder="12" min={0} />
              <NumInput id="avg_ratio" label="Amt vs Avg" value={form.amount_vs_avg_ratio} onChange={v => setField('amount_vs_avg_ratio', v)} error={errors.amount_vs_avg_ratio} placeholder="2.4" min={0} />
              <NumInput id="cash_ratio" label="Mo. Cash Ratio" value={form.cash_ratio_monthly} onChange={v => setField('cash_ratio_monthly', v)} error={errors.cash_ratio_monthly} placeholder="0.0 - 1.0" min={0} max={1} />
              <NumInput id="same_amt" label="Amt Freq." value={form.same_amount_frequency} onChange={v => setField('same_amount_frequency', v)} error={errors.same_amount_frequency} placeholder="0.0 - 1.0" min={0} max={1} />
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <NumInput id="bulk_ratio" label="Bulk Ratio" value={form.bulk_transaction_ratio} onChange={v => setField('bulk_transaction_ratio', v)} error={errors.bulk_transaction_ratio} placeholder="0.0 - 1.0" min={0} max={1} />
              <div className="h-[46px] flex items-center bg-secondary/40 rounded-xl px-4 border border-border/50">
                <Toggle id="spike_flag" checked={form.sudden_spike_flag} onChange={v => setField('sudden_spike_flag', v)} label="Sudden Spike" />
              </div>
            </div>
          </div>
        </section>

        {/* Group 3: Health */}
        <section className="animate-fade-up delay-200">
          <GroupHeading colorClass="bg-danger" label="Group 3 • Systemic Health" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <NumInput id="tax_gap" label="Tax Discrepancy (Gap)" value={form.tax_gap} onChange={v => setField('tax_gap', v)} error={errors.tax_gap} placeholder="e.g. 25,000" min={0} prefix="₹" hint="Reported vs Theoretical Tax Variance" />
            </div>
            <NumInput id="profit_margin" label="Margin (%)" value={form.profit_margin} onChange={v => setField('profit_margin', v)} error={errors.profit_margin} placeholder="0.0 - 1.0" min={0} max={1} />
            <NumInput id="discount_freq" label="Disc. Freq" value={form.discount_frequency} onChange={v => setField('discount_frequency', v)} error={errors.discount_frequency} placeholder="0.0 - 1.0" min={0} max={1} />
            <NumInput id="refund_rate" label="Refund Rate" value={form.refund_rate} onChange={v => setField('refund_rate', v)} error={errors.refund_rate} placeholder="0.0 - 1.0" min={0} max={1} />
            <NumInput id="client_conc" label="Client Conc." value={form.client_concentration_ratio} onChange={v => setField('client_concentration_ratio', v)} error={errors.client_concentration_ratio} placeholder="0.0 - 1.0" min={0} max={1} />
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="p-6 border-t border-border bg-secondary/10 pointer-events-auto">
        <button
          id="analyze-btn"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3  font-bold text-[1rem] shadow-lg transition-all duration-300 relative overflow-hidden group active:scale-[0.98] cursor-pointer ${isLoading
              ? 'bg-secondary text-text-muted cursor-not-allowed shadow-none'
              : 'bg-accent text-[#0f1117] shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Synthesizing Signals…</span>
            </>
          ) : (
            <>
              <Search size={20} className="group-hover:scale-110 transition-transform" />
              <span>Generate Risk Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export const TransactionForm = React.memo(TransactionFormInner)
