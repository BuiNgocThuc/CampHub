// app/admin/items/ItemList.tsx
"use client";

import { useState } from "react";
import { PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import { Chip, IconButton, Box, Typography, CircularProgress } from "@mui/material";
import { Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllItems, approveItem, lockItem } from "@/libs/api/item-api";
import { Item } from "@/libs/core/types";
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
    const queryClient = useQueryClient();

    const { data: items = [], isLoading } = useQuery({
        queryKey: ["adminItems"] as const,
        queryFn: async () => await getAllItems(),
    });

    const mutation = useMutation({
        mutationFn: async ({ id, action }: { id: string; action: "approve" | "reject" | "lock" | "unlock" }) => {
            if (action === "approve") return approveItem(id, true);
            if (action === "reject") return approveItem(id, false);
            if (action === "lock") return lockItem(id, true);
            if (action === "unlock") return lockItem(id, false);
            throw new Error("Hành động không hợp lệ");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminItems"] });
            toast.success("Cập nhật trạng thái thành công!");
            setOpenDetail(false);
        },
        onError: () => toast.error("Cập nhật thất bại!"),
    });

    const columns = [
        { field: "name", headerName: "Tên sản phẩm", width: 340 },
        { field: "ownerName", headerName: "Chủ sở hữu", width: 180 },
        {
            field: "pricePerDay",
            headerName: "Giá thuê/ngày",
            width: 140,
            renderCell: (params: any) => `${Number(params.row.pricePerDay).toLocaleString()}₫`,
        },
        {
            field: "depositAmount",
            headerName: "Tiền cọc",
            width: 140,
            renderCell: (params: any) => `${Number(params.row.depositAmount).toLocaleString()}₫`,
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h6" fontWeight="bold">
                    Danh sách sản phẩm ({items.length})
                </Typography>
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