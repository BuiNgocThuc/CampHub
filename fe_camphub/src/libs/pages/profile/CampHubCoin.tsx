"use client";

import { PrimaryButton } from "@/libs/components";
import { Coins } from "lucide-react";

interface CampHubCoinProps {
  balance: number;
  isLoading?: boolean;
}

export default function CampHubCoin({ balance, isLoading = false }: CampHubCoinProps) {
  if (isLoading) return <div>Đang tải số dư...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">CampHub Xu</h2>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center justify-between">
        <div>
          <p className="text-gray-600">Số dư hiện tại</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {balance.toLocaleString("vi-VN")} Xu
          </h3>
        </div>
        {/* primary button */}
        <PrimaryButton content="Nạp xu" className="" icon={<Coins size={16} />} />
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Lịch sử giao dịch</h4>
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          Chưa có giao dịch nào.
        </div>
      </div>
    </div>
  );
}
