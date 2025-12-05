"use client";

import { useState } from "react";
import { PrimaryModal, PrimaryButton, CustomizedButton } from "@/libs/components";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { AlertCircle, ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDispute, getAllDamageTypes } from "@/libs/api";
import type { Booking, DamageType, MediaResource } from "@/libs/core/types";
import { useCloudinaryUpload } from "@/libs/hooks";
import PrimarySelectField from "@/libs/components/TextFields/PrimarySelectField";
import PrimaryTextField from "@/libs/components/TextFields/PrimaryTextField";

interface DisputeModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
}

export default function DisputeModal({ open, onClose, booking }: DisputeModalProps) {
  const queryClient = useQueryClient();
  const { uploads, uploadFile } = useCloudinaryUpload();

  const [damageTypeId, setDamageTypeId] = useState<string>("");
  const [note, setNote] = useState("");
  const [evidences, setEvidences] = useState<MediaResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: damageTypes = [], isLoading: loadingDamageTypes } = useQuery<DamageType[]>({
    queryKey: ["damageTypes"],
    queryFn: getAllDamageTypes,
  });

  const disputeMut = useMutation({
    mutationFn: createDispute,
    onSuccess: () => {
      toast.success("Đã gửi khiếu nại thành công");
      queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      handleClose();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể gửi khiếu nại";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    setDamageTypeId("");
    setNote("");
    setEvidences([]);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (evidences.length + files.length > 10) {
      toast.error("Tối đa 10 hình ảnh/video minh chứng");
      return;
    }

    try {
      setIsUploading(true);
      for (const file of files) {
        const result = await uploadFile(file);
        setEvidences(prev => [
          ...prev,
          {
            url: result.url,
            type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
          } as MediaResource,
        ]);
      }
      toast.success("Upload minh chứng thành công");
    } catch (err) {
      toast.error("Upload minh chứng thất bại");
    } finally {
      setIsUploading(false);
      // reset input
      e.target.value = "";
    }
  };

  const removeEvidence = (index: number) => {
    setEvidences(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!damageTypeId) {
      toast.error("Vui lòng chọn loại hư tổn");
      return;
    }
    if (evidences.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 hình ảnh/video minh chứng");
      return;
    }

    disputeMut.mutate({
      bookingId: booking.id,
      damageTypeId,
      note,
      evidenceUrls: evidences,
    });
  };

  const uploadingCount = Object.values(uploads).filter(u => u.uploading).length;

  return (
    <PrimaryModal
      open={open}
      onClose={handleClose}
      title="Tạo khiếu nại"
    >
      <Box sx={{ p: 3, minWidth: 600 }}>
        {/* Thông tin đơn thuê */}
        <Box sx={{ mb: 3, p: 2.5, borderRadius: 2, bgcolor: "#f9fafb" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Đơn thuê
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {booking.itemName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Khách thuê: <strong>{booking.lesseeName}</strong>
          </Typography>
        </Box>

        {/* Chọn loại hư tổn */}
        <Box sx={{ mb: 3 }}>
          <PrimarySelectField
            label={
              <span>
                Loại hư tổn <span style={{ color: "red" }}>*</span>
              </span>
            }
            required
            value={damageTypeId}
            onChange={(e) => setDamageTypeId(e.target.value)}
            disabled={loadingDamageTypes}
            error={!damageTypeId && disputeMut.isError}
            helperText={!damageTypeId && disputeMut.isError ? "Vui lòng chọn loại hư tổn" : ""}
            options={[
              {
                value: "",
                label: loadingDamageTypes ? "Đang tải loại hư tổn..." : "Chọn loại hư tổn",
                disabled: true,
              },
              ...damageTypes.map(dt => ({
                value: dt.id,
                label: `${dt.name} (${(dt.compensationRate * 100).toFixed(0)}% tiền cọc)`,
              })),
            ]}
          />
        </Box>

        {/* Ghi chú */}
        <Box sx={{ mb: 3 }}>
          <PrimaryTextField
            label="Ghi chú thêm (không bắt buộc)"
            multiline
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>

        {/* Upload minh chứng */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <ImageIcon size={18} />
            Hình ảnh / video minh chứng <span style={{ color: "red" }}>*</span>
          </Typography>

          <label htmlFor="dispute-evidences-input">
            <input
              id="dispute-evidences-input"
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
                    Click để upload ảnh/video minh chứng (tối đa 10)
                  </Typography>
                </>
              )}
            </Box>
          </label>

          {evidences.length === 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5, color: "#9ca3af", fontSize: 13 }}>
              <AlertCircle size={14} />
              <span>Nên cung cấp hình ảnh rõ ràng: trước & sau, bao bì, chi tiết hư hại...</span>
            </Box>
          )}
        </Box>

        {/* Danh sách minh chứng đã upload */}
        {evidences.length > 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1.5, mb: 2 }}>
            {evidences.map((media, idx) => (
              <Box key={idx} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                {media.type === "VIDEO" ? (
                  <video src={media.url} controls className="w-full h-28 object-cover" />
                ) : (
                  <img src={media.url} alt="" className="w-full h-28 object-cover" />
                )}
                <IconButton
                  size="small"
                  onClick={() => removeEvidence(idx)}
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

        {/* Footer actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
          <CustomizedButton
            content="Hủy"
            color="#9ca3af"
            onClick={handleClose}
          />
          <PrimaryButton
            content={disputeMut.isPending ? "Đang gửi khiếu nại..." : "Gửi khiếu nại"}
            onClick={handleSubmit}
            disabled={disputeMut.isPending || isUploading || uploadingCount > 0}
            icon={disputeMut.isPending || isUploading ? <CircularProgress size={18} /> : undefined}
            className="bg-red-600 hover:bg-red-700"
          />
        </Box>
      </Box>
    </PrimaryModal>
  );
}


