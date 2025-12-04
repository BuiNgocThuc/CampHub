// app/admin/extension-requests/ExtensionDetailModal.tsx
"use client";

import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { ExtensionRequest } from "@/libs/core/types";
import { format } from "date-fns";
import { ExtensionStatus } from "@/libs/core/constants";

interface ExtensionDetailModalProps {
    request: ExtensionRequest;
}

const statusConfig: Record<ExtensionStatus, { label: string; color: "success" | "warning" | "error" | "default" }> = {
    PENDING: { label: "Đang chờ duyệt", color: "warning" },
    APPROVED: { label: "Đã duyệt", color: "success" },
    REJECTED: { label: "Bị từ chối", color: "error" },
    CANCELLED: { label: "Đã hủy", color: "default" },
    EXPIRED: { label: "Hết hạn", color: "default" },
};

export default function ExtensionDetailModal({ request }: ExtensionDetailModalProps) {
    const status = statusConfig[request.status];

    return (
        <Box sx={{ minWidth: 600 }}>
            <Stack spacing={4}>
                {/* Header */}
                <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Chi tiết yêu cầu gia hạn
                    </Typography>
                    <Chip label={status.label} color={status.color} sx={{ fontWeight: 600 }} />
                </Box>

                <Divider />

                {/* Thông tin chính */}
                <Stack spacing={3}>
                    <Box>
                        <Typography fontWeight="bold" color="primary" gutterBottom>
                            Thông tin yêu cầu
                        </Typography>
                        <GridRow label="Mã yêu cầu" value={request.id} />
                        <GridRow label="Mã đơn thuê" value={request.bookingId} />
                        <GridRow label="Thời gian tạo" value={format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")} />
                    </Box>

                    <Box>
                        <Typography fontWeight="bold" color="primary" gutterBottom>
                            Thời gian gia hạn
                        </Typography>
                        <GridRow label="Ngày kết thúc cũ" value={request.oldEndDate || "—"} />
                        <GridRow label="Ngày đề xuất mới" value={request.requestedNewEndDate} />
                        <GridRow
                            label="Phí gia hạn"
                            value={
                                <Typography fontWeight="bold" color="error">
                                    {Number(request.additionalFee).toLocaleString("vi-VN")} ₫
                                </Typography>
                            }
                        />
                    </Box>

                    <Box>
                        <Typography fontWeight="bold" color="primary" gutterBottom>
                            Người liên quan
                        </Typography>
                        <GridRow label="Người thuê" value={request.lesseeName} />
                        <GridRow label="Chủ đồ" value={request.lessorName} />
                        <GridRow label="Sản phẩm" value={request.itemName} />
                    </Box>

                    {request.note && (
                        <Box>
                            <Typography fontWeight="bold" color="primary" gutterBottom>
                                Ghi chú
                            </Typography>
                            <Typography variant="body2" sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                                {request.note}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}

// Helper component
const GridRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box display="flex" justifyContent="space-between" py={0.5}>
        <Typography color="text.secondary">{label}:</Typography>
        <Typography fontWeight="medium">{value}</Typography>
    </Box>
);