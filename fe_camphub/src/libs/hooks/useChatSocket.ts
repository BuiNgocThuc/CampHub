"use client";
import { useEffect, useRef, useState } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessage } from "../core/types";
import { ChatMessageRequest } from "../core/dto/request";
import { getMessagesByChatCode } from "../api";
import { ACCESS_TOKEN, BASE_URL } from "../utils";
import Cookies from "js-cookie";

interface UseChatSocketReturn {
    messages: ChatMessage[];
    sendMessage: (msg: ChatMessageRequest) => void;
    subscribeToChatRoom: (chatCode: string) => Promise<void>;
    lastMessages: Record<string, ChatMessage>;
}

export function useChatSocket(): UseChatSocketReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const clientRef = useRef<Client | null>(null);
    const roomSubscriptionRef = useRef<StompSubscription | null>(null);
    const [lastMessages, setLastMessages] = useState<Record<string, ChatMessage>>({});


    useEffect(() => {
        const token = Cookies.get(ACCESS_TOKEN) || "";

        const client = new Client({
            webSocketFactory: () => new SockJS(`${BASE_URL}/ws-chat?token=${token}`),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => console.log("[STOMP]", str),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("[STOMP] Connected");

            client.subscribe("/topic/chat.global", (msg) => {
                if (!msg.body) return;
                const payload = JSON.parse(msg.body) as ChatMessage;

                // update last message của room
                setLastMessages(prev => ({
                    ...prev,
                    [payload.chatCode]: payload
                }));
            });
        };

        client.onStompError = (frame) => {
            console.error("[STOMP ERROR]", frame);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            roomSubscriptionRef.current?.unsubscribe();
            client.deactivate();
        };
    }, []);

    const subscribeToChatRoom = async (chatCode: string) => {
        if (!clientRef.current || !clientRef.current.connected) return;

        // Unsubscribe room cũ nếu có
        roomSubscriptionRef.current?.unsubscribe();

        console.log("[STOMP] Subscribing to room:", chatCode);

        setMessages([]); // Clear messages khi chuyển room

        // Lấy lịch sử tin nhắn qua API
        try {
            const res = await getMessagesByChatCode(chatCode);
            if (res.result) {
                setMessages(res.result);
            }
        } catch (err) {
            console.error("Failed to fetch chat history", err);
        }

        // Subscribe WebSocket theo chatCode
        roomSubscriptionRef.current = clientRef.current.subscribe(
            `/topic/chat.${chatCode}`,
            (msg: IMessage) => {
                if (!msg.body) return;
                const payload = JSON.parse(msg.body) as ChatMessage;
                setMessages((prev) => [...prev, payload]);
            }
        );
    };

    const sendMessage = (msg: ChatMessageRequest) => {
        if (!clientRef.current || !clientRef.current.connected) return;

        clientRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(msg),
        });
    };

    return { messages, sendMessage, subscribeToChatRoom, lastMessages };
}
