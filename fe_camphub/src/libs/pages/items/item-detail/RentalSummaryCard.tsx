// components/item/RentalSummaryCard.tsx
"use client";

import { useState } from "react";
import { Calendar, Info, ShoppingCart } from "lucide-react";
import { PrimaryButton } from "@/libs/components";
import { toast } from "sonner";
import { useCartStore } from "@/libs/stores/cart.store";
import { CircularProgress } from "@mui/material";

interface RentalSummaryCardProps {
  itemId: string;
  itemName: string;
  pricePerDay: number;
  depositAmount: number;
  itemImage: string;
}

export default function RentalSummaryCard({
  itemId,
  itemName,
  pricePerDay,
  depositAmount,
  itemImage,
}: RentalSummaryCardProps) {
  const [days, setDays] = useState(3); // mặc định 3 ngày
  const { addToCart, isLoading } = useCartStore();

  const totalRental = days * pricePerDay;
  const total = totalRental + depositAmount;

  const handleAddToCart = async () => {
    if (days < 1 || days > 30) {
      toast.error("Số ngày thuê phải từ 1 đến 30 ngày!");
      return;
    }

    try {
      await addToCart(itemId, days, pricePerDay, itemName, itemImage);
      // Toast success đã được xử lý trong store
    } catch (error) {
      // Toast error đã được xử lý trong store
      // Không cần làm gì thêm vì store đã xử lý error
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden sticky top-6">
      {/* Header với gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5">
        <h3 className="text-2xl font-extrabold text-center">Đặt thuê ngay</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Giá thuê/ngày */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold text-base">Giá thuê/ngày</span>
            <span className="font-extrabold text-xl text-blue-600">{pricePerDay.toLocaleString()}₫</span>
          </div>
        </div>

        {/* Tiền cọc */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold text-base">Tiền cọc (hoàn lại)</span>
            <span className="font-extrabold text-xl text-orange-600">+{depositAmount.toLocaleString()}₫</span>
          </div>
        </div>

        {/* Chọn số ngày thuê */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border-2 border-blue-200 shadow-inner">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
              <Calendar className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg text-gray-800">Chọn số ngày thuê:</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5 mb-5">
            {[1, 2, 3, 5, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${days === d
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-offset-2"
                  : "bg-white border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-400 hover:scale-105 text-gray-700"
                  }`}
              >
                {d} ngày
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-5 mb-4">
            <button
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-14 h-14 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white font-bold text-2xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 bg-white text-blue-600"
            >
              −
            </button>
            <div className="text-center">
              <input
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-24 text-4xl font-extrabold text-center border-b-4 border-blue-600 bg-transparent outline-none text-gray-800 focus:border-indigo-600 transition-colors"
              />
              <p className="text-sm text-gray-600 mt-1 font-medium">ngày</p>
            </div>
            <button
              onClick={() => setDays(Math.min(30, days + 1))}
              className="w-14 h-14 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white font-bold text-2xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 bg-white text-blue-600"
            >
              +
            </button>
          </div>

          <div className="bg-white/60 rounded-xl p-3 border border-blue-200">
            <p className="text-sm text-center text-blue-800 font-semibold">
              Nhận đồ: <span className="font-extrabold text-base">ngày mai</span> → Trả trước: <span className="font-extrabold text-base">{days} ngày sau</span>
            </p>
          </div>
        </div>

      </div>

      {/* Tổng tiền */}
      <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold">Tổng thanh toán</span>
            <span className="text-3xl font-extrabold">{total.toLocaleString()}₫</span>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-95 bg-white/10 rounded-lg px-3 py-2">
            <Info size={16} className="flex-shrink-0" />
            <span className="font-medium">
              {totalRental.toLocaleString()}₫ thuê + {depositAmount.toLocaleString()}₫ cọc
            </span>
          </div>
        </div>

        <PrimaryButton
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full mt-6 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          icon={isLoading ? <CircularProgress size={24} color="inherit" /> : <ShoppingCart size={24} />}
          content={isLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
        />

        <p className="text-center text-xs text-gray-500 leading-relaxed">
          Chủ đồ sẽ xác nhận trong 24h • Tiền cọc hoàn lại 100%
        </p>
      </div>
    </div>
  );
}