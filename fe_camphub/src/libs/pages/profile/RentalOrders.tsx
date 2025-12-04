"use client";

import { useState, useMemo } from "react";
import { CustomizedButton, Tabs, TabsList, TabsTrigger } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getBookingsByLessor } from "@/libs/api";
import { PrimaryButton } from "@/libs/components";
import { MessageSquare } from "lucide-react";
import BookingList from "./BookingList";
import { Booking } from "@/libs/core/types";
import OwnerResponseTrigger from "./booking-management/OwnerResponseTrigger";
import { BookingStatus } from "@/libs/core/constants";

const tabs = ["Tất cả", "Chờ xác nhận", "Đã từ chối", "Chờ giao hàng", "Đang cho thuê", "Chờ nhận lại đồ", "Hoàn thành", "Khiếu nại"] as const;
type Tab = (typeof tabs)[number];

const statusToTab: Record<BookingStatus, Tab> = {
    PENDING_CONFIRM: "Chờ xác nhận",
    PAID_REJECTED: "Đã từ chối",
    WAITING_DELIVERY: "Chờ giao hàng",
    IN_USE: "Đang cho thuê",
    DUE_FOR_RETURN: "Chờ nhận lại đồ",
    RETURNED_PENDING_CHECK: "Chờ nhận lại đồ",
    RETURN_REFUND_REQUESTED: "Chờ nhận lại đồ",
    RETURN_REFUND_PROCESSING: "Chờ nhận lại đồ",
    WAITING_REFUND: "Chờ nhận lại đồ",
    COMPLETED: "Hoàn thành",
    COMPENSATION_COMPLETED: "Hoàn thành",
    DISPUTE_PENDING_REVIEW: "Khiếu nại",
    LATE_RETURN: "Khiếu nại",
    OVERDUE: "Khiếu nại",
    DAMAGED_ITEM: "Khiếu nại",
    FORFEITED: "Khiếu nại",
};

export default function RentalOrders() {
    const [activeTab, setActiveTab] = useState<Tab>("Tất cả");
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["lessorBookings"],
        queryFn: getBookingsByLessor,
    });

    const filteredBookings = useMemo(() => {
        if (activeTab === "Tất cả") return bookings;
        return bookings.filter(b => statusToTab[b.status] === activeTab);
    }, [bookings, activeTab]);

    const renderActions = (booking: Booking) => {
        if (booking.status === "PENDING_CONFIRM") {
            return <OwnerResponseTrigger booking={booking} />;
        }
        if (["RETURNED_PENDING_CHECK", "RETURN_REFUND_REQUESTED"].includes(booking.status)) {
            return (
                <div className="flex gap-3">
                    <PrimaryButton content="Xác nhận" className="bg-blue-600 hover:bg-blue-700" />
                    <CustomizedButton content="Khiếu nại" icon={<MessageSquare size={16} />} color="orange" className="hover:bg-orange-50" />
                </div>
            );
        }
        return null;
    };

    if (isLoading) return <div className="py-20 text-center">Đang tải đơn cho thuê...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Đơn cho thuê của tôi</h2>

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

            <BookingList bookings={filteredBookings} role="lessor" renderActions={renderActions} />
        </div>
    );
}