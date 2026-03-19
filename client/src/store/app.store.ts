import { create } from 'zustand'
import type { ApiStatus, HistoryEntry, PredictionResult } from '@/types/prediction'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  setToken: (token: string | null) => void
}

interface UserState {
  id: string
  name: string
  email: string
}

interface DashboardState {
  apiStatus: ApiStatus
  result: PredictionResult | null
  history: HistoryEntry[]
  setApiStatus: (status: ApiStatus) => void
  setResult: (result: PredictionResult | null) => void
  addHistoryEntry: (entry: HistoryEntry) => void
  clearHistory: () => void
}

interface AppStore {
  auth: AuthState
  user: UserState | null
  dashboard: DashboardState
  setUser: (user: UserState | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  auth: {
    isAuthenticated: false,
    token: null,
    setToken: (token) =>
      set((state) => ({
        auth: { ...state.auth, isAuthenticated: Boolean(token), token },
      })),
  },
  user: null,
  dashboard: {
    apiStatus: 'demo',
    result: null,
    history: [],
    setApiStatus: (apiStatus) =>
      set((state) => ({ dashboard: { ...state.dashboard, apiStatus } })),
    setResult: (result) =>
      set((state) => ({ dashboard: { ...state.dashboard, result } })),
    addHistoryEntry: (entry) =>
      set((state) => ({
        dashboard: {
          ...state.dashboard,
          history: [entry, ...state.dashboard.history].slice(0, 10),
        },
      })),
    clearHistory: () =>
      set((state) => ({
        dashboard: {
          ...state.dashboard,
          history: [],
        },
      })),
  },
  setUser: (user) => set(() => ({ user })),
}))
