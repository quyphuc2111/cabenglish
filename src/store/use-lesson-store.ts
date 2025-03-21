import { create } from 'zustand';

interface LessonStore {
  selectedLessonId: string;
  setSelectedLessonId: (id: string) => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
  selectedLessonId: '',
  setSelectedLessonId: (id) => set({ selectedLessonId: id }),
})); 