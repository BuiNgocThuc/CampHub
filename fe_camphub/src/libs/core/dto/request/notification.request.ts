import { NotificationType, ReferenceType } from "@/libs/core/constants";

export interface NotificationCreationRequest {
    receiverId: string | null;
    senderId: string;
    type: NotificationType;
    title: string;
    content: string;
    referenceType: ReferenceType;
    referenceId: string;
    isBroadcast?: boolean;
}