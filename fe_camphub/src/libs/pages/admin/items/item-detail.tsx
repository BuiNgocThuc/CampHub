// app/admin/items/ItemDetail.tsx
"use client";

import { Box, Grid, Typography, Chip, Alert, Divider, Stack } from "@mui/material";
import { CheckCircle, XCircle, Lock, Unlock, Package, DollarSign, Coins, Hash } from "lucide-react";
import { Item } from "@/libs/core/types";
import { ItemStatus } from "@/libs/core/constants";
import { MediaPreview, CustomizedButton } from "@/libs/components";

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + " coin";
    };

    return (
        <Box sx={{ minWidth: 800 }}>
            <Grid container spacing={4}>
                {/* Header: Tiêu đề + Trạng thái */}
                <Grid size={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <Hash size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                                ID: {item.id}
                            </Typography>
                        </Box>
                        <Chip
                            label={statusLabel}
                            color={statusColor}
                            size="medium"
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

                {/* Thông tin chi tiết */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{
                            bgcolor: "grey.50",
                            borderRadius: 2,
                            p: 3,
                            height: "100%",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Thông tin sản phẩm
                        </Typography>
                        <Stack spacing={2.5}>
                            <DetailRow
                                label="Danh mục"
                                value={item.categoryName || "Chưa xác định"}
                            />
                            <DetailRow
                                label="Mô tả"
                                value={
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            color: "text.primary",
                                        }}
                                    >
                                        {item.description || "Không có mô tả"}
                                    </Typography>
                                }
                            />
                            <DetailRow
                                label="Chủ sở hữu"
                                value={item.ownerName || "N/A"}
                            />
                        </Stack>
                    </Box>
                </Grid>

                {/* Thông tin giá cả & số lượng */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                        sx={{
                            bgcolor: "grey.50",
                            borderRadius: 2,
                            p: 3,
                            height: "100%",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Giá cả & Số lượng
                        </Typography>
                        <Stack spacing={2.5}>
                            <DetailRow
                                label="Giá thuê/ngày"
                                value={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <DollarSign size={18} color="#16a34a" />
                                        <Typography variant="body1" fontWeight="bold" color="primary.main">
                                            {formatCurrency(item.price || 0)}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <DetailRow
                                label="Tiền cọc"
                                value={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Coins size={18} color="#f59e0b" />
                                        <Typography variant="body1" fontWeight="bold" color="warning.main">
                                            {formatCurrency(item.depositAmount || 0)}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <DetailRow
                                label="Số lượng"
                                value={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Package size={18} color="#2563eb" />
                                        <Typography variant="body1" fontWeight="bold">
                                            {item.quantity || 0} sản phẩm
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Stack>
                    </Box>
                </Grid>

                {/* Lý do từ chối (nếu có) */}
                {item.rejectionReason && (
                    <Grid size={12}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Lý do từ chối:
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {item.rejectionReason}
                            </Typography>
                        </Alert>
                    </Grid>
                )}

                {/* Hình ảnh minh họa */}
                <Grid size={12}>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Hình ảnh minh họa ({item.mediaUrls?.length || 0})
                        </Typography>
                        {item.mediaUrls && item.mediaUrls.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {item.mediaUrls.map((media, index) => (
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
                                    py: 6,
                                    textAlign: "center",
                                    color: "text.secondary",
                                    bgcolor: "grey.50",
                                    borderRadius: 2,
                                    border: "2px dashed",
                                    borderColor: "grey.300",
                                }}
                            >
                                <Typography variant="body1">Không có ảnh minh họa</Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Nút hành động */}
                <Grid size={12}>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        {status === "PENDING_APPROVAL" && (
                            <>
                                <CustomizedButton
                                    content="Duyệt sản phẩm"
                                    onClick={() => onAction("approve")}
                                    disabled={loading}
                                    size="small"
                                    color="#16a34a"
                                    icon={<CheckCircle size={16} />}
                                    className="font-semibold"
                                />
                                <CustomizedButton
                                    content="Từ chối"
                                    onClick={() => onAction("reject")}
                                    disabled={loading}
                                    size="small"
                                    color="#dc2626"
                                    icon={<XCircle size={16} />}
                                    className="font-semibold"
                                />
                            </>
                        )}

                        {status === "AVAILABLE" && (
                            <CustomizedButton
                                content="Khóa sản phẩm"
                                onClick={() => onAction("lock")}
                                disabled={loading}
                                size="small"
                                color="#f59e0b"
                                icon={<Lock size={16} />}
                                className="font-semibold"
                            />
                        )}

                        {(status === "BANNED" || status === "REJECTED") && (
                            <CustomizedButton
                                content="Mở khóa / Bỏ từ chối"
                                onClick={() => onAction("unlock")}
                                disabled={loading}
                                size="small"
                                color="#2563eb"
                                icon={<Unlock size={16} />}
                                className="font-semibold"
                            />
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

// Component helper để hiển thị một dòng thông tin
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
            {label}
        </Typography>
        <Box component="div">
            {typeof value === "string" ? (
                <Typography variant="body1" fontWeight="medium">
                    {value}
                </Typography>
            ) : (
                value
            )}
        </Box>
    </Box>
);