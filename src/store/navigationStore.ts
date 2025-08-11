import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavigationState {
  // Thông tin về trang trước
  previousPage: {
    url: string;
    title: string;
    state?: {
      activeTab?: string;
      scrollPosition?: number;
      filters?: Record<string, any>;
    };
  } | null;

  // Actions
  setPreviousPage: (page: NavigationState["previousPage"]) => void;
  clearPreviousPage: () => void;

  // Lesson teaching specific state
  lessonTeachingState: {
    activeTab: string;
    scrollPosition: number;
    lastVisited: number;
  };

  setLessonTeachingState: (
    state: Partial<NavigationState["lessonTeachingState"]>
  ) => void;

  // Lesson complete specific state (filters + scroll)
  lessonCompleteState: {
    selectedClassId: string;
    selectedUnitId: string;
    selectedWeekId: string;
    scrollPosition: number;
    lastVisited: number;
  };

  setLessonCompleteState: (
    state: Partial<NavigationState["lessonCompleteState"]>
  ) => void;

  // Overview page specific state (scroll position)
  overviewState: {
    scrollPosition: number;
    lastVisited: number;
  };

  setOverviewState: (
    state: Partial<NavigationState["overviewState"]>
  ) => void;

  // Lecture favourite list specific state (filters + scroll)
  lectureFavouriteState: {
    selectedClassId: string;
    selectedUnitId: string;
    selectedWeekId: string;
    scrollPosition: number;
    lastVisited: number;
  };

  setLectureFavouriteState: (
    state: Partial<NavigationState["lectureFavouriteState"]>
  ) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      previousPage: null,
      lessonTeachingState: {
        activeTab: "all",
        scrollPosition: 0,
        lastVisited: Date.now()
      },
      lessonCompleteState: {
        selectedClassId: "",
        selectedUnitId: "",
        selectedWeekId: "",
        scrollPosition: 0,
        lastVisited: Date.now()
      },
      overviewState: {
        scrollPosition: 0,
        lastVisited: Date.now()
      },
      lectureFavouriteState: {
        selectedClassId: "",
        selectedUnitId: "",
        selectedWeekId: "",
        scrollPosition: 0,
        lastVisited: Date.now()
      },

      setPreviousPage: (page) => {
        set({ previousPage: page });
      },

      clearPreviousPage: () => {
        set({ previousPage: null });
      },

      setLessonTeachingState: (newState) => {
        set((state) => ({
          lessonTeachingState: {
            ...state.lessonTeachingState,
            ...newState,
            lastVisited: Date.now()
          }
        }));
      },

      setLessonCompleteState: (newState) => {
        set((state) => ({
          lessonCompleteState: {
            ...state.lessonCompleteState,
            ...newState,
            lastVisited: Date.now()
          }
        }));
      },

      setOverviewState: (newState) => {
        set((state) => ({
          overviewState: {
            ...state.overviewState,
            ...newState,
            lastVisited: Date.now()
          }
        }));
      },

      setLectureFavouriteState: (newState) => {
        set((state) => ({
          lectureFavouriteState: {
            ...state.lectureFavouriteState,
            ...newState,
            lastVisited: Date.now()
          }
        }));
      }
    }),
    {
      name: "navigation-store",
      // Chỉ persist những thông tin cần thiết
      partialize: (state) => ({
        previousPage: state.previousPage,
        lessonTeachingState: state.lessonTeachingState,
        lessonCompleteState: state.lessonCompleteState,
        overviewState: state.overviewState,
        lectureFavouriteState: state.lectureFavouriteState
      })
    }
  )
);
