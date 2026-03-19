import type { FormData, PredictPayload } from '@/types/prediction'

export const toNumberFlag = (value: boolean): number => (value ? 1 : 0)

export function buildPredictPayload(form: FormData): PredictPayload {
  return {
    amount: Number(form.amount),
    cash_flag: toNumberFlag(form.cash_flag),
    is_weekend: toNumberFlag(new Date().getDay() === 0 || new Date().getDay() === 6),
    is_round_amount: toNumberFlag(form.is_round_amount),
    duplicate_transaction_flag: toNumberFlag(form.duplicate_transaction_flag),
    transaction_velocity: Number(form.transaction_velocity),
    cash_ratio_monthly: Number(form.cash_ratio_monthly),
    amount_vs_avg_ratio: Number(form.amount_vs_avg_ratio),
    sudden_spike_flag: toNumberFlag(form.sudden_spike_flag),
    same_amount_frequency: Number(form.same_amount_frequency),
    bulk_transaction_ratio: Number(form.bulk_transaction_ratio),
    tax_gap: Number(form.tax_gap),
    profit_margin: Number(form.profit_margin),
    discount_frequency: Number(form.discount_frequency),
    refund_rate: Number(form.refund_rate),
    client_concentration_ratio: Number(form.client_concentration_ratio),
  }
}

export function formatTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
