"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

interface ItemCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ItemCard({ id, name, price, imageUrl }: ItemCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/CampHub/items/${id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer p-3"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Item info */}
      <div className="mt-3 text-left">
        <h3 className="font-semibold text-gray-800 line-clamp-1 text-center text-xl">
          {name}
        </h3>
        <p className="text-blue-600 font-bold mt-1 text-center text-lg">
          {price.toLocaleString()}₫ / ngày
        </p>
      </div>

      {/* Rent button */}
      <button className="w-full mt-3 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg">
        <ShoppingBag size={16} className="mr-2" />
        Thuê ngay
      </button>
    </div>
  );
}
