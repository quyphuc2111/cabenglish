import { create } from 'zustand';

export type ModalType = "userInfo" | "teachingMode" | "coinHistory";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: any;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: null,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));