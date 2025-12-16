"use client";

import { useMemo } from "react";
import { Box, Typography, Chip, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Image as ImageIcon, Video, AlertCircle } from "lucide-react";

import { PrimaryModal } from "@/libs/components";
import { getReturnRequestByBooking } from "@/libs/api/return-request-api";
import { ReturnRequestStatus, ReasonReturnType } from "@/libs/core/constants";
import { ReturnRequest } from "@/libs/core/types";

interface ReturnRequestDetailModalProps {
  open: boolean;
  bookingId: string | null;
  onClose: () => void;
}

const statusLabel: Record<ReturnRequestStatus, string> = {
  [ReturnRequestStatus.PENDING]: "Đang chờ duyệt",
  [ReturnRequestStatus.PROCESSING]: "Đang xử lý",
  [ReturnRequestStatus.APPROVED]: "Đã chấp nhận",
  [ReturnRequestStatus.REJECTED]: "Đã từ chối",
  [ReturnRequestStatus.AUTO_REFUNDED]: "Tự động hoàn tiền",
  [ReturnRequestStatus.RESOLVED]: "Đã hoàn tất",
  [ReturnRequestStatus.CLOSED_BY_DISPUTE]: "Đã đóng do khiếu nại",
};

const statusColor: Record<ReturnRequestStatus, string> = {
  [ReturnRequestStatus.PENDING]: "default",
  [ReturnRequestStatus.PROCESSING]: "info",
  [ReturnRequestStatus.APPROVED]: "success",
  [ReturnRequestStatus.REJECTED]: "error",
  [ReturnRequestStatus.AUTO_REFUNDED]: "warning",
  [ReturnRequestStatus.RESOLVED]: "success",
  [ReturnRequestStatus.CLOSED_BY_DISPUTE]: "default",
};

export default function ReturnRequestDetailModal({ open, bookingId, onClose }: ReturnRequestDetailModalProps) {
  const isEnabled = open && !!bookingId;

  const { data, isLoading, isError, error } = useQuery<ReturnRequest>({
    enabled: isEnabled,
    queryKey: ["returnRequestDetail", bookingId],
    queryFn: () => getReturnRequestByBooking(bookingId!),
    staleTime: 0,
    retry: false,
  });

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CircularProgress size={18} />
          <span>Đang tải yêu cầu hoàn tiền...</span>
        </div>
      );
    }
    if (isError || !data) {
      return (
        <div className="flex flex-col gap-2 text-sm text-red-600">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>Không thể tải chi tiết yêu cầu hoàn tiền.</span>
          </div>
          {error && (
            <Typography variant="caption" color="error">
              {String(error)}
            </Typography>
          )}
        </div>
      );
    }
    if (!data) return null;

    const rawStatus = data.status as unknown;
    const normalizedStatus = typeof rawStatus === 'string'
      ? rawStatus.toUpperCase()
      : String(rawStatus);
    const statusKey = normalizedStatus as unknown as ReturnRequestStatus;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Chip
            label={statusLabel[statusKey] ?? normalizedStatus}
            color={(statusColor[statusKey] ?? "default") as any}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            Gửi lúc: {new Date(data.createdAt).toLocaleString("vi-VN")}
          </Typography>
        </div>

        <Box sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2, bgcolor: "#f9fafb" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Lý do
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {reasonLabel(data.reason)}
          </Typography>
          {data.note && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ghi chú: <span className="italic">{data.note}</span>
            </Typography>
          )}
        </Box>

        {data.evidenceUrls?.length > 0 && (
          <div>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Minh chứng ({data.evidenceUrls.length})
            </Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {data.evidenceUrls.map((ev, idx) => (
                <div
                  key={idx}
                  className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                >
                  {ev.type === "VIDEO" ? (
                    <video src={ev.url} controls className="w-full h-32 object-cover" />
                  ) : (
                    <img src={ev.url} alt={`evidence-${idx}`} className="w-full h-32 object-cover" />
                  )}
                  <div className="absolute top-1 left-1 bg-white/80 rounded px-1 py-[2px] text-[10px] flex items-center gap-1 text-gray-700">
                    {ev.type === "VIDEO" ? <Video size={12} /> : <ImageIcon size={12} />} {ev.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }, [data, isError, isLoading]);

  return (
    <PrimaryModal open={open} onClose={onClose} title="Chi tiết yêu cầu hoàn tiền / trả hàng">
      <Box sx={{ p: 3, minWidth: 520 }}>{content}</Box>
    </PrimaryModal>
  );
}

function reasonLabel(reason: ReasonReturnType) {
  switch (reason) {
    case ReasonReturnType.WRONG_DESCRIPTION:
      return "Không đúng mô tả sản phẩm";
    case ReasonReturnType.MISSING_PARTS:
      return "Giao thiếu đồ / phụ kiện";
    case ReasonReturnType.NO_NEEDED_ANYMORE:
      return "Không còn nhu cầu sử dụng";
    default:
      return reason;
  }
}

