"use client";

import { useState } from "react";
import { Chip, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PrimaryTable, PrimaryModal } from "@/libs/components";
import BookingDetailModal from "./booking-detail";
import { Booking } from "@/libs/core/types";
import { mockBookings, mockAccounts } from "@/libs/utils/mock-data";
import { BookingStatus } from "@/libs/core/constants";

export default function BookingManagementPage() {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleView = (booking: Booking) => {
        setSelectedBooking(booking);
        setOpenModal(true);
    };

    const getAccountName = (accountId: string): string => {
        const acc = mockAccounts.find((a) => a.id === accountId);
        return acc ? `${acc.firstname} ${acc.lastname}` : "(Không xác định)";
    };

    const getStatusChip = (status: BookingStatus) => {
        let label = "Không xác định";
        let color: "default" | "success" | "warning" | "error" | "info" = "default";
        switch (status) {
            case BookingStatus.COMPLETED:
                label = "Hoàn thành";
                color = "success";
                break;
            case BookingStatus.IN_USE:
                label = "Đang sử dụng";
                color = "info";
                break;
            case BookingStatus.LATE_RETURN:
                label = "Trả trễ";
                color = "error";
                break;
            case BookingStatus.WAITING_REFUND:
                label = "Chờ hoàn cọc";
                color = "warning";
                break;
            default:
                color = "default";
        }
        return <Chip label={label} color={color} size="small" />;
    };

    const columns = [
        { field: "id", headerName: "Mã đơn thuê" },
        {
            field: "lesseeId",
            headerName: "Người thuê",
            render: (row: Booking) => getAccountName(row.lesseeId),
        },
        {
            field: "lessorId",
            headerName: "Chủ thuê",
            render: (row: Booking) => getAccountName(row.lessorId),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            render: (row: Booking) => getStatusChip(row.status),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            render: (row: Booking) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton color="primary" onClick={() => handleView(row)}>
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách đơn thuê</h1>

            <PrimaryTable columns={columns} rows={mockBookings} />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={selectedBooking ? `Chi tiết đơn ${selectedBooking.id}` : "Chi tiết đơn thuê"}
            >
                {selectedBooking && <BookingDetailModal booking={selectedBooking} />}
            </PrimaryModal>
        </div>
    );
}
