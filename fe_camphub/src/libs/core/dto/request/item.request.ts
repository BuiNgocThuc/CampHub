import { MediaResource } from "../../types";

export interface ItemCreationRequest {
    name: string;
    description: string;
    categoryId: string;
    pricePerDay: number;
    quantity: number;
    depositAmount: number;
    mediaUrls: MediaResource[];
}

export interface ItemPatchRequest {
    categoryId?: string;
    name?: string;
    description?: string;
    pricePerDay?: number;
    quantity?: number;
    depositAmount?: number;
    mediaUrls?: MediaResource[];
}

export interface ItemUpdateRequest {
    categoryId: string;
    name: string;
    description: string;
    pricePerDay: number;
    depositAmount: number;
    quantity: number;
    mediaUrls: MediaResource[];
}