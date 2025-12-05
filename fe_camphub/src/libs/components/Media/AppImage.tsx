// libs/components/AppImage.tsx
"use client";
import Image from "next/image";
import { Box } from "@mui/material";

interface AppImageProps {
    src?: string | null;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

const FALLBACK = "/img/placeholder.webp"; // ảnh mặc định siêu nhẹ

export default function AppImage({
    src,
    alt = "CampHub",
    width = 400,
    height = 300,
    className = "",
    priority = false,
}: AppImageProps) {
    const isValid =
        !!src &&
        src.trim() !== "" &&
        !src.includes("null") &&
        !src.includes("undefined");

    const imageSrc = isValid ? src : FALLBACK;

    return (
        <Box
            position="relative"
            width={width}
            height={height}
            borderRadius={2}
            overflow="hidden"
            bgcolor="#f3f4f6"
            className={className}
        >
            <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={priority}
                placeholder={imageSrc === FALLBACK ? "empty" : "blur"}
                blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoQAAIAAgA0JaQAA3AA/vv9..."
                onError={(e) => {
                    e.currentTarget.src = FALLBACK;
                    e.currentTarget.srcset = FALLBACK;
                }}
            />
        </Box>
    );
}