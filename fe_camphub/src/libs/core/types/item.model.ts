import { ItemStatus } from "../constants";
import { MediaResource } from "./media-resource.model";

export interface Item {
    id: string;
    ownerId: string;
    categoryId: string;
    ownerName: string; // fullname của chủ sở hữu
    categoryName: string;
    ownerAvatar: string;
    ownerTrustScore: number;

    name: string;
    description: string;
    price: number;
    quantity: number;
    depositAmount: number;
    status: ItemStatus;
    mediaUrls: MediaResource[];
}
