// app/cart/page.tsx
"use client";

import { useEffect } from "react";
import { useCartStore } from "@/libs/stores/cart.store";

import { ShoppingCart } from "lucide-react";
import CartItemList from "./CartItemList";
import CartSummary from "./CartSummary";

export default function CartPage() {
  const { items, fetchCart, isFetching } = useCartStore();

  useEffect(() => {
    fetchCart(); // Gọi API thật khi vào trang
  }, [fetchCart]);

  if (isFetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-gray-50 rounded-3xl">
        <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Giỏ hàng trống</h2>
        <a href="/CampHub" className="text-blue-600 font-medium hover:underline">
          ← Tiếp tục mua sắm
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CartItemList />
        </div>
        <CartSummary />
      </div>
    </div>
  );
}