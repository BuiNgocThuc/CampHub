// app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/libs/stores/cart.store";
import { PrimaryAlert } from "@/libs/components";
import { ShoppingCart } from "lucide-react";
import CartItemList from "./CartItemList";
import CartSummary from "./CartSummary";
import { CartItem } from "@/libs/core/types";

export default function CartPage() {
  const { items, fetchCart, isFetching } = useCartStore();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [alert, setAlert] = useState<{
    visible: boolean;
    content: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    content: "",
    type: "success",
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const availableItems = items.filter((i) => i.isAvailable);
    if (selectedItems.size === availableItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(availableItems.map((i) => i.id)));
    }
  };

  const handleCheckoutSuccess = (bookingsCount: number) => {
    setAlert({
      visible: true,
      content: `Đặt thuê thành công ${bookingsCount} sản phẩm!`,
      type: "success",
    });
    // Xóa các item đã checkout khỏi selected
    setSelectedItems(new Set());
  };

  if (isFetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  return (
    <>
      {alert.visible && (
        <PrimaryAlert
          content={alert.content}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
          duration={3000}
        />
      )}

      {items.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-gray-50 rounded-3xl">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-3">Giỏ hàng trống</h2>
          <a href="/CampHub" className="text-blue-600 font-medium hover:underline">
            ← Tiếp tục mua sắm
          </a>
        </div>
      ) : (

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn ({items.length})</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CartItemList
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            </div>
            <CartSummary
              selectedItems={selectedItems}
              onCheckoutSuccess={handleCheckoutSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}