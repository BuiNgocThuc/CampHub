"use client";

import { useState } from "react";
import { PrimaryModal, PrimaryButton, CustomizedButton, PrimaryAlert } from "@/libs/components";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { AlertCircle, ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDispute, getAllDamageTypes, validateImageHash } from "@/libs/api";
import type { Booking, DamageType, MediaResource } from "@/libs/core/types";
import {PrimarySelectField, PrimaryTextField} from "@/libs/components";

import { calculateFileHash, isFileSizeValid, isFileTypeAllowed, uploadMedia } from "@/libs/utils";
import { MediaType } from "@/libs/core/constants";

interface PendingFile {
  file: File;
  hash: string;
  preview: string;
  type: "IMAGE" | "VIDEO";
}

interface DisputeModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess?: () => void;
}

export default function DisputeModal({ open, onClose, booking, onSuccess }: DisputeModalProps) {
  const queryClient = useQueryClient();

  const [damageTypeId, setDamageTypeId] = useState<string>("");
  const [note, setNote] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const { data: damageTypes = [], isLoading: loadingDamageTypes } = useQuery<DamageType[]>({
    queryKey: ["damageTypes"],
    queryFn: getAllDamageTypes,
  });

  const disputeMut = useMutation({
    mutationFn: createDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
      queryClient.invalidateQueries({ queryKey: ["myRentals"] });
      queryClient.invalidateQueries({ queryKey: ["myDisputes"] });
      handleClose();
      // Gọi callback để hiển thị alert ở parent component
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể gửi khiếu nại";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    setDamageTypeId("");
    setNote("");
    setPendingFiles([]);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (pendingFiles.length + selectedFiles.length > 10) {
      toast.error("Tối đa 10 hình ảnh/video minh chứng");
      return;
    }

    const newFiles: PendingFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (!isFileTypeAllowed(file)) {
        showAlert(`File ${file.name} không đúng định dạng`, "error");
        setIsUploading(false);
        continue;
      }
      if (!isFileSizeValid(file, 10)) {
        showAlert(`File ${file.name} quá lớn (Max 10MB)`, "error");
        setIsUploading(false);
        continue;
      }
      
      try {
        const hash = await calculateFileHash(file);

        // Check local duplicate
        const isDuplicateLocal = pendingFiles.some(f => f.hash === hash) || newFiles.some(f => f.hash === hash);
        if (isDuplicateLocal) {
          showAlert(`File ${file.name} đã được chọn rồi`, "warning");
          setIsUploading(false);
          continue;
        }

        // Check server duplicate
        const isValid = await validateImageHash(hash);
        if (!isValid) {
          showAlert(`Ảnh ${file.name} đã tồn tại trong lịch sử của sản phẩm này`, "error");
          setIsUploading(false);
          continue;
        }

        newFiles.push({
          file,
          hash,
          preview: URL.createObjectURL(file),
          type: file.type.startsWith("video") ? "VIDEO" : "IMAGE"
        });

      } catch (error) {
        console.error("File processing error:", error);
        showAlert(`Không thể xử lý file ${file.name}`, "error");
        setIsUploading(false);
      } finally {
        setIsUploading(false);
      }
    }

    if (newFiles.length > 0) {
      setPendingFiles(prev => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeEvidence = (index: number) => {
    setPendingFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview); // Giải phóng bộ nhớ
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    if (!damageTypeId) {
      toast.error("Vui lòng chọn loại hư tổn");
      return;
    }
    if (pendingFiles.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 hình ảnh/video minh chứng");
      return;
    }

    setIsSubmitting(true);
    try {
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

      await disputeMut.mutateAsync({
        bookingId: booking.id,
        damageTypeId,
        note,
        evidenceUrls: uploadedResources,
      });
      
    } catch (error) {
      console.error(error);
      if (!disputeMut.isError) toast.error("Lỗi khi upload minh chứng, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {isUploading ? (
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

          {pendingFiles.length === 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5, color: "#9ca3af", fontSize: 13 }}>
              <AlertCircle size={14} />
              <span>Nên cung cấp hình ảnh rõ ràng: trước & sau, bao bì, chi tiết hư hại...</span>
            </Box>
          )}
        </Box>

        {/* Danh sách minh chứng đã upload */}
        {pendingFiles.length > 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1.5, mb: 2 }}>
            {pendingFiles.map((pf, idx) => (
              <Box key={idx} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", border: "1px solid #e5e7eb", height: 112 }}>
                {pf.type === "VIDEO" ? (
                  <video src={pf.preview} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={pf.preview} alt="preview" className="w-full h-full object-cover" />
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
            disabled={disputeMut.isPending || isSubmitting}
            icon={disputeMut.isPending ? <CircularProgress size={18} /> : undefined}
            className="bg-red-600 hover:bg-red-700"
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


