"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface PrimaryModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    onSave?: () => void;
    children: ReactNode;
    isCreate?: boolean;
}

export default function PrimaryModal({ open, title, onClose, onSave, children, isCreate }: PrimaryModalProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="font-bold text-lg flex justify-between items-center">
                {title}
                <div className="w-8 h-8 float-right cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose}>
                    <X/>
                </div>
            </DialogTitle>
            <DialogContent dividers>{children}</DialogContent>
        </Dialog>
    );
}
