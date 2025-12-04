// app/cart/CartItemList.tsx
"use client";

import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/libs/stores/cart.store";
import { format, addDays } from "date-fns";
import { AppImage } from "@/libs/components"; //

export default function CartItemList() {
  const { items, updateRentalDays, updateQuantity, removeFromCart, isLoading } = useCartStore();
  const tomorrow = addDays(new Date(), 1);
  const formatDate = (date: Date) => format(date, "dd/MM/yyyy");

  const handleDaysChange = async (id: string, days: number) => {
    const clamped = Math.max(1, Math.min(30, days));
    if (clamped !== days) return;
    await updateRentalDays(id, clamped);
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    const clamped = Math.max(1, quantity);
    if (clamped !== quantity) return;
    await updateQuantity(id, clamped);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 text-2xl font-semibold">Giỏ hàng trống</p>
        <p className="text-gray-500 mt-2">Hãy thêm sản phẩm bạn muốn thuê nhé!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-5">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <ShoppingBag size={28} />
          Sản phẩm trong giỏ hàng ({items.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {items.map((item) => {
          const startDate = tomorrow;
          const endDate = addDays(tomorrow, item.rentalDays);

          return (
            <div
              key={item.id}
              className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 flex flex-col md:flex-row gap-6 group"
            >
              {/* Ảnh sản phẩm + Trạng thái */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                  <AppImage
                    src={item.itemImage}
                    alt={item.itemName}
                    width={128}
                    height={128}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={false}
                  />
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center">
                      <span className="text-white font-bold text-base">Hết hàng</span>
                    </div>
                  )}
                </div>
                {/* Trạng thái hàng */}
                <div className="mt-6 text-center">
                  {item.isAvailable ? (
                    <span className="inline-flex items-center gap-2 px-5 py-1.5 bg-green-100 text-green-700 font-semibold rounded-full text-xs">
                      Còn hàng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-5 py-1.5 bg-red-100 text-red-700 font-semibold rounded-full text-xs">
                      Hết hàng
                    </span>
                  )}
                </div>
              </div>

              {/* Nội dung chính */}
              <div className="flex-1 space-y-4">
                <h4 className="font-bold text-xl text-gray-800 line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {item.itemName}
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Giá thuê/ngày</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {item.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tiền cọc</p>
                    <p className="font-bold text-orange-600 text-lg">
                      {item.depositAmount.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>

                {/* Số lượng sản phẩm */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-green-900">Số lượng:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                      >
                        <Minus size={16} className="text-green-700" />
                      </button>
                      <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                      >
                        <Plus size={16} className="text-green-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Số ngày thuê - bố cục ngang compact */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-blue-900">Số ngày thuê:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDaysChange(item.id, item.rentalDays - 1)}
                          disabled={isLoading || item.rentalDays <= 1}
                          className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                        >
                          <Minus size={16} className="text-blue-700" />
                        </button>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 min-w-[2rem] text-center">
                          {item.rentalDays}
                        </span>
                        <button
                          onClick={() => handleDaysChange(item.id, item.rentalDays + 1)}
                          disabled={isLoading || item.rentalDays >= 30}
                          className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-110 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                        >
                          <Plus size={16} className="text-blue-700" />
                        </button>
                        <span className="text-sm font-semibold text-gray-700">ngày</span>
                      </div>
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <p className="text-gray-600">
                        Nhận: <span className="text-green-600 font-semibold">{formatDate(startDate)}</span>
                      </p>
                      <p className="text-gray-600">
                        Trả: <span className="text-red-600 font-semibold">{formatDate(endDate)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tổng tiền + Xóa */}
              <div className="text-right space-y-4">
                <div>
                  <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                    {item.subtotal.toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tổng tiền thuê</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  <Trash2 size={18} />
                  Xóa khỏi giỏ
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}