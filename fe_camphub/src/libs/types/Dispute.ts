import { DisputeStatus, DisputeDecision } from "../constants";
import { MediaResource } from "./MediaResource";

export interface Dispute {
  id: string;                   // UUID
  bookingId: string;            // liên kết đến Booking
  reporterId?: string | null;   // người báo cáo (lessor)
  defenderId?: string | null;   // người bị khiếu nại (lessee)
  adminId?: string | null;      // admin xử lý
  description?: string | null;  // mô tả khiếu nại
  evidences?: MediaResource[];  // danh sách hình ảnh / video chứng cứ
  damageTypeId?: string | null; // loại hư hại (nếu có)
  status: DisputeStatus;        // trạng thái khiếu nại
  adminDecision?: DisputeDecision | null; // quyết định của admin
  compensationAmount?: number | null;     // tiền bồi thường
  adminNote?: string | null;    // ghi chú từ admin
  createdAt: string;            // ISO datetime
  resolvedAt?: string | null;   // thời gian giải quyết
}
