"use client";

import { Chip } from "@mui/material";
import { formatCurrency, formatDateTime } from "@/libs/utils";
import { Booking, Transaction } from "@/libs/core/types";
import { TransactionStatus, TransactionType } from "@/libs/core/constants";
import { PrimaryModal, PrimaryTable } from "@/libs/components/";

interface TransactionDetailModalProps {
    open: boolean;
    onClose: () => void;
    transaction?: Transaction;
    bookings?: Booking[];
}

export default function TransactionDetailModal({
    open,
    onClose,
    transaction,
    bookings = [],
}: TransactionDetailModalProps) {
    if (!transaction) return null;

    const columns = [
        { field: "id", headerName: "Mã đơn" },
        { field: "itemName", headerName: "Sản phẩm" },
        { field: "lessorName", headerName: "Chủ cho thuê" },
        { field: "lesseeName", headerName: "Người thuê" },
        {
            field: "rentalPeriod",
            headerName: "Thời gian thuê",
            render: (row: Booking) => `${row.startDate} → ${row.endDate}`,
        },
        {
            field: "pricePerDay",
            headerName: "Giá/ngày (VNĐ)",
            render: (row: Booking) => formatCurrency(row.pricePerDay),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            render: (row: Booking) => (
                <Chip
                    label={row.status}
                    size="small"
                    color={
                        row.status === "COMPLETED"
                            ? "success"
                            : row.status === "IN_USE"
                                ? "warning"
                                : "default"
                    }
                />
            ),
        },
    ];

    return (
        <PrimaryModal
            open={open}
            title={`Chi tiết giao dịch #${transaction.id}`}
            onClose={onClose}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <p>
                        <strong>Người gửi:</strong> {transaction.fromAccountId}
                    </p>
                    <p>
                        <strong>Người nhận:</strong> {transaction.toAccountId}
                    </p>
                    <p>
                        <strong>Số tiền:</strong>{" "}
                        <span className="font-semibold text-blue-600">
                            {formatCurrency(transaction.amount)}
                        </span>
                    </p>
                    <p>
                        <strong>Loại giao dịch:</strong>{" "}
                        {mapTransactionType(transaction.type)}
                    </p>
                    <p>
                        <strong>Trạng thái:</strong>{" "}
                        <Chip
                            label={mapStatus(transaction.status)}
                            color={
                                transaction.status === TransactionStatus.SUCCESS
                                    ? "success"
                                    : transaction.status === TransactionStatus.FAILED
                                        ? "error"
                                        : "warning"
                            }
                            size="small"
                        />
                    </p>
                    <p>
                        <strong>Ngày tạo:</strong>{" "}
                        {formatDateTime(transaction.createdAt)}
                    </p>
                </div>

                <div>
                    <p className="font-semibold mb-2 mt-3">Các đơn thuê liên quan:</p>
                    {bookings.length === 0 ? (
                        <p className="text-gray-500 italic">Không có đơn thuê nào.</p>
                    ) : (
                        <PrimaryTable columns={columns} rows={bookings} />
                    )}
                </div>
            </div>
        </PrimaryModal>
    );
}

// 🧩 Helper
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
