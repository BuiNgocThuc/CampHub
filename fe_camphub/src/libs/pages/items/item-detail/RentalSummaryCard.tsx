"use client";
import { useState } from "react";
import { PrimaryButton } from "@/libs/components";

interface RentalSummaryCardProps {
  pricePerDay: number;
  depositAmount: number;
}

export default function RentalSummaryCard({
  pricePerDay,
  depositAmount,
}: RentalSummaryCardProps) {
  const [days, setDays] = useState(1);
  const total = days * pricePerDay + depositAmount;

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">Tóm tắt thuê</h3>

      <div className="flex justify-between text-gray-600">
        <span>Giá thuê / ngày</span>
        <span>{pricePerDay.toLocaleString()}đ</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Tiền cọc</span>
        <span>{depositAmount.toLocaleString()}đ</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Số ngày</span>
        <input
          type="number"
          value={days}
          min={1}
          onChange={(e) => setDays(parseInt(e.target.value) || 1)}
          className="w-16 border rounded text-center"
        />
      </div>

      <hr />
      <div className="flex justify-between font-semibold text-lg">
        <span>Tổng</span>
        <span>{total.toLocaleString()}đ</span>
      </div>


      <PrimaryButton
        content="Thuê ngay"
        onClick={() => alert("Thuê ngay")}
        className="w-full"
        sx={{ borderRadius: "12px" }}
      />
    </div>
  );
}
