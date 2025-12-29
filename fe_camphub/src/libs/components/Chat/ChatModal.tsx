// src/libs/components/Chat/ChatModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChatRoom } from "@/libs/core/types";
import { useChatSocket } from "@/libs/hooks";
import { useAuthStore, useChatStore } from "@/libs/stores";
import { getChatRooms } from "@/libs/api";
import { MessageSquare, X, Send, Search } from "lucide-react"; // Import thêm icon

interface ChatModalProps {
    onClose?: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
    const user = useAuthStore((state) => state.user);
    const { receiverInfo } = useChatStore();
    const currentUserId = user?.id; // Đảm bảo lấy ID thật

    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    
    // State UI
    const [search, setSearch] = useState("");
    const [filterUnread, setFilterUnread] = useState(false);
    const [input, setInput] = useState("");
    
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { messages, sendMessage, subscribeToChatRoom, lastMessages } = useChatSocket();

    // 1. Logic tải phòng và chọn phòng mặc định
    const fetchRoomsAndSelect = async () => {
        if (!currentUserId) return;
        try {
            const res = await getChatRooms(currentUserId);
            if (res.result) {
                const rooms = res.result;
                setChatRooms(rooms);

                // LOGIC QUAN TRỌNG:
                // Chỉ tự động chọn phòng khi có receiverInfo (tức là bấm từ nút "Chat ngay")
                if (receiverInfo && receiverInfo.id) {
                    const existingRoom = rooms.find(r =>
                        r.participantIds.includes(receiverInfo.id)
                    );

                    if (existingRoom) {
                        setSelectedRoom(existingRoom);
                        subscribeToChatRoom(existingRoom.chatCode);
                    } else {
                        // Tạo phòng ảo
                        const tempRoom: ChatRoom = {
                            id: "temp_id",
                            chatCode: "TEMP_CODE",
                            participantIds: [currentUserId, receiverInfo.id],
                            lastMessage: "",
                            lastTimestamp: new Date().toISOString(),
                            unreadMessageCounts: {},
                            receiverUsername: receiverInfo.fullName,
                            avatarUrl: receiverInfo.avatar
                        };
                        setSelectedRoom(tempRoom);
                    }
                } else {
                    // Nếu mở từ Global Button (không có target) -> Về màn hình Welcome
                    setSelectedRoom(null);
                }
            }
        } catch (error) {
            console.error("Failed to load chat rooms", error);
        }
    };

    useEffect(() => {
        fetchRoomsAndSelect();
    }, [receiverInfo, currentUserId]);

    // Scroll xuống cuối
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedRoom]);

    // Realtime update danh sách phòng (đẩy phòng mới lên đầu)
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
                        [currentUserId!]: !isSender && selectedRoom?.chatCode !== chatCode
                            ? (oldRoom.unreadMessageCounts[currentUserId!] || 0) + 1
                            : (oldRoom.unreadMessageCounts[currentUserId!] || 0)
                    }
                };
                updatedRooms.splice(index, 1);
                updatedRooms.unshift(newRoom);
            });
            return updatedRooms;
        });
    }, [lastMessages, currentUserId, selectedRoom]);

    // Handle chọn phòng từ Sidebar
    const handleSelectRoom = (room: ChatRoom) => {
        // Reset unread count local
        if (currentUserId) {
            setChatRooms(prev => prev.map(r => r.chatCode === room.chatCode 
                ? { ...r, unreadMessageCounts: { ...r.unreadMessageCounts, [currentUserId]: 0 } } 
                : r
            ));
        }
        
        setSelectedRoom(room);
        subscribeToChatRoom(room.chatCode);
    };

    // Handle gửi tin nhắn
    const handleSend = async () => {
        if (!input.trim() || !currentUserId || !selectedRoom) return;
        
        let targetReceiverId = "";
        if (selectedRoom.chatCode === "TEMP_CODE") {
            targetReceiverId = receiverInfo?.id || "";
        } else {
            targetReceiverId = selectedRoom.participantIds.find(id => id !== currentUserId) || "";
        }

        if (!targetReceiverId) return;

        await sendMessage({
            senderId: currentUserId,
            receiverId: targetReceiverId,
            content: input,
        });
        setInput("");

        // Reload phòng nếu là tin nhắn đầu tiên
        if (selectedRoom.chatCode === "TEMP_CODE") {
            setTimeout(() => { fetchRoomsAndSelect(); }, 500);
        }
    };

    // Logic Search & Filter
    const filteredRooms = chatRooms.filter((room) => {
        const nameTarget = (room.receiverUsername || "").toLowerCase();
        const searchKeyword = search.toLowerCase();
        const matchSearch = nameTarget.includes(searchKeyword);
        const matchUnread = filterUnread && currentUserId 
            ? (room.unreadMessageCounts[currentUserId] || 0) > 0 
            : true;
        return matchSearch && matchUnread;
    });

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-[800px] h-[600px] bg-white flex flex-col shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
                
                {/* Main Header (Toàn bộ Modal) */}
                <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={20} />
                        <h3 className="font-semibold text-lg">Tin nhắn</h3>
                    </div>
                    {onClose && (
                        <button
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Body Content */}
                <div className="flex flex-1 overflow-hidden">
                    
                    {/* LEFT SIDEBAR */}
                    <div className="w-[320px] border-r flex flex-col bg-gray-50/50">
                        {/* Search & Filter */}
                        <div className="p-3 border-b bg-white space-y-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full pl-9 pr-3 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-lg text-sm transition-all outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        !filterUnread ? "bg-white text-blue-700 shadow-sm border" : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                    onClick={() => setFilterUnread(false)}
                                >
                                    Tất cả
                                </button>
                                <button
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        filterUnread ? "bg-white text-blue-700 shadow-sm border" : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                    onClick={() => setFilterUnread(true)}
                                >
                                    Chưa đọc
                                </button>
                            </div>
                        </div>

                        {/* Room List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredRooms.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    Không tìm thấy cuộc hội thoại nào
                                </div>
                            ) : (
                                filteredRooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className={`p-3 cursor-pointer hover:bg-white hover:shadow-sm transition-all border-l-4 ${
                                            selectedRoom?.id === room.id 
                                                ? "bg-white border-l-blue-600 shadow-sm" 
                                                : "border-l-transparent"
                                        }`}
                                        onClick={() => handleSelectRoom(room)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-11 h-11 flex-shrink-0">
                                                <Image
                                                    src={room.avatarUrl || '/img/profiles/avatar-default.png'}
                                                    alt={room.receiverUsername}
                                                    fill
                                                    className="rounded-full object-cover border border-gray-100"
                                                />
                                                {currentUserId && (room.unreadMessageCounts[currentUserId] || 0) > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full border-2 border-white">
                                                        {room.unreadMessageCounts[currentUserId]}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <p className={`text-sm truncate ${
                                                        currentUserId && (room.unreadMessageCounts[currentUserId] || 0) > 0 
                                                        ? "font-bold text-gray-900" 
                                                        : "font-medium text-gray-700"
                                                    }`}>
                                                        {room.receiverUsername}
                                                    </p>
                                                    {room.lastTimestamp && (
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(room.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-xs truncate mt-0.5 ${
                                                     currentUserId && (room.unreadMessageCounts[currentUserId] || 0) > 0 
                                                     ? "text-gray-800 font-medium" 
                                                     : "text-gray-500"
                                                }`}>
                                                    {room.lastMessage || "Hình ảnh/Tệp tin"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT CHAT WINDOW */}
                    <div className="flex-1 flex flex-col bg-white h-full relative">
                        
                        {/* CASE 1: Đã chọn phòng -> Hiện Header người nhận + List tin nhắn */}
                        {selectedRoom ? (
                            <>
                                {/* Header Người nhận */}
                                <div className="px-4 py-3 border-b flex items-center gap-3 shadow-sm z-10">
                                    <div className="relative w-9 h-9">
                                        <Image
                                            src={selectedRoom.avatarUrl || '/img/profiles/avatar-default.png'}
                                            alt="avt"
                                            fill
                                            className="rounded-full object-cover border"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-gray-800">
                                            {selectedRoom.receiverUsername}
                                        </h2>
                                        <p className="text-xs text-green-600">Đang hoạt động</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                    {messages
                                        .filter((msg) => msg.chatCode === selectedRoom.chatCode)
                                        .map((msg, idx) => {
                                            const isMine = msg.senderId === currentUserId;
                                            return (
                                                <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                        isMine 
                                                        ? "bg-blue-600 text-white rounded-br-none" 
                                                        : "bg-white border text-gray-800 rounded-bl-none"
                                                    }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t bg-white">
                                    <div className="flex gap-2 items-center bg-gray-100 rounded-full px-2 py-1.5 border focus-within:ring-2 ring-blue-100 transition-all focus-within:bg-white focus-within:border-blue-300">
                                        <input
                                            type="text"
                                            className="flex-1 bg-transparent border-none px-3 py-1.5 text-sm focus:outline-none"
                                            placeholder="Nhập tin nhắn..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        />
                                        <button
                                            className={`p-2 rounded-full transition-all ${
                                                input.trim() 
                                                ? "bg-blue-600 text-white shadow hover:scale-105" 
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                            onClick={handleSend}
                                            disabled={!input.trim()}
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* CASE 2: Chưa chọn phòng -> Màn hình Welcome */
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-gray-50/50">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    <MessageSquare size={48} className="text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    Chào mừng đến với CampHub Chat
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                                    Chọn một cuộc hội thoại từ danh sách bên trái hoặc nhấn 
                                    <span className="font-semibold text-gray-700"> "Chat ngay" </span> 
                                    từ trang sản phẩm để bắt đầu.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}