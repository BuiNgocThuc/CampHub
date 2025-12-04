// app/admin/items/ItemDetail.tsx
"use client";

import { Box, Grid, Typography, Chip, Button, Alert } from "@mui/material";
import { CheckCircle, XCircle, Lock, Unlock } from "lucide-react";
import { Item } from "@/libs/core/types";
import { ItemStatus } from "@/libs/core/constants";
import { MediaPreview } from "@/libs/components";

interface ItemDetailProps {
    item: Item;
    onAction: (action: "approve" | "reject" | "lock" | "unlock") => void;
    loading?: boolean;
}

export default function ItemDetail({ item, onAction, loading }: ItemDetailProps) {
    const status = item.status as ItemStatus;

    const getStatusInfo = (): { label: string; color: "success" | "error" | "warning" | "info" | "default" | "primary" } => {
        switch (status) {
            case "PENDING_APPROVAL": return { label: "Chờ duyệt", color: "warning" };
            case "AVAILABLE": return { label: "Đang hiển thị", color: "success" };
            case "REJECTED": return { label: "Bị từ chối", color: "error" };
            case "BANNED": return { label: "Bị cấm", color: "error" };
            case "RENTED_PENDING_CONFIRM": return { label: "Chờ xác nhận thuê", color: "warning" };
            case "RENTED": return { label: "Đang thuê", color: "info" };
            case "RETURN_PENDING_CHECK": return { label: "Chờ kiểm tra trả", color: "info" };
            case "DELETED": return { label: "Đã xóa", color: "default" };
            case "MISSING": return { label: "Mất tích", color: "error" };
            default: return { label: status, color: "default" };
        }
    };

    const { label: statusLabel, color: statusColor } = getStatusInfo();

    return (
        <Box sx={{ minWidth: 800 }}>
            <Grid container spacing={4}>
                {/* Tiêu đề + Trạng thái */}
                <Grid size={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <div>
                            <Typography variant="h5" fontWeight="bold">{item.name}</Typography>
                            <Typography color="text.secondary">
                                Chủ sở hữu: <strong>{item.ownerName}</strong> • ID: {item.id.slice(0, 8)}
                            </Typography>
                        </div>
                        {/* FIX 1: Dùng đúng color + size hợp lệ */}
                        <Chip
                            label={statusLabel}
                            color={statusColor}
                            size="medium" // "large" không tồn tại → dùng "medium"
                            sx={{ fontWeight: "bold", px: 2, py: 2.5 }}
                        />
                    </Box>
                </Grid>

                {/* Alert hướng dẫn */}
                <Grid size={12}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Admin chỉ có thể <strong>duyệt/từ chối</strong> khi sản phẩm <strong>Chờ duyệt</strong>,<br />
                        và <strong>khóa/mở khóa</strong> khi sản phẩm <strong>Đang hiển thị</strong> hoặc <strong>Bị cấm/Từ chối</strong>.
                    </Alert>
                </Grid>

                <Grid size={12}>
                    <Box sx={{ my: 4 }}>
                        {item.mediaUrls && item.mediaUrls.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                {item.mediaUrls.slice(0, 8).map((media, index) => (
                                    <MediaPreview
                                        key={index}
                                        url={media.url}
                                        size="large"
                                        showRemove={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Box
                                sx={{
                                    py: 8,
                                    textAlign: "center",
                                    color: "text.secondary",
                                    bgcolor: "grey.50",
                                    borderRadius: 3,
                                    border: "2px dashed",
                                    borderColor: "grey.300",
                                }}
                            >
                                <Typography variant="body1">Không có ảnh minh họa</Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Nút hành động */}
                <Grid size={12}>
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                        {status === "PENDING_APPROVAL" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircle />}
                                    onClick={() => onAction("approve")}
                                    disabled={loading}
                                >
                                    Duyệt sản phẩm
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<XCircle />}
                                    onClick={() => onAction("reject")}
                                    disabled={loading}
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}

                        {status === "AVAILABLE" && (
                            <Button
                                variant="outlined"
                                color="warning"
                                startIcon={<Lock />}
                                onClick={() => onAction("lock")}
                                disabled={loading}
                            >
                                Khóa sản phẩm
                            </Button>
                        )}

                        {(status === "BANNED" || status === "REJECTED") && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Unlock />}
                                onClick={() => onAction("unlock")}
                                disabled={loading}
                            >
                                Mở khóa / Bỏ từ chối
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}