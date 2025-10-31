"use client";

import { PrimaryButton } from "@/components";

interface CartSummaryProps {
  selectedItems: {
    id: number;
    name: string;
    pricePerDay: number;
    days: number;
  }[];
}

export default function CartSummary({ selectedItems }: CartSummaryProps) {
  const total = selectedItems.reduce(
    (sum, item) => sum + item.pricePerDay * item.days,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 h-fit">
      <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Sản phẩm được chọn:</span>
          <span className="font-medium">{selectedItems.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Tổng tiền thuê:</span>
          <span className="font-medium text-gray-900">
            {total.toLocaleString()}₫
          </span>
        </div>
        <div className="flex justify-between">
          <span>Phí đặt cọc:</span>
          <span>–</span>
        </div>
        <div className="flex justify-between">
          <span>Tổng cộng:</span>
          <span className="text-blue-600 font-bold text-lg">
            {total.toLocaleString()}₫
          </span>
        </div>
      </div>

      <PrimaryButton
        content="Tiến hành thanh toán"
        onClick={() => alert("Thanh toán sau")}
        className="mt-6 w-full"
        disabled={selectedItems.length === 0}
      />
    </div>
  );
}
