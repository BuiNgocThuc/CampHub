// app/admin/items/ItemHistory.tsx
"use client";

import { useState } from "react";
import { IconButton, Chip, Box, Typography, CircularProgress } from "@mui/material";
import { Eye } from "lucide-react";
import { PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getAllItemLogs } from "@/libs/api/item-log-api";
import { ItemLog } from "@/libs/core/types";
import { ItemActionType } from "@/libs/core/constants";
import { format } from "date-fns";
import ItemLogDetail from "./item-log-detail";

const actionColors: Record<ItemActionType, "success" | "error" | "warning" | "info" | "default"> = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
    APPROVE: "success",
    REJECT: "error",
    LOCK: "warning",
    UNLOCK: "info",
    RENT: "default",
    APPROVE_RENTAL: "success",
    REJECT_RENTAL: "error",
    DELIVER: "info",
    RETURN: "warning",
    CHECK_RETURN: "success",
    REFUND: "success",
    DAMAGE_REPORTED: "error",
    RETURN_REQUESTED: "warning",
    UNRETURNED: "error",
};

export default function ItemHistory() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ItemLog | null>(null);

    const { data: logs = [], isLoading } = useQuery({
        queryKey: ["itemLogs"],
        queryFn: getAllItemLogs,
    });

    const columns = [
        {
            field: "createdAt",
            headerName: "Thời gian",
            width: 180,
            renderCell: (params: any) => (
                <Typography variant="body2" color="text.secondary">
                    {format(new Date(params.row.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography>
            ),
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 300,
            renderCell: (params: any) => (
                <div>
                    <div className="font-medium">{params.row.itemName}</div>
                    <div className="text-xs text-gray-500">ID: {params.row.itemId}</div>
                </div>
            ),
        },
        {
            field: "account",
            headerName: "Người thực hiện",
            width: 180,
        },
        {
            field: "action",
            headerName: "Hành động",
            width: 180,
            renderCell: (params: any) => {
                const action = params.row.action as ItemActionType;
                return (
                    <Chip
                        label={action.replace(/_/g, " ")}
                        color={actionColors[action] || "default"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                );
            },
        },
        {
            field: "statusChange",
            headerName: "Thay đổi trạng thái",
            width: 220,
            renderCell: (params: any) => {
                const { previousStatus, currentStatus } = params.row;
                if (!previousStatus && !currentStatus) return "—";
                return (
                    <div className="text-sm">
                        {previousStatus ? (
                            <span className="text-gray-500">{previousStatus}</span>
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                        <span className="mx-2">→</span>
                        <strong className="text-blue-600">{currentStatus}</strong>
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            renderCell: (params: any) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(params.row);
                        setOpenModal(true);
                    }}
                    color="primary"
                >
                    <Eye size={18} />
                </IconButton>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" my={10}>
                <CircularProgress />
                <Typography ml={2}>Đang tải lịch sử thay đổi...</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
                Lịch sử thay đổi sản phẩm
            </Typography>

            <PrimaryDataGrid<ItemLog>
                rows={logs}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.id}
                onRowClick={(itemLog: ItemLog) => {
                    setSelectedLog(itemLog);
                    setOpenModal(true);
                }}
            />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Chi tiết hành động"
            >
                {selectedLog && <ItemLogDetail log={selectedLog} />}
            </PrimaryModal>
        </Box>
    );
}