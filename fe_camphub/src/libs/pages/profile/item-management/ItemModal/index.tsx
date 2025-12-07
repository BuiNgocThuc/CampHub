// app/profile/owned-items/ItemModal/ItemModal.tsx
"use client";

import { PrimaryModal } from "@/libs/components";
import { Item } from "@/libs/core/types";
import ItemForm from "./ItemForm";
import ItemDetail from "./ItemDetail";

type ModalMode = "view" | "edit" | "create";

interface ItemModalProps {
    open: boolean;
    onClose: () => void;
    item?: Item | null;
    mode: ModalMode;
    onSuccess?: () => void;
}

export default function ItemModal({ open, onClose, item, mode, onSuccess }: ItemModalProps) {
    console.log(mode);

    const getTitle = () => {
        if (mode === "view") return "Chi tiết sản phẩm";
        if (mode === "edit") return "Chỉnh sửa sản phẩm";
        return "Đăng sản phẩm mới";
    };

    return (
        <PrimaryModal open={open} onClose={onClose} title={getTitle()}>
            {mode === "view" && item ? (
                <ItemDetail item={item} />
            ) : (
                <ItemForm
                    item={item || undefined}
                    onSuccess={() => {
                        onSuccess?.();
                        onClose();
                    }}
                    onCancel={onClose}
                />
            )}
        </PrimaryModal>
    );
}