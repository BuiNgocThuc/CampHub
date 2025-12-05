// app/admin/items/ItemList.tsx
"use client";

import { useState } from "react";
import { PrimaryDataGrid, PrimaryModal, PrimarySelectField } from "@/libs/components";
import { Chip, IconButton, Box, Typography, CircularProgress, Grid } from "@mui/material";
import { Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllItems, approveItem, lockItem } from "@/libs/api/item-api";
import { getAllCategories } from "@/libs/api/category-api";
import { Item, Category } from "@/libs/core/types";
import ItemDetail from "./item-detail";
import { toast } from "sonner";
import { ItemStatus } from "@/libs/core/constants";

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

    const columns = [
        { field: "name", headerName: "Tên sản phẩm", width: 340 },
        { field: "ownerName", headerName: "Chủ sở hữu", width: 180 },
        {
            field: "price",
            headerName: "Giá thuê/ngày",
            width: 140,
            renderCell: (params: any) => {
                const price = params.row.price;
                if (price == null || isNaN(Number(price))) return "N/A";
                return `${Number(price).toLocaleString("vi-VN")}₫`;
            },
        },
        {
            field: "depositAmount",
            headerName: "Tiền cọc",
            width: 140,
            renderCell: (params: any) => {
                const deposit = params.row.depositAmount;
                if (deposit == null || isNaN(Number(deposit))) return "N/A";
                return `${Number(deposit).toLocaleString("vi-VN")}₫`;
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params: any) => {
                const status = params.row.status as ItemStatus;
                const config = itemStatusConfig[status] || { label: status, color: "default" };
                return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
            },
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            renderCell: (params: any) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(params.row);
                        setOpenDetail(true);
                    }}
                >
                    <Eye size={20} />
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Typography variant="h6" fontWeight="bold">
                    Danh sách sản phẩm ({items.length})
                </Typography>

                {/* Filters */}
                <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    <Box minWidth={200}>
                        <PrimarySelectField
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