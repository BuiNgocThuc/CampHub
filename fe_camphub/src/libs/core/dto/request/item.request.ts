import { MediaResource } from "../../types";

export interface ItemCreationRequest {
    name: string;
    categoryId: string;
    description: string;
    pricePerDay: number;
    quantity: number;
    depositAmount: number;
    mediaUrls: MediaResource[];
}

export interface ItemPatchRequest {
    name?: string;
    categoryId?: string;
    description?: string;
    pricePerDay?: number;
    quantity?: number;
    depositAmount?: number;
    mediaUrls?: MediaResource[];
}

export interface ItemUpdateRequest {
    name: string;
    categoryId: string;
    description: string;
    pricePerDay: number;
    depositAmount: number;
    quantity: number;
    mediaUrls: MediaResource[];
}