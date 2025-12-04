// app/profile/RentalHistory.tsx
"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getBookingsByLessee } from "@/libs/api";
import BookingList from "./BookingList";
import { BookingStatus } from "@/libs/core/constants";

const tabs = ["Tất cả", "Chờ xác nhận", "Chờ giao hàng", "Đang thuê", "Đang trả", "Hoàn thành", "Trả hàng / Hoàn tiền"] as const;
type Tab = (typeof tabs)[number];

const statusToTab: Record<BookingStatus, Tab> = {
  PENDING_CONFIRM: "Chờ xác nhận",
  PAID_REJECTED: "Chờ xác nhận",
  WAITING_DELIVERY: "Chờ giao hàng",
  IN_USE: "Đang thuê",
  DUE_FOR_RETURN: "Đang thuê",
  RETURNED_PENDING_CHECK: "Đang trả",
  RETURN_REFUND_REQUESTED: "Đang trả",
  RETURN_REFUND_PROCESSING: "Đang trả",
  WAITING_REFUND: "Đang trả",
  COMPLETED: "Hoàn thành",
  COMPENSATION_COMPLETED: "Hoàn thành",
  DISPUTE_PENDING_REVIEW: "Trả hàng / Hoàn tiền",
  LATE_RETURN: "Trả hàng / Hoàn tiền",
  OVERDUE: "Trả hàng / Hoàn tiền",
  DAMAGED_ITEM: "Trả hàng / Hoàn tiền",
  FORFEITED: "Trả hàng / Hoàn tiền",
};

export default function RentalHistory() {
  const [activeTab, setActiveTab] = useState<Tab>("Tất cả");
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myRentals"],
    queryFn: getBookingsByLessee,
  });

  const filteredBookings = useMemo(() => {
    if (activeTab === "Tất cả") return bookings;
    return bookings.filter(b => statusToTab[b.status] === activeTab);
  }, [bookings, activeTab]);

  if (isLoading) return <div className="py-20 text-center">Đang tải lịch sử thuê...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Lịch sử thuê đồ</h2>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as Tab)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8">
          {tabs.map(tab => {
            const count = tab === "Tất cả" ? bookings.length : bookings.filter(b => statusToTab[b.status] === tab).length;
            return (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-3 px-4 text-sm font-semibold whitespace-nowrap"
              >
                {tab} <span className="ml-2 px-2 py-0.5 bg-gray-300 rounded-full text-xs">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <BookingList bookings={filteredBookings} role="lessee" />
    </div>
  );
}