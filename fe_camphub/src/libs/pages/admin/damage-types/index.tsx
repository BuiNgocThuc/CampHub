// app/admin/damage-types/DamageTypeManagement.tsx
"use client";

import { useState } from "react";
import { Button, IconButton, Chip, Box, Typography, CircularProgress } from "@mui/material";
import { Edit, Trash2, Plus } from "lucide-react";
import { PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllDamageTypes,
    createDamageType,
    updateDamageType,
    deleteDamageType,
} from "@/libs/api/damage-type-api";
import { DamageType } from "@/libs/core/types";
import DamageTypeForm from "./damage-type-detail";
import { toast } from "sonner";

export default function DamageTypeManagement() {
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);
    const [selected, setSelected] = useState<DamageType | null>(null);
    const [isCreate, setIsCreate] = useState(false);

    // Fetch data
    const { data: damageTypes = [], isLoading } = useQuery({
        queryKey: ["damageTypes"],
        queryFn: getAllDamageTypes,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createDamageType,
        onSuccess: () => {
            toast.success("Thêm loại hư tổn thành công!");
            queryClient.invalidateQueries({ queryKey: ["damageTypes"] });
            setOpenModal(false);
        },
        onError: () => toast.error("Thêm thất bại"),
    });

    const updateMutation = useMutation({
        mutationFn: updateDamageType,
        onSuccess: () => {
            toast.success("Cập nhật thành công!");
            queryClient.invalidateQueries({ queryKey: ["damageTypes"] });
            setOpenModal(false);
        },
        onError: () => toast.error("Cập nhật thất bại"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDamageType,
        onSuccess: () => {
            toast.success("Xóa thành công!");
            queryClient.invalidateQueries({ queryKey: ["damageTypes"] });
        },
        onError: () => toast.error("Xóa thất bại"),
    });

    const handleCreate = () => {
        setSelected(null);
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleEdit = (damage: DamageType) => {
        setSelected(damage);
        setIsCreate(false);
        setOpenModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa loại hư tổn này?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleSave = (data: DamageType) => {
        if (isCreate) {
            createMutation.mutate(data);
        } else {
            updateMutation.mutate(data);
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Mã",
            width: 120,
            renderCell: (params: any) => (
                <Typography fontFamily="monospace" fontSize="0.875rem" color="text.secondary">
                    {params.value.slice(0, 8)}
                </Typography>
            ),
        },
        {
            field: "name",
            headerName: "Tên loại hư tổn",
            width: 300,
            renderCell: (params: any) => (
                <Typography fontWeight="medium">{params.value}</Typography>
            ),
        },
        {
            field: "description",
            headerName: "Mô tả",
            width: 400,
            renderCell: (params: any) => (
                <Typography variant="body2" color="text.secondary">
                    {params.value || "—"}
                </Typography>
            ),
        },
        {
            field: "compensationRate",
            headerName: "Tỷ lệ bồi thường",
            width: 180,
            renderCell: (params: any) => (
                <Chip
                    label={`${(params.value * 100).toFixed(0)}%`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                />
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 140,
            renderCell: (params: any) => (
                <Box display="flex" gap={1}>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(params.row);
                        }}
                    >
                        <Edit size={18} />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(params.row.id);
                        }}
                    >
                        <Trash2 size={18} />
                    </IconButton>
                </Box>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" my={10} gap={2}>
                <CircularProgress />
                <Typography>Đang tải danh sách loại hư tổn...</Typography>
            </Box>
        );
    }

    return (
        <Box p={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight="bold">
                    Quản lý loại hư tổn
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={handleCreate}
                    size="large"
                >
                    Thêm loại hư tổn
                </Button>
            </Box>

            <PrimaryDataGrid<DamageType>
                rows={damageTypes}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.id}
            />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={isCreate ? "Thêm loại hư tổn mới" : "Chỉnh sửa loại hư tổn"}
            >
                <DamageTypeForm
                    initialData={selected}
                    onSave={handleSave}
                    onCancel={() => setOpenModal(false)}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            </PrimaryModal>
        </Box>
    );
}