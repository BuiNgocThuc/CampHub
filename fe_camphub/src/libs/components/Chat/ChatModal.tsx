"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChatRoom } from "@/libs/core/types";
import { useChatSocket } from "@/libs/hooks";
import { useAuthStore } from "@/libs/stores";
import { getChatRooms } from "@/libs/api";

interface ChatModalProps {
    initialReceiverId?: string;
    initialReceiverUsername?: string;
    onClose?: () => void;
}

export default function ChatModal({ initialReceiverId, initialReceiverUsername, onClose }: ChatModalProps) {
    const user = useAuthStore((state) => state.user);
    const currentUserId = user?.id ?? "user1";
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [search, setSearch] = useState("");
    const [filterUnread, setFilterUnread] = useState(false);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { messages, sendMessage, subscribeToChatRoom, lastMessages } = useChatSocket();

    // Load chat rooms khi mở modal
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getChatRooms(currentUserId);
                if (res.result) {
                    setChatRooms(res.result);
                    // Nếu có initialReceiverId, auto select room
                    if (initialReceiverId) {
                        const room = res.result.find(r =>
                            r.participantIds.includes(initialReceiverId)
                        );
                        if (room) {
                            handleSelectRoom(room);
                        } else {
                            // tạo room tạm thời
                            const tempRoom: ChatRoom = {
                            id: "temp-" + initialReceiverId,
                            chatCode: "", // room giả => không có chatCode
                            participantIds: [currentUserId, initialReceiverId],
                            receiverUsername: initialReceiverUsername ?? "Người dùng",
                            avatarUrl: undefined,

                            lastMessage: "",
                            lastTimestamp: new Date().toISOString(),
                            unreadMessageCounts: {
                                [currentUserId]: 0,
                                [initialReceiverId]: 0,
                            },
                        };

                        setSelectedRoom(tempRoom);
                        }
                    } else {
                        setSelectedRoom(null);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch chat rooms", err);
            }
        };

        fetchRooms();
    }, [currentUserId, initialReceiverId]);

    // Cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // update sidebar last message
    useEffect(() => {
        if (!lastMessages) return;

        setChatRooms((prevRooms) => {
            const updatedRooms = [...prevRooms];

            Object.entries(lastMessages).forEach(([chatCode, msg]) => {
                const index = updatedRooms.findIndex((room) => room.chatCode === chatCode);
                if (index === -1) return;

                const oldRoom = updatedRooms[index];

                const isSender = msg.senderId === currentUserId;

                const newRoom: ChatRoom = {
                    ...oldRoom,
                    lastMessage: msg.content,
                    lastTimestamp: msg.timestamp,
                    unreadMessageCounts: {
                        ...oldRoom.unreadMessageCounts,
                        [currentUserId]:
                            !isSender && selectedRoom?.chatCode !== chatCode
                                ? (oldRoom.unreadMessageCounts[currentUserId] || 0) + 1
                                : oldRoom.unreadMessageCounts[currentUserId]
                    }
                };

                // Đưa phòng lên đầu danh sách
                updatedRooms.splice(index, 1);
                updatedRooms.unshift(newRoom);

            });

            return updatedRooms;
        });
    }, [lastMessages, currentUserId, selectedRoom]);

    const handleSelectRoom = (room: ChatRoom) => {
        // reset unread count
        setChatRooms(prev =>
            prev.map(r =>
                r.chatCode === room.chatCode
                    ? {
                        ...r,
                        unreadMessageCounts: {
                            ...r.unreadMessageCounts,
                            [currentUserId]: 0
                        }
                    }
                    : r
            )
        );
        const freshRoom = chatRooms.find(r => r.chatCode === room.chatCode) ?? room;
        setSelectedRoom(freshRoom);
        subscribeToChatRoom(room.chatCode);
    };

    const handleSend = () => {
        if (!input.trim() || !selectedRoom) return;
        const receiverId = selectedRoom.participantIds.find(id => id !== currentUserId)!;
        sendMessage({
            senderId: currentUserId,
            receiverId,
            content: input,
        });
        setInput("");
    };

    const filteredRooms = chatRooms.filter((room) => {
        const otherId = room.participantIds.find(id => id !== currentUserId)!;
        const matchSearch = otherId.includes(search);
        const matchUnread = filterUnread ? room.unreadMessageCounts[currentUserId] > 0 : true;
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
                                const otherId = room.participantIds.find(id => id !== currentUserId)!;
                                return (
                                    <div
                                        key={room.id}
                                        className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${selectedRoom?.id === room.id ? "bg-gray-200" : ""}`}
                                        onClick={() => handleSelectRoom(room)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10">
                                                <Image
                                                    src={room.avatarUrl || '/default-avatar.png'}
                                                    alt={room.receiverUsername}
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
                                                    {room.receiverUsername}
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
                        {selectedRoom && (
                            <div className="flex items-center px-4 py-3 border-b bg-white shadow-sm">
                                <h2 className="text-base font-semibold text-gray-700">
                                    {selectedRoom.receiverUsername}
                                </h2>
                            </div>
                        )}

                        {/* Welcome Screen */}
                        {!selectedRoom && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gray-50">
                                <Image
                                    src="/welcome-chat.png"
                                    alt="Welcome"
                                    width={120}
                                    height={120}
                                    className="opacity-80 mb-4"
                                />
                                <h2 className="text-xl font-semibold text-gray-700">
                                    Chào mừng bạn đến với CampHub Chat
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Hãy chọn một cuộc trò chuyện hoặc bắt đầu mới với chủ thuê!
                                </p>
                            </div>
                        )}
                        {selectedRoom && (
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                                {messages
                                    .filter((msg) => selectedRoom ? msg.chatCode === selectedRoom.chatCode : true)
                                    .map((msg) => {
                                        const isMine = msg.senderId === currentUserId;
                                        return (
                                            <div key={msg.id ?? msg.timestamp} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[70%] px-3 py-2 rounded-lg ${isMine ? "bg-blue-100 text-gray-800" : "bg-gray-100 text-gray-800"}`}>
                                                    {msg.content}
                                                    <div className="text-xs text-gray-400 text-right mt-1">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                <div ref={messagesEndRef} />
                            </div>
                        )}


                        {/* Input */}
                        {selectedRoom && (
                            <div className="flex border-t p-2 gap-2 bg-white">
                                <input
                                    type="text"
                                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                    placeholder="Nhập tin nhắn..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
