import { createMap, createMapper } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { ItemLog } from "../types";
import { ItemLogsResponse } from "../dto/response";

const itemLogMapper = createMapper({
    strategyInitializer: pojos(),
});

PojosMetadataMap.create<ItemLog>("ItemLog", {});
PojosMetadataMap.create<ItemLogsResponse>("ItemLogsResponse", {});

createMap<ItemLogsResponse, ItemLog>(
    itemLogMapper,
    "ItemLogsResponse",
    "ItemLog"
);

export const itemLogMap = {
    fromResponse: (response: ItemLogsResponse): ItemLog => {
        return itemLogMapper.map(response, "ItemLogsResponse", "ItemLog");
    }
}