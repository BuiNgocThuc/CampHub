export interface ChatRoom {
    id: string;
    chatCode: string;
    participantIds: string[];
    lastMessage?: string;
    lastTimestamp?: string;
    unreadMessageCounts: Record<string, number>;
}