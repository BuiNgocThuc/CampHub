import { MediaType } from "../constants";

export interface MediaResource {
  url: string;             // đường dẫn ảnh/video
  type?: MediaType; // loại media (tùy chọn)
  description?: string;    // chú thích (nếu có)
}
