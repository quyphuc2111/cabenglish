import { LessonType } from "@/types/lesson";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState: LessonType = {
  classId: 0,
  unitId: 0,
  lessonId: 0,
  schoolWeekId: 0,
  lessonName: "",
  className: "",
  unitName: "",
  imageUrl: "",
  schoolWeekID: 0,
  progress: 0,
  numLiked: 0,
  isLocked: false,
  schoolWeek: 0,
  lessonOrder: 0
};

export const useSelectLessonStore = create<
  LessonType & {
    setSelectedLesson: (lesson: LessonType) => void;
    clearSelectedLesson: () => void;
  }
>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedLesson: (lesson: LessonType) => set(lesson),
      clearSelectedLesson: () => set(initialState)
    }),
    {
      name: "selected-lesson-storage"
    }
  )
);
