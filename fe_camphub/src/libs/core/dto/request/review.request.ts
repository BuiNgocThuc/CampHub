import { MediaResource } from "../../types";

export interface ReviewCreationRequest {
    bookingId: string;
    reviewerId: string;
    reviewedId: string;
    rating: number;
    content: string;
    mediaUrls: MediaResource[];
}
