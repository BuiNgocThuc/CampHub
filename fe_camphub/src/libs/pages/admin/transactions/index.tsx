"use client";

import { useState } from "react";
import { Transaction } from "@/libs/types";
import { formatCurrency, formatDateTime, mockAccounts, mockBookings, mockTransactionBookings, mockTransactions } from "@/libs/utils";
import { Chip, TextField, MenuItem, Divider, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TransactionStatus, TransactionType } from "@/libs/constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import TransactionDetailModal from "./transaction-detail";


export default function TransactionList() {
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [openDetail, setOpenDetail] = useState(false);
    const router = useRouter();

     //Map accountId -> fullName
    const getAccountName = (accountId: string): string => {
        const acc = mockAccounts.find((a) => a.id === accountId);
        return acc ? acc.firstname + " " + acc.lastname : "N/A";
    };

    // Bổ sung thêm tên người gửi / nhận
    const transactionsWithNames = mockTransactions.map((t) => ({
        ...t,
        fromAccountName: getAccountName(t.fromAccountId),
        toAccountName: getAccountName(t.toAccountId),
    }));

    // Lọc theo loại & trạng thái
    const filteredTransactions = transactionsWithNames.filter((t) => {
        const typeMatch = typeFilter ? t.type === typeFilter : true;
        const statusMatch = statusFilter ? t.status === statusFilter : true;
        return typeMatch && statusMatch;
    });

    const handleView = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setOpenDetail(true);
    };

    const getBookingsByTransaction = (transactionId: string) => {
        const relatedIds = mockTransactionBookings
            .filter((tb) => tb.transactionId === transactionId)
            .map((tb) => tb.bookingId);
        return mockBookings.filter((b) => relatedIds.includes(b.id));
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "Mã GD", width: 140 },
        { field: "fromAccountName", headerName: "Người gửi", width: 180 },
        { field: "toAccountName", headerName: "Người nhận", width: 180 },
        {
            field: "amount",
            headerName: "Số tiền (VNĐ)",
            width: 160,
            renderCell: (params) => (
                <span className="font-semibold text-blue-600">
                    {formatCurrency(params.value)}
                </span>
            ),
        },
        {
            field: "type",
            headerName: "Loại giao dịch",
            width: 180,
            renderCell: (params) => (
                <Chip
                    label={mapTransactionType(params.value)}
                    color="info"
                    size="small"
                    variant="outlined"
                />
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={mapStatus(params.value)}
                    color={
                        params.value === TransactionStatus.SUCCESS
                            ? "success"
                            : params.value === TransactionStatus.FAILED
                                ? "error"
                                : "warning"
                    }
                    size="small"
                />
            ),
        },
        {
            field: "createdAt",
            headerName: "Ngày tạo",
            width: 180,
            renderCell: (params) => formatDateTime(params.value),
        },

        {
            field: "actions",
            headerName: "Thao tác",
            width: 120,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton
                        color="primary"
                        onClick={() => router.push(`/admin/transactions/${params.row.id}`)}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
                <TextField
                    label="Loại giao dịch"
                    select
                    size="small"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {Object.values(TransactionType).map((t) => (
                        <MenuItem key={t} value={t}>
                            {mapTransactionType(t)}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Trạng thái"
                    select
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {Object.values(TransactionStatus).map((s) => (
                        <MenuItem key={s} value={s}>
                            {mapStatus(s)}
                        </MenuItem>
                    ))}
                </TextField>
            </div>

            <Divider />

            <DataGrid
                rows={filteredTransactions}
                columns={columns}
                getRowId={(row) => row.id}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                localeText={{
                    noRowsLabel: "Không có dữ liệu giao dịch",
                }}
            />

            <TransactionDetailModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                transaction={selectedTransaction || undefined}
                bookings={
                    selectedTransaction
                        ? getBookingsByTransaction(selectedTransaction.id)
                        : []
                }
            />
        </div>


    );
}

function mapTransactionType(type: TransactionType) {
    switch (type) {
        case TransactionType.RENTAL_PAYMENT:
            return "Thanh toán thuê";
        case TransactionType.REFUND_DEPOSIT:
            return "Hoàn cọc";
        case TransactionType.REFUND_FULL:
            return "Hoàn tiền";
        case TransactionType.COMPENSATION_PAYOUT:
            return "Bồi thường";
        case TransactionType.EXTENSION_PAYMENT:
            return "Phí gia hạn";
        default:
            return type;
    }
}

function mapStatus(status: TransactionStatus) {
    switch (status) {
        case TransactionStatus.SUCCESS:
            return "Thành công";
        case TransactionStatus.FAILED:
            return "Thất bại";
        case TransactionStatus.PENDING:
            return "Đang xử lý";
        default:
            return status;
    }
}
