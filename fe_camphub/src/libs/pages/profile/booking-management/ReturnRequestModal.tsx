"use client";

import { useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, CircularProgress } from "@mui/material";
import { AlertCircle, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PrimaryModal, PrimaryButton, CustomizedButton, PrimaryAlert } from "@/libs/components";
import type { Booking } from "@/libs/core/types";
import { MediaType, ReasonReturnType } from "@/libs/core/constants";
import { calculateFileHash, isFileSizeValid, isFileTypeAllowed, uploadMedia } from "@/libs/utils";
import { validateImageHash, createReturnRequest } from "@/libs/api";

interface ReturnRequestModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess?: (message: string) => void;
}

interface PendingFile {
  file: File;
  hash: string;
  preview: string;
  type: "IMAGE" | "VIDEO";
}

export default function ReturnRequestModal({ open, onClose, booking, onSuccess }: ReturnRequestModalProps) {
  const queryClient = useQueryClient();

  const [reason, setReason] = useState<ReasonReturnType | "">("");
  const [note, setNote] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => {
    setAlert({ content, type, duration });
  };

  const mutation = useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      onSuccess?.("Đã gửi yêu cầu trả hàng / hoàn tiền");
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
      queryClient.invalidateQueries({ queryKey: ["pendingReturnRequests"] });
      handleClose();
      // Gọi callback để hiển thị alert ở parent component

    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể gửi yêu cầu trả hàng";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    setReason("");
    setNote("");
    setPendingFiles([]);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (pendingFiles.length + files.length > 10) {
      showAlert("Tối đa 10 ảnh/video minh chứng", "error");
      return;
    }

    const newFiles: PendingFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!isFileTypeAllowed(file)) {
        showAlert(`File ${file.name} sai định dạng`, "error");
        continue;
      }
      if (!isFileSizeValid(file, 10)) {
        showAlert(`File ${file.name} quá lớn`, "error");
        continue;
      }

      try {
        const hash = await calculateFileHash(file);

        // Check local duplicate
        const isDuplicateLocal = pendingFiles.some(f => f.hash === hash) || newFiles.some(f => f.hash === hash);
        if (isDuplicateLocal) {
          showAlert(`File ${file.name} đã chọn rồi`, "warning");
          continue;
        }

        // Check server duplicate
        const isValid = await validateImageHash(hash);
        if (!isValid) {
          showAlert(`Ảnh ${file.name} đã tồn tại trong hệ thống (trùng lặp)`, "error");
          continue;
        }

        newFiles.push({
          file,
          hash,
          preview: URL.createObjectURL(file),
          type: file.type.startsWith("video") ? "VIDEO" : "IMAGE"
        });

      } catch (err) {
        console.error(err);
        showAlert("Lỗi xử lý file " + file.name, "error");
      }
    }

    if (newFiles.length > 0) {
      setPendingFiles(prev => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setPendingFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Vui lòng chọn lý do trả hàng");
      return;
    }
    if (pendingFiles.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 ảnh/video minh chứng");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Cloudinary
      const uploadedResources = await Promise.all(
        pendingFiles.map(async (pf) => {
          const result = await uploadMedia(pf.file);
          return {
            url: result.url,
            type: result.type as MediaType,
            fileHash: pf.hash,
          };
        })
      );

      // 2. Submit API
      await mutation.mutateAsync({
        bookingId: booking.id,
        reason: reason as ReasonReturnType,
        note: note || undefined,
        evidenceUrls: uploadedResources,
      });

    } catch (error) {
      console.error(error);
      if (!mutation.isError) showAlert("Gửi yêu cầu thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };


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
              disabled={isSubmitting}
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
              {isSubmitting ? (
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
          {pendingFiles.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 1.5,
              }}
            >
              {pendingFiles.map((ev, idx) => (
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
                      src={ev.preview}
                      controls
                      style={{ width: "100%", height: 120, objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={ev.preview}
                      alt="evidence"
                      style={{ width: "100%", height: 120, objectFit: "cover" }}
                    />
                  )}
                  <X
                    onClick={() => removeFile(idx)}
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
            disabled={mutation.isPending || isSubmitting}
            icon={mutation.isPending ? <CircularProgress size={18} /> : undefined}
          />
        </Box>
      </Box>

      {/* Alert */}
      {alert && (
        <PrimaryAlert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </PrimaryModal>
  );
}


