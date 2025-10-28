import { LessonAdminType } from "@/types/lesson";
import {
  NotiAdminType,
  NotificationType,
  NotiType
} from "@/types/notification";
import {
  SectionAdminType,
  SectionContentAdminType,
  SectionContentType
} from "@/types/section";
import { create } from "zustand";

export type ModalType =
  | "userInfo"
  | "teachingMode"
  | "coinHistory"
  | "changeTheme"
  | "resetUnit"
  | "resetSchoolYear"
  | "changeTeachingModeModal"
  | "completeLesson"
  | "nextSection"
  | "nextLesson"
  | "completeLessonFinal"
  | "notification"
  | "createUpdateClassroom"
  | "deleteClassroom"
  | "importClassroom"
  | "exportClassroom"
  | "createUpdateSchoolWeek"
  | "deleteSchoolWeek"
  | "importSchoolWeek"
  | "exportSchoolWeek"
  | "createUpdateNotiType"
  | "deleteNotiType"
  | "createUpdateUnits"
  | "createUpdateLessons"
  | "deleteLessons"
  | "createUpdateSection"
  | "deleteSection"
  | "createUpdateSectionContent"
  | "deleteSectionContent"
  | "expertDetail"
  | "exportNotiType"
  | "importNotiType"
  | "importNoti"
  | "exportNoti"
  | "deleteLesson"
  | "exportSection"
  | "createUpdateNoti"
  | "importSection"
  | "importSectionContent"
  | "exportSectionContent"
  | "deleteNoti"
  | "deleteUnit"
  | "deleteUnits"
  | "importUnits"
  | "exportUnits"
  | "exportLessons"
  | "importLessons"
  | "logout"
  | "errorDetails"
  | "exportNotiType"
  | "createUpdateGameTopic"
  | "deleteGameTopic"
  | "exportGameTopics"
  | "importGameTopics"
  | "createUpdateGameAge"
  | "deleteGameAge"
  | "exportGameAges"
  | "importGameAges"
  | "viewGame"
  | "createUpdateGame"
  | "deleteGame"
  | "exportGames"
  | "importGames";

export interface ModalData {
  onConfirm?: () => void;
  onCancel?: () => void;
  onDataRefetch?: () => Promise<void>;
  mode?: "defaultMode" | "freeMode";
  notificationList?: NotificationType[];
  lessonIds?: number[] | number;
  nextLessonId?: number;
  isLastLesson?: boolean;
  formType?: "create" | "update";
  classroomId?: string;
  classroomIds?: string[];
  classroomNames?: string[];
  schoolWeekIds?: string[];
  notiTypeIds?: string[];
  notiTypes?: NotiType[];
  notiIds?: string[];
  sectionIds?: number | string[];
  sections?: SectionAdminType[];
  unitIds?: string[];
  units?: any;
  sectionContentIds?: string[];
  sectionContents?: SectionContentType[];
  notis?: NotiAdminType[];
  lessons?: LessonAdminType[];
  schoolWeeks?: {
    value: number;
    swId: number;
  }[];
  classroom?: {
    id: string;
    classname: string;
    imageurl: string;
    description: string;
    class_id: string;
  };
  schoolWeek?: {
    id: number;
    value: number;
    swId: number;
  };
  // Export modal data
  selectedGames?: any[];
  filterParams?: any;
  hasFilters?: boolean;
  notiType?: {
    id: number;
    value: string;
    ntId: number;
  };
  unit?: {
    unitId: number;
    unitName: string;
    order: number;
    progress: number;
  };
  unitData?: {
    unitId: number;
    unitName: string;
    order: number;
    progress: number;
  };
  unitId?: number;
  lessonId?: number;
  expert?: {
    id: number;
    name: string;
    image: string;
    title: string;
    specialty: string;
    experience: string;
    location: string;
    description: {
      icon: string;
      title: string;
    }[];
  };
  onSuccess?: () => void;
  error?: Error | null;
  errorTitle?: string;
  selectedClassId?: number | string;
  gameTopic?: {
    topic_id: number;
    topic_name: string;
    topic_name_vi: string;
    icon_url?: string;
    description?: string;
    order: number;
    is_active: boolean;
  };
  topicId?: number;
  gameAge?: {
    age_id: number;
    age_name: string;
    age_name_en: string;
    description?: string;
    min_age: number;
    max_age: number;
    order: number;
  };
  ageId?: number;
  game?: {
    game_id: number;
    game_name: string;
    game_name_vi: string;
    description?: string;
    description_vi?: string;
    image_url?: string;
    url_game: string;
    num_liked: number;
    order: number;
    difficulty_level: "easy" | "medium" | "hard";
    estimated_duration: number;
    is_active: boolean;
    topics: Array<{
      topic_id: number;
      topic_name: string;
      topic_name_vi: string;
      icon_url?: string;
    }>;
    ages: Array<{
      age_id: number;
      age_name: string;
      age_name_en: string;
    }>;
  };
  topicsData?: Array<{
    topic_id: number;
    topic_name: string;
    topic_name_vi: string;
    icon_url?: string;
  }>;
  agesData?: Array<{
    age_id: number;
    age_name: string;
    age_name_en: string;
  }>;
  loadingRows?: Set<number>;
  setLoadingRows?: (rows: Set<number> | ((prev: Set<number>) => Set<number>)) => void;
}

export interface ModalStore {
  type: ModalType | null;
  data: ModalData | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: null })
}));
