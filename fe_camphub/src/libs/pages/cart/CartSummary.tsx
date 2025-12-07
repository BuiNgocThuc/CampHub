// app/cart/CartSummary.tsx
"use client";

import { useState, useEffect } from "react";
import { PrimaryButton } from "@/libs/components";
import { useCartStore } from "@/libs/stores/cart.store";
import { useAuthStore } from "@/libs/stores/auth.store";
import { useRouter } from "next/navigation";
import { checkout } from "@/libs/api/booking-api";
import { getAccountById } from "@/libs/api/account-api";
import { removeCartItem } from "@/libs/api/cart-api";
import { Account } from "@/libs/core/types";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCircle2, Loader2, AlertCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

interface CartSummaryProps {
  selectedItems: Set<string>;
  onCheckoutSuccess: (bookingsCount: number) => void;
}

export default function CartSummary({ selectedItems, onCheckoutSuccess }: CartSummaryProps) {
  const { items, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Lấy thông tin account để có coin balance
  useEffect(() => {
    const fetchAccount = async () => {
      if (!user?.id) {
        setLoadingBalance(false);
        return;
      }
      try {
        setLoadingBalance(true);
        const accountData = await getAccountById(user.id);
        setAccount(accountData);
      } catch (error) {
        console.error("Failed to fetch account balance:", error);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchAccount();
  }, [user?.id]);

  // Lọc các item đã được chọn và có sẵn
  const selectedItemsArray = items.filter(
    (i) => selectedItems.has(i.id) && i.isAvailable
  );
  const unavailableSelectedItems = items.filter(
    (i) => selectedItems.has(i.id) && !i.isAvailable
  );

  // Tính tổng tiền thuê (chỉ tính các item đã chọn)
  const totalRental = selectedItemsArray.reduce(
    (s, i) => s + i.price * i.quantity * i.rentalDays,
    0
  );
  // Tính tổng tiền cọc (chỉ tính các item đã chọn)
  const totalDeposit = selectedItemsArray.reduce(
    (s, i) => s + i.depositAmount * i.quantity,
    0
  );
  const grandTotal = totalRental + totalDeposit;

  // Kiểm tra số dư
  const coinBalance = account?.coinBalance || 0;
  const isInsufficientBalance = grandTotal > coinBalance;
  const balanceDifference = grandTotal - coinBalance;

  const tomorrow = addDays(new Date(), 1);
  const tomorrowStr = format(tomorrow, "yyyy-MM-dd");

  const handleCheckout = async () => {
    if (selectedItemsArray.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để đặt thuê");
      return;
    }

    if (unavailableSelectedItems.length > 0) {
      toast.error("Có sản phẩm đã chọn đã hết! Vui lòng bỏ chọn hoặc xóa khỏi giỏ");
      return;
    }

    if (isInsufficientBalance) {
      toast.error(`Số dư không đủ! Cần thêm ${balanceDifference.toLocaleString("vi-VN")}₫`);
      return;
    }

    setIsSubmitting(true);
    try {
      const request = {
        items: selectedItemsArray.map((item) => ({
          cartItemId: item.id,
          startDate: tomorrowStr,
          endDate: format(addDays(tomorrow, item.rentalDays), "yyyy-MM-dd"),
          quantity: item.quantity,
          pricePerDay: item.price,
          depositAmount: item.depositAmount,
          note: `Thuê ${item.rentalDays} ngày từ ngày mai`,
        })),
      };

      const bookings = await checkout(request);


      //  alert thuê thành công
      onCheckoutSuccess(bookings.length);

      const itemIdsToRemove = selectedItemsArray.map((item) => item.id);

      for (const itemId of itemIdsToRemove) {
        try {
          await removeCartItem(itemId);
        } catch (error) {
          console.error(`Failed to remove item ${itemId}:`, error);
        }
      }

      await fetchCart();
    } catch (error: any) {
      toast.error(error.message || "Đặt thuê thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sticky top-6">
      <h3 className="text-2xl font-bold text-center mb-6 text-blue-800">Xác nhận đặt thuê</h3>

      {selectedItemsArray.length === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-5 flex gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-yellow-700 text-sm">Chưa chọn sản phẩm nào</p>
            <p className="text-xs text-yellow-600">Vui lòng chọn sản phẩm bạn muốn đặt thuê</p>
          </div>
        </div>
      )}

      {unavailableSelectedItems.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-700 text-sm">
              {unavailableSelectedItems.length} sản phẩm đã chọn đã hết!
            </p>
            <p className="text-xs text-red-600">Vui lòng bỏ chọn hoặc xóa khỏi giỏ</p>
          </div>
        </div>
      )}

      {/* Cảnh báo số dư không đủ */}
      {isInsufficientBalance && selectedItemsArray.length > 0 ? (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-700 text-sm">Số dư không đủ để thanh toán!</p>
            <p className="text-xs text-red-600">
              Vui lòng nạp thêm {balanceDifference.toLocaleString("vi-VN")}₫ để tiếp tục đặt thuê
            </p>
          </div>
        </div>
      ) : (<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-5 border-2 border-green-200">
        <div className="flex items-center gap-3">
          <Wallet className="text-green-600" size={24} />
          <div>
            <p className="text-sm font-semibold text-green-700">Số dư hiện có</p>
            <p className="text-2xl font-bold text-green-700">
              {loadingBalance ? "..." : coinBalance.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      </div>)}

      <div className="space-y-4 py-5 border-t-2 border-dashed border-gray-300">
        <div className="flex justify-between text-base">
          <span className="text-gray-700">Tổng tiền thuê:</span>
          <span className="font-bold text-gray-900">{totalRental.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-gray-700">Tiền cọc (hoàn lại):</span>
          <span className="font-bold text-orange-600">+{totalDeposit.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-4 border-t-2 border-gray-400">
          <span className="text-gray-900">Tổng thanh toán:</span>
          <span className="text-blue-600">{grandTotal.toLocaleString()}₫</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 text-center border-2 border-blue-200 mb-5">
        <p className="font-semibold text-blue-800 text-sm">Tất cả sản phẩm sẽ được giao vào:</p>
        <p className="text-lg font-bold text-blue-900 mt-2">
          Ngày mai – {format(tomorrow, "EEEE, dd/MM/yyyy", { locale: vi })}
        </p>
      </div>

      <PrimaryButton
        onClick={handleCheckout}
        disabled={
          isSubmitting ||
          selectedItemsArray.length === 0 ||
          isInsufficientBalance ||
          loadingBalance ||
          unavailableSelectedItems.length > 0
        }
        className="w-full py-4 text-lg font-bold shadow-xl mt-5"
        icon={isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
        content={
          loadingBalance
            ? "Đang tải số dư..."
            : isSubmitting
              ? "Đang xử lý..."
              : selectedItemsArray.length === 0
                ? "Chưa chọn sản phẩm"
                : isInsufficientBalance
                  ? "Số dư không đủ"
                  : `Xác nhận đặt thuê ${selectedItemsArray.length} sản phẩm`
        }
      />

      <p className="text-center text-xs text-gray-600 mt-5">
        Chủ đồ sẽ xác nhận trong 24h • Tiền cọc được hoàn lại 100%
      </p>
    </div>
  );
}