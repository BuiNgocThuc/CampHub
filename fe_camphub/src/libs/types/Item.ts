import { ItemStatus } from "../constants";
import { MediaResource } from "./MediaResource";

export interface Item {
    id: string;
    ownerId: string;            // chủ sở hữu
    categoryId?: string | null; // danh mục
    name: string;
    description?: string | null;
    pricePerDay: number;
    depositAmount: number;
    mediaUrls?: MediaResource[]; // ảnh/video sản phẩm
    status: ItemStatus;
    createdAt: string;
    updatedAt: string;
}
