import type { PredictionResult } from '@/types/prediction'

export interface DashboardStats {
  total: number
  highRisk: number
  suspicious: number
}

export function computeDashboardStats(history: PredictionResult[]): DashboardStats {
  return {
    total: history.length,
    highRisk: history.filter((h) => h.risk_level === 'HIGH').length,
    suspicious: history.filter((h) => h.is_suspicious).length,
  }
}
