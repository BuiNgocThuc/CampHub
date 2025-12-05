import { createMap, createMapper } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { Notification } from "../types";
import { NotificationCreationRequest } from "../dto/request";
import { NotificationResponse } from "../dto/response";

const notificationMapper = createMapper({
    strategyInitializer: pojos(),
})

PojosMetadataMap.create<Notification>("Notification", {
    id: String,
    receiverId: String,
    senderId: String,
    type: String,
    title: String,
    content: String,
    referenceType: String,
    referenceId: String,
    isRead: Boolean,
    isBroadcast: Boolean,
    createdAt: String,
});
PojosMetadataMap.create<NotificationCreationRequest>("NotificationCreationRequest", {
    receiverId: String,
    senderId: String,
    type: String,
    title: String,
    content: String,
    referenceType: String,
    referenceId: String,
});
PojosMetadataMap.create<NotificationResponse>("NotificationResponse", {
    id: String,
    receiverId: String,
    senderId: String,
    type: String,
    title: String,
    content: String,
    referenceType: String,
    referenceId: String,
    isRead: Boolean,
    isBroadcast: Boolean,
    createdAt: String,
});

createMap<NotificationResponse, Notification>(
    notificationMapper,
    "NotificationResponse",
    "Notification"
);

createMap<Notification, NotificationCreationRequest>(
    notificationMapper,
    "Notification",
    "NotificationCreationRequest"
);

export const notificationMap = {
    fromResponse: (response: NotificationResponse): Notification => {
        return notificationMapper.map(response, "NotificationResponse", "Notification");
    },
    toCreationRequest: (model: Notification): NotificationCreationRequest => {
        return notificationMapper.map(model, "Notification", "NotificationCreationRequest");
    }
}