import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { ItemLog } from "../types";
import { ItemLogsResponse } from "../dto/response";

const itemLogMapper = createMapper({
    strategyInitializer: pojos(),
});

PojosMetadataMap.create<ItemLog>("ItemLog", {
    id: String,
    itemId: String,
    itemName: String,
    account: String,
    action: String,
    previousStatus: String,
    currentStatus: String,
    note: String,
    media: Array,
    createdAt: String,
});
PojosMetadataMap.create<ItemLogsResponse>("ItemLogsResponse", {
    id: String,
    itemId: String,
    itemName: String,
    account: String,
    action: String,
    previousStatus: String,
    currentStatus: String,
    note: String,
    media: Array,
    createdAt: String,
});

createMap<ItemLogsResponse, ItemLog>(
    itemLogMapper,
    "ItemLogsResponse",
    "ItemLog",
);

export const itemLogMap = {
    fromResponse: (response: ItemLogsResponse): ItemLog => {
        return itemLogMapper.map(response, "ItemLogsResponse", "ItemLog");
    }
}