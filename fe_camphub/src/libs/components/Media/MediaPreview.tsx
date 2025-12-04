// libs/components/MediaPreview.tsx
"use client";

import { Box, IconButton } from "@mui/material";
import { X, PlayCircle } from "lucide-react";
import AppImage from "./AppImage";

interface MediaPreviewProps {
    url?: string | null;
    size?: "small" | "medium" | "large" | "full";
    onRemove?: () => void;
    showRemove?: boolean;
}

const sizeMap = {
    small: 60,
    medium: 100,
    large: 150,
    full: "100%",
} as const;

export default function MediaPreview({
    url,
    size = "medium",
    onRemove,
    showRemove = true,
}: MediaPreviewProps) {
    const isVideo = url?.match(/\.(mp4|webm|ogg|mov)$/i);
    const hasMedia = url && url.trim() !== "";

    return (
        <Box sx={{ position: "relative", display: "inline-block" }}>
            {hasMedia && isVideo ? (
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: "grey.900",
                        boxShadow: 3,
                    }}
                >
                    <video
                        src={url}
                        style={{
                            width: size === "full" ? "100%" : sizeMap[size],
                            height: size === "full" ? "auto" : sizeMap[size],
                            objectFit: "cover",
                            borderRadius: 12,
                        }}
                        poster="/img/placeholder.webp"
                    />
                    <PlayCircle
                        size={size === "small" ? 28 : size === "large" ? 56 : 44}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-2xl"
                        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}
                    />
                </Box>
            ) : hasMedia ? (
                <AppImage
                    src={url}
                    alt="Preview"
                    width={size === "full" ? 400 : sizeMap[size]}
                    height={size === "full" ? 300 : sizeMap[size]}
                    className="rounded-3xl object-cover shadow-lg"
                />
            ) : (
                /* TRƯỜNG HỢP KHÔNG CÓ ẢNH → DÙNG PLACEHOLDER ĐẸP TỪ APPIMAGE */
                <Box
                    sx={{
                        width: size === "full" ? "100%" : sizeMap[size],
                        height: size === "full" ? 200 : sizeMap[size],
                        bgcolor: "#f3f4f6",
                        borderRadius: 3,
                        border: "3px dashed #cbd5e1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        fontSize: size === "small" ? "0.8rem" : "1rem",
                        gap: 1,
                    }}
                >
                    <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">?</span>
                    </div>
                    <span className="font-medium">Không có ảnh</span>
                </Box>
            )}

            {/* Nút xóa */}
            {showRemove && onRemove && (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        bgcolor: "#ef4444",
                        color: "white",
                        boxShadow: 3,
                        "&:hover": { bgcolor: "#dc2626", transform: "scale(1.1)" },
                        transition: "all 0.2s",
                    }}
                >
                    <X size={16} />
                </IconButton>
            )}
        </Box>
    );
}