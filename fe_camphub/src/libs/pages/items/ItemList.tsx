// app/page.tsx hoặc app/items/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryList from "./CategoryList";
import ItemCard from "./ItemCard";
import { getAllCategories, getAllItems } from "@/libs/api";
import { Loader2, Package } from "lucide-react";

export default function ItemList() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Lấy danh sách sản phẩm
  const {
    data: itemsData,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", selectedCategoryId],
    queryFn: () => getAllItems("AVAILABLE", selectedCategoryId || undefined),
  });

  // Lấy danh sách danh mục
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const items = useMemo(() => {
    return itemsData?.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.mediaUrls?.[0]?.url || "/placeholder.jpg",
    })) || [];
  }, [itemsData]);

  if (itemsLoading || categoriesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600">
        Không thể tải sản phẩm. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Thuê đồ cắm trại – Giá tốt nhất
        </h1>
        <p className="text-lg text-gray-600">
          Hàng ngàn sản phẩm chất lượng từ cộng đồng CampHub
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Danh mục */}
        <div className="lg:col-span-1">
          <CategoryList
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>

        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-3">
          {items.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Chưa có sản phẩm nào trong danh mục này</p>
              <p className="text-sm text-gray-400 mt-2">
                Hãy thử chọn danh mục khác hoặc quay lại sau nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}