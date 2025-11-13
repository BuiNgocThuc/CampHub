// src/libs/stores/useChatStore.ts
import { create } from "zustand";

interface ChatStore {
    isOpen: boolean;
    receiverId: string | null;
    openChat: (receiverId: string) => void;
    closeChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    isOpen: false,
    receiverId: null,
    openChat: (receiverId) => {
        console.log(receiverId);
        set({ isOpen: true, receiverId }); // mở chat và lưu id người nhận
    },
    closeChat: () =>
        set({ isOpen: false, receiverId: null }), // đóng chat
}));
