"use client";
import { useEffect, useState } from "react";
import ItemCard from "../ItemCard";

interface SimilarItemsSectionProps {
  categoryId: string;
}

interface ItemCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function SimilarItemsSection({ categoryId }: SimilarItemsSectionProps) {
  const [items, setItems] = useState<ItemCardProps[]>([]);

  // 🔹 Mock data hiển thị thử
  useEffect(() => {
    const mockItems: ItemCardProps[] = [
      {
        id: "1",
        name: "Lều cắm trại 2 người NatureHike",
        price: 180000,
        imageUrl: "/img/items/tent1.jpg",
      },
      {
        id: "2",
        name: "Bếp ga mini dã ngoại",
        price: 95000,
        imageUrl: "/img/items/stove1.jpg",
      },
      {
        id: "3",
        name: "Túi ngủ chống lạnh Coleman",
        price: 120000,
        imageUrl: "/img/items/sleepbag1.jpg",
      },
    ];
    setItems(mockItems);
  }, [categoryId]);

  // 🔹 Khi có API thật, bỏ comment này:
  // useEffect(() => {
  //   fetch(`/api/items/similar?categoryId=${categoryId}`)
  //     .then((res) => res.json())
  //     .then(setItems)
  //     .catch(console.error);
  // }, [categoryId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4">Sản phẩm tương tự</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
