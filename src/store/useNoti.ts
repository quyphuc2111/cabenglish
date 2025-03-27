import { create } from 'zustand';

interface Notification {
  notificationId: number;
  title: string;
  description: string;
  contentHtml: string;
  ntId: number;
  createdAt: string;
  lastSentTime: string;
}

// Định nghĩa state cho notification
interface NotiState {
  selectedNoti: Notification | null;
  selectedNotiType: string | null;
}

// Định nghĩa actions cho notification
interface NotiActions {
  setSelectedNoti: (noti: Notification | null) => void;
  setSelectedNotiType: (ntId: string | null) => void;
  resetNotiState: () => void;
}

type NotiStore = NotiState & NotiActions;

const initialState: NotiState = {
  selectedNoti: null,
  selectedNotiType: null
};

export const useNotiStore = create<NotiStore>((set) => ({
  ...initialState,
  
  setSelectedNoti: (noti) => 
    set(() => ({
      selectedNoti: noti
    })),
    
  setSelectedNotiType: (ntId) =>
    set(() => ({
      selectedNotiType: ntId
    })),
    
  resetNotiState: () =>
    set(initialState)
})); 