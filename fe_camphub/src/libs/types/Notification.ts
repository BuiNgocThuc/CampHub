import { NotificationType, ReferenceType } from "../constants";

export interface Notification {
  id: string;                    // UUID
  receiverId: string;            // người nhận thông báo
  senderId?: string | null;      // người gửi (nếu có)
  type: NotificationType;        // loại thông báo
  title?: string | null;         // tiêu đề
  content?: string | null;       // nội dung
  referenceType?: ReferenceType | null; // loại thực thể liên quan (Booking, Item, v.v.)
  referenceId?: string | null;   // id liên quan
  isRead: boolean;               // đã đọc chưa
  createdAt: string;             // thời gian tạo
  readAt?: string | null;        // thời gian đọc (nếu có)
}
