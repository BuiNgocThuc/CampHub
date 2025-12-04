"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Chip, Divider } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { PrimaryTable } from "@/libs/components";
import { formatCurrency, formatDateTime } from "@/libs/utils";
import { mockAccounts, mockBookings, mockTransactionBookings, mockTransactions } from "@/libs/utils/mock-data";

import { Transaction, Booking } from "@/libs/core/types";
import { TransactionStatus } from "@/libs/core/constants";

const TransactionDetail: NextPage = () => {
    const router = useRouter();
    const params = useParams() as { transactionId: string };
    console.log(params);
    const transactionId = params.transactionId;

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
    }, [transactionId]);

    if (!transaction)
        return <div className="p-6 text-gray-500 italic">Không tìm thấy giao dịch.</div>;

    // ---- Resolve account names từ mockAccounts ----
    const fromAccount =
        mockAccounts.find((a) => a.id === transaction.fromAccountId) || null;
    const toAccount =
        mockAccounts.find((a) => a.id === transaction.toAccountId) || null;

    const bookingColumns = [
        { field: "id", headerName: "Mã đơn thuê" },
        { field: "itemId", headerName: "Sản phẩm" },
        {
            field: "pricePerDay",
            headerName: "Giá / ngày",
            render: (row: Booking) => formatCurrency(row.pricePerDay),
        },
        { field: "startDate", headerName: "Ngày bắt đầu" },
        { field: "endDate", headerName: "Ngày kết thúc" },
    ];

    const renderStatusLabel = (
        status: TransactionStatus
    ): { label: string; color: 'success' | 'error' | 'warning' } => {
        switch (status) {
            case TransactionStatus.SUCCESS:
                return { label: 'Thành công', color: 'success' };
            case TransactionStatus.FAILED:
                return { label: 'Thất bại', color: 'error' };
            default:
                return { label: 'Đang xử lý', color: 'warning' };
        }
    };

    const { label, color } = renderStatusLabel(transaction.status);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Chi tiết giao dịch #{transaction.id}
                </h1>
                <button
                    onClick={() => router.back()}
                    className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded-md"
                >
                    ← Quay lại
                </button>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4 text-gray-800">
                <p>
                    <strong>Người gửi:</strong>{" "}
                    {fromAccount
                        ? `${fromAccount.firstname} ${fromAccount.lastname}`
                        : "(Không xác định)"}
                </p>
                <p>
                    <strong>Người nhận:</strong>{" "}
                    {toAccount
                        ? `${toAccount.firstname} ${toAccount.lastname}`
                        : "(Không xác định)"}
                </p>
                <p>
                    <strong>Số tiền:</strong> {formatCurrency(transaction.amount)}
                </p>
                <p>
                    <strong>Loại giao dịch:</strong> {transaction.type}
                </p>
                <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {formatDateTime(transaction.createdAt)}
                </p>
                <p>
                    <strong>Trạng thái:</strong>{" "}
                    <Chip label={label} color={color} size="small" />
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">
                    Các đơn thuê liên quan
                </h2>
                <PrimaryTable columns={bookingColumns} rows={bookings} />
            </div>
        </div>
    );
};

// export default TransactionDetail;
