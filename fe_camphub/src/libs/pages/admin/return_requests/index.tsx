"use client";

import { useRouter } from "next/navigation";
import { IconButton, Chip } from "@mui/material";
import { Eye } from "lucide-react";
import { PrimaryTable } from "@/libs/components";
import { mockReturnRequests } from "@/libs/utils";
import { ReturnRequest } from "@/libs/types";
import { ReasonReturnType, ReturnRequestStatus } from "@/libs/constants";

export default function ReturnRequestList() {
    const router = useRouter();

    const columns = [
        { field: "id", headerName: "Mã yêu cầu" },
        { field: "lesseeId", headerName: "Người thuê" },
        { field: "lessorId", headerName: "Chủ thuê" },
        {
            field: "reason",
            headerName: "Lý do",
            render: (row: ReturnRequest) => ({
                [ReasonReturnType.MISSING_PARTS]: "Giao thiếu đồ",
                [ReasonReturnType.WRONG_DESCRIPTION]: "Không đúng mô tả",
                [ReasonReturnType.NO_NEEDED_ANYMORE]: "Không còn nhu cầu"
            }[row.reason]),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            render: (row: ReturnRequest) => (
                <Chip
                    label={row.status}
                    color={
                        row.status === ReturnRequestStatus.APPROVED
                            ? "success"
                            : row.status === ReturnRequestStatus.REJECTED
                                ? "error"
                                : "warning"
                    }
                    size="small"
                />
            ),
        },
        {
            field: "createdAt",
            headerName: "Ngày gửi",
            render: (row: ReturnRequest) =>
                new Date(row.createdAt).toLocaleString("vi-VN"),
        },
        {
            field: "actions",
            headerName: "Chi tiết",
            render: (row: ReturnRequest) => (
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/return-requests/${row.id}`);
                    }}
                >
                    <Eye size={18} />
                </IconButton>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
                Quản lý yêu cầu trả đồ / hoàn tiền
            </h2>

            <PrimaryTable<ReturnRequest> columns={columns} rows={mockReturnRequests} />
        </div>
    );
}
