"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  reviewer: { fullName: string; avatar: string };
  rating: number;
  content: string;
  createdAt: string;
}

export default function ReviewList({ itemId }: { itemId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  // 🔸 Dữ liệu mock
  useEffect(() => {
    const mockReviews: Review[] = [
      {
        id: "1",
        reviewer: { fullName: "Nguyễn Minh Khoa", avatar: "/img/avatar/user1.jpg" },
        rating: 5,
        content:
          "Sản phẩm rất tốt, giao nhanh, lều chắc chắn và dễ dựng. Chủ thuê rất thân thiện.",
        createdAt: "2025-10-20",
      },
      {
        id: "2",
        reviewer: { fullName: "Lê Thảo", avatar: "/img/avatar/user3.jpg" },
        rating: 4,
        content: "Giá thuê hợp lý, chỉ hơi nhỏ so với mô tả một chút.",
        createdAt: "2025-10-18",
      },
      {
        id: "3",
        reviewer: { fullName: "Phạm Đức", avatar: "/img/avatar/user4.jpg" },
        rating: 5,
        content: "Tôi rất hài lòng, sẽ thuê lại khi có dịp đi cắm trại lần tới.",
        createdAt: "2025-10-15",
      },
    ];
    setReviews(mockReviews);
  }, [itemId]);

  // 🔹 Khi có API thật, chỉ cần bỏ comment đoạn dưới:
  // useEffect(() => {
  //   fetch(`/api/reviews/item/${itemId}`)
  //     .then((res) => res.json())
  //     .then(setReviews)
  //     .catch(console.error);
  // }, [itemId]);

  if (reviews.length === 0)
    return <p className="text-gray-500">Chưa có đánh giá nào.</p>;

  return (
    <div className="bg-white mt-12 p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Đánh giá từ người thuê ({reviews.length})</h3>
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b pb-4 last:border-none last:pb-0">
            <div className="flex items-start gap-3">
              <img
                src={r.reviewer.avatar}
                className="w-10 h-10 rounded-full object-cover"
                alt={r.reviewer.fullName}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.reviewer.fullName}</p>
                  <p className="text-sm text-gray-400">{r.createdAt}</p>
                </div>

                <div className="flex items-center mt-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700">{r.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
