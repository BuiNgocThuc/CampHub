"use client";

import { useState, useMemo, useEffect } from "react";
import { CustomizedButton, Tabs, TabsList, TabsTrigger, PrimaryButton, PrimaryAlert, PrimaryPagination } from "@/libs/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookingsByLessor, lessorConfirmReturnForReturnRequest } from "@/libs/api";
import { MessageSquare } from "lucide-react";
import BookingList from "./BookingList";
import { Booking, ExtensionRequest } from "@/libs/core/types";
import OwnerResponseTrigger from "./booking-management/OwnerResponseTrigger";
import DisputeModal from "./booking-management/DisputeModal";
import ReturnRequestDetailModal from "./booking-management/ReturnRequestDetailModal";
import { BookingStatus, ExtensionStatus } from "@/libs/core/constants";
import { toast } from "sonner";
import { approveExtensionRequest, getAllExtensionRequests, rejectExtensionRequest } from "@/libs/api/extension-request-api";

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
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
    const itemsPerPage = 3;
    const [selectedDisputeBooking, setSelectedDisputeBooking] = useState<Booking | null>(null);
    const [viewReturnRequestBookingId, setViewReturnRequestBookingId] = useState<string | null>(null);
    const [alert, setAlert] = useState<{
        visible: boolean;
        content: string;
        type: "success" | "error" | "warning" | "info";
    }>({
        visible: false,
        content: "",
        type: "success",
    });

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["lessorBookings"],
        queryFn: getBookingsByLessor,
    });

    const confirmReturnMut = useMutation({
        mutationFn: lessorConfirmReturnForReturnRequest,
        onSuccess: () => {
            toast.success("Đã xác nhận nhận lại hàng trả");
            queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
            queryClient.invalidateQueries({ queryKey: ["myRentals"] });
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Không thể xác nhận nhận lại hàng";
            toast.error(msg);
        },
    });

    const handleLessorConfirmReturn = (booking: Booking) => {
        if (confirmReturnMut.isPending) return;
        if (!window.confirm("Xác nhận bạn đã nhận lại đầy đủ đồ từ khách thuê cho đơn này?")) {
            return;
        }
        confirmReturnMut.mutate({ bookingId: booking.id });
    };

    const filteredBookings = useMemo(() => {
        if (activeTab === "Tất cả") return bookings;
        return bookings.filter(b => statusToTab[b.status] === activeTab);
    }, [bookings, activeTab]);

    // Reset to page 1 when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredBookings.slice(startIndex, endIndex);
    }, [filteredBookings, currentPage, itemsPerPage]);

    const handleOwnerResponseSuccess = (isAccept: boolean) => {
        setAlert({
            visible: true,
            content: isAccept ? "Đã chấp nhận đơn thuê thành công!" : "Đã từ chối đơn thuê!",
            type: "success",
        });
    };

    const handleDisputeSuccess = () => {
        setAlert({
            visible: true,
            content: "Gửi khiếu nại thành công",
            type: "success",
        });
    };

    const renderActions = (booking: Booking) => {
        if (booking.status === "PENDING_CONFIRM") {
            return <OwnerResponseTrigger booking={booking} onSuccess={handleOwnerResponseSuccess} />;
        }
        if (["RETURNED_PENDING_CHECK", "RETURN_REFUND_REQUESTED"].includes(booking.status)) {
            return (
                <div className="flex gap-3">
                    <PrimaryButton
                        content={confirmReturnMut.isPending ? "Đang xác nhận..." : "Xác nhận đã nhận lại hàng"}
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleLessorConfirmReturn(booking)}
                        disabled={confirmReturnMut.isPending}
                    />
                    <CustomizedButton
                        content="Khiếu nại"
                        icon={<MessageSquare size={16} />}
                        color="orange"
                        className="active:opacity-50 transition-opacity duration-200"
                        onClick={() => setSelectedDisputeBooking(booking)}
                    />
                </div>
            );
        }
        if (booking.status === BookingStatus.IN_USE) {
            return <LessorExtensionActions booking={booking} />;
        }
        return null;
    };

    if (isLoading) return <div className="py-20 text-center">Đang tải đơn cho thuê...</div>;

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

                <BookingList
                    bookings={paginatedBookings}
                    role="lessor"
                    renderActions={renderActions}
                    onViewReturnRequest={(bookingId) => {
                        console.log("🟢 [RentalOrders] onViewReturnRequest called with bookingId:", bookingId);
                        setViewReturnRequestBookingId(bookingId);
                    }}
                />

                {filteredBookings.length > 0 && (
                    <PrimaryPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

                {selectedDisputeBooking && (
                    <DisputeModal
                        open={!!selectedDisputeBooking}
                        onClose={() => setSelectedDisputeBooking(null)}
                        booking={selectedDisputeBooking}
                        onSuccess={handleDisputeSuccess}
                    />
                )}

                <ReturnRequestDetailModal
                    open={!!viewReturnRequestBookingId}
                    bookingId={viewReturnRequestBookingId}
                    onClose={() => setViewReturnRequestBookingId(null)}
                />
            </div>
        </>
    );
}

interface LessorExtensionActionsProps {
    booking: Booking;
}

function LessorExtensionActions({ booking }: LessorExtensionActionsProps) {
    const queryClient = useQueryClient();

    const { data: extensionRequests = [], isLoading } = useQuery<ExtensionRequest[]>({
        queryKey: ["extensionRequestsByBooking", booking.id],
        queryFn: () => getAllExtensionRequests({ bookingId: booking.id }),
    });

    const pendingReq = extensionRequests.find(r => r.status === ExtensionStatus.PENDING);

    const approveMut = useMutation({
        mutationFn: approveExtensionRequest,
        onSuccess: () => {
            toast.success("Đã đồng ý gia hạn thuê");
            queryClient.invalidateQueries({ queryKey: ["extensionRequestsByBooking", booking.id] });
            queryClient.invalidateQueries({ queryKey: ["extensionRequests"] });
            queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
            queryClient.invalidateQueries({ queryKey: ["myRentals"] });
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Không thể đồng ý gia hạn";
            toast.error(msg);
        },
    });

    const rejectMut = useMutation({
        mutationFn: rejectExtensionRequest,
        onSuccess: () => {
            toast.success("Đã từ chối yêu cầu gia hạn");
            queryClient.invalidateQueries({ queryKey: ["extensionRequestsByBooking", booking.id] });
            queryClient.invalidateQueries({ queryKey: ["extensionRequests"] });
            queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
            queryClient.invalidateQueries({ queryKey: ["myRentals"] });
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Không thể từ chối yêu cầu gia hạn";
            toast.error(msg);
        },
    });

    if (isLoading || !pendingReq) {
        return null;
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 max-w-xs text-right">
                <div className="text-xs text-gray-700">
                    Khách thuê yêu cầu gia hạn đến ngày{" "}
                    <span className="font-semibold">
                        {new Date(pendingReq.requestedNewEndDate).toLocaleDateString("vi-VN")}
                    </span>
                    . Phí thêm:{" "}
                    <span className="font-semibold text-blue-700">
                        {Number(pendingReq.additionalFee).toLocaleString("vi-VN")}₫
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <PrimaryButton
                    content={approveMut.isPending ? "Đang đồng ý..." : "Đồng ý gia hạn"}
                    onClick={() => {
                        if (approveMut.isPending) return;
                        if (window.confirm("Đồng ý gia hạn thuê cho đơn này?")) {
                            approveMut.mutate({ requestId: pendingReq.id });
                        }
                    }}
                    disabled={approveMut.isPending || rejectMut.isPending}
                    className="bg-green-600 hover:bg-green-700"
                />
                <CustomizedButton
                    content={rejectMut.isPending ? "Đang từ chối..." : "Từ chối"}
                    onClick={() => {
                        if (rejectMut.isPending) return;
                        if (window.confirm("Từ chối yêu cầu gia hạn này?")) {
                            rejectMut.mutate({ requestId: pendingReq.id });
                        }
                    }}
                    disabled={approveMut.isPending || rejectMut.isPending}
                    color="#f97316"
                    className="hover:bg-orange-50"
                />
            </div>
        </div>
    );
}