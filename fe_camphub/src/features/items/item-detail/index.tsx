"use client";

import ItemInfo from "./ItemInfo";
import ItemDescription from "./ItemDescription";
import RentalSummaryCard from "./RentalSummaryCard";
import ReviewList from "./ReviewList";
import ImageGallery from "./ItemGallery";
import SimilarItemsSection from "./SimilarItemsSection";

// kiểu dữ liệu DTO
interface ItemDetailResponse {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  depositAmount: number;
  mediaUrls: string[];
  status: string;
  category: { id: string; name: string };
  owner: { id: string; fullName: string; avatar: string; trustScore: number };
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export default function ItemDetailPage({ item }: { item: ItemDetailResponse }) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={item.mediaUrls} />
          <ItemInfo
            name={item.name}
            pricePerDay={item.pricePerDay}
            owner={item.owner}
            category={item.category}
            averageRating={item.averageRating}
            totalReviews={item.totalReviews}
          />
          <ItemDescription
            description={item.description}
            depositAmount={item.depositAmount}
          />
        </div>

        {/* Right booking card */}
        <RentalSummaryCard
          pricePerDay={item.pricePerDay}
          depositAmount={item.depositAmount}
        />
      </div>

      <div className="mt-12">
        <ReviewList itemId={item.id} />
        <SimilarItemsSection categoryId={item.category.id} />
      </div>
    </div>
  );
}
