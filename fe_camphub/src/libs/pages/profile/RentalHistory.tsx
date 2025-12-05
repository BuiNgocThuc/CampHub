// app/profile/RentalHistory.tsx
"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, PrimaryButton, CustomizedButton } from "@/libs/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookingsByLessee, confirmReceived } from "@/libs/api";
import BookingList from "./BookingList";
import { BookingStatus, ExtensionStatus } from "@/libs/core/constants";
import type { Booking, ExtensionRequest } from "@/libs/core/types";
import { toast } from "sonner";
import ReturnItemModal from "./booking-management/ReturnItemModal";
import ExtensionRequestModal from "./booking-management/ExtensionRequestModal";
import ReturnRequestModal from "./booking-management/ReturnRequestModal";
import ReviewModal from "./booking-management/ReviewModal";
import { getAllExtensionRequests, cancelExtensionRequest } from "@/libs/api/extension-request-api";

const tabs = ["Tất cả", "Chờ xác nhận", "Chờ giao hàng", "Đang thuê", "Đến hạn trả", "Đang trả", "Hoàn thành", "Trả hàng / Hoàn tiền"] as const;
type Tab = (typeof tabs)[number];

const statusToTab: Record<BookingStatus, Tab> = {
  PENDING_CONFIRM: "Chờ xác nhận",
  PAID_REJECTED: "Chờ xác nhận",
  WAITING_DELIVERY: "Chờ giao hàng",
  IN_USE: "Đang thuê",
  DUE_FOR_RETURN: "Đến hạn trả",
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
  const queryClient = useQueryClient();
  const [selectedReturnBooking, setSelectedReturnBooking] = useState<Booking | null>(null);
  const [selectedReturnRequestBooking, setSelectedReturnRequestBooking] = useState<Booking | null>(null);
  const [selectedExtensionBooking, setSelectedExtensionBooking] = useState<Booking | null>(null);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myRentals"],
    queryFn: getBookingsByLessee,
  });

  const confirmReceivedMut = useMutation({
    mutationFn: confirmReceived,
    onSuccess: () => {
      toast.success("Đã xác nhận đã nhận hàng");
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể xác nhận nhận hàng";
      toast.error(msg);
    },
  });

  const handleConfirmReceived = (bookingId: string) => {
    if (confirmReceivedMut.isPending) return;
    confirmReceivedMut.mutate(bookingId);
  };

  const filteredBookings = useMemo(() => {
    if (activeTab === "Tất cả") return bookings;
    return bookings.filter(b => statusToTab[b.status] === activeTab);
  }, [bookings, activeTab]);

  const renderActions = (booking: Booking) => {
    // Khi đang chờ giao hàng: cho phép khách xác nhận đã nhận & gửi yêu cầu trả hàng
    if (booking.status === BookingStatus.WAITING_DELIVERY) {
      return (
        <div className="flex flex-wrap gap-3 justify-end">
          <PrimaryButton
            content={confirmReceivedMut.isPending ? "Đang xác nhận..." : "Xác nhận đã nhận hàng"}
            onClick={() => handleConfirmReceived(booking.id)}
            disabled={confirmReceivedMut.isPending}
          />
          <CustomizedButton
            content="Yêu cầu trả hàng / hoàn tiền"
            onClick={() => setSelectedReturnRequestBooking(booking)}
          />
        </div>
      );
    }

    // Khi đến hạn trả: cho phép khách mở form trả đồ
    if (booking.status === BookingStatus.DUE_FOR_RETURN) {
      return (
        <div className="flex flex-wrap gap-3 justify-end">
          <PrimaryButton
            content="Trả đồ"
            onClick={() => setSelectedReturnBooking(booking)}
          />
        </div>
      );
    }

    // Khi đang thuê: cho phép khách làm việc với yêu cầu gia hạn
    if (booking.status === BookingStatus.IN_USE) {
      return (
        <LesseeExtensionActions
          booking={booking}
          onOpenExtensionModal={() => setSelectedExtensionBooking(booking)}
        />
      );
    }

    // Khi đã hoàn thành: cho phép khách đánh giá sản phẩm
    if (booking.status === BookingStatus.COMPLETED) {
      return (
        <div className="flex flex-wrap gap-3 justify-end">
          <CustomizedButton
            content="Đánh giá sản phẩm"
            onClick={() => setSelectedReviewBooking(booking)}
          />
        </div>
      );
    }

    return null;
  };

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

      <BookingList bookings={filteredBookings} role="lessee" renderActions={renderActions} />

      {selectedReturnBooking && (
        <ReturnItemModal
          open={!!selectedReturnBooking}
          onClose={() => setSelectedReturnBooking(null)}
          booking={selectedReturnBooking}
        />
      )}

      {selectedReturnRequestBooking && (
        <ReturnRequestModal
          open={!!selectedReturnRequestBooking}
          onClose={() => setSelectedReturnRequestBooking(null)}
          booking={selectedReturnRequestBooking}
        />
      )}

      {selectedExtensionBooking && (
        <ExtensionRequestModal
          open={!!selectedExtensionBooking}
          onClose={() => setSelectedExtensionBooking(null)}
          booking={selectedExtensionBooking}
        />
      )}

      {selectedReviewBooking && (
        <ReviewModal
          open={!!selectedReviewBooking}
          onClose={() => setSelectedReviewBooking(null)}
          booking={selectedReviewBooking}
        />
      )}
    </div>
  );
}

interface LesseeExtensionActionsProps {
  booking: Booking;
  onOpenExtensionModal: () => void;
}

function LesseeExtensionActions({ booking, onOpenExtensionModal }: LesseeExtensionActionsProps) {
  const queryClient = useQueryClient();

  const { data: extensionRequests = [], isLoading } = useQuery<ExtensionRequest[]>({
    queryKey: ["extensionRequestsByBooking", booking.id],
    queryFn: () => getAllExtensionRequests({ bookingId: booking.id }),
  });

  const pendingReq = extensionRequests.find(r => r.status === ExtensionStatus.PENDING);

  const cancelMut = useMutation({
    mutationFn: (requestId: string) => cancelExtensionRequest(requestId),
    onSuccess: () => {
      toast.success("Đã hủy yêu cầu gia hạn");
      queryClient.invalidateQueries({ queryKey: ["extensionRequestsByBooking", booking.id] });
      queryClient.invalidateQueries({ queryKey: ["extensionRequests"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể hủy yêu cầu gia hạn";
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-end text-xs text-gray-500">
        Đang kiểm tra yêu cầu gia hạn...
      </div>
    );
  }

  // Chưa có yêu cầu đang chờ → cho phép tạo mới
  if (!pendingReq) {
    return (
      <div className="flex flex-wrap gap-3 justify-end">
        <CustomizedButton
          content="Gia hạn thuê"
          onClick={onOpenExtensionModal}
        />
      </div>
    );
  }

  // Đã có yêu cầu đang PENDING → hiển thị thông tin + nút hủy
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 max-w-xs text-right">
        <div className="text-xs text-gray-700">
          Bạn đã gửi yêu cầu gia hạn đến ngày{" "}
          <span className="font-semibold">
            {new Date(pendingReq.requestedNewEndDate).toLocaleDateString("vi-VN")}
          </span>
          . Đang chờ chủ đồ phản hồi.
        </div>
      </div>
      <CustomizedButton
        content={cancelMut.isPending ? "Đang hủy..." : "Hủy yêu cầu gia hạn"}
        onClick={() => {
          if (
            window.confirm(
              "Bạn có chắc muốn hủy yêu cầu gia hạn này? Bạn sẽ cần gửi lại yêu cầu mới nếu muốn gia hạn tiếp."
            )
          ) {
            cancelMut.mutate(pendingReq.id);
          }
        }}
        disabled={cancelMut.isPending}
      />
    </div>
  );
}