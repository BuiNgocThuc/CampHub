"use client";

import { useState } from "react";
import { PrimaryTable, PrimaryModal, PrimaryTextField } from "@/libs/components";
import { Button, IconButton, Chip } from "@mui/material";
import { Pencil, Trash2, Plus, Eye, Delete } from "lucide-react";

// ✅ Mock data tạm thời
const mockCategories = [
    { id: "1", name: "Lều trại", description: "Các loại lều cắm trại", isDeleted: false },
    { id: "2", name: "Phụ kiện", description: "Đèn pin, dao, túi ngủ...", isDeleted: false },
    { id: "3", name: "Thiết bị nấu ăn", description: "Bếp gas, bình mini, nồi...", isDeleted: true },
];

export default function CategoryList() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);

    // ✅ Lọc bỏ danh mục đã xoá
    const activeCategories = mockCategories.filter((cat) => !cat.isDeleted);

    const columns = [
        { field: "name", headerName: "Tên danh mục" },
        { field: "description", headerName: "Mô tả" },
        {
            field: "actions",
            headerName: "Thao tác",
            render: (row: any) => (
                <div className="flex gap-1">
                    {!row.isDeleted && (
                        <IconButton
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(row);
                                setIsCreateMode(false);
                                setOpenModal(true);
                            }}
                        >
                            <Pencil size={18} />
                        </IconButton>
                    )}
                    <IconButton
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row);
                        }}
                    >
                        <Trash2 size={18} />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh mục sản phẩm</h2>
                <Button
                    variant="contained"
                    onClick={() => {
                        setSelectedCategory(null);
                        setIsCreateMode(true);
                        setOpenModal(true);
                    }}
                >
                    + Thêm danh mục
                </Button>
            </div>

            <PrimaryTable columns={columns} rows={activeCategories} />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={isCreateMode ? "Tạo danh mục mới" : "Chi tiết danh mục"}
                isCreate={isCreateMode}
                onSave={() => console.log("Saved!")}
            >
                <CategoryForm
                    category={selectedCategory || undefined}
                    isCreateMode={isCreateMode}
                    onSave={(data) => console.log("Saved data:", data)}
                />
            </PrimaryModal>
        </div>
    );
}

type CategoryFormData = {
    name: string;
    description: string;
    isDeleted: boolean;
};

function CategoryForm({
    category,
    isCreateMode,
    onSave,
}: {
    category?: CategoryFormData;
    isCreateMode: boolean;
    onSave: (data: CategoryFormData) => void;
}) {
    const [form, setForm] = useState(
        category || { name: "", description: "", isDeleted: false }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev: CategoryFormData) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4">
            <PrimaryTextField
                label="Tên danh mục"

                size="small"
                value={form.name}
                onChange={handleChange}
                required
            />
            <PrimaryTextField
                label="Mô tả"
                size="small"
                value={form.description}
                onChange={handleChange}
                multiline
            />

            <div className="flex justify-end pt-4">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSave(form)}
                >
                    {isCreateMode ? "Tạo mới" : "Lưu thay đổi"}
                </Button>
            </div>
        </div>
    );
}
function handleDelete(row: any) {
    alert(`Xoá danh mục: ${row.name}`);
}

