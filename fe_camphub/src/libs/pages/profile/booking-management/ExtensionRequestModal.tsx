"use client";

import { useState } from "react";
import { Box, Typography, TextField, CircularProgress } from "@mui/material";
import { CalendarClock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PrimaryModal, PrimaryButton, CustomizedButton } from "@/libs/components";
import { createExtensionRequest } from "@/libs/api";
import type { Booking } from "@/libs/core/types";

interface ExtensionRequestModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess?: (message: string) => void;
}

export default function ExtensionRequestModal({
  open,
  onClose,
  booking,
  onSuccess,
}: ExtensionRequestModalProps) {
  const queryClient = useQueryClient();

  const [additionalDays, setAdditionalDays] = useState<number | "">(1);
  const [note, setNote] = useState("");

  const handleAdjustDays = (delta: number) => {
    const current = additionalDays === "" ? 0 : Number(additionalDays);
    const next = Math.max(1, current + delta);
    setAdditionalDays(next);
  };

  const quantity = booking.quantity ?? 1;
  const pricePerDay = booking.pricePerDay ?? 0;
  const additionalDaysNumber = additionalDays === "" ? 0 : Number(additionalDays);
  const rentSubtotal = pricePerDay * quantity * additionalDaysNumber;

  const mutation = useMutation({
    mutationFn: createExtensionRequest,
    onSuccess: () => {
      onSuccess?.("Đã gửi yêu cầu gia hạn thuê");
      if (!onSuccess) {
        toast.success("Đã gửi yêu cầu gia hạn thuê");
      }
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
      queryClient.invalidateQueries({ queryKey: ["extensionRequests"] });
      handleClose();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        "Không thể gửi yêu cầu gia hạn. Có thể đã tồn tại yêu cầu đang chờ xử lý.";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    setAdditionalDays(1);
    setNote("");
    onClose();
  };

  const handleSubmit = () => {
    if (!additionalDays || Number(additionalDays) <= 0) {
      toast.error("Vui lòng nhập số ngày gia hạn hợp lệ");
      return;
    }

    mutation.mutate({
      bookingId: booking.id,
      additionalDays: Number(additionalDays),
      note: note || undefined,
    });
  };

  return (
    <PrimaryModal
      open={open}
      onClose={handleClose}
      title="Yêu cầu gia hạn thuê"
    >
      <Box sx={{ p: 3, minWidth: 500 }}>
        {/* Thông tin đơn thuê */}
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#f9fafb",
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <CalendarClock className="text-blue-600" size={24} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Gia hạn đơn thuê
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {booking.itemName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chủ đồ: <strong>{booking.lessorName}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Số ngày gia hạn */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Số ngày muốn gia hạn thêm
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
              maxWidth: 320,
              bgcolor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              px: 1.5,
              py: 1,
            }}
          >
            <button
              onClick={() => handleAdjustDays(-1)}
              disabled={additionalDaysNumber <= 1}
              className="w-10 h-10 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              –
            </button>
            <input
              type="number"
              min={1}
              value={additionalDays}
              onChange={e => setAdditionalDays(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full text-center text-lg font-semibold bg-transparent outline-none"
            />
            <button
              onClick={() => handleAdjustDays(1)}
              className="w-10 h-10 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
            >
              +
            </button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Lưu ý: Giá thuê mỗi ngày sẽ tính theo đơn hiện tại. Hệ thống sẽ tính thêm tiền thuê tương ứng.
          </Typography>
        </Box>

        {/* Tính tiền dự kiến */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: "#f3f4f6",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Dự kiến phí gia hạn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Giá mỗi ngày: {pricePerDay.toLocaleString("vi-VN")} đ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Số lượng: {quantity} sản phẩm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Số ngày gia hạn: {additionalDaysNumber} ngày
          </Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
            Tạm tính: {rentSubtotal.toLocaleString("vi-VN")} đ
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (Phí gia hạn = giá mỗi ngày x số lượng x số ngày gia hạn)
          </Typography>
        </Box>

        {/* Ghi chú */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Ghi chú cho chủ đồ (không bắt buộc)"
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <CustomizedButton
            content="Hủy"
            color="#9ca3af"
            onClick={handleClose}
          />
          <PrimaryButton
            content={mutation.isPending ? "Đang gửi yêu cầu..." : "Gửi yêu cầu gia hạn"}
            onClick={handleSubmit}
            disabled={mutation.isPending}
            icon={mutation.isPending ? <CircularProgress size={18} /> : undefined}
          />
        </Box>
      </Box>
    </PrimaryModal>
  );
}


