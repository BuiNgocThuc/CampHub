// app/admin/transactions/TransactionList.tsx
"use client";

import { useState } from "react";
import { IconButton, Chip, Box, Typography, CircularProgress, Tooltip } from "@mui/material";
import { PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/libs/api/transaction-api";
import { Transaction } from "@/libs/core/types";
import { format } from "date-fns";
import TransactionDetailModal from "./transaction-detail";
import { TransactionStatus, TransactionType } from "@/libs/core/constants";
import { Visibility } from "@mui/icons-material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const typeLabels: Record<TransactionType, string> = {
    RENTAL_PAYMENT: "Thanh toán thuê",
    REFUND_FULL: "Hoàn tiền toàn phần",
    REFUND_DEPOSIT: "Hoàn cọc",
    RENTAL_PAYOUT: "Chi trả cho chủ",
    EXTENSION_PAYMENT: "Phí gia hạn",
    COMPENSATION_PAYOUT: "Bồi thường thiệt hại",
};

const statusLabels: Record<TransactionStatus, string> = {
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    PENDING: "Đang xử lý",
};

const statusColors: Record<TransactionStatus, "success" | "error" | "warning" | "info"> = {
    SUCCESS: "success",
    FAILED: "error",
    PENDING: "warning",
};

export default function TransactionList() {
    const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
    const [statusFilter, setStatusFilter] = useState<TransactionStatus | "">("");
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [openDetail, setOpenDetail] = useState(false);

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ["adminTransactions"],
        queryFn: getAllTransactions,
    });

    const filteredTransactions = transactions.filter((t) => {
        const typeMatch = typeFilter ? t.type === typeFilter : true;
        const statusMatch = statusFilter ? t.status === statusFilter : true;
        return typeMatch && statusMatch;
    });

    const columns: GridColDef<Transaction>[] = [
        {
            field: "id",
            headerName: "Mã giao dịch",
            width: 150,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => (
                <Typography fontFamily="monospace" fontSize="0.875rem">
                    {String(params.value).slice(0, 12)}...
                </Typography>
            ),
        },
        {
            field: "senderName",
            headerName: "Người gửi",
            width: 200,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => (
                <Box>
                    <div className="font-medium">{params.row.senderName}</div>
                    <div className="text-xs text-gray-500">ID: {params.row.fromAccountId}</div>
                </Box>
            ),
        },
        {
            field: "receiverName",
            headerName: "Người nhận",
            width: 200,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => (
                <Box>
                    <div className="font-medium">{params.row.receiverName}</div>
                    <div className="text-xs text-gray-500">ID: {params.row.toAccountId}</div>
                </Box>
            ),
        },
        {
            field: "amount",
            headerName: "Số tiền",
            width: 160,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => (
                <Typography fontWeight="bold" color="primary">
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(Number(params.value) ?? 0)}
                </Typography>
            ),
        },
        {
            field: "type",
            headerName: "Loại giao dịch",
            width: 200,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => {
                const type = params.row.type as TransactionType;
                return (
                    <Chip
                        label={typeLabels[type] || type}
                        color="info"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => {
                const status = params.row.status as TransactionStatus;
                return (
                    <Chip
                        label={statusLabels[status] || status}
                        color={statusColors[status] || "default"}
                        size="small"
                    />
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Thời gian",
            width: 180,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => (
                <Typography variant="body2">
                    {format(new Date(params.row.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<any, Transaction>) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(params.row);
                            setOpenDetail(true);
                        }}
                        color="primary"
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" my={10} gap={2}>
                <CircularProgress />
                <Typography>Đang tải danh sách giao dịch...</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
                Quản lý giao dịch tài chính
            </Typography>

            <Box display="flex" gap={3} mb={3} flexWrap="wrap">
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as TransactionType | "")}
                    className="px-4 py-2 border rounded-lg text-sm min-w-[220px]"
                >
                    <option value="">Tất cả loại giao dịch</option>
                    {Object.values(TransactionType).map((t) => (
                        <option key={t} value={t}>
                            {typeLabels[t]}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "")}
                    className="px-4 py-2 border rounded-lg text-sm min-w-[180px]"
                >
                    <option value="">Tất cả trạng thái</option>
                    {Object.values(TransactionStatus).map((s) => (
                        <option key={s} value={s}>
                            {statusLabels[s]}
                        </option>
                    ))}
                </select>
            </Box>

            <PrimaryDataGrid<Transaction>
                rows={filteredTransactions}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.id}
                onRowClick={(transaction: Transaction) => {
                    setSelectedTx(transaction);
                    setOpenDetail(true);
                }}
            />

            <PrimaryModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                title={selectedTx ? `Chi tiết giao dịch #${selectedTx.id.slice(0, 12)}` : "Chi tiết giao dịch"}
            >
                {selectedTx && <TransactionDetailModal transaction={selectedTx} />}
            </PrimaryModal>
        </Box>
    );
}