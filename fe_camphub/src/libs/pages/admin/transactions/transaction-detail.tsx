// app/admin/transactions/TransactionDetailModal.tsx
"use client";

import { Box, Divider, Typography, Chip, Grid } from "@mui/material";
import { format } from "date-fns";
import { Transaction } from "@/libs/core/types";
import { getTransactionDetailsByTxId } from "@/libs/api/transaction-api";
import { useQuery } from "@tanstack/react-query";
import { PrimaryDataGrid } from "@/libs/components";
import { TransactionType } from "@/libs/core/constants";

interface TransactionDetailModalProps {
    transaction: Transaction;
}

const typeLabels: Record<TransactionType, string> = {
    RENTAL_PAYMENT: "Thanh toán thuê",
    REFUND_FULL: "Hoàn tiền toàn phần",
    REFUND_DEPOSIT: "Hoàn cọc",
    RENTAL_PAYOUT: "Chi trả cho chủ",
    EXTENSION_PAYMENT: "Phí gia hạn",
    COMPENSATION_PAYOUT: "Bồi thường thiệt hại",
};

export default function TransactionDetailModal({ transaction }: TransactionDetailModalProps) {
    const { data: details = [], isLoading } = useQuery({
        queryKey: ["transactionDetails", transaction.id],
        queryFn: () => getTransactionDetailsByTxId(transaction.id),
    });

    const columns = [
        { field: "bookingId", headerName: "Mã đơn thuê", width: 140 },
        { field: "itemName", headerName: "Sản phẩm", width: 250 },
        { field: "lesseeName", headerName: "Người thuê", width: 180 },
        { field: "lessorName", headerName: "Chủ cho thuê", width: 180 },
        {
            field: "amount",
            headerName: "Số tiền",
            width: 160,
            renderCell: (params: any) => (
                <Typography fontWeight="bold" color="primary">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(params.value)}
                </Typography>
            ),
        },
    ];

    return (
        <Box sx={{ minWidth: 800 }}>
            <Grid container spacing={4}>
                <Grid size={12}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {typeLabels[transaction.type] || transaction.type}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                        Mã giao dịch: <strong>{transaction.id}</strong>
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Typography fontWeight="medium" color="text.secondary">Người gửi</Typography>
                    <Typography fontWeight="bold">{transaction.senderName}</Typography>
                    <Typography fontSize="0.875rem" color="text.secondary">
                        ID: {transaction.fromAccountId}
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Typography fontWeight="medium" color="text.secondary">Người nhận</Typography>
                    <Typography fontWeight="bold">{transaction.receiverName}</Typography>
                    <Typography fontSize="0.875rem" color="text.secondary">
                        ID: {transaction.toAccountId}
                    </Typography>
                </Grid>

                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid size={6}>
                    <Typography fontWeight="medium" color="text.secondary">Số tiền</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(transaction.amount)}
                    </Typography>
                </Grid>

                <Grid size={6}>
                    <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                        <Chip
                            label={transaction.status === "SUCCESS" ? "Thành công" : transaction.status === "FAILED" ? "Thất bại" : "Đang xử lý"}
                            color={transaction.status === "SUCCESS" ? "success" : transaction.status === "FAILED" ? "error" : "warning"}
                            size="medium"
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                height: "40",
                                px: 3,
                                borderRadius: 3
                            }}
                        />
                    </Box>
                </Grid>

                <Grid size={12}>
                    <Typography fontWeight="medium" color="text.secondary" gutterBottom>
                        Thời gian: {format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm:ss")}
                    </Typography>
                </Grid>

                {details.length > 0 && (
                    <>
                        <Grid size={12}>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Chi tiết đơn thuê liên quan ({details.length})
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <PrimaryDataGrid
                                rows={details}
                                columns={columns}
                                loading={isLoading}
                                getRowId={(row) => row.bookingId}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
}