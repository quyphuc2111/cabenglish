import { LessonAdminType } from "@/types/lesson";
import { NotiAdminType, NotificationType, NotiType } from "@/types/notification";
import { SectionAdminType, SectionContentAdminType, SectionContentType } from "@/types/section";
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
  ;

export interface ModalData {
  onConfirm?: () => void;
  mode?: "defaultMode" | "freeMode";
  notificationList?: NotificationType[];
  lessonIds?: number[] | number;
  formType?: "create" | "update";
  classroomId?: string;
  classroomIds?: string[];
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
  onSuccess?: () => void;
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
