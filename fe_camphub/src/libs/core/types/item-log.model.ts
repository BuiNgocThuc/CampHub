import { ItemActionType, ItemStatus } from "../constants";
import { MediaResource } from "./media-resource.model";

export interface ItemLog {
    d: string;
    itemId: string;
    itemName: string;
    account: string; // username của người thực hiện hành động
    action: ItemActionType; 
    previousStatus: ItemStatus | null;
    currentStatus: ItemStatus;
    note?: string;
    media?: MediaResource[];
    createdAt: string;
}
