import { create } from 'zustand';

type EntityId = string;

// Định nghĩa state theo từng feature
interface LessonState {
  activeLesson: {
    lessonId: EntityId;
    classId: EntityId;
    unitId: EntityId;
    sectionId: EntityId;
  };
}

// Định nghĩa actions theo feature
interface LessonActions {
  activateLesson: (lessonId: EntityId) => void;
  activateClass: (classId: EntityId) => void;
  activateUnit: (unitId: EntityId) => void;
  activateSection: (sectionId: EntityId) => void;
  // Thêm action để activate tất cả cùng lúc
  activateFullPath: (path: {
    lessonId: EntityId;
    classId: EntityId;
    unitId: EntityId;
    sectionId: EntityId;
  }) => void;
}

type LessonStore = LessonState & LessonActions;

const initialState: LessonState = {
  activeLesson: {
    lessonId: '',
    classId: '',
    unitId: '',
    sectionId: '',
  },
};

export const useLessonStore = create<LessonStore>((set) => ({
  ...initialState,
  
  activateLesson: (lessonId) => 
    set((state) => ({
      activeLesson: { ...state.activeLesson, lessonId }
    })),
    
  activateClass: (classId) =>
    set((state) => ({
      activeLesson: { ...state.activeLesson, classId }
    })),
    
  activateUnit: (unitId) =>
    set((state) => ({
      activeLesson: { ...state.activeLesson, unitId }
    })),
    
  activateSection: (sectionId) =>
    set((state) => ({
      activeLesson: { ...state.activeLesson, sectionId }
    })),
    
  activateFullPath: (path) =>
    set({ activeLesson: path }),
})); 