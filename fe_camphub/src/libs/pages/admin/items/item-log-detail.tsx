// app/admin/items/ItemLogDetail.tsx
"use client";

import React from "react";
import { Box, Divider, Typography, Chip, Stack, Paper } from "@mui/material";
import { format } from "date-fns";
import { ItemLog } from "@/libs/core/types";
import { ItemActionType } from "@/libs/core/constants";
import { MediaPreview } from "@/libs/components";

interface ItemLogDetailProps {
    log: ItemLog;
}

const actionLabels: Record<ItemActionType, string> = {
    CREATE: "Tạo sản phẩm",
    UPDATE: "Cập nhật thông tin",
    DELETE: "Xóa sản phẩm",
    APPROVE: "Duyệt sản phẩm",
    REJECT: "Từ chối sản phẩm",
    LOCK: "Khóa sản phẩm",
    UNLOCK: "Mở khóa sản phẩm",
    RENT: "Thuê sản phẩm",
    APPROVE_RENTAL: "Duyệt đơn thuê",
    REJECT_RENTAL: "Từ chối đơn thuê",
    DELIVER: "Giao hàng",
    RETURN: "Trả hàng",
    CHECK_RETURN: "Kiểm tra trả hàng",
    REFUND: "Hoàn tiền",
    DAMAGE_REPORTED: "Báo hỏng",
    RETURN_REQUESTED: "Yêu cầu trả hàng",
    UNRETURNED: "Không trả đúng hạn",
};

export default function ItemLogDetail({ log }: ItemLogDetailProps) {
    return (
        <Box sx={{ minWidth: 600, maxWidth: 800 }}>
            <Stack spacing={3}>
                {/* Header */}
                <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                        {actionLabels[log.action] || log.action}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Typography variant="body2" color="text.secondary">
                            <strong>Người thực hiện:</strong> {log.account || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            •
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Thời gian:</strong> {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss")}
                        </Typography>
                    </Stack>
                </Paper>

                <Divider />

                {/* Thông tin sản phẩm */}
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                        Thông tin sản phẩm
                    </Typography>
                    <GridRow label="Tên sản phẩm" value={log.itemName} />
                    <GridRow label="Mã sản phẩm" value={log.itemId} />
                </Box>

                {/* Thay đổi trạng thái */}
                {(log.previousStatus || log.currentStatus) && (
                    <>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                Thay đổi trạng thái
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                                {log.previousStatus ? (
                                    <Chip
                                        label={log.previousStatus}
                                        size="small"
                                        color="default"
                                        variant="outlined"
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.disabled">
                                        —
                                    </Typography>
                                )}
                                <Typography variant="body1" color="text.secondary" fontWeight="bold">
                                    →
                                </Typography>
                                <Chip
                                    label={log.currentStatus || "—"}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: "bold" }}
                                />
                            </Box>
                        </Box>
                    </>
                )}

                {/* Ghi chú */}
                {log.note && (
                    <>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                Ghi chú
                            </Typography>
                            <Box
                                sx={{
                                    bgcolor: "grey.50",
                                    p: 2.5,
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "grey.200",
                                    mt: 1,
                                }}
                            >
                                <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
                                    {log.note}
                                </Typography>
                            </Box>
                        </Box>
                    </>
                )}

                {/* Minh chứng */}
                {log.media && log.media.length > 0 && (
                    <>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                Minh chứng ({log.media.length})
                            </Typography>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
                                    gap: 2,
                                    mt: 2,
                                }}
                            >
                                {log.media.map((m, i) => (
                                    <MediaPreview
                                        key={i}
                                        url={m.url}
                                        size="large"
                                        showRemove={false}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </>
                )}
            </Stack>
        </Box>
    );
}

const GridRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
            {label}:
        </Typography>
        <Typography variant="body2" fontWeight="medium" sx={{ textAlign: "right", maxWidth: "60%" }}>
            {value}
        </Typography>
    </Box>
);