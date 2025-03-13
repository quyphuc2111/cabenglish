import { NotificationType } from "@/types/notification";
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
  | "createUpdateSchoolWeek"
  | "deleteSchoolWeek"
  | "createUpdateNotiType"
  | "deleteNotiType";

export interface ModalData {
  onConfirm?: () => void;
  mode?: "defaultMode" | "freeMode";
  notificationList?: NotificationType[];
  lessonIds?: number[];
  formType?: "create" | "update";
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
