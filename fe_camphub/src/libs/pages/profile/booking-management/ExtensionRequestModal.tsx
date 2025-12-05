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
}

export default function ExtensionRequestModal({
  open,
  onClose,
  booking,
}: ExtensionRequestModalProps) {
  const queryClient = useQueryClient();

  const [additionalDays, setAdditionalDays] = useState<number | "">("");
  const [note, setNote] = useState("");

  const mutation = useMutation({
    mutationFn: createExtensionRequest,
    onSuccess: () => {
      toast.success("Đã gửi yêu cầu gia hạn thuê");
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
    setAdditionalDays("");
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
          <TextField
            type="number"
            label="Số ngày muốn gia hạn thêm"
            fullWidth
            value={additionalDays}
            inputProps={{ min: 1 }}
            onChange={e =>
              setAdditionalDays(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Lưu ý: Giá thuê mỗi ngày sẽ tính theo đơn hiện tại. Hệ thống sẽ tính thêm tiền thuê tương ứng.
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


