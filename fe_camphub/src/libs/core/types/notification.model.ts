import { NotificationType, ReferenceType } from "../constants";

export interface Notification {
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
