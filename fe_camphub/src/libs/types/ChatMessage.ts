export interface ChatMessage {
    id: string;
    chatCode: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}