import { api } from '@/services/api'

export interface UserProfile {
  id: string
  name: string
  email: string
}

export const userService = {
  async getCurrentUser(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/api/users/me')
    return response.data
  },
}
