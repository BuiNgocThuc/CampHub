"use client";

import React from "react";
import ChatModal from "./ChatModal";
import { useChatStore } from "@/libs/stores";

export default function GlobalChatButton() {
    const { isOpen, openChat, closeChat } = useChatStore();

    const handleClick = () => {
        if (isOpen) closeChat();
        else openChat(null);
    };

    return (
        <>
            {/* Floating button luôn hiển thị */}
            <button
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center z-50"
                onClick={handleClick}
            >
                💬
            </button>

            {isOpen && <ChatModal onClose={closeChat} />}
        </>
    );
}
