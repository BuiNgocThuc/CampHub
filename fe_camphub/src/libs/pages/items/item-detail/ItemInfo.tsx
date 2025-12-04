"use client";

import { useChatStore } from "@/libs/stores/chat.store";
import { Star, MessageCircle } from "lucide-react";

interface OwnerInfo {
  id: string;
  fullName: string;
  avatar: string;
  trustScore: number;
}

interface CategoryInfo {
  id: string;
  name: string;
}

interface ItemInfoProps {
  name: string;
  pricePerDay: number;
  quantity: number;
  owner: OwnerInfo;
  category: CategoryInfo;
  averageRating: number;
  totalReviews: number;
}

export default function ItemInfo({
  name,
  pricePerDay,
  quantity,
  owner,
  category,
  averageRating,
  totalReviews,
}: ItemInfoProps) {
  const { openChat } = useChatStore();

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{name}</h1>
      <div className="text-gray-600">Danh mục: {category.name}</div>
      <div className="flex items-center text-yellow-500">
        <Star className="w-5 h-5 mr-1 fill-yellow-500" />
        {averageRating.toFixed(1)} ({totalReviews} đánh giá)
      </div>
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold text-green-600">
          {pricePerDay.toLocaleString()}đ / ngày
        </div>
        <div className="text-base font-medium text-gray-700">
          Số lượng: <span className="font-bold text-blue-600">{quantity}</span> sản phẩm
        </div>
      </div>

      {/* Owner info + Chat button */}
      <div className="flex items-center gap-3 mt-4">
        <img
          src={owner.avatar}
          alt={owner.fullName}
          className="w-10 h-10 rounded-full border"
        />
        <div>
          <p className="font-medium">{owner.fullName}</p>
          <p className="text-sm text-gray-500">
            Trust Score: {owner.trustScore}
          </p>
        </div>

        {/* Chat ngay button */}
        <div className="ml-auto">
          <button
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
            onClick={() => openChat(owner.id)} // 👉 mở ChatModal global
          >
            <MessageCircle size={16} />
            Chat ngay
          </button>
        </div>
      </div>
    </div>
  );
}
