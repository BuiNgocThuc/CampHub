// app/admin/transactions/TransactionList.tsx
"use client";

import { useState } from "react";
import { IconButton, Chip, Box, Typography, CircularProgress, Tooltip } from "@mui/material";
import { PrimaryDataGrid, PrimaryModal, PrimarySelectField } from "@/libs/components";
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
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => {
                const index = filteredTransactions.findIndex((tx) => tx.id === params.row.id);
                return <Typography>{index + 1}</Typography>;
            },
        },
        {
            field: "senderName",
            headerName: "Người gửi",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.senderName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "receiverName",
            headerName: "Người nhận",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.receiverName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "amount",
            headerName: "Số tiền",
            width: 160,
            flex: 1,
            minWidth: 140,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => (
                <Typography fontWeight="bold" color="primary" fontSize="0.875rem">
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
            width: 180,
            flex: 1.1,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => {
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
            width: 130,
            flex: 0.8,
            minWidth: 110,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => {
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
            width: 160,
            flex: 1,
            minWidth: 140,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => (
                <Typography variant="body2" fontSize="0.875rem">
                    {format(new Date(params.row.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            flex: 0,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Transaction>) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(params.row);
                            setOpenDetail(true);
                        }}
                        color="primary"
                    >
                        <Visibility fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}>
                <CircularProgress />
                <Typography>Đang tải danh sách giao dịch...</Typography>
            </Box>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý giao dịch tài chính ({filteredTransactions.length})
                    </Typography>

                    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                        <Box minWidth={220}>
                            <PrimarySelectField
                                size="small"
                                label="Lọc theo loại giao dịch"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as TransactionType | "")}
                                options={[
                                    { value: "", label: "Tất cả loại giao dịch" },
                                    ...Object.entries(typeLabels).map(([key, label]) => ({
                                        value: key,
                                        label: label,
                                    })),
                                ]}
                            />
                        </Box>
                        <Box minWidth={180}>
                            <PrimarySelectField
                                size="small"
                                label="Lọc theo trạng thái"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "")}
                                options={[
                                    { value: "", label: "Tất cả trạng thái" },
                                    ...Object.entries(statusLabels).map(([key, label]) => ({
                                        value: key,
                                        label: label,
                                    })),
                                ]}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0 }}>
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
                </Box>
            </Box>

            <PrimaryModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                title={selectedTx ? `Chi tiết giao dịch #${selectedTx.id.slice(0, 12)}` : "Chi tiết giao dịch"}
            >
                {selectedTx && <TransactionDetailModal transaction={selectedTx} />}
            </PrimaryModal>
        </div>
    );
}