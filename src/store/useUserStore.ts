import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  user_id: string
  email: string
  language: string
  theme: string 
  mode: string
  is_firstlogin: boolean
  progress?: {
    units: {
      unit_id: number
    }[]
    lessons: {
      lesson_id: number
    }[]
    sections: {
      section_id: number
    }[]
    classrooms: {
      class_id: number
    }[]
  }
  locked?: {
    sections: number[]
    section_contents: number[]
    lessons: number[]
  }
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface UserActions {
  setUser: (user: User | null) => void
  updateUser: (userData: Partial<User>) => void
  updateProgress: (progressData: Partial<User['progress']>) => void
  updateLocked: (lockedData: Partial<User['locked']>) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // State mặc định
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => 
        set(() => ({
          user,
          isAuthenticated: !!user,
          error: null
        })),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),

      updateProgress: (progressData) =>
        set((state) => ({
          user: state.user ? {
            ...state.user,
            progress: {
              units: [],
              lessons: [],
              sections: [],
              classrooms: [],
              ...state.user.progress,
              ...progressData
            }
          } : null
        })),

      updateLocked: (lockedData) =>
        set((state) => ({
          user: state.user ? {
            ...state.user,
            locked: {
              sections: [],
              section_contents: [],
              lessons: [],
              ...state.user.locked,
              ...lockedData  
            }
          } : null
        })),

      logout: () =>
        set(() => ({
          user: null,
          isAuthenticated: false,
          error: null
        })),

      setLoading: (loading) =>
        set(() => ({
          isLoading: loading
        })),

      setError: (error) =>
        set(() => ({
          error
        }))
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Selector helpers
export const useUser = () => useUserStore((state) => state.user)
export const useUserId = () => useUserStore((state) => state.user?.user_id)
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated)
export const useIsLoading = () => useUserStore((state) => state.isLoading)
export const useUserError = () => useUserStore((state) => state.error)
export const useUserTheme = () => useUserStore((state) => state.user?.theme)
export const useUserMode = () => useUserStore((state) => state.user?.mode)
