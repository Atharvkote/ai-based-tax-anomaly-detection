import { api } from '@/services/api'
import type { PredictPayload, PredictionResult } from '@/types/prediction'

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export const mlService = {
  async predict(payload: PredictPayload): Promise<PredictionResult> {
    const response = await api.post<PredictionResult | ApiResponse<PredictionResult>>('/api/ml/predict', payload)
    const body = response.data
    if ('success' in body) {
      if (!body.success) throw new Error(body.message || 'Prediction failed')
      return body.data
    }
    return body
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health', { timeout: 4000 })
      return response.status === 200
    } catch {
      return false
    }
  },
}
