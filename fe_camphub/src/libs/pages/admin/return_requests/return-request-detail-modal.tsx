// app/admin/return-requests/return-request-detail-modal.tsx
"use client";

import {
    Box,
    Chip,
    Divider,
    Typography,
    TextField,
    Alert,
    Stack,
    CircularProgress,
    duration,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReasonReturnType, ReturnRequestStatus } from "@/libs/core/constants";
import { useState } from "react";
import { adminDecisionOnReturnRequest } from "@/libs/api";
import { ReturnRequest } from "@/libs/core/types";
import { CustomizedButton, MediaPreview, PrimaryAlert, PrimaryButton } from "@/libs/components";
import { format } from "date-fns";

const reasonLabels: Record<ReasonReturnType, string> = {
    MISSING_PARTS: "Giao thiếu đồ / phụ kiện",
    WRONG_DESCRIPTION: "Không đúng mô tả sản phẩm",
    NO_NEEDED_ANYMORE: "Không còn nhu cầu sử dụng",
};

// Định nghĩa kiểu cho config để TS hiểu rõ các giá trị màu cho phép
type StatusConfig = {
    label: string;
    color: "warning" | "success" | "error" | "default" | "info";
};

const modalStatusConfig: Record<string, StatusConfig> = {
    PENDING: { label: "Chờ nhận hàng", color: "warning" },
    PROCESSING: { label: "Chờ xử lý", color: "info" },
    APPROVED: { label: "Đã xử lý", color: "success" },
    REJECTED: { label: "Bị từ chối", color: "error" },
    AUTO_REFUNDED: { label: "Tự hoàn tiền (hết hạn)", color: "success" },
    RESOLVED: { label: "Đã hoàn tất", color: "success" },
    CLOSED_BY_DISPUTE: { label: "Đã chuyển khiếu nại", color: "warning" },
};

interface ReturnRequestDetailModalProps {
    request: ReturnRequest;
    onClose: () => void;
    onResult?: (message: string, type?: "success" | "error") => void;
}

export default function ReturnRequestDetailModal({ request, onClose, onResult }: ReturnRequestDetailModalProps) {
    const queryClient = useQueryClient();
    const [adminNote, setAdminNote] = useState("");
    const [pendingAction, setPendingAction] = useState<"APPROVE" | "REJECT" | null>(null);
    const [alert, setAlert] = useState <{
        content: string;
        type: "success" | "error" | "info" | "warning";
        duration: number;
    } | null>(null);

    const showAlert = (
        content: string,
        type: "success" | "error" | "info" | "warning",
        duration = 2000
    ) => {
        setAlert({ content, type, duration });
    }


    // 1. Chuẩn hóa status
    const rawStatus = request.status as unknown;
    const normalizedStatus = typeof rawStatus === "string" ? rawStatus.toUpperCase() : (rawStatus as ReturnRequestStatus);
    const statusKey = String(normalizedStatus);

    // 2. Logic hiển thị Form xử lý
    const isActionable = 
        normalizedStatus === ReturnRequestStatus.PROCESSING || 
        normalizedStatus === "PROCESSING";

    // 3. Lấy config hiển thị (Label & Color) - SỬA LỖI Ở ĐÂY
    // Dùng "as const" để TypeScript hiểu đây là literal type, không phải string thường
    const currentStatusConfig = modalStatusConfig[statusKey] || { 
        label: statusKey, 
        color: "default" as const 
    };

    const decisionMutation = useMutation({
        mutationFn: (action: "APPROVE" | "REJECT") => {
            setPendingAction(action);
            return adminDecisionOnReturnRequest({
                returnRequestId: request.id,
                isApproved: action === "APPROVE",
                adminNote: action === "REJECT" ? (adminNote.trim() || undefined) : undefined,
            });
        },
        onSuccess: (updatedRequest: ReturnRequest) => {
            const actionText = updatedRequest.status === ReturnRequestStatus.APPROVED
                ? "chấp nhận lý do trả hàng"
                : "từ chối xử phạt chủ thuê";

            showAlert(`Đã ${actionText} thành công!`, "success");
            onResult?.(
                updatedRequest.status === ReturnRequestStatus.APPROVED
                    ? "Đã chấp nhận lý do trả hàng"
                    : "Đã từ chối xử phạt chủ thuê",
                "success"
            );

            queryClient.invalidateQueries({ queryKey: ["ReturnRequests"] });
            queryClient.invalidateQueries({ queryKey: ["returnRequest", request.id] });
            onClose();
        },
        onError: (error: any) => {
            showAlert("Xử lý thất bại. Vui lòng thử lại!", "error")
        },
        onSettled: () => {
            setPendingAction(null);
        },
    });

    return (
        <Box>
            <Stack spacing={3}>
                {/* Thông tin chính */}
                <Box>
                    <GridRow label="Người thuê" value={request.lesseeName} />
                    <GridRow label="Chủ đồ" value={request.lessorName} />
                    <GridRow label="Sản phẩm" value={request.itemName} />
                    <GridRow label="Mã đơn thuê" value={request.bookingId} />
                    <GridRow label="Lý do trả đồ" value={reasonLabels[request.reason]} />
                    <GridRow
                        label="Trạng thái"
                        value={
                            // SỬA LỖI: Dùng currentStatusConfig thay vì modalStatusConfig
                            <Chip
                                label={currentStatusConfig.label}
                                color={currentStatusConfig.color}
                                size="small"
                                sx={{ fontWeight: "bold" }}
                            />
                        }
                    />
                    <GridRow
                        label="Ngày gửi"
                        value={request.createdAt ? format(new Date(request.createdAt), "dd/MM/yyyy HH:mm") : "N/A"}
                    />
                </Box>

                {/* Ghi chú người thuê */}
                {request.note && (
                    <Box>
                        <Typography fontWeight="bold" color="primary" mb={1} fontSize="0.9rem">
                            Ghi chú từ người thuê
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, border: '1px solid #eee', whiteSpace: "pre-line" }}
                        >
                            {request.note}
                        </Typography>
                    </Box>
                )}

                {/* Minh chứng */}
                {request.evidenceUrls && request.evidenceUrls.length > 0 && (
                    <Box>
                        <Typography fontWeight="bold" color="primary" mb={2} fontSize="0.9rem">
                            Minh chứng ({request.evidenceUrls.length})
                        </Typography>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {request.evidenceUrls.map((media, idx) => (
                                <MediaPreview
                                    key={idx}
                                    url={media.url}
                                    size="large"
                                    showRemove={false}
                                />
                            ))}
                        </div>
                    </Box>
                )}

                <Divider />

                {/* Khu vực Xử lý của Admin */}
                <Box>
                    <Typography fontWeight="bold" color="primary" mb={1} fontSize="0.9rem">
                        Xử lý của Admin
                    </Typography>

                    {isActionable ? (
                        // CASE 1: Đang chờ xử lý (PROCESSING) -> Hiện Form
                        <>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Yêu cầu này đang chờ bạn xử lý.
                            </Alert>
                            <TextField
                                fullWidth
                                label="Ghi chú xử lý (Bắt buộc nếu Từ chối)"
                                multiline
                                rows={3}
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                sx={{ mb: 3 }}
                                placeholder="Nhập lý do từ chối hoặc ghi chú thêm..."
                            />
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <CustomizedButton
                                    content="Từ chối xử phạt"
                                    onClick={() => {
                                        if (!adminNote.trim()) {
                                            showAlert("Vui lòng nhập lý do khi từ chối!", "error");
                                            return;
                                        }
                                        decisionMutation.mutate("REJECT");
                                    }}
                                    disabled={!!pendingAction}
                                    color="#ef4444"
                                    icon={pendingAction === "REJECT" ? <CircularProgress size={20} color="inherit" /> : undefined}
                                />
                                <PrimaryButton
                                    content="Đồng ý xử phạt"
                                    onClick={() => decisionMutation.mutate("APPROVE")}
                                    disabled={!!pendingAction}
                                    icon={pendingAction === "APPROVE" ? <CircularProgress size={20} color="inherit" /> : undefined}
                                />
                            </Stack>
                        </>
                    ) : (
                        // CASE 2: Các trạng thái khác -> Chỉ xem (View Only)
                        <>
                            {request.adminNote ? (
                                <Typography
                                    variant="body2"
                                    sx={{ 
                                        bgcolor: statusKey === "REJECTED" ? "#fff5f5" : "#f0fdf4", 
                                        p: 2, 
                                        borderRadius: 2, 
                                        border: `1px solid ${statusKey === "REJECTED" ? "#feb2b2" : "#bbf7d0"}`,
                                        whiteSpace: "pre-line",
                                        color: "#374151"
                                    }}
                                >
                                    {request.adminNote}
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    {statusKey === "PENDING" 
                                        ? "Đang chờ người thuê gửi trả hàng hoặc chủ đồ xác nhận." 
                                        : "Không có ghi chú xử lý."}
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </Stack>

            {alert && (
                <PrimaryAlert
                    content={alert.content}
                    type={alert.type}
                    duration={alert.duration}
                    onClose={() => setAlert(null)}
                />
            )}
        </Box>
    );
}

const GridRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box display="flex" justifyContent="space-between" py={1.5} alignItems="center" borderBottom="1px dashed #f0f0f0">
        <Typography color="text.secondary" variant="body2">{label}</Typography>
        <Typography fontWeight="medium" variant="body2" component="div">
            {value}
        </Typography>
    </Box>
);