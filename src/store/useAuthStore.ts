import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserInfo {
  id: number
  username: string
  nickname: string
  role: string
  status: string
  avatarUrl?: string
}

interface AuthState {
  token: string | null
  user: UserInfo | null
  login: (token: string, user: UserInfo) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => {
        set({ token: null, user: null })
        localStorage.removeItem('accessToken')
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)