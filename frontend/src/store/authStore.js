import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist((set) => ({
  token: null,
  user: null,
  setAuth: ({ access_token, user }) => set({ token: access_token, user }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null })
}), { name: 'contentos-auth' }))
