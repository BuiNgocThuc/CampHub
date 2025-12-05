import { NotificationType, ReferenceType } from "../constants";

export interface Notification {
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
