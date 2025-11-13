"use client";

import { useState } from "react";
import { Button, IconButton, Chip } from "@mui/material";
import { Eye } from "lucide-react";
import { PrimaryTable, PrimaryModal } from "@/libs/components";
import { ItemActionType, ItemStatus } from "@/libs/constants";
import { mockItemLogs } from "@/libs/utils";
import ItemLogDetail from "./item-log-detail";

export default function ItemHistory() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any | null>(null);

    const columns = [
        { field: "createdAt", headerName: "Thời gian" },
        { field: "itemName", headerName: "Sản phẩm" },
        { field: "accountName", headerName: "Người thực hiện" },
        {
            field: "action",
            headerName: "Hành động",
            render: (row: any) => (
                <Chip
                    label={row.action}
                    color={
                        row.action === ItemActionType.APPROVE
                            ? "success"
                            : row.action === ItemActionType.REJECT
                                ? "error"
                                : "default"
                    }
                    size="small"
                />
            ),
        },
        {
            field: "statusChange",
            headerName: "Trạng thái",
            render: (row: any) => (
                <div className="text-sm">
                    <span className="text-gray-500">{row.previousStatus}</span> →{" "}
                    <span className="font-semibold text-blue-600">
                        {row.currentStatus}
                    </span>
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Chi tiết",
            render: (row: any) => (
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(row);
                        setOpenModal(true);
                    }}
                >
                    <Eye size={18} />
                </IconButton>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch sử thay đổi sản phẩm</h2>

            <PrimaryTable columns={columns} rows={mockItemLogs} />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Chi tiết thay đổi"
                isCreate={false}
            >
                <ItemLogDetail log={selectedLog} />
            </PrimaryModal>
        </div>
    );
}
