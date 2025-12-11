import { MediaResource } from "../../types";

export interface ReviewCreationRequest {
    bookingId: string;
    reviewerId: string;
    reviewedId: string;
    itemId: string;
    rating: number;
    content: string;
    mediaUrls: MediaResource[];
}
