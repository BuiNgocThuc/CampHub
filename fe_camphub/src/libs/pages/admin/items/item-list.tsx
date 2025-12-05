// app/admin/items/ItemList.tsx
"use client";

import { useState } from "react";
import { PrimaryDataGrid, PrimaryModal, PrimarySelectField } from "@/libs/components";
import { Chip, IconButton, Box, Typography, CircularProgress } from "@mui/material";
import { Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllItems, approveItem, lockItem } from "@/libs/api/item-api";
import { getAllCategories } from "@/libs/api/category-api";
import { Item, Category } from "@/libs/core/types";
import ItemDetail from "./item-detail";
import { toast } from "sonner";
import { ItemStatus } from "@/libs/core/constants";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const itemStatusConfig: Record<ItemStatus, { label: string; color: any }> = {
    PENDING_APPROVAL: { label: "Chờ duyệt", color: "warning" },
    AVAILABLE: { label: "Đang hiển thị", color: "success" },
    REJECTED: { label: "Bị từ chối", color: "error" },
    RENTED_PENDING_CONFIRM: { label: "Chờ xác nhận thuê", color: "warning" },
    RENTED: { label: "Đang thuê", color: "info" },
    RETURN_PENDING_CHECK: { label: "Chờ kiểm tra trả", color: "info" },
    BANNED: { label: "Bị cấm", color: "error" },
    DELETED: { label: "Đã xóa", color: "default" },
    MISSING: { label: "Mất tích", color: "error" },
};

export default function ItemList() {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    const { data: items = [], isLoading } = useQuery({
        queryKey: ["adminItems", statusFilter, categoryFilter] as const,
        queryFn: async () => await getAllItems(statusFilter || undefined, categoryFilter || undefined),
    });

    const mutation = useMutation({
        mutationFn: async ({ id, action }: { id: string; action: "approve" | "reject" | "lock" | "unlock" }) => {
            if (action === "approve") return approveItem(id, true);
            if (action === "reject") return approveItem(id, false);
            if (action === "lock") return lockItem(id, true);
            if (action === "unlock") return lockItem(id, false);
            throw new Error("Hành động không hợp lệ");
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["adminItems"] });
            const actionMessages: Record<string, string> = {
                approve: "Đã duyệt sản phẩm thành công!",
                reject: "Đã từ chối sản phẩm thành công!",
                lock: "Đã khóa sản phẩm thành công!",
                unlock: "Đã mở khóa sản phẩm thành công!",
            };
            toast.success(actionMessages[variables.action] || "Cập nhật trạng thái thành công!");
            setOpenDetail(false);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Cập nhật thất bại!";
            toast.error(errorMessage);
        },
    });

    const columns: GridColDef<Item>[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            renderCell: (params: GridRenderCellParams<Item>) => {
                const index = items.findIndex((item) => item.id === params.row.id);
                return <Typography>{index + 1}</Typography>;
            },
        },
        { field: "name", headerName: "Tên sản phẩm", width: 200, flex: 1.5, minWidth: 150 },
        { field: "ownerName", headerName: "Chủ sở hữu", width: 150, flex: 1, minWidth: 120 },
        {
            field: "price",
            headerName: "Giá thuê/ngày",
            width: 140,
            flex: 0.9,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams<Item>) => {
                const price = params.row.price;
                if (price == null || isNaN(Number(price))) return <Typography>N/A</Typography>;
                return (
                    <Typography fontWeight="bold" color="primary" fontSize="0.875rem">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(Number(price) ?? 0)}
                    </Typography>
                );
            },
        },
        {
            field: "depositAmount",
            headerName: "Tiền cọc",
            width: 140,
            flex: 0.9,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams<Item>) => {
                const deposit = params.row.depositAmount;
                if (deposit == null || isNaN(Number(deposit))) return <Typography>N/A</Typography>;
                return (
                    <Typography fontWeight="bold" color="primary" fontSize="0.875rem">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(Number(deposit) ?? 0)}
                    </Typography>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            flex: 1,
            minWidth: 130,
            renderCell: (params: GridRenderCellParams<Item>) => {
                const status = params.row.status as ItemStatus;
                const config = itemStatusConfig[status] || { label: status, color: "default" };
                return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
            },
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            flex: 0,
            sortable: false,
            renderCell: (params: GridRenderCellParams<Item>) => (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(params.row);
                        setOpenDetail(true);
                    }}
                >
                    <Eye size={16} />
                </IconButton>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" my={12} gap={2}>
                <CircularProgress size={24} />
                <Typography variant="body1">Đang tải danh sách sản phẩm...</Typography>
            </Box>
        );
    }

    return (
        <>
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Danh sách sản phẩm ({items.length})
                    </Typography>

                    {/* Filters */}
                    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                        <Box minWidth={200}>
                            <PrimarySelectField
                                size="small"
                                label="Lọc theo trạng thái"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { value: "", label: "Tất cả trạng thái" },
                                    ...Object.entries(itemStatusConfig).map(([key, config]) => ({
                                        value: key,
                                        label: config.label,
                                    })),
                                ]}
                            />
                        </Box>
                        <Box minWidth={200}>
                            <PrimarySelectField
                                size="small"
                                label="Lọc theo danh mục"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                disabled={loadingCategories}
                                options={[
                                    { value: "", label: loadingCategories ? "Đang tải..." : "Tất cả danh mục" },
                                    ...categories.map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                    })),
                                ]}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <PrimaryDataGrid<Item>
                        rows={items}
                        columns={columns}
                        loading={isLoading}
                        getRowId={(row) => row.id}
                        onRowClick={(item: Item) => {
                            setSelectedItem(item);
                            setOpenDetail(true);
                        }}
                    />
                </Box>
            </Box>

            <PrimaryModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                title={selectedItem ? `Chi tiết: ${selectedItem.name}` : "Chi tiết sản phẩm"}
            >
                {selectedItem && (
                    <ItemDetail
                        item={selectedItem}
                        onAction={(action) => mutation.mutate({ id: selectedItem.id, action })}
                        loading={mutation.isPending}
                    />
                )}
            </PrimaryModal>
        </>
    );
}