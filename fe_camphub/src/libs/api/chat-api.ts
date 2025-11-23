import { ApiResponse } from './../core/dto/response/api-response';
import { ChatRoom } from "../core/types";
import { ChatMessageResponse } from '../core/dto/response';
import { api } from '../configuration';

export const getChatRooms = async (userId: string): Promise<ApiResponse<ChatRoom[]>> => {
    try {
        console.log("Fetching chat rooms for userId:", userId);
        const response = await api.get<ApiResponse<ChatRoom[]>>("/chat/chat-rooms?userId=" + userId);
        console.log("Received chat rooms:", response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMessagesByChatCode = async (chatCode: string): Promise<ApiResponse<ChatMessageResponse[]>> => {
    try {
        const response = await api.get<ApiResponse<ChatMessageResponse[]>>(`/chat/messages/${chatCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}