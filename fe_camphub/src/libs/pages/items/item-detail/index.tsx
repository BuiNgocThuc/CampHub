// app/items/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getItemById, getAllItems, getReviewsByItemId } from "@/libs/api";
import ImageGallery from "./ItemGallery";
import ItemInfo from "./ItemInfo";
import ItemDescription from "./ItemDescription";
import RentalSummaryCard from "./RentalSummaryCard";
import ReviewList from "./ReviewList";
import SimilarItemsSection from "./SimilarItemsSection";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

export default function ItemDetailPage() {
    const { itemId } = useParams() as { itemId: string };

    console.log(itemId);
    const {
        data: item,
        isLoading: loadingItem,
        error: itemError,
    } = useQuery({
        queryKey: ["item", itemId],
        queryFn: () => getItemById(itemId),
        retry: false,
    });

    console.log(item);

    const { data: reviews = [] } = useQuery({
        queryKey: ["reviews", itemId],
        queryFn: () => getReviewsByItemId(itemId),
        enabled: !!item,
    });

    const { data: similarItems = [] } = useQuery({
        queryKey: ["similarItems", item?.categoryId],
        queryFn: () => getAllItems("AVAILABLE", item!.categoryId!),
        enabled: !!item?.categoryId,
    });

    if (loadingItem) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <span className="ml-3 text-xl">Đang tải sản phẩm...</span>
            </div>
        );
    }

    if (itemError || !item) {
        notFound(); // 404 đẹp hơn
    }

    const images = item.mediaUrls?.map(m => m.url) || ["/placeholder.jpg"];
    const averageRating = reviews.length > 0
        ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Cột trái: Ảnh + Thông tin */}
                <div className="lg:col-span-2 space-y-8">
                    <ImageGallery images={images} />

                    <ItemInfo
                        name={item.name}
                        pricePerDay={item.price}
                        quantity={item.quantity}
                        owner={{
                            id: item.ownerId,
                            fullName: item.ownerName || "Chủ đồ CampHub",
                            avatar: item.ownerAvatar || "/img/avatar/default-avatar.png",
                            trustScore: item.ownerTrustScore || 95,
                        }}
                        category={{ id: item.categoryId!, name: item.categoryName || "Chưa xác định" }}
                        averageRating={averageRating}
                        totalReviews={reviews.length}
                    />

                    <ItemDescription
                        description={item.description || "Chưa có mô tả chi tiết."}
                        depositAmount={item.depositAmount}
                    />

                    <ReviewList reviews={reviews} />
                </div>

                {/* Cột phải: Card đặt thuê */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <RentalSummaryCard
                        itemId={item.id}
                        pricePerDay={item.price}
                        depositAmount={item.depositAmount}
                        itemName={item.name}
                        itemImage={images[0]}
                        maxQuantity={item.quantity}
                    />
                </div>
            </div>

            {/* Sản phẩm tương tự */}
            {similarItems.length > 0 && (
                <div className="mt-16">
                    <SimilarItemsSection items={similarItems} />
                </div>
            )}
        </div>
    );
}