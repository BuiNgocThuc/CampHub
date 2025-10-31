"use client";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <Image
        src={images[selected]}
        alt="Item image"
        width={600}
        height={400}
        className="rounded-2xl object-cover w-full h-[400px]"
      />
      <div className="flex gap-3 mt-3 overflow-x-auto">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt="Thumbnail"
            width={90}
            height={90}
            onClick={() => setSelected(idx)}
            className={`rounded-lg object-cover cursor-pointer border-2 ${
              selected === idx ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
