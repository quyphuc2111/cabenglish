import { create } from "zustand";

export type ModalType =
  | "userInfo"
  | "teachingMode"
  | "coinHistory"
  | "changeTheme"
  | "resetUnit"
  | "resetSchoolYear"
  | "changeTeachingModeModal"
  | "completeLesson";

export interface ModalData {
  onConfirm?: () => void;
  mode?: "defaultMode" | "freeMode";
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
