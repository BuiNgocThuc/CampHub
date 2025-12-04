import { useState } from "react";
import { getFilePreview } from "../utils";
import { CloudinaryUploadResult, uploadToCloudinary } from "../services";

interface UploadState {
    uploading: boolean;
    error: string | null;
    preview: string | null;
}

export const useCloudinaryUpload = () => {
    const [uploads, setUploads] = useState<Record<string, UploadState>>({});

    const uploadFile = async (file: File): Promise<CloudinaryUploadResult> => {
        const key = `${file.name}-${file.size}-${Date.now()}`;
        const preview = getFilePreview(file);

        setUploads(prev => ({
            ...prev,
            [key]: { uploading: true, error: null, preview },
        }));

        try {
            const result = await uploadToCloudinary(file);

            setUploads(prev => ({
                ...prev,
                [key]: { uploading: false, error: null, preview },
            }));

            return result;
        } catch (err: any) {
            setUploads(prev => ({
                ...prev,
                [key]: { uploading: false, error: err.message, preview },
            }));
            throw err;
        }
    };

    const uploadMultiple = async (files: File[]): Promise<CloudinaryUploadResult[]> => {
        return Promise.all(files.map(uploadFile));
    };

    return { uploads, uploadFile, uploadMultiple };
};