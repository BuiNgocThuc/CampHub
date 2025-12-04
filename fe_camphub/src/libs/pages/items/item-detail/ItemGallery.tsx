// components/item/ItemGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppImage } from "@/libs/components";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      {/* Ảnh lớn */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
      <AppImage
          src={images[selected]}
          alt="Sản phẩm"
          width={800}
          height={600}
          className="object-cover"
          priority // ảnh đầu tiên load nhanh
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelected((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setSelected((i) => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                selected === i ? "border-blue-600" : "border-gray-200"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}