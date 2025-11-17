"use client";
import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { PrimaryTable, PrimaryModal } from "@/libs/components";
import { mockDamageTypes } from "@/libs/utils/mock-data";
import { DamageType } from "@/libs/core/types";
import DamageTypeForm from "./damage-type-detail";

export default function DamageTypeManagement() {
    const [damageTypes, setDamageTypes] = useState<DamageType[]>(mockDamageTypes);
    const [selected, setSelected] = useState<DamageType | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);

    const handleEdit = (damage: DamageType) => {
        setSelected(damage);
        setIsCreate(false);
        setOpenModal(true);
    };

    const handleCreate = () => {
        setSelected(null);
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc muốn xóa loại hư tổn này không?")) {
            setDamageTypes((prev) => prev.filter((d) => d.id !== id));
        }
    };

    const handleSave = (data: DamageType) => {
        if (isCreate) {
            setDamageTypes((prev) => [...prev, { ...data, id: `DT${prev.length + 1}` }]);
        } else {
            setDamageTypes((prev) =>
                prev.map((d) => (d.id === data.id ? { ...d, ...data } : d))
            );
        }
        setOpenModal(false);
    };

    const columns = [
        { field: "id", headerName: "Mã", render: (row: DamageType) => row.id },
        { field: "name", headerName: "Tên loại hư tổn", render: (row: DamageType) => row.name },
        {
            field: "compensationRate",
            headerName: "Tỷ lệ bồi thường",
            render: (row: DamageType) => `${(row.compensationRate * 100).toFixed(0)}%`,
        },
        {
            field: "actions",
            headerName: "Thao tác",
            render: (row: DamageType) => (
                <div className="flex space-x-2">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
                        <Edit size={18} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}>
                        <Trash2 size={18} />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý loại hư tổn</h1>
                <Button variant="contained" onClick={handleCreate}>
                    + Thêm loại hư tổn
                </Button>
            </div>

            <PrimaryTable columns={columns} rows={damageTypes} />

            <PrimaryModal
                open={openModal}
                title={isCreate ? "Thêm loại hư tổn" : "Cập nhật loại hư tổn"}
                onClose={() => setOpenModal(false)}
            >
                <DamageTypeForm
                    initialData={selected}
                    onSave={handleSave}
                    onCancel={() => setOpenModal(false)}
                />
            </PrimaryModal>
        </div>
    );
}
