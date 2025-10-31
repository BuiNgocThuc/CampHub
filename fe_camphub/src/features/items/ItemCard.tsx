"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface ItemCardProps {
  name: string;
  price: number;
  imageUrl: string;
}

export default function ItemCard(props: ItemCardProps) {
  const { name, price, imageUrl } = props;
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3">
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="mt-3 text-left">
        <h3 className="font-semibold text-gray-800 line-clamp-1 text-center text-xl">{name}</h3>
        <p className="text-blue-600 font-bold mt-1 text-center text-lg">
          {price.toLocaleString()}₫ / ngày
        </p>
      </div>

      <button className="w-full mt-3 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg">
        <ShoppingBag size={16} className="mr-2" />
        Thuê ngay
      </button>
    </div>
  );
}
