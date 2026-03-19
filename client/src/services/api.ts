import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ts-auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as (typeof error.config & { __retryCount?: number }) | undefined
    if (!config) return Promise.reject(error)

    const retryCount = config.__retryCount ?? 0
    if (retryCount < 2) {
      config.__retryCount = retryCount + 1
      await new Promise((resolve) => setTimeout(resolve, 350 * config.__retryCount!))
      return api.request(config as any)
    }

    return Promise.reject(error)
  },
)
