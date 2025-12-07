"use client";

import { useState } from "react";
import { PrimaryModal, PrimaryButton, OutlineButton, PrimaryTextField } from "@/libs/components";
import { Box } from "@mui/material";

interface RejectItemModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (rejectionReason: string) => void;
    itemName?: string;
    loading?: boolean;
}

export default function RejectItemModal({
    open,
    onClose,
    onConfirm,
    itemName,
    loading = false,
}: RejectItemModalProps) {
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        if (!reason.trim()) {
            return; // Không cho phép submit nếu rỗng
        }
        onConfirm(reason.trim());
        setReason(""); // Reset sau khi confirm
    };

    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <PrimaryModal
            open={open}
            onClose={handleClose}
            title="Từ chối sản phẩm"
            maxWidth="sm"
        >
            <Box sx={{ p: 2 }}>
                {itemName && (
                    <Box sx={{ mb: 2 }}>
                        <strong>Sản phẩm:</strong> {itemName}
                    </Box>
                )}
                <PrimaryTextField
                    label="Lý do từ chối *"
                    placeholder="Nhập lý do từ chối sản phẩm..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    multiline
                    rows={4}
                    required
                    fullWidth
                />
                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                    <OutlineButton
                        content="Hủy"
                        onClick={handleClose}
                        disabled={loading}
                    />
                    <PrimaryButton
                        content={loading ? "Đang xử lý..." : "Xác nhận từ chối"}
                        onClick={handleConfirm}
                        disabled={loading || !reason.trim()}
                    />
                </Box>
            </Box>
        </PrimaryModal>
    );
}

