import type { FormData } from '@/types/prediction'

export const INITIAL_FORM: FormData = {
  amount: '',
  cash_flag: false,
  is_round_amount: false,
  duplicate_transaction_flag: false,
  transaction_velocity: '',
  cash_ratio_monthly: '',
  amount_vs_avg_ratio: '',
  sudden_spike_flag: false,
  same_amount_frequency: '',
  bulk_transaction_ratio: '',
  tax_gap: '',
  profit_margin: '',
  discount_frequency: '',
  refund_rate: '',
  client_concentration_ratio: '',
}

export const SAMPLE_FORM: FormData = {
  amount: '950000',
  cash_flag: true,
  is_round_amount: true,
  duplicate_transaction_flag: true,
  transaction_velocity: '47',
  cash_ratio_monthly: '0.89',
  amount_vs_avg_ratio: '8.4',
  sudden_spike_flag: true,
  same_amount_frequency: '0.76',
  bulk_transaction_ratio: '0.82',
  tax_gap: '35000',
  profit_margin: '0.04',
  discount_frequency: '0.87',
  refund_rate: '0.73',
  client_concentration_ratio: '0.95',
}
