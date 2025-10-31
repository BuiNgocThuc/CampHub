"use client";

import { useState } from "react";
import CartItemList from "./CartItemList";
import CartSummary from "./CartSummary";

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Giỏ hàng của bạn
        </h2>
        <CartItemList onSelectionChange={setSelectedItems} />
      </div>

      <CartSummary selectedItems={selectedItems} />
    </div>
  );
}
