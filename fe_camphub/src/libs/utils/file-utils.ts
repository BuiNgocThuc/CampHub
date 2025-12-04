export const getFilePreview = (file: File): string => {
    return URL.createObjectURL(file);
};

export const isFileSizeValid = (file: File, maxMB: number = 50): boolean => {
    return file.size <= maxMB * 1024 * 1024;
};

export const isFileTypeAllowed = (file: File): boolean => {
    const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/quicktime",
    ];
    return allowed.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};