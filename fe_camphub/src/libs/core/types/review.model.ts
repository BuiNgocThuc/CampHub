import { MediaResource } from "./media-resource.model";

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewedId: string;
  itemName: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  mediaUrls: MediaResource[];
  createdAt: string;
}
