import { MediaType } from "../constants";

export interface MediaResource {
  url: string;             // đường dẫn ảnh/video
  type: MediaType; // loại media (IMAGE/VIDEO)
  fileHash?: string;
}
