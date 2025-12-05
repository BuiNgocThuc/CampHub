// app/admin/bookings/BookingList.tsx
"use client";

import { useState } from "react";
import { Chip, IconButton, Tooltip, Box, Typography, CircularProgress } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { PrimaryDataGrid, PrimaryModal, PrimarySelectField } from "@/libs/components";
import BookingDetail from "./booking-detail";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings, getBookingById } from "@/libs/api/booking-api";
import { Booking } from "@/libs/core/types";
import { BookingStatus } from "@/libs/core/constants";
import { Visibility } from "@mui/icons-material";


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
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");

    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ["adminBookings"],
        queryFn: getAllBookings,
    });

    const filteredBookings = bookings.filter((booking) => {
        if (!statusFilter) return true;
        return booking.status === statusFilter;
    });

    const {
        data: bookingDetail,
        isLoading: isLoadingDetail,
        error: detailError,
    } = useQuery({
        queryKey: ["adminBookingDetail", selectedBooking?.id],
        queryFn: () => getBookingById(selectedBooking!.id),
        enabled: !!selectedBooking,
    });

    const handleView = (booking: Booking) => {
        setSelectedBooking(booking);
        setOpenDetail(true);
    };

    const columns: GridColDef<Booking>[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Booking>) => {
                const index = filteredBookings.findIndex((booking) => booking.id === params.row.id);
                return <Typography>{index + 1}</Typography>;
            },
        },
        {
            field: "lesseeName",
            headerName: "Người thuê",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Booking>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.lesseeName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "lessorName",
            headerName: "Chủ thuê",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Booking>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.lessorName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 200,
            flex: 1.5,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Booking>) => (
                <Tooltip title={params.row.itemName}>
                    <Typography fontSize="0.875rem" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                        {params.row.itemName}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: "totalAmount",
            headerName: "Tổng tiền",
            width: 160,
            flex: 1,
            minWidth: 140,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Booking>) => {
                // Tổng tiền = tiền thuê + cọc
                const total = (params.row.totalAmount || 0) + (params.row.depositAmount || 0);
                return (
                    <Typography fontWeight="bold" color="primary" fontSize="0.875rem">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(total)}
                    </Typography>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            flex: 1.1,
            minWidth: 140,
            align: "center",
            headerAlign: "center",
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
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            flex: 0,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Booking>) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(params.row);
                        }}
                    >
                        <Visibility fontSize="small" />
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
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý đơn thuê ({filteredBookings.length})
                    </Typography>

                    <Box minWidth={200}>
                        <PrimarySelectField
                            size="small"
                            label="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                ...Object.entries(bookingStatusConfig).map(([key, config]) => ({
                                    value: key,
                                    label: config.label,
                                })),
                            ]}
                        />
                    </Box>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <PrimaryDataGrid<Booking>
                        rows={filteredBookings}
                        columns={columns}
                        loading={isLoading}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        onRowClick={handleView}
                        getRowId={(row) => row.id}
                    />
                </Box>
            </Box>

            <PrimaryModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                title={selectedBooking ? `Chi tiết đơn #${selectedBooking.id.slice(0, 8)}` : "Chi tiết đơn thuê"}
            >
                {isLoadingDetail && (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                        <CircularProgress size={24} />
                        <Typography ml={2}>Đang tải chi tiết đơn...</Typography>
                    </Box>
                )}

                {detailError && (
                    <Box textAlign="center" py={4}>
                        <Typography color="error">
                            Không thể tải chi tiết đơn: {(detailError as any).message}
                        </Typography>
                    </Box>
                )}

                {!isLoadingDetail && !detailError && bookingDetail && (
                    <BookingDetail booking={bookingDetail} />
                )}
            </PrimaryModal>
        </div>
    );
}