"use client";

import { useState } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { Star, Upload, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PrimaryModal, PrimaryButton, CustomizedButton } from "@/libs/components";
import { useAuthStore } from "@/libs/stores/auth.store";
import { useCloudinaryUpload } from "@/libs/hooks";
import { createReview, getReviewsByBooking } from "@/libs/api/review-api";
import type { Booking, MediaResource, Review } from "@/libs/core/types";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess?: () => void;
}

export default function ReviewModal({ open, onClose, booking, onSuccess }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { uploads, uploadFile } = useCloudinaryUpload();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [media, setMedia] = useState<MediaResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: existingReviews = [], isLoading: loadingReviews } = useQuery<Review[]>({
    queryKey: ["bookingReviews", booking.id],
    queryFn: () => getReviewsByBooking(booking.id),
    enabled: open,
  });

  const hasReview = existingReviews.length > 0;

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success("Đã gửi đánh giá sản phẩm");
      queryClient.invalidateQueries({ queryKey: ["bookingReviews", booking.id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", booking.itemId] });
      onClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Không thể gửi đánh giá";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    setRating(0);
    setHoverRating(null);
    setComment("");
    setMedia([]);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (media.length + files.length > 5) {
      toast.error("Tối đa 5 ảnh minh họa");
      return;
    }

    try {
      setIsUploading(true);
      for (const file of files) {
        const result = await uploadFile(file);
        setMedia(prev => [
          ...prev,
          {
            url: result.url,
            type: "IMAGE",
          } as MediaResource,
        ]);
      }
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Upload ảnh thất bại, vui lòng thử lại");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }
    if (hasReview) {
      toast.error("Bạn đã đánh giá đơn này rồi");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn số sao từ 1 đến 5");
      return;
    }

    mutation.mutate({
      bookingId: booking.id,
      reviewerId: user.id,
      reviewedId: booking.lessorId,
      itemId: booking.itemId,
      rating,
      content: comment || "",
      mediaUrls: media,
    });
  };

  const isSubmitting = mutation.isPending || loadingReviews;
  const displayRating = hoverRating ?? rating;

  return (
    <PrimaryModal
      open={open}
      onClose={handleClose}
      title="Đánh giá sản phẩm"
    >
      <Box sx={{ p: 3, minWidth: 600 }}>
        {/* Thông tin đơn */}
        <Box sx={{ mb: 3, p: 2.5, borderRadius: 2, bgcolor: "#f9fafb" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Đơn thuê đã hoàn thành
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {booking.itemName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chủ đồ: <strong>{booking.lessorName}</strong>
          </Typography>
        </Box>

        {/* Sao đánh giá */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Điểm đánh giá <span style={{ color: "red" }}>*</span>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={28}
                className={
                  star <= displayRating
                    ? "text-yellow-400 fill-yellow-400 cursor-pointer"
                    : "text-gray-300 cursor-pointer"
                }
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setRating(star)}
              />
            ))}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {displayRating}/5
            </Typography>
          </Box>
        </Box>

        {/* Nội dung nhận xét */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Nhận xét (không bắt buộc)
          </Typography>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Chia sẻ trải nghiệm thuê sản phẩm này (chất lượng, giao tiếp với chủ đồ, ...)"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </Box>

        {/* Ảnh minh họa */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Ảnh minh họa (tùy chọn, tối đa 5)
          </Typography>

          <label htmlFor="review-media-input">
            <input
              id="review-media-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={isUploading || media.length >= 5}
            />
            <Box
              sx={{
                border: "2px dashed #e5e7eb",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: media.length >= 5 ? "not-allowed" : "pointer",
                bgcolor: "#f9fafb",
                "&:hover": { bgcolor: media.length >= 5 ? "#f9fafb" : "#f3f4f6" },
              }}
            >
              {isUploading ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">
                    Đang upload ảnh...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Upload size={28} className="mx-auto text-gray-400 mb-1" />
                  <Typography variant="body2" color="text.secondary">
                    Click để chọn tối đa 5 ảnh (tùy chọn)
                  </Typography>
                </>
              )}
            </Box>
          </label>

          {media.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {media.map((m, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 90,
                    height: 90,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <img src={m.url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                  <IconButton
                    size="small"
                    onClick={() => setMedia(prev => prev.filter((_, i) => i !== idx))}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(239,68,68,0.85)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(220,38,38,1)" },
                    }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <CustomizedButton
            content="Hủy"
            color="#9ca3af"
            onClick={handleClose}
          />
          <PrimaryButton
            content={
              mutation.isPending
                ? "Đang gửi đánh giá..."
                : "Gửi đánh giá"
            }
            onClick={handleSubmit}
            disabled={mutation.isPending || loadingReviews || isUploading}
            icon={mutation.isPending ? <CircularProgress size={18} /> : undefined}
          />
        </Box>
      </Box>
    </PrimaryModal>
  );
}


