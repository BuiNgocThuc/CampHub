"use client";
import { useEffect, useState } from "react";
import ItemCard from "../ItemCard";

interface SimilarItemsSectionProps {
  categoryId: string;
}

export default function SimilarItemsSection({
  categoryId,
}: SimilarItemsSectionProps) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/items/similar?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, [categoryId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4">Sản phẩm tương tự</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
