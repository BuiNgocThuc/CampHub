import { NotificationType, ReferenceType } from "@/libs/core/constants";

export interface NotificationResponse {
    id: string;
    receiverId: string;
    senderId: string;
    type: NotificationType;
    title: string;
    content: string;
    referenceType: ReferenceType;
    referenceId: string;
    isRead: boolean;
    createdAt: string;
}