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
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

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

    const columns: GridColDef<ItemLog>[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            renderCell: (params: GridRenderCellParams<ItemLog>) => {
                const index = logs.findIndex((log) => log.id === params.row.id);
                return <Typography>{index + 1}</Typography>;
            },
        },
        {
            field: "createdAt",
            headerName: "Thời gian",
            width: 160,
            flex: 0.9,
            minWidth: 140,
            renderCell: (params: GridRenderCellParams<ItemLog>) => (
                <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                    {format(new Date(params.row.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography>
            ),
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 200,
            flex: 1.2,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams<ItemLog>) => (
                <Box>
                    <Typography fontWeight="medium" fontSize="0.875rem">{params.row.itemName}</Typography>
                </Box>
            ),
        },
        {
            field: "account",
            headerName: "Người thực hiện",
            width: 150,
            flex: 1,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams<ItemLog>) => (
                <Typography fontSize="0.875rem">{params.row.account || "N/A"}</Typography>
            ),
        },
        {
            field: "action",
            headerName: "Hành động",
            width: 150,
            flex: 1,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams<ItemLog>) => {
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
            headerName: "Trạng thái hiện tại",
            width: 200,
            flex: 1.1,
            minWidth: 160,
            renderCell: (params: GridRenderCellParams<ItemLog>) => {
                const { previousStatus, currentStatus } = params.row;
                if (!previousStatus && !currentStatus) return <Typography>—</Typography>;
                return (
                    <Box fontSize="0.875rem">
                        <Typography component="span" fontWeight="bold" color="primary">{currentStatus}</Typography>
                    </Box>
                );
            },
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            flex: 0,
            sortable: false,
            renderCell: (params: GridRenderCellParams<ItemLog>) => (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(params.row);
                        setOpenModal(true);
                    }}
                    color="primary"
                >
                    <Eye size={16} />
                </IconButton>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
                <Typography ml={2}>Đang tải lịch sử thay đổi...</Typography>
            </Box>
        );
    }

    return (
        <>
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Lịch sử thay đổi sản phẩm ({logs.length})
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0 }}>
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
                </Box>
            </Box>

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Chi tiết hành động"
            >
                {selectedLog && <ItemLogDetail log={selectedLog} />}
            </PrimaryModal>
        </>
    );
}