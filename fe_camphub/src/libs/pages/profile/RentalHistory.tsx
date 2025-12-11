// app/profile/RentalHistory.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, PrimaryButton, CustomizedButton, PrimaryAlert, PrimaryConfirmation } from "@/libs/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookingsByLessee, confirmReceived } from "@/libs/api";
import BookingList from "./BookingList";
import { BookingStatus, ExtensionStatus } from "@/libs/core/constants";
import type { Booking, ExtensionRequest } from "@/libs/core/types";
import { toast } from "sonner";
import ReturnItemModal from "./booking-management/ReturnItemModal";
import ExtensionRequestModal from "./booking-management/ExtensionRequestModal";
import ReturnRequestModal from "./booking-management/ReturnRequestModal";
import ReturnRequestDetailModal from "./booking-management/ReturnRequestDetailModal";
import ReviewModal from "./booking-management/ReviewModal";
import { getAllExtensionRequests, cancelExtensionRequest } from "@/libs/api/extension-request-api";

const tabs = ["Tất cả", "Chờ xác nhận", "Chờ giao hàng", "Đang thuê", "Đến hạn trả", "Đang trả", "Hoàn thành", "Khiếu nại"] as const;
type Tab = (typeof tabs)[number];

const statusToTab: Record<BookingStatus, Tab> = {
  PENDING_CONFIRM: "Chờ xác nhận",
  PAID_REJECTED: "Chờ xác nhận",
  WAITING_DELIVERY: "Chờ giao hàng",
  IN_USE: "Đang thuê",
  DUE_FOR_RETURN: "Đến hạn trả",
  LATE_RETURN: "Đến hạn trả",
  OVERDUE: "Đến hạn trả",
  RETURNED_PENDING_CHECK: "Đang trả",
  RETURN_REFUND_REQUESTED: "Đang trả",
  RETURN_REFUND_PROCESSING: "Đang trả",
  WAITING_REFUND: "Đang trả",
  COMPLETED: "Hoàn thành",
  COMPENSATION_COMPLETED: "Hoàn thành",
  DISPUTE_PENDING_REVIEW: "Khiếu nại",
  DAMAGED_ITEM: "Khiếu nại",
  FORFEITED: "Khiếu nại",
};

export default function RentalHistory() {
  const [activeTab, setActiveTab] = useState<Tab>("Tất cả");
  const [alert, setAlert] = useState<{ visible: boolean; content: string; type: "success" | "error"; duration?: number } | null>(null);
  const queryClient = useQueryClient();
  const [selectedReturnBooking, setSelectedReturnBooking] = useState<Booking | null>(null);
  const [selectedReturnRequestBooking, setSelectedReturnRequestBooking] = useState<Booking | null>(null);
  const [selectedExtensionBooking, setSelectedExtensionBooking] = useState<Booking | null>(null);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<Booking | null>(null);
  const [viewReturnRequestBookingId, setViewReturnRequestBookingId] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myRentals"],
    queryFn: getBookingsByLessee,
  });

  const confirmReceivedMut = useMutation({
    mutationFn: confirmReceived,
    onSuccess: () => {
      setAlert({ visible: true, content: "Đã xác nhận đã nhận hàng", type: "success", duration: 3000 });
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

    // Khi đến hạn trả
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

    // Khi đang thuê: cho phép khách yêu cầu gia hạn
    if (booking.status === BookingStatus.IN_USE) {
      return (
        <LesseeExtensionActions
          booking={booking}
          onOpenExtensionModal={() => setSelectedExtensionBooking(booking)}
        />
      );
    }

    // Khi đã hoàn thành: nếu đã review -> Thuê lại, nếu chưa -> Đánh giá
    if (booking.status === BookingStatus.COMPLETED) {
      const hasReviewed = booking.hasReviewed ?? false;
      return (
        <div className="flex flex-wrap gap-3 justify-end">
          {hasReviewed ? (
            <Link href={`/items/${booking.itemId}`}>
              <PrimaryButton content="Thuê lại" />
            </Link>
          ) : (
            <CustomizedButton
              content="Đánh giá sản phẩm"
              onClick={() => setSelectedReviewBooking(booking)}
            />
          )}
        </div>
      );
    }

    return null;
  };

  if (isLoading) return <div className="py-20 text-center">Đang tải lịch sử thuê...</div>;

  return (
    <div>
      {alert?.visible && (
        <PrimaryAlert
          content={alert.content}
          type={alert.type}
          duration={alert.duration ?? 3000}
          onClose={() => setAlert(null)}
        />
      )}

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

      <BookingList
        bookings={filteredBookings}
        role="lessee"
        renderActions={renderActions}
        onViewReturnRequest={bookingId => setViewReturnRequestBookingId(bookingId)}
      />

      {selectedReturnBooking && (
        <ReturnItemModal
          open={!!selectedReturnBooking}
          onClose={() => setSelectedReturnBooking(null)}
          booking={selectedReturnBooking}
          onSuccess={message => {
            setAlert({ visible: true, content: message, type: "success", duration: 3000 });
            setSelectedReturnBooking(null);
          }}
        />
      )}

      {selectedReturnRequestBooking && (
        <ReturnRequestModal
          open={!!selectedReturnRequestBooking}
          onClose={() => setSelectedReturnRequestBooking(null)}
          booking={selectedReturnRequestBooking}
          onSuccess={message => {
            setAlert({ visible: true, content: message, type: "success", duration: 3000 });
            setSelectedReturnRequestBooking(null);
          }}
        />
      )}

      {selectedExtensionBooking && (
        <ExtensionRequestModal
          open={!!selectedExtensionBooking}
          onClose={() => setSelectedExtensionBooking(null)}
          booking={selectedExtensionBooking}
          onSuccess={message => {
            setAlert({ visible: true, content: message, type: "success", duration: 3000 });
          }}
        />
      )}

      {selectedReviewBooking && (
        <ReviewModal
          open={!!selectedReviewBooking}
          onClose={() => setSelectedReviewBooking(null)}
          booking={selectedReviewBooking}
          onSuccess={() => {
            setAlert({ visible: true, content: "Đánh giá sản phẩm thành công", type: "success", duration: 3000 });
            setSelectedReviewBooking(null);
          }}
        />
      )}

      <ReturnRequestDetailModal
        open={!!viewReturnRequestBookingId}
        bookingId={viewReturnRequestBookingId}
        onClose={() => setViewReturnRequestBookingId(null)}
      />
    </div>
  );
}

interface LesseeExtensionActionsProps {
  booking: Booking;
  onOpenExtensionModal: () => void;
}

function LesseeExtensionActions({ booking, onOpenExtensionModal }: LesseeExtensionActionsProps) {
  const queryClient = useQueryClient();
  const [showHistory, setShowHistory] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: extensionRequests = [], isLoading } = useQuery<ExtensionRequest[]>({
    queryKey: ["extensionRequestsByBooking", booking.id],
    queryFn: () => getAllExtensionRequests({ bookingId: booking.id }),
  });

  const sortedReqs = [...extensionRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latestReq = sortedReqs[0];
  const pendingReq = sortedReqs.find(r => r.status === ExtensionStatus.PENDING);
  const hasAnyRequest = sortedReqs.length > 0;

  const statusClass = (status: ExtensionStatus) => {
    if (status === ExtensionStatus.APPROVED) return "text-green-600";
    if (status === ExtensionStatus.REJECTED) return "text-red-600";
    if (status === ExtensionStatus.PENDING) return "text-blue-600";
    return "text-gray-600";
  };

  const cancelMut = useMutation({
    mutationFn: (requestId: string) => cancelExtensionRequest(requestId),
    onSuccess: () => {
      toast.success("Đã hủy yêu cầu gia hạn");
      queryClient.invalidateQueries({ queryKey: ["extensionRequestsByBooking", booking.id] });
      queryClient.invalidateQueries({ queryKey: ["extensionRequests"] });
      setShowCancelConfirm(false);
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

  // Chưa có yêu cầu đang chờ
  if (!pendingReq) {
    return (
      <div className="flex flex-col items-end gap-2">
        {latestReq && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-xs text-right">
            <div className="text-xs text-gray-700">
              Yêu cầu gia hạn gần nhất đến ngày{" "}
              <span className="font-semibold">
                {new Date(latestReq.requestedNewEndDate).toLocaleDateString("vi-VN")}
              </span>
              .
            </div>
            <div className="text-xs font-semibold mt-1">
              Trạng thái:{" "}
              <span className={statusClass(latestReq.status)}>
                {latestReq.status === ExtensionStatus.APPROVED
                  ? "Đã chấp nhận"
                  : latestReq.status === ExtensionStatus.REJECTED
                    ? "Đã từ chối"
                    : latestReq.status}
              </span>
            </div>
            {latestReq.note && (
              <div className="text-xs text-gray-600 mt-1">
                Ghi chú: <span className="italic">{latestReq.note}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end">
          <CustomizedButton
            content="Gia hạn thuê"
            onClick={onOpenExtensionModal}
          />
        </div>

        {hasAnyRequest && (
          <button
            className="text-xs text-blue-600 hover:underline mt-1"
            onClick={() => setShowHistory(prev => !prev)}
          >
            {showHistory ? "Ẩn lịch sử gia hạn" : "Xem lịch sử gia hạn"}
          </button>
        )}

        {showHistory && (
          <div className="w-full max-w-md border border-gray-200 rounded-lg bg-white shadow-sm p-3">
            <div className="text-sm font-semibold mb-2">Lịch sử yêu cầu gia hạn</div>
            <div className="flex flex-col gap-2 max-h-60 overflow-auto pr-1">
              {sortedReqs.map(req => (
                <div
                  key={req.id}
                  className="border border-gray-100 rounded-md px-3 py-2 bg-gray-50"
                >
                  <div className="text-xs text-gray-700">
                    Đến ngày{" "}
                    <span className="font-semibold">
                      {new Date(req.requestedNewEndDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="text-xs">
                    Trạng thái:{" "}
                    <span className={`font-semibold ${statusClass(req.status)}`}>
                      {req.status === ExtensionStatus.APPROVED
                        ? "Đã chấp nhận"
                        : req.status === ExtensionStatus.REJECTED
                          ? "Đã từ chối"
                          : req.status === ExtensionStatus.PENDING
                            ? "Đang chờ duyệt"
                            : req.status}
                    </span>
                  </div>
                  {req.note && (
                    <div className="text-xs text-gray-600">
                      Ghi chú: <span className="italic">{req.note}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-gray-500 mt-1">
                    Gửi lúc: {new Date(req.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Đã có yêu cầu đang PENDING: hiển thị thông tin + nút hủy
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 max-w-xs text-right">
        <div className="text-xs text-gray-700">
          Bạn đã gửi yêu cầu gia hạn đến ngày{" "}
          <span className="font-semibold">
            {new Date(pendingReq.requestedNewEndDate).toLocaleDateString("vi-VN")}
          </span>
          . Đang chờ chủ đồ phản hồi.
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CustomizedButton
          color="red"
          content={cancelMut.isPending ? "Đang hủy..." : "Hủy yêu cầu gia hạn"}
          onClick={() => setShowCancelConfirm(true)}
          disabled={cancelMut.isPending}
        />
        {hasAnyRequest && (
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => setShowHistory(prev => !prev)}
          >
            {showHistory ? "Ẩn lịch sử gia hạn" : "Xem lịch sử gia hạn"}
          </button>
        )}
      </div>

      {showHistory && (
        <div className="w-full border border-gray-200 rounded-lg bg-white shadow-sm p-3">
          <div className="text-sm font-semibold mb-2">Lịch sử yêu cầu gia hạn</div>
          <div className="flex flex-col gap-2 max-h-60 overflow-auto pr-1">
            {sortedReqs.map(req => (
              <div
                key={req.id}
                className="border border-gray-100 rounded-md px-3 py-2 bg-gray-50"
              >
                <div className="text-xs text-gray-700">
                  Đến ngày{" "}
                  <span className="font-semibold">
                    {new Date(req.requestedNewEndDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="text-xs">
                  Trạng thái:{" "}
                  <span className={`font-semibold ${statusClass(req.status)}`}>
                    {req.status === ExtensionStatus.APPROVED
                      ? "Đã chấp nhận"
                      : req.status === ExtensionStatus.REJECTED
                        ? "Đã từ chối"
                        : req.status === ExtensionStatus.PENDING
                          ? "Đang chờ duyệt"
                          : req.status}
                  </span>
                </div>
                {req.note && (
                  <div className="text-xs text-gray-600">
                    Ghi chú: <span className="italic">{req.note}</span>
                  </div>
                )}
                <div className="text-[11px] text-gray-500 mt-1">
                  Gửi lúc: {new Date(req.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PrimaryConfirmation
        open={showCancelConfirm}
        title="Hủy yêu cầu gia hạn"
        message="Bạn có chắc muốn hủy yêu cầu gia hạn này? Bạn sẽ cần gửi lại yêu cầu mới nếu muốn gia hạn tiếp."
        confirmText="Hủy yêu cầu"
        confirmColor="#ef4444"
        loading={cancelMut.isPending}
        onConfirm={() => cancelMut.mutate(pendingReq.id)}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}