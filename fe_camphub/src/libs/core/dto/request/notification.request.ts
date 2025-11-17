import { NotificationType, ReferenceType } from "@/libs/core/constants";

export interface NotificationCreationRequest {
    receiverId: string;
    senderId: string;
    type: NotificationType;
    title: string;
    content: string;
    referenceType: ReferenceType;
    referenceId: string;
}