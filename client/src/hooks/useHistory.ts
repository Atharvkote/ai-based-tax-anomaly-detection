import { useAppStore } from '@/store/app.store'

export function useHistory() {
  const history = useAppStore((s) => s.dashboard.history)
  const clearHistory = useAppStore((s) => s.dashboard.clearHistory)
  return { history, clearHistory }
}
