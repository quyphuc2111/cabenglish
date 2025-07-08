// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// type ModeStore = {
//   currentTeachingMode: string
//   setTeachingMode: (mode: string) => void
// }

// export const useTeachingModeStore = create<ModeStore>()(
//   persist(
//     (set) => ({
//       currentTeachingMode: 'defaultMode',
//       setTeachingMode: (mode) => set({ currentTeachingMode: mode }),
//     }),
//     {
//       name: 'mode-storage',
//     }
//   )
// ) 