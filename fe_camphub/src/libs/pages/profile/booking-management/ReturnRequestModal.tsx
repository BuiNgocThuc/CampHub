"use client";

import { useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, CircularProgress } from "@mui/material";
import { AlertCircle, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PrimaryModal, PrimaryButton, CustomizedButton, PrimaryAlert } from "@/libs/components";
import { useCloudinaryUpload } from "@/libs/hooks";
import type { Booking, MediaResource } from "@/libs/core/types";
import { ReasonReturnType } from "@/libs/core/constants";
import { calculateFileHash } from "@/libs/utils";
import { validateImageHash, createReturnRequest } from "@/libs/api";

interface ReturnRequestModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess?: (message: string) => void;
}

export default function ReturnRequestModal({ open, onClose, booking, onSuccess }: ReturnRequestModalProps) {
  const queryClient = useQueryClient();
  const { uploads, uploadFile } = useCloudinaryUpload();

  const [reason, setReason] = useState<ReasonReturnType | "">("");
  const [note, setNote] = useState("");
  const [evidences, setEvidences] = useState<MediaResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [oldImageAlert, setOldImageAlert] = useState<{ visible: boolean }>({ visible: false });

  const mutation = useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      onSuccess?.("Đã gửi yêu cầu trả hàng / hoàn tiền");
      if (!onSuccess) toast.success("Đã gửi yêu cầu trả hàng / hoàn tiền");
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
      queryClient.invalidateQueries({ queryKey: ["pendingReturnRequests"] });
      handleClose();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể gửi yêu cầu trả hàng";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    setReason("");
    setNote("");
    setEvidences([]);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (evidences.length + files.length > 10) {
      toast.error("Tối đa 10 ảnh/video minh chứng");
      return;
    }

    try {
      setIsUploading(true);
      let uploadedCount = 0;
      for (const file of files) {
        // Chỉ hash và validate cho ảnh, không validate video
        if (file.type.startsWith("image")) {
          const fileHash = await calculateFileHash(file);
          const isValid = await validateImageHash(fileHash, booking.itemId);

          // Nếu hash đã tồn tại (ảnh cũ), hiển thị alert
          if (isValid) {
            setOldImageAlert({ visible: true });
            continue; // Bỏ qua file này
          }
        }

        // Upload file (ảnh mới hoặc video)
        const result = await uploadFile(file);
        setEvidences(prev => [
          ...prev,
          {
            url: result.url,
            type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
          } as MediaResource,
        ]);
        uploadedCount++;
      }
      if (uploadedCount > 0) {
        toast.success("Upload minh chứng thành công");
      }
    } catch (err) {
      toast.error("Upload minh chứng thất bại, vui lòng thử lại");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveEvidence = (idx: number) => {
    setEvidences(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!reason) {
      toast.error("Vui lòng chọn lý do trả hàng");
      return;
    }
    if (evidences.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 ảnh/video minh chứng");
      return;
    }

    mutation.mutate({
      bookingId: booking.id,
      reason: reason as ReasonReturnType,
      note: note || undefined,
      evidenceUrls: evidences,
    });
  };

  const uploadingCount = Object.values(uploads).filter(u => u.uploading).length;

  return (
    <PrimaryModal
      open={open}
      onClose={handleClose}
      title="Yêu cầu trả hàng / hoàn tiền"
    >
      <Box sx={{ p: 3, minWidth: 600 }}>
        {/* Thông tin đơn */}
        <Box sx={{ mb: 3, p: 2.5, borderRadius: 2, bgcolor: "#f9fafb" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Đơn hàng
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {booking.itemName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chủ đồ: <strong>{booking.lessorName}</strong>
          </Typography>
        </Box>

        {/* Lý do trả hàng */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Lý do trả hàng <span style={{ color: "red" }}>*</span>
          </Typography>
          <RadioGroup
            value={reason}
            onChange={e => setReason(e.target.value as ReasonReturnType)}
          >
            <FormControlLabel
              value={ReasonReturnType.WRONG_DESCRIPTION}
              control={<Radio />}
              label="Không đúng mô tả sản phẩm"
            />
            <FormControlLabel
              value={ReasonReturnType.MISSING_PARTS}
              control={<Radio />}
              label="Giao thiếu đồ / phụ kiện"
            />
            <FormControlLabel
              value={ReasonReturnType.NO_NEEDED_ANYMORE}
              control={<Radio />}
              label="Không còn nhu cầu sử dụng"
            />
          </RadioGroup>

          <Box sx={{ mt: 1.5, display: "flex", gap: 0.5, alignItems: "center", color: "#6b7280" }}>
            <AlertCircle size={14} />
            <Typography variant="caption">
              Tùy từng lý do, hệ thống có thể trừ điểm uy tín chủ đồ hoặc khóa sản phẩm nếu khiếu nại là đúng.
            </Typography>
          </Box>
        </Box>

        {/* Upload minh chứng */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Hình ảnh / video minh chứng <span style={{ color: "red" }}>*</span>
          </Typography>

          <label htmlFor="return-request-evidence-input">
            <input
              id="return-request-evidence-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={isUploading || uploadingCount > 0}
            />
            <Box
              sx={{
                border: "2px dashed #3b82f6",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: "#eff6ff",
                "&:hover": { bgcolor: "#dbeafe" },
              }}
            >
              {isUploading || uploadingCount > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" color="text.secondary">
                    Đang upload minh chứng...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Upload size={32} className="mx-auto text-blue-600 mb-1" />
                  <Typography variant="body2">
                    Click để upload ảnh/video (tối đa 10) thể hiện rõ vấn đề của sản phẩm
                  </Typography>
                </>
              )}
            </Box>
          </label>

          {/* Preview evidences */}
          {evidences.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 1.5,
              }}
            >
              {evidences.map((ev, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  {ev.type === "VIDEO" ? (
                    <video
                      src={ev.url}
                      controls
                      style={{ width: "100%", height: 120, objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={ev.url}
                      alt="evidence"
                      style={{ width: "100%", height: 120, objectFit: "cover" }}
                    />
                  )}
                  <X
                    onClick={() => handleRemoveEvidence(idx)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 rounded-full px-2 py-1 text-xs shadow"
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Ghi chú thêm */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Ghi chú thêm (không bắt buộc)
          </Typography>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Mô tả chi tiết hơn về vấn đề, ví dụ: hư hỏng, khác màu, thiếu phụ kiện..."
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
            content={mutation.isPending ? "Đang gửi yêu cầu..." : "Gửi yêu cầu trả hàng"}
            onClick={handleSubmit}
            disabled={mutation.isPending || isUploading || uploadingCount > 0}
            icon={mutation.isPending ? <CircularProgress size={18} /> : undefined}
          />
        </Box>
      </Box>

      {oldImageAlert.visible && (
        <PrimaryAlert
          content="Ảnh này đã được sử dụng trước đó. Vui lòng upload ảnh mới để làm minh chứng."
          type="warning"
          duration={3000}
          onClose={() => setOldImageAlert({ visible: false })}
        />
      )}
    </PrimaryModal>
  );
}


