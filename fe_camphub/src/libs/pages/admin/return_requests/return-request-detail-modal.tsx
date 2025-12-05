// app/admin/return-requests/return-request-detail-modal.tsx
"use client";

import {
    Box,
    Button,
    Chip,
    Divider,
    Typography,
    TextField,
    Alert,
    Stack,
    CircularProgress,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReasonReturnType, ReturnRequestStatus } from "@/libs/core/constants";
import { useState } from "react";
import { adminDecisionOnReturnRequest } from "@/libs/api";
import { toast } from "sonner";
import { ReturnRequest } from "@/libs/core/types";
import { CustomizedButton, MediaPreview, PrimaryButton } from "@/libs/components";
import { format } from "date-fns";

const reasonLabels: Record<ReasonReturnType, string> = {
    MISSING_PARTS: "Giao thiếu đồ / phụ kiện",
    WRONG_DESCRIPTION: "Không đúng mô tả sản phẩm",
    NO_NEEDED_ANYMORE: "Không còn nhu cầu sử dụng",
};

interface ReturnRequestDetailModalProps {
    request: ReturnRequest;
    onClose: () => void;
}

export default function ReturnRequestDetailModal({ request, onClose }: ReturnRequestDetailModalProps) {
    const queryClient = useQueryClient();
    const [adminNote, setAdminNote] = useState("");
    const [pendingAction, setPendingAction] = useState<"APPROVE" | "REJECT" | null>(null);

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
            const actionText =
                updatedRequest.status === ReturnRequestStatus.APPROVED
                    ? "chấp nhận hoàn tiền"
                    : "từ chối yêu cầu";

            toast.success(`Đã ${actionText} thành công!`);

            // Cập nhật lại cache
            queryClient.invalidateQueries({ queryKey: ["ReturnRequests"] });
            queryClient.invalidateQueries({ queryKey: ["returnRequest", request.id] });
            
            // Đóng modal sau khi thành công
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Xử lý thất bại. Vui lòng thử lại!");
        },
        onSettled: () => {
            setPendingAction(null);
        },
    });

    const isPending = request.status === ReturnRequestStatus.PENDING;

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
                            <Chip
                                label={
                                    isPending
                                        ? "Chờ xử lý"
                                        : request.status === "APPROVED"
                                        ? "Đã hoàn tiền"
                                        : "Bị từ chối"
                                }
                                color={isPending ? "warning" : request.status === "APPROVED" ? "success" : "error"}
                                size="small"
                            />
                        }
                    />
                    <GridRow
                        label="Ngày gửi"
                        value={request.createdAt ? format(new Date(request.createdAt), "dd/MM/yyyy") : "N/A"}
                    />
                </Box>

                {/* Ghi chú người thuê */}
                {request.note && (
                    <Box>
                        <Typography fontWeight="bold" color="primary" mb={1}>
                            Ghi chú từ người thuê
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, whiteSpace: "pre-line" }}
                        >
                            {request.note}
                        </Typography>
                    </Box>
                )}

                {/* Minh chứng */}
                {request.evidenceUrls && request.evidenceUrls.length > 0 && (
                    <Box>
                        <Typography fontWeight="bold" color="primary" mb={2}>
                            Minh chứng từ người thuê ({request.evidenceUrls.length})
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

                {/* Xử lý admin */}
                {isPending && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Vui lòng kiểm tra kỹ minh chứng và lý do trước khi quyết định.
                        </Alert>

                        <TextField
                            fullWidth
                            label="Ghi chú xử lý (bắt buộc nếu từ chối)"
                            multiline
                            rows={3}
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Stack direction="row" spacing={3} justifyContent="flex-end">
                            <PrimaryButton
                                content="Chấp thuận"
                                onClick={() => decisionMutation.mutate("APPROVE")}
                                disabled={!!pendingAction}
                                icon={pendingAction === "APPROVE" ? <CircularProgress size={20} color="inherit" /> : undefined}
                            />

                            <CustomizedButton
                                content="Từ chối"
                                onClick={() => {
                                    if (!adminNote.trim()) {
                                        toast.error("Vui lòng nhập lý do khi từ chối!");
                                        return;
                                    }
                                    decisionMutation.mutate("REJECT");
                                }}
                                disabled={!!pendingAction}
                                icon={pendingAction === "REJECT" ? <CircularProgress size={20} color="inherit" /> : undefined}
                            />
                        </Stack>
                    </Box>
                )}

                {!isPending && request.adminNote && (
                    <Alert severity={request.status === "APPROVED" ? "success" : "error"}>
                        <strong>Kết quả xử lý:</strong> {request.status === "APPROVED" ? "Đã hoàn tiền" : "Từ chối"}
                        <Typography mt={1}>
                            <strong>Ghi chú:</strong> {request.adminNote}
                        </Typography>
                    </Alert>
                )}
            </Stack>
        </Box>
    );
}

const GridRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box display="flex" justifyContent="space-between" py={1}>
        <Typography color="text.secondary">{label}:</Typography>
        <Typography fontWeight="medium">{value}</Typography>
    </Box>
);

