"use client";

import { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { Upload, X, Package } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PrimaryModal, PrimaryButton, CustomizedButton, PrimaryAlert } from "@/libs/components";
import { useCloudinaryUpload } from "@/libs/hooks";
import type { Booking, MediaResource } from "@/libs/core/types";
import { returnItem } from "@/libs/api/booking-api";
import { validateImageHash } from "@/libs/api";
import { calculateFileHash } from "@/libs/utils";

interface ReturnItemModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess?: (message: string) => void;
}

export default function ReturnItemModal({ open, onClose, booking, onSuccess }: ReturnItemModalProps) {
  const queryClient = useQueryClient();
  const { uploads, uploadFile } = useCloudinaryUpload();

  const [note, setNote] = useState("");
  const [media, setMedia] = useState<MediaResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [oldImageAlert, setOldImageAlert] = useState<{ visible: boolean }>({ visible: false });

  const mutation = useMutation({
    mutationFn: returnItem,
    onSuccess: () => {
      onSuccess?.("Đã gửi thông tin đóng gói / trả đồ thành công");
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
      handleClose();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể gửi thông tin trả đồ";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    setNote("");
    setMedia([]);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (media.length + files.length > 10) {
      toast.error("Tối đa 10 ảnh/video đóng gói");
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
        setMedia(prev => [
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

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (media.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 ảnh/video đóng gói");
      return;
    }

    mutation.mutate({
      bookingId: booking.id,
      note,
      mediaUrls: media,
    });
  };

  const uploadingCount = Object.values(uploads).filter(u => u.uploading).length;

  return (
    <PrimaryModal
      open={open}
      onClose={handleClose}
      title="Xác nhận trả đồ"
    >
      <Box sx={{ p: 3, minWidth: 600 }}>
        {/* Thông tin đơn thuê */}
        <Box sx={{ mb: 3, p: 2.5, borderRadius: 2, bgcolor: "#f9fafb", display: "flex", gap: 2, alignItems: "center" }}>
          <Package className="text-blue-600" size={24} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Trả đồ cho đơn thuê
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {booking.itemName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chủ đồ: <strong>{booking.lessorName}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Hướng dẫn */}
        <Box sx={{ mb: 2, bgcolor: "#eff6ff", borderRadius: 2, p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Hãy chụp ảnh/video đóng gói sản phẩm thật rõ ràng (trước khi gửi cho đơn vị vận chuyển) để làm bằng chứng nếu có tranh chấp.
          </Typography>
        </Box>

        {/* Upload minh chứng */}
        <Box sx={{ mb: 3 }}>
          <label htmlFor="return-item-media-input">
            <input
              id="return-item-media-input"
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
                    Click để upload ảnh/video đóng gói (tối đa 10)
                  </Typography>
                </>
              )}
            </Box>
          </label>
        </Box>

        {/* Danh sách media */}
        {media.length > 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1.5, mb: 3 }}>
            {media.map((m, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                }}
              >
                {m.type === "VIDEO" ? (
                  <video src={m.url} controls className="w-full h-28 object-cover" />
                ) : (
                  <img src={m.url} alt="" className="w-full h-28 object-cover" />
                )}
                <IconButton
                  size="small"
                  onClick={() => removeMedia(idx)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(239,68,68,0.9)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(220,38,38,1)" },
                  }}
                >
                  <X size={14} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Ghi chú */}
        <Box sx={{ mb: 3 }}>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Ghi chú thêm cho chủ đồ (mã vận đơn, đơn vị vận chuyển, thời gian gửi hàng, tình trạng đồ, ...)"
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
            content={mutation.isPending ? "Đang gửi thông tin..." : "Xác nhận đã gửi đồ"}
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


