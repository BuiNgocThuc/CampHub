// app/admin/disputes/DisputeDetailModal.tsx
"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    TextField,
    Typography,
    Stack,
    Alert,
} from "@mui/material";
import { AppImage } from "@/libs/components";
import { adminReviewDispute } from "@/libs/api/dispute-api";
import { Dispute } from "@/libs/core/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisputeDecision, DisputeStatus } from "@/libs/core/constants";
import { toast } from "sonner";

interface DisputeDetailModalProps {
    dispute: Dispute;
    onClose: () => void;
}

export default function DisputeDetailModal({ dispute, onClose }: DisputeDetailModalProps) {
    const [adminNote, setAdminNote] = useState("");
    const queryClient = useQueryClient();

    const reviewMutation = useMutation({
        mutationFn: (decision: DisputeDecision) =>
            adminReviewDispute({
                disputeId: dispute.id,
                isApproved: decision === DisputeDecision.APPROVED,
                adminNote,
            }),
        onSuccess: () => {
            toast.success("Xử lý khiếu nại thành công!");
            queryClient.invalidateQueries({ queryKey: ["pendingDisputes"] });
            onClose();
        },
        onError: () => toast.error("Xử lý thất bại"),
    });

    const isPending = dispute.status === DisputeStatus.PENDING_REVIEW;

    return (
        <Box sx={{ minWidth: 900, maxWidth: 1200 }}>
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Chi tiết khiếu nại #{dispute.id.slice(-6)}
                    </Typography>
                    <Chip
                        label={isPending ? "Chờ xử lý" : "Đã xử lý"}
                        color={isPending ? "warning" : "success"}
                        size="medium"
                        sx={{ mt: 1, fontWeight: "bold" }}
                    />
                </Box>

                <Divider />

                <Stack direction={{ xs: "column", md: "row" }} spacing={6}>
                    <Box flex={1}>
                        <Typography fontWeight="bold" color="primary" gutterBottom>
                            Thông tin khiếu nại
                        </Typography>
                        <GridRow label="Mã đơn thuê" value={dispute.bookingId} />
                        <GridRow label="Người báo cáo" value={dispute.reporterName} />
                        <GridRow label="Người bị báo cáo" value={dispute.defenderName} />
                        <GridRow label="Loại hư hại" value={dispute.damageTypeName} />
                        <GridRow
                            label="Tỷ lệ bồi thường"
                            value={dispute.compensationRate
                                ? <span className="text-red-600 font-bold">{(dispute.compensationRate * 100).toFixed(0)}%</span>
                                : "—"
                            }
                        />
                    </Box>

                    <Box flex={1}>
                        <Typography fontWeight="bold" color="primary" gutterBottom>
                            Mô tả sự cố
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: "grey.50",
                                p: 3,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "grey.200",
                                minHeight: 120,
                            }}
                        >
                            <Typography variant="body1" color={dispute.description ? "text.primary" : "text.secondary"}>
                                {dispute.description || "(Không có mô tả)"}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>

                {/* MINH CHỨNG – DÙNG APPIMAGE → KHÔNG BAO GIỜ VỠ */}
                {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
                    <Box>
                        <Typography fontWeight="bold" color="primary" gutterBottom>
                            Minh chứng từ người dùng ({dispute.evidenceUrls.length})
                        </Typography>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {dispute.evidenceUrls.map((media, idx) => (
                                <Box
                                    key={idx}
                                    position="relative"
                                    borderRadius={3}
                                    overflow="hidden"
                                    boxShadow={3}
                                    sx={{
                                        aspectRatio: "4/3",
                                        bgcolor: "grey.100",
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-8px)",
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    {media.type === "VIDEO" ? (
                                        <video
                                            controls
                                            className="w-full h-full object-cover"
                                            poster="/img/placeholder.webp"
                                        >
                                            <source src={media.url} type="video/mp4" />
                                            <track kind="captions" />
                                            Trình duyệt không hỗ trợ video.
                                        </video>
                                    ) : (
                                        <AppImage
                                            src={media.url}
                                            alt={`Minh chứng ${idx + 1}`}
                                            width={400}
                                            height={300}
                                            className="object-cover"
                                            priority={false}
                                        />
                                    )}

                                    {/* Badge loại media */}
                                    <Chip
                                        label={media.type === "VIDEO" ? "VIDEO" : "ẢNH"}
                                        size="small"
                                        color={media.type === "VIDEO" ? "secondary" : "primary"}
                                        sx={{
                                            position: "absolute",
                                            top: 12,
                                            left: 12,
                                            fontWeight: "bold",
                                            backdropFilter: "blur(4px)",
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            color: "white",
                                        }}
                                    />
                                </Box>
                            ))}
                        </div>
                    </Box>
                )}

                <Divider />

                {/* NÚT XỬ LÝ */}
                {isPending ? (
                    <Box>
                        <Alert severity="warning" sx={{ mb: 3, fontSize: "1rem" }}>
                            Vui lòng xem xét kỹ minh chứng và mô tả trước khi đưa ra quyết định cuối cùng.
                        </Alert>

                        <TextField
                            fullWidth
                            label="Ghi chú xử lý (bắt buộc nếu từ chối)"
                            multiline
                            rows={4}
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Ví dụ: Không đủ bằng chứng, ảnh mờ, không đúng hư hại đã báo..."
                            sx={{ mb: 4 }}
                        />

                        <Stack direction="row" spacing={3} justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={() => reviewMutation.mutate(DisputeDecision.APPROVED)}
                                disabled={reviewMutation.isPending}
                                sx={{ minWidth: 200, py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
                            >
                                {reviewMutation.isPending ? "Đang xử lý..." : "Chấp nhận bồi thường"}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="large"
                                onClick={() => {
                                    if (!adminNote.trim()) {
                                        toast.error("Vui lòng nhập ghi chú khi từ chối!");
                                        return;
                                    }
                                    reviewMutation.mutate(DisputeDecision.REJECTED);
                                }}
                                disabled={reviewMutation.isPending}
                                sx={{ minWidth: 200, py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
                            >
                                {reviewMutation.isPending ? "Đang xử lý..." : "Từ chối khiếu nại"}
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Alert severity={dispute.adminDecision === "ACCEPTED" ? "success" : "error"} sx={{ fontSize: "1.1rem" }}>
                        <strong>Kết quả xử lý:</strong>{" "}
                        {dispute.adminDecision === "ACCEPTED" ? "Đã chấp nhận bồi thường" : "Đã từ chối khiếu nại"}
                        {dispute.adminNote && (
                            <Typography mt={2}>
                                <strong>Ghi chú admin:</strong> {dispute.adminNote}
                            </Typography>
                        )}
                    </Alert>
                )}
            </Stack>
        </Box>
    );
}

const GridRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box display="flex" justifyContent="space-between" py={1}>
        <Typography color="text.secondary" fontWeight="medium">{label}:</Typography>
        <Typography fontWeight="bold" color="text.primary">
            {value}
        </Typography>
    </Box>
);