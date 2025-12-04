// app/admin/return-requests/[returnRequestId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReasonReturnType, ReturnRequestStatus } from "@/libs/core/constants";
import { useState } from "react";
import { adminDecisionOnReturnRequest, getReturnRequestById } from "@/libs/api";
import { toast } from "sonner";
import { ReturnRequest } from "@/libs/core/types";
import { CustomizedButton, MediaPreview, PrimaryButton } from "@/libs/components";


const reasonLabels: Record<ReasonReturnType, string> = {
    MISSING_PARTS: "Giao thiếu đồ / phụ kiện",
    WRONG_DESCRIPTION: "Không đúng mô tả sản phẩm",
    NO_NEEDED_ANYMORE: "Không còn nhu cầu sử dụng",
};

export default function ReturnRequestDetailPage() {
    const router = useRouter();
    const { returnRequestId } = useParams() as { returnRequestId: string };
    const queryClient = useQueryClient();
    const [adminNote, setAdminNote] = useState("");
    const [pendingAction, setPendingAction] = useState<"APPROVE" | "REJECT" | null>(null);

    const { data: request } = useQuery({
        queryKey: ["returnRequest", returnRequestId],
        queryFn: () => getReturnRequestById(returnRequestId),
    });

    const decisionMutation = useMutation({
        mutationFn: (action: "APPROVE" | "REJECT") => {
            if (!request) {
                throw new Error("Yêu cầu chưa được tải. Vui lòng thử lại.");
            }

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
            queryClient.invalidateQueries({ queryKey: ["pendingReturnRequests"] });
            queryClient.invalidateQueries({ queryKey: ["returnRequest", returnRequestId] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Xử lý thất bại. Vui lòng thử lại!");
        },
        onSettled: () => {
            setPendingAction(null); // ← Kết thúc loading
        },
    });

    if (!request) {
        return (
            <Box p={6}>
                <Typography variant="h6">Không tìm thấy yêu cầu hoàn tiền</Typography>
                <Button variant="outlined" onClick={() => router.back()} sx={{ mt: 2 }}>
                    Quay lại
                </Button>
            </Box>
        );
    }

    const isPending = request.status === ReturnRequestStatus.PENDING;

    return (
        <Box p={6} maxWidth="lg" mx="auto">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight="bold">
                    Yêu cầu hoàn tiền #{request.id.slice(0, 8)}
                </Typography>
                <Button variant="outlined" onClick={() => router.back()}>
                    ← Quay lại
                </Button>
            </Box>

            <Stack spacing={4}>
                {/* Thông tin chính */}
                <Box bgcolor="white" borderRadius={2} p={4} boxShadow={1}>
                    <GridRow label="Người thuê" value={request.lesseeName} />
                    <GridRow label="Chủ đồ" value={request.lessorName} />
                    <GridRow label="Sản phẩm" value={request.itemName} />
                    <GridRow label="Mã đơn thuê" value={request.bookingId} />
                    <GridRow label="Lý do trả đồ" value={reasonLabels[request.reason]} />
                    <GridRow
                        label="Trạng thái"
                        value={
                            <Chip
                                label={isPending ? "Chờ xử lý" : request.status === "APPROVED" ? "Đã hoàn tiền" : "Bị từ chối"}
                                color={isPending ? "warning" : request.status === "APPROVED" ? "success" : "error"}
                            />
                        }
                    />
                    <GridRow label="Ngày gửi" value={new Date(request.createdAt).toLocaleString("vi-VN")} />
                </Box>

                {/* Ghi chú người thuê */}
                {request.note && (
                    <Box bgcolor="white" borderRadius={2} p={4} boxShadow={1}>
                        <Typography fontWeight="bold" color="primary" mb={1}>Ghi chú từ người thuê</Typography>
                        <Typography variant="body2" sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, whiteSpace: "pre-line" }}>
                            {request.note}
                        </Typography>
                    </Box>
                )}

                {/* Minh chứng */}
                {request.evidenceUrls.length > 0 && (
                    <Box bgcolor="white" borderRadius={2} p={4} boxShadow={1}>
                        <Typography fontWeight="bold" color="primary" mb={3}>
                            Minh chứng từ người thuê ({request.evidenceUrls.length})
                        </Typography>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {request.evidenceUrls.map((media, idx) => (
                                <MediaPreview
                                    key={idx}
                                    url={media.url}
                                    size="large"
                                    showRemove={false}   // Không cho xóa ở trang admin
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
                                disabled={!!pendingAction} // disable cả 2 khi đang xử lý
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
                        <Typography mt={1}><strong>Ghi chú:</strong> {request.adminNote}</Typography>
                    </Alert>
                )}
            </Stack>
        </Box>
    );
}

const GridRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box display="flex" justifyContent="space-between" py={0.8}>
        <Typography color="text.secondary">{label}:</Typography>
        <Typography fontWeight="medium">{value}</Typography>
    </Box>
);