// app/profile/owned-items/ItemModal/ItemModal.tsx
"use client";

import { useEffect, useState } from "react";
import { PrimaryModal, PrimaryButton, OutlineButton } from "@/libs/components";
import { Item } from "@/libs/core/types";
import ItemDetail from "./ItemDetail";
import ItemForm from "./ItemForm";

type ModalMode = "view" | "edit" | "create";

interface ItemModalProps {
    open: boolean;
    onClose: () => void;
    item?: Item | null;
    mode: ModalMode;
    onSuccess?: () => void;
}

export default function ItemModal({ open, onClose, item, mode, onSuccess }: ItemModalProps) {
    const [isEditing, setIsEditing] = useState(mode === "create");

    useEffect(() => {
        setIsEditing(mode === "create");
    }, [mode, open]);

    const title = mode === "create" ? "Đăng sản phẩm mới" :
        isEditing ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm";

    return (
        <PrimaryModal open={open} onClose={onClose} title={title}>
            {mode === "create" || isEditing ? (
                <ItemForm item={item || undefined} onSuccess={() => { onSuccess?.(); onClose(); }} onCancel={onClose} />
            ) : item ? (
                <>
                    <ItemDetail item={item} />
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                        <OutlineButton content="Đóng" onClick={onClose} />
                        <PrimaryButton content="Chỉnh sửa" onClick={() => setIsEditing(true)}/>
                    </div>
                </>
            ) : null}
        </PrimaryModal>
    );
}