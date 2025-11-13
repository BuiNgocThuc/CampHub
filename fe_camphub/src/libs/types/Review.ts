import { MediaResource } from "./MediaResource";

export interface Review {
  id: string;                 // UUID
  bookingId: string;          // liên kết với Booking
  reviewerId: string;         // người viết đánh giá
  reviewedId: string;         // người được đánh giá (chủ thuê hoặc khách thuê)
  itemId: string;             // sản phẩm được thuê
  rating: number;             // 1–5 sao
  comment?: string | null;    // nội dung đánh giá
  mediaUrls?: MediaResource[]; // hình ảnh / video kèm theo
  createdAt: string;          // ISO datetime
  updatedAt: string;          // ISO datetime
}
