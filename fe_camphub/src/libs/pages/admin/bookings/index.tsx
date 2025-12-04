// app/admin/bookings/BookingList.tsx
"use client";

import { useState } from "react";
import { Chip, IconButton, Tooltip, Box, Typography, CircularProgress } from "@mui/material";
import { PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import BookingDetail from "./booking-detail";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "@/libs/api/booking-api";
import { Booking } from "@/libs/core/types";
import { BookingStatus } from "@/libs/core/constants";
import { Visibility } from "@mui/icons-material";
import { GridRenderCellParams } from "@mui/x-data-grid";


export const bookingStatusConfig: Record<
    BookingStatus,
    { label: string; color: "success" | "warning" | "error" | "info" | "default"; icon?: any }
> = {
    PENDING_CONFIRM: { label: "Chờ xác nhận", color: "warning" },
    WAITING_DELIVERY: { label: "Chờ giao đồ", color: "info" },
    IN_USE: { label: "Đang thuê", color: "info" },
    DUE_FOR_RETURN: { label: "Đến hạn trả", color: "warning" },
    RETURNED_PENDING_CHECK: { label: "Đã trả - Chờ kiểm tra", color: "info" },
    RETURN_REFUND_REQUESTED: { label: "Yêu cầu hoàn cọc", color: "warning" },
    RETURN_REFUND_PROCESSING: { label: "Đang xử lý hoàn cọc", color: "info" },
    WAITING_REFUND: { label: "Chờ hoàn cọc", color: "warning" },
    COMPLETED: { label: "Hoàn thành", color: "success" },
    DISPUTE_PENDING_REVIEW: { label: "Khiếu nại đang xử lý", color: "error" },
    COMPENSATION_COMPLETED: { label: "Đã bồi thường", color: "success" },
    LATE_RETURN: { label: "Trả trễ", color: "error" },
    OVERDUE: { label: "Quá hạn nghiêm trọng", color: "error" },
    DAMAGED_ITEM: { label: "Hỏng đồ", color: "error" },
    FORFEITED: { label: "Mất cọc", color: "error" },
    PAID_REJECTED: { label: "Bị từ chối", color: "default" },
};

export default function BookingList() {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [openDetail, setOpenDetail] = useState(false);

    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ["adminBookings"],
        queryFn: getAllBookings,
    });

    const handleView = (booking: Booking) => {
        setSelectedBooking(booking);
        setOpenDetail(true);
    };

    const columns = [
        {
            field: "id",
            headerName: "Mã đơn",
            width: 120,
            renderCell: (params: any) => (
                <span className="font-mono text-xs">{params.value.slice(0, 8)}</span>
            ),
        },
        {
            field: "lesseeName",
            headerName: "Người thuê",
            width: 180,
            renderCell: (params: any) => <strong>{params.value}</strong>,
        },
        {
            field: "lessorName",
            headerName: "Chủ đồ",
            width: 180,
            renderCell: (params: any) => <strong>{params.value}</strong>,
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 220,
            renderCell: (params: any) => (
                <Tooltip title={params.value}>
                    <span className="truncate block max-w-full">{params.value}</span>
                </Tooltip>
            ),
        },
        {
            field: "totalAmount",
            headerName: "Tổng tiền",
            width: 130,
            renderCell: (params: any) => (
                <span className="font-semibold text-green-600">
                    {params.value.toLocaleString()}₫
                </span>
            ),
        },
        {
            field: "depositAmount",
            headerName: "Cọc",
            width: 110,
            renderCell: (params: any) => (
                <span className="text-orange-600 font-medium">
                    {params.value.toLocaleString()}₫
                </span>
            ),
        },
        // Trong columns
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            renderCell: (params: GridRenderCellParams<Booking>) => {
                const status = params.row.status as BookingStatus;
                const config = bookingStatusConfig[status] || { label: status, color: "default" as const };

                return (
                    <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        variant="outlined"
                    />
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Ngày tạo",
            width: 120,
            renderCell: (params: any) => new Date(params.value).toLocaleDateString("vi-VN"),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            renderCell: (params: any) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton color="primary" onClick={() => handleView(params.row)}>
                        <Visibility />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                <CircularProgress />
                <Typography ml={2}>Đang tải danh sách đơn thuê...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={10}>
                <Typography color="error">Lỗi tải dữ liệu: {(error as any).message}</Typography>
            </Box>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6">
                <Typography variant="h5" fontWeight="bold" mb={4}>
                    Quản lý đơn thuê ({bookings.length})
                </Typography>

                <PrimaryDataGrid<Booking>
                    rows={bookings}
                    columns={columns}
                    loading={isLoading}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    onRowClick={handleView}
                    getRowId={(row) => row.id}
                />
            </Box>

            <PrimaryModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                title={selectedBooking ? `Chi tiết đơn #${selectedBooking.id.slice(0, 8)}` : "Chi tiết đơn thuê"}
            >
                {selectedBooking && <BookingDetail booking={selectedBooking} />}
            </PrimaryModal>
        </div>
    );
}