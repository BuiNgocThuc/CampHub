// app/cart/CartSummary.tsx
"use client";

import { useState } from "react";
import { PrimaryButton } from "@/libs/components";
import { useCartStore } from "@/libs/stores/cart.store";
import { useRouter } from "next/navigation";
import { checkout } from "@/libs/api/booking-api";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function CartSummary() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unavailableItems = items.filter(i => !i.isAvailable);
  const validItems = items.filter(i => i.isAvailable);

  const totalRental = validItems.reduce((s, i) => s + i.subtotal, 0);
  const totalDeposit = validItems.reduce((s, i) => s + i.depositAmount, 0);
  const grandTotal = totalRental + totalDeposit;

  // Tính ngày mai ở đây → client-side → an toàn
  const tomorrow = addDays(new Date(), 1);
  const tomorrowStr = format(tomorrow, "yyyy-MM-dd");

  const handleCheckout = async () => {
    if (unavailableItems.length > 0) {
      toast.error("Có sản phẩm đã hết! Vui lòng xóa khỏi giỏ");
      return;
    }

    setIsSubmitting(true);
    try {
      const request = {
        items: validItems.map(item => ({
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
      toast.success(`Đặt thuê thành công ${bookings.length} sản phẩm!`);
      clearCart();
      router.push("/my-bookings?tab=pending");
    } catch (error: any) {
      toast.error(error.message || "Đặt thuê thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sticky top-6">
      <h3 className="text-2xl font-bold text-center mb-6 text-blue-800">Xác nhận đặt thuê</h3>

      {unavailableItems.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-700 text-sm">{unavailableItems.length} sản phẩm đã hết!</p>
            <p className="text-xs text-red-600">Vui lòng xóa để tiếp tục</p>
          </div>
        </div>
      )}

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
        disabled={isSubmitting || validItems.length === 0}
        className="w-full py-4 text-lg font-bold shadow-xl mt-5"
        icon={isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
        content={isSubmitting ? "Đang xử lý..." : "Xác nhận đặt thuê ngay"}
      />

      <p className="text-center text-xs text-gray-600 mt-5">
        Chủ đồ sẽ xác nhận trong 24h • Tiền cọc được hoàn lại 100%
      </p>
    </div>
  );
}