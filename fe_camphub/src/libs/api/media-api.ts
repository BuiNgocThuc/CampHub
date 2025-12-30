import { api } from '../configuration';
import { ApiResponse } from '../core/dto/response';

export const validateImageHash = async (hash: string): Promise<boolean> => {
    try {
        const response = await api.get<ApiResponse<boolean>>("/media/validate-hash", {
            params: {
                hash,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error validating image hash:", error);
        throw error;
    }
};