"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import ItemInfo from "./ItemInfo";
import ItemDescription from "./ItemDescription";
import RentalSummaryCard from "./RentalSummaryCard";
import ReviewList from "./ReviewList";
import ImageGallery from "./ItemGallery";
import SimilarItemsSection from "./SimilarItemsSection";
import { Item } from "@/libs/types";
import { mockItems } from "@/libs/utils";
import { NextPage } from "next";


const ItemDetail: NextPage = () => {
    const params = useParams() as { itemId: string };
    const itemId = params.itemId;
    console.log(params);
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (itemId) {
            setLoading(true);
            const foundItem = mockItems.find((i) => i.id === itemId) || null;
            setItem(foundItem);
            setLoading(false);
        }
    }, [itemId]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-[60vh] text-gray-500">
                Đang tải thông tin sản phẩm...
            </div>
        );

    if (!item)
        return (
            <div className="flex items-center justify-center h-[60vh] text-red-500">
                Không tìm thấy sản phẩm.
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left content */}
                <div className="lg:col-span-2 space-y-6">
                    <ImageGallery images={item.mediaUrls?.map((m) => m.url) || []} />
                    <ItemInfo
                        name={item.name}
                        pricePerDay={item.pricePerDay}
                        owner={{
                            id: item.ownerId,
                            fullName: "Chủ thuê", // Thay bằng mock/real owner info
                            avatar: "/img/avatar/default-avatar.png",
                            trustScore: 90,
                        }}
                        category={{ id: item.categoryId || "", name: "Danh mục" }}
                        averageRating={4.5}
                        totalReviews={12}
                    />
                    <ItemDescription
                        description={item.description || ""}
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
                <SimilarItemsSection categoryId={item.categoryId || ""} />
            </div>
        </div>
    );
};

export default ItemDetail;
