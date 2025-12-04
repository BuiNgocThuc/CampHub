// components/item/SimilarItemsSection.tsx
"use client";

import { Item } from "@/libs/core/types";
import ItemCard from "../ItemCard";

interface SimilarItemsSectionProps {
  items: Item[];
}

export default function SimilarItemsSection({ items }: SimilarItemsSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-8">Sản phẩm tương tự</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            imageUrl={item.mediaUrls?.[0]?.url || "/placeholder.jpg"}
          />
        ))}
      </div>
    </section>
  );
}