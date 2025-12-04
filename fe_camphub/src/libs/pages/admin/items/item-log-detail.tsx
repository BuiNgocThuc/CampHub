// app/admin/items/ItemLogDetail.tsx
"use client";

import { Box, Divider, Typography, Chip } from "@mui/material";
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
        <Box sx={{ minWidth: 600 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {actionLabels[log.action] || log.action}
                </Typography>
                <Typography color="text.secondary">
                    Thực hiện bởi: <strong>{log.account}</strong> •{" "}
                    {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss")}
                </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ spaceY: 3 }}>
                <Box>
                    <Typography fontWeight="medium" color="text.secondary" gutterBottom>
                        Sản phẩm
                    </Typography>
                    <Typography>
                        <strong>{log.itemName}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ID: {log.itemId}
                    </Typography>
                </Box>

                {(log.previousStatus || log.currentStatus) && (
                    <Box>
                        <Typography fontWeight="medium" color="text.secondary" gutterBottom>
                            Thay đổi trạng thái
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Chip
                                label={log.previousStatus || "—"}
                                size="small"
                                color="default"
                            />
                            <Typography>→</Typography>
                            <Chip
                                label={log.currentStatus}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                )}

                {log.note && (
                    <Box>
                        <Typography fontWeight="medium" color="text.secondary" gutterBottom>
                            Ghi chú
                        </Typography>
                        <Typography
                            sx={{
                                bgcolor: "grey.50",
                                p: 2,
                                borderRadius: 2,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {log.note}
                        </Typography>
                    </Box>
                )}

                {log.media && log.media.length > 0 && (
                    <Box>
                        <Typography fontWeight="medium" color="text.secondary" gutterBottom>
                            Minh chứng ({log.media.length})
                        </Typography>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                            {log.media.map((m, i) => (
                                <MediaPreview
                                    key={i}
                                    url={m.url}
                                    size="large"
                                    showRemove={false}
                                />
                            ))}
                        </div>
                    </Box>
                )}
            </Box>
        </Box>
    );
}