"use client";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  reviewer: { fullName: string; avatar: string };
  rating: number;
  content: string;
  createdAt: string;
}

export default function ReviewList({ itemId }: { itemId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // gọi API thật sau
    fetch(`/api/reviews/item/${itemId}`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(console.error);
  }, [itemId]);

  if (reviews.length === 0)
    return <p className="text-gray-500">Chưa có đánh giá nào.</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Đánh giá</h3>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded-lg bg-white">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={r.reviewer.avatar}
                className="w-8 h-8 rounded-full"
                alt={r.reviewer.fullName}
              />
              <p className="font-medium">{r.reviewer.fullName}</p>
              <span className="text-yellow-500">⭐ {r.rating}</span>
            </div>
            <p>{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
