import { create } from "zustand";

interface ReceiverInfo {
    id: string;
    fullName: string;
    avatar: string;
}

interface ChatStore {
    isOpen: boolean;
    receiverInfo: ReceiverInfo | null;
    openChat: (info: ReceiverInfo | null) => void;
    closeChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    isOpen: false,
    receiverInfo: null,
    openChat: (info) => {
        set({ isOpen: true, receiverInfo: info });
    },
    closeChat: () =>
        set({ isOpen: false, receiverInfo: null }),
}));
