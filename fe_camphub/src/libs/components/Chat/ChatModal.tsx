"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChatMessage, ChatRoom } from "@/libs/core/types";
import { mockChatRooms, mockChatMessages } from "@/libs/utils";

interface ChatModalProps {
    initialReceiverId?: string;
    onClose?: () => void; // optional — chỉ dùng nếu muốn đóng từ trong modal
}

export default function ChatModal({ initialReceiverId, onClose }: ChatModalProps) {
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [search, setSearch] = useState("");
    const [filterUnread, setFilterUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const currentUserId = "user1";
    const [input, setInput] = useState("");

    // Cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Khi ChatModal mở với receiverId (VD: click "Chat ngay")
    useEffect(() => {
        if (initialReceiverId) {
            const existingRoom = mockChatRooms.find((r) =>
                r.participantIds.includes(initialReceiverId)
            );
            if (existingRoom) {
                setSelectedRoom(existingRoom);
                const msgs = mockChatMessages.filter(
                    (m) => m.chatCode === existingRoom.chatCode
                );
                setMessages(msgs);
            } else {
                // Tạo room mới tạm thời
                const newRoom: ChatRoom = {
                    id: crypto.randomUUID(),
                    chatCode: crypto.randomUUID(),
                    participantIds: [initialReceiverId, currentUserId],
                    lastMessage: "",
                    lastTimestamp: new Date().toISOString(),
                    unreadMessageCounts: { user1: 0, [initialReceiverId]: 0 },
                };
                setSelectedRoom(newRoom);
                setMessages([]); // chưa có tin nhắn nào
            }
        }
    }, [initialReceiverId]);

    const handleSelectRoom = (room: ChatRoom) => {
        setSelectedRoom(room);
        const msgs = mockChatMessages.filter((m) => m.chatCode === room.chatCode);
        setMessages(msgs);
    };

    const handleSend = () => {
        if (!input.trim() || !selectedRoom) return;
        const newMsg: ChatMessage = {
            id: crypto.randomUUID(),
            chatCode: selectedRoom.chatCode,
            senderId: currentUserId,
            receiverId: selectedRoom.participantIds.find((id) => id !== currentUserId)!,
            content: input,
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
    };

    const filteredRooms = mockChatRooms.filter((room) => {
        const otherId = room.participantIds.find((id) => id !== currentUserId)!;
        const matchSearch = otherId.includes(search);
        const matchUnread = filterUnread
            ? room.unreadMessageCounts[currentUserId] > 0
            : true;
        return matchSearch && matchUnread;
    });

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <div className="w-[600px] h-[80vh] bg-white flex flex-col shadow-2xl rounded-t-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white rounded-t-lg">
                    <h3 className="font-semibold">Tin nhắn</h3>
                    {onClose && (
                        <button
                            className="hover:bg-blue-700 px-2 py-1 rounded"
                            onClick={onClose}
                        >
                            X
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/3 border-r overflow-y-auto bg-gray-50 flex flex-col">
                        {/* Search + Filter */}
                        <div className="p-3 border-b flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    className={`flex-1 py-1 text-sm rounded ${!filterUnread
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200"
                                        }`}
                                    onClick={() => setFilterUnread(false)}
                                >
                                    Tất cả
                                </button>
                                <button
                                    className={`flex-1 py-1 text-sm rounded ${filterUnread
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200"
                                        }`}
                                    onClick={() => setFilterUnread(true)}
                                >
                                    Chưa đọc
                                </button>
                            </div>
                        </div>

                        {/* Chat Rooms */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredRooms.map((room) => {
                                const otherId = room.participantIds.find(
                                    (id) => id !== currentUserId
                                )!;
                                return (
                                    <div
                                        key={room.id}
                                        className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${selectedRoom?.id === room.id
                                                ? "bg-gray-200"
                                                : ""
                                            }`}
                                        onClick={() => handleSelectRoom(room)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10">
                                                <Image
                                                    src="/default-avatar.png"
                                                    alt={`User ${otherId}`}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                                {room.unreadMessageCounts[currentUserId] > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                        {room.unreadMessageCounts[currentUserId]}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    User {otherId}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {room.lastMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                            {messages.map((msg) => {
                                const isMine = msg.senderId === currentUserId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMine
                                                ? "justify-end"
                                                : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-3 py-2 rounded-lg ${isMine
                                                    ? "bg-blue-100 text-gray-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {msg.content}
                                            <div className="text-xs text-gray-400 text-right mt-1">
                                                {new Date(
                                                    msg.timestamp
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        {selectedRoom && (
                            <div className="flex border-t p-2 gap-2 bg-white">
                                <input
                                    type="text"
                                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                    placeholder="Nhập tin nhắn..."
                                    value={input}
                                    onChange={(e) =>
                                        setInput(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSend()
                                    }
                                />
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                    onClick={handleSend}
                                >
                                    Gửi
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
