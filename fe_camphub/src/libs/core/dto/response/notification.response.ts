import { NotificationType, ReferenceType } from "@/libs/core/constants";

export interface NotificationResponse {
    id: string;
    receiverId: string | null;
    senderId: string;
    type: NotificationType;
    title: string;
    content: string;
    referenceType: ReferenceType;
    referenceId: string;
    isRead: boolean;
    isBroadcast: boolean;
    createdAt: string;
}