"use client";

import { useState } from "react";
import { PrimaryButton, PrimaryAlert } from "@/libs/components";
import { Coins } from "lucide-react";
import { topUpAccount } from "@/libs/api/account-api";
import { toast } from "sonner";

interface CampHubCoinProps {
  balance: number;
  isLoading?: boolean;
  onTopUpSuccess?: (newBalance: number) => void;
}

export default function CampHubCoin({
  balance,
  isLoading = false,
  onTopUpSuccess,
}: CampHubCoinProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAlert, setSuccessAlert] = useState<{ visible: boolean; content: string }>({
    visible: false,
    content: "",
  });

  if (isLoading) return <div>Đang tải số dư...</div>;

  const handleTopUp = async () => {
    if (!amount || amount <= 0) {
      toast.error("Vui lòng nhập số xu hợp lệ");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await topUpAccount({ amount });
      const newBalance = response.result.newBalance;

      onTopUpSuccess?.(newBalance);
      setSuccessAlert({
        visible: true,
        content: `Nạp ${amount.toLocaleString("vi-VN")} xu thành công`,
      });
      setAmount("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Nạp xu thất bại, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {successAlert.visible && (
        <PrimaryAlert
          content={successAlert.content}
          type="success"
          duration={3000}
          onClose={() => setSuccessAlert({ visible: false, content: "" })}
        />
      )}

      <h2 className="text-xl font-semibold mb-6">CampHub Xu</h2>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-gray-600">Số dư hiện tại</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {balance.toLocaleString("vi-VN")} Xu
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số xu muốn nạp
            </label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => {
                const val = e.target.value;
                setAmount(val === "" ? "" : Number(val));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập số xu..."
            />
          </div>

          <PrimaryButton
            content={isSubmitting ? "Đang nạp..." : "Nạp xu"}
            className="whitespace-nowrap px-5 sm:mt-6 sm:self-end"
            icon={<Coins size={16} />}
            disabled={isSubmitting || !amount || Number(amount) <= 0}
            onClick={handleTopUp}
          />
        </div>
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
