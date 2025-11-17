import { MediaResource } from "../../types";

export interface ReviewResponse {
    id: string;
    bookingId: string;
    reviewerId: string;
    reviewedId: string;
    itemName: string;
    reviewerName: string;
    rating: number;
    comment: string;
    mediaUrls: MediaResource[];
    createdAt: string;
}
