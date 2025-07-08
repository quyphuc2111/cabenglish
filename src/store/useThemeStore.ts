// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// type ThemeStore = {
//   currentTheme: string
//   setTheme: (theme: string) => void
// }

// export const useThemeStore = create<ThemeStore>()(
//   persist(
//     (set) => ({
//       currentTheme: 'theme-gold',
//       setTheme: (theme) => set({ currentTheme: theme }),
//     }),
//     {
//       name: 'theme-storage',
//     }
//   )
// ) 