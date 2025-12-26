import { MediaType } from "../core/constants";

// src/libs/services/cloudinary.service.ts
export interface CloudinaryUploadResult {
    url: string;
    type: MediaType;
    publicId: string;
    resourceType: "image" | "video";
}

export const uploadToCloudinary = async (
    file: File
): Promise<CloudinaryUploadResult> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!cloudName || !preset) {
        throw new Error("Thiếu cấu hình Cloudinary. Kiểm tra .env");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const endpoint =
        file.type.startsWith("video/")
            ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
            : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || "Upload thất bại");
    }

    const data = await response.json();

    return {
        url: data.secure_url,
        type: data.resource_type === "video" ? MediaType.VIDEO : MediaType.IMAGE,
        publicId: data.public_id,
        resourceType: data.resource_type,
    };
};

// Upload nhiều file
export const uploadMultipleToCloudinary = async (
    files: File[]
): Promise<CloudinaryUploadResult[]> => {
    const uploads = files.map(uploadToCloudinary);
    return Promise.all(uploads);
};