"use client";

import { useState } from "react";
import {
    IconButton,
    Chip,
    Box,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
} from "@mui/material";
import { Eye, Trash2, Plus } from "lucide-react";
import { PrimaryDataGrid, PrimaryModal, PrimaryButton, PrimaryAlert, OutlineButton, CustomizedButton } from "@/libs/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllDamageTypes,
    createDamageType,
    updateDamageType,
    deleteDamageType,
} from "@/libs/api/damage-type-api";
import { DamageType } from "@/libs/core/types";
import DamageTypeForm from "./damage-type-detail";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export default function DamageTypeManagement() {
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selected, setSelected] = useState<DamageType | null>(null);
    const [isCreate, setIsCreate] = useState(false);
    const [alert, setAlert] = useState<{
        content: string;
        type: "success" | "error" | "warning" | "info";
        duration: number;
    } | null>(null);

    // Fetch data
    const { data: damageTypes = [], isLoading } = useQuery({
        queryKey: ["damageTypes"],
        queryFn: getAllDamageTypes,
    });

    const showAlert = (
        content: string,
        type: "success" | "error" | "warning" | "info",
        duration = 2000
    ) => {
        setAlert({ content, type, duration });
    };

    // Mutations
    const createMutation = useMutation({
        mutationFn: createDamageType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["damageTypes"] });
            setOpenModal(false);
            setSelected(null);
            setIsCreate(false);
            showAlert("Thêm loại hư tổn thành công!", "success");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Thêm thất bại";
            showAlert(errorMessage, "error");
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateDamageType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["damageTypes"] });
            setOpenModal(false);
            setSelected(null);
            setIsCreate(false);
            showAlert("Cập nhật loại hư tổn thành công!", "success");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Cập nhật thất bại";
            showAlert(errorMessage, "error");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDamageType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["damageTypes"] });
            setOpenDeleteDialog(false);
            setSelected(null);
            showAlert("Xóa loại hư tổn thành công!", "success");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Xóa thất bại";
            showAlert(errorMessage, "error");
        },
    });

    const handleCreate = () => {
        setSelected(null);
        setIsCreate(true);
        setOpenModal(true);
    };

    const handleView = (damage: DamageType) => {
        setSelected(damage);
        setIsCreate(false);
        setOpenModal(true);
    };

    const handleDeleteClick = (damage: DamageType) => {
        setSelected(damage);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (selected) {
            deleteMutation.mutate(selected.id);
        }
    };

    const handleSave = (data: DamageType) => {
        if (isCreate) {
            createMutation.mutate(data);
        } else {
            if (data.id) {
                updateMutation.mutate(data);
            }
        }
    };

    const columns: GridColDef<DamageType>[] = [
        {
            field: "name",
            headerName: "Tên loại hư tổn",
            width: 250,
            flex: 1.5,
            minWidth: 200,
            align: "left",
            headerAlign: "left",
            renderCell: (params: GridRenderCellParams<DamageType>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.name}
                </Typography>
            ),
        },
        {
            field: "description",
            headerName: "Mô tả",
            width: 400,
            flex: 2,
            minWidth: 300,
            align: "left",
            headerAlign: "left",
            renderCell: (params: GridRenderCellParams<DamageType>) => (
                <Typography fontSize="0.875rem" color="text.secondary">
                    {params.row.description || "—"}
                </Typography>
            ),
        },
        {
            field: "compensationRate",
            headerName: "Tỷ lệ bồi thường",
            width: 150,
            flex: 1,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<DamageType>) => (
                <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                    <Chip
                        label={`${((params.row.compensationRate || 0) * 100).toFixed(0)}%`}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                    />
                </Box>
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 120,
            flex: 0,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<DamageType>) => (
                <Box display="flex" gap={0.5}>
                    <Tooltip title="Xem chi tiết">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleView(params.row);
                            }}
                        >
                            <Eye size={16} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(params.row);
                            }}
                        >
                            <Trash2 size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}>
                <CircularProgress />
                <Typography>Đang tải danh sách loại hư tổn...</Typography>
            </Box>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý loại hư tổn ({damageTypes.length})
                    </Typography>
                    <PrimaryButton
                        content="Thêm loại hư tổn"
                        icon={<Plus size={16} />}
                        onClick={handleCreate}
                        className="text-sm px-3 py-1.5"
                    />
                </Box>

                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <PrimaryDataGrid<DamageType>
                        rows={damageTypes}
                        columns={columns}
                        loading={isLoading}
                        getRowId={(row) => row.id}
                    />
                </Box>
            </Box>

            <PrimaryModal
                maxWidth="sm"
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelected(null);
                    setIsCreate(false);
                }}
                title={isCreate ? "Thêm loại hư tổn mới" : "Chi tiết loại hư tổn"}
            >
                <DamageTypeForm
                    initialData={selected}
                    onSave={handleSave}
                    onCancel={() => {
                        setOpenModal(false);
                        setSelected(null);
                        setIsCreate(false);
                    }}
                    isLoading={createMutation.isPending}
                    isCreate={isCreate}
                />
            </PrimaryModal>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelected(null);
                }}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa loại hư tổn "{selected?.name}"? Hành động này không thể hoàn tác.
                        {selected && (
                            <Typography component="div" mt={2} color="error" fontWeight="bold">
                                ⚠️ Lưu ý: Nếu loại hư tổn này đã được sử dụng trong khiếu nại, bạn sẽ không thể xóa!
                            </Typography>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <OutlineButton
                        content="Hủy"
                        onClick={() => {
                            setOpenDeleteDialog(false);
                            setSelected(null);
                        }}
                    />
                    <CustomizedButton
                        content={deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                        onClick={handleDeleteConfirm}
                        disabled={deleteMutation.isPending}
                        color="red"
                    />
                </DialogActions>
            </Dialog>

            {/* Alert */}
            {alert && (
                <PrimaryAlert
                    content={alert.content}
                    type={alert.type}
                    duration={alert.duration}
                    onClose={() => setAlert(null)}
                />
            )}
        </div>
    );
}