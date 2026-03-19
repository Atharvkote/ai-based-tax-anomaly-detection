import { useCallback, useState } from 'react'
import { mlService } from '@/services/ml.service'
import { formatTimestamp } from '@/utils/prediction'
import { useAppStore } from '@/store/app.store'
import type { PredStatus, PredictPayload } from '@/types/prediction'

export function usePrediction() {
  const [status, setStatus] = useState<PredStatus>('idle')
  const result = useAppStore((s) => s.dashboard.result)
  const apiStatus = useAppStore((s) => s.dashboard.apiStatus)
  const setApiStatus = useAppStore((s) => s.dashboard.setApiStatus)
  const setResult = useAppStore((s) => s.dashboard.setResult)
  const addHistoryEntry = useAppStore((s) => s.dashboard.addHistoryEntry)

  const predict = useCallback(async (payload: PredictPayload) => {
    setStatus('loading')
    try {
      const data = await mlService.predict(payload)
      setResult(data)
      setApiStatus('live')
      addHistoryEntry({
        ...data,
        id: `${Date.now()}`,
        amount: payload.amount,
        timestamp: formatTimestamp(),
      })
      setStatus('success')
    } catch {
      setApiStatus('demo')
      setStatus('error')
    }
  }, [addHistoryEntry, setApiStatus, setResult])

  return { status, result, apiStatus, predict }
}
