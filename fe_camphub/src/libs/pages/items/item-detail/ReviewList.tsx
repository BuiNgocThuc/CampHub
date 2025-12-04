// components/item/ReviewList.tsx
"use client";

import { Star } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Review } from "@/libs/core/types";
import {AppImage} from "@/libs/components";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-10 text-center">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Chưa có đánh giá nào</p>
        <p className="text-sm text-gray-400 mt-2">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h3 className="text-2xl font-bold mb-6">Đánh giá từ người thuê ({reviews.length})</h3>
      
      <div className="space-y-8">  
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-gray-100 pb-8 last:border-none last:pb-0">
            <div className="flex gap-4">
              {/* Avatar người đánh giá */}
              <AppImage
                src={r.reviewerAvatar}
                alt={r.reviewerName}
                width={56}
                height={56}
                className="rounded-full flex-shrink-0 border-2 border-gray-100"
              />

              <div className="flex-1 min-w-0">
                {/* Tên + ngày + sao */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <p className="font-semibold text-lg">{r.reviewerName}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(r.createdAt), "dd 'tháng' MM, yyyy", { locale: vi })}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < r.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Nội dung bình luận */}
                <p className="mt-4 text-gray-800 leading-relaxed text-base">
                  {r.comment || "Không có nội dung bình luận"}
                </p>

                {r.mediaUrls && r.mediaUrls.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {r.mediaUrls.map((media, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <AppImage
                          src={media.url}
                          alt={`Ảnh đánh giá ${idx + 1}`}
                          width={96}
                          height={96}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}