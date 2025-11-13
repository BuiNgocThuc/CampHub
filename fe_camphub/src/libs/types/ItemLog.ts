import { ItemActionType, ItemStatus } from "../constants";
import { MediaResource } from "./MediaResource";

export interface ItemLog {
    id: string;                  // UUID
    itemId: string;              // sản phẩm liên quan
    accountId: string;           // người thực hiện hành động
    action: ItemActionType;      // CREATE, UPDATE, APPROVE, REJECT, ...
    previousStatus?: ItemStatus | null;
    currentStatus?: ItemStatus | null;
    note?: string | null;        // mô tả thay đổi
    evidenceUrls?: MediaResource[]; // ảnh/video minh chứng
    createdAt: string;           // ISO datetime
}
