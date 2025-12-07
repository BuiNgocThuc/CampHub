"use client";

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { PrimaryButton, OutlineButton, CustomizedButton } from "@/libs/components";
interface PrimaryConfirmationProps {
    open: boolean;
    title: string;
    message: string;
    warningMessage?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: string;
    loading?: boolean;
}

export default function PrimaryConfirmation({
    open,
    title,
    message,
    warningMessage,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    onConfirm,
    onCancel,
    confirmColor = "#EF4444",
    loading = false,
}: PrimaryConfirmationProps) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                    {warningMessage && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 font-semibold text-sm">
                                ⚠️ {warningMessage}
                            </p>
                        </div>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions className="px-4 pb-4">
                <OutlineButton
                    content={cancelText}
                    onClick={onCancel}
                    disabled={loading}
                />
                <CustomizedButton
                    content={loading ? "Đang xử lý..." : confirmText}
                    color={confirmColor}
                    onClick={onConfirm}
                    disabled={loading}
                    className="hover:opacity-90 text-white"
                />
            </DialogActions>
        </Dialog>
    );
}

