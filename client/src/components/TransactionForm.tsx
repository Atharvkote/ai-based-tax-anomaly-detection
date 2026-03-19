import React, { useCallback } from 'react'
import type { FormData } from '@/types/prediction'
import { Toggle, NumInput } from '@/components/PredictionAtoms'

interface Props {
  form: FormData
  errors: Partial<Record<keyof FormData, string>>
  setField: (k: keyof FormData, v: string | boolean) => void
  loadSample: () => void
  resetForm: () => void
  onSubmit: () => void
  isLoading: boolean
}

const S = {
  card: {
    background: 'var(--bg-surface)', borderRadius: '1.25rem',
    border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' as const,
    height: '100%', boxShadow: 'var(--shadow-md)',
  },
  header: {
    padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  groupLabel: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  toggleBox: {
    background: 'var(--bg-elevated)', borderRadius: '0.875rem',
    padding: '1rem', display: 'flex', flexDirection: 'column' as const,
    gap: 14, border: '1px solid var(--border-subtle)',
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
}

function GroupHeading({ color, label }: { color: string; label: string }) {
  return (
    <div style={S.groupLabel}>
      <div style={{ width: 3, height: 20, borderRadius: 9999, background: color, flexShrink: 0 }} />
      <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)' }}>
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
    <div style={S.card}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            Transaction Input
          </h2>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 2 }}>15 parameters · 3 signal groups</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button id="load-sample-btn" type="button" onClick={loadSample}
            style={{
              fontSize: '0.75rem', fontWeight: 700, padding: '6px 12px', borderRadius: 10, cursor: 'pointer',
              background: 'var(--accent-light)', color: 'var(--accent-dark)', border: '1px solid transparent',
              transition: 'all 0.2s'
            }}>
            ⚡ Sample
          </button>
          <button id="reset-btn" type="button" onClick={resetForm}
            style={{
              fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: 10, cursor: 'pointer',
              background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)',
              transition: 'all 0.2s'
            }}>
            Reset
          </button>
        </div>
      </div>

      {/* Scrollable fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Group 1 */}
        <div>
          <GroupHeading color="var(--accent)" label="Group 1 — Transaction Basics" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <NumInput id="amount" label="Amount" value={form.amount} onChange={v => setField('amount', v)}
              error={errors.amount} placeholder="e.g. 250000" min={0} prefix="₹" hint="Transaction amount in local currency" />
            <div style={S.toggleBox}>
              <Toggle id="cash_flag" checked={form.cash_flag} onChange={v => setField('cash_flag', v)} label="Cash Transaction Flag" />
              <Toggle id="is_round_amount" checked={form.is_round_amount} onChange={v => setField('is_round_amount', v)} label="Is Round Amount" />
              <Toggle id="duplicate_flag" checked={form.duplicate_transaction_flag} onChange={v => setField('duplicate_transaction_flag', v)} label="Duplicate Transaction Flag" />
            </div>
          </div>
        </div>

        {/* Group 2 */}
        <div>
          <GroupHeading color="var(--warning)" label="Group 2 — Behavioral Signals" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={S.twoCol}>
              <NumInput id="tx_velocity" label="Transaction Velocity" value={form.transaction_velocity} onChange={v => setField('transaction_velocity', v)} error={errors.transaction_velocity} placeholder="e.g. 12" min={0} />
              <NumInput id="avg_ratio" label="Amount vs Avg Ratio" value={form.amount_vs_avg_ratio} onChange={v => setField('amount_vs_avg_ratio', v)} error={errors.amount_vs_avg_ratio} placeholder="e.g. 2.4" min={0} />
              <NumInput id="cash_ratio" label="Cash Ratio Monthly" value={form.cash_ratio_monthly} onChange={v => setField('cash_ratio_monthly', v)} error={errors.cash_ratio_monthly} placeholder="0.0 – 1.0" min={0} max={1} />
              <NumInput id="same_amt" label="Same Amount Freq." value={form.same_amount_frequency} onChange={v => setField('same_amount_frequency', v)} error={errors.same_amount_frequency} placeholder="0.0 – 1.0" min={0} max={1} />
              <NumInput id="bulk_ratio" label="Bulk Transaction Ratio" value={form.bulk_transaction_ratio} onChange={v => setField('bulk_transaction_ratio', v)} error={errors.bulk_transaction_ratio} placeholder="0.0 – 1.0" min={0} max={1} />
            </div>
            <div style={S.toggleBox}>
              <Toggle id="spike_flag" checked={form.sudden_spike_flag} onChange={v => setField('sudden_spike_flag', v)} label="Sudden Spike Flag" />
            </div>
          </div>
        </div>

        {/* Group 3 */}
        <div>
          <GroupHeading color="var(--danger)" label="Group 3 — Financial Health" />
          <div style={S.twoCol}>
            <NumInput id="tax_gap" label="Tax Gap" value={form.tax_gap} onChange={v => setField('tax_gap', v)} error={errors.tax_gap} placeholder="0.0 – 1.0" min={0} max={1} />
            <NumInput id="profit_margin" label="Profit Margin" value={form.profit_margin} onChange={v => setField('profit_margin', v)} error={errors.profit_margin} placeholder="0.0 – 1.0" min={0} max={1} />
            <NumInput id="discount_freq" label="Discount Frequency" value={form.discount_frequency} onChange={v => setField('discount_frequency', v)} error={errors.discount_frequency} placeholder="0.0 – 1.0" min={0} max={1} />
            <NumInput id="refund_rate" label="Refund Rate" value={form.refund_rate} onChange={v => setField('refund_rate', v)} error={errors.refund_rate} placeholder="0.0 – 1.0" min={0} max={1} />
            <NumInput id="client_conc" label="Client Concentration" value={form.client_concentration_ratio} onChange={v => setField('client_concentration_ratio', v)} error={errors.client_concentration_ratio} placeholder="0.0 – 1.0" min={0} max={1} />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button id="analyze-btn" type="button" onClick={handleSubmit} disabled={isLoading}
          style={{
            width: '100%', padding: '14px', borderRadius: '1rem', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
            background: isLoading ? 'var(--bg-elevated)' : 'var(--accent)',
            color: isLoading ? 'var(--text-muted)' : '#0f1117',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
            transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: isLoading ? 'none' : 'var(--shadow-accent)',
            transform: 'scale(1)',
          }}
          onMouseEnter={e => { if (!isLoading) { (e.currentTarget).style.transform = 'scale(1.02)'; (e.currentTarget).style.boxShadow = '0 12px 40px rgba(234,179,8,0.4)' } }}
          onMouseLeave={e => { (e.currentTarget).style.transform = 'scale(1)'; (e.currentTarget).style.boxShadow = isLoading ? 'none' : 'var(--shadow-accent)' }}
          onMouseDown={e => { if (!isLoading) (e.currentTarget).style.transform = 'scale(0.98)' }}
          onMouseUp={e => { if (!isLoading) (e.currentTarget).style.transform = 'scale(1.02)' }}>
          {isLoading ? '⏳  Analyzing Transaction Patterns…' : '🔍  Analyze Transaction'}
        </button>
      </div>
    </div>
  )
}

export const TransactionForm = React.memo(TransactionFormInner)
