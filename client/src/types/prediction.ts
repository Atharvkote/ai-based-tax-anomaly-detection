export interface FormData {
  amount: string
  cash_flag: boolean
  is_round_amount: boolean
  duplicate_transaction_flag: boolean
  transaction_velocity: string
  cash_ratio_monthly: string
  amount_vs_avg_ratio: string
  sudden_spike_flag: boolean
  same_amount_frequency: string
  bulk_transaction_ratio: string
  tax_gap: string
  profit_margin: string
  discount_frequency: string
  refund_rate: string
  client_concentration_ratio: string
}

export interface PredictionResult {
  final_score: number
  ml_score: number
  rule_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  is_suspicious: boolean
}

export interface HistoryEntry extends PredictionResult {
  id: string
  timestamp: string
  amount: number
}

export interface PredictPayload {
  amount: number
  cash_flag: number
  is_weekend: number
  is_round_amount: number
  duplicate_transaction_flag: number
  transaction_velocity: number
  cash_ratio_monthly: number
  amount_vs_avg_ratio: number
  sudden_spike_flag: number
  same_amount_frequency: number
  bulk_transaction_ratio: number
  tax_gap: number
  profit_margin: number
  discount_frequency: number
  refund_rate: number
  client_concentration_ratio: number
}

export type ApiStatus = 'live' | 'demo'
export type PredStatus = 'idle' | 'loading' | 'success' | 'error'
