// app/admin/return-requests/page.tsx
"use client";

import { useState } from "react";
import {
    Chip,
    IconButton,
    Tooltip,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { Eye } from "lucide-react";
import { PrimaryDataGrid } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getPendingReturnRequests } from "@/libs/api/return-request-api";
import { ReturnRequest } from "@/libs/core/types";
import { ReasonReturnType, ReturnRequestStatus } from "@/libs/core/constants";
import { GridColDef } from "@mui/x-data-grid";

const reasonLabels: Record<ReasonReturnType, string> = {
    MISSING_PARTS: "Giao thiếu đồ",
    WRONG_DESCRIPTION: "Không đúng mô tả",
    NO_NEEDED_ANYMORE: "Không còn nhu cầu",
};

const statusConfig: Record<ReturnRequestStatus, { label: string; color: "warning" | "success" | "error" }> = {
    PENDING: { label: "Chờ xử lý", color: "warning" },
    APPROVED: { label: "Đã hoàn tiền", color: "success" },
    REJECTED: { label: "Bị từ chối", color: "error" },
};

export default function ReturnRequestList() {
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["pendingReturnRequests"],
        queryFn: getPendingReturnRequests,
    });

    const handleView = (id: string) => {
        window.open(`/admin/return-requests/${id}`, "_blank");
    };

    const columns: GridColDef<ReturnRequest>[] = [
        {
            field: "id",
            headerName: "Mã yêu cầu",
            width: 130,
            renderCell: (params: any) => (
                <Typography fontFamily="monospace" color="text.secondary">
                    {params.value.slice(0, 8)}
                </Typography>
            ),
        },
        {
            field: "lesseeName",
            headerName: "Người thuê",
            width: 180,
            renderCell: (params: any) => <Typography fontWeight="medium">{params.value}</Typography>,
        },
        {
            field: "lessorName",
            headerName: "Chủ đồ",
            width: 180,
            renderCell: (params: any) => <Typography fontWeight="medium">{params.value}</Typography>,
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 220,
        },
        {
            field: "reason",
            headerName: "Lý do",
            width: 200,
            renderCell: (params: any) => {
                const reason = params.value as ReasonReturnType;
                return <Chip label={reasonLabels[reason]} variant="outlined" size="small" />;
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: (params: any) => {
                const config = statusConfig[params.value as ReturnRequestStatus];
                return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600 }} />;
            },
        },
        {
            field: "createdAt",
            headerName: "Ngày gửi",
            width: 170,
            renderCell: (params: any) => new Date(params.value).toLocaleString("vi-VN"),
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            renderCell: (params: any) => (
                <Tooltip title="Xem chi tiết & xử lý">
                    <IconButton color="primary" onClick={() => handleView(params.row.id)}>
                        <Eye size={18} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ] as const;

    return (
        <Box p={6}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
                Quản lý yêu cầu trả đồ & hoàn tiền
            </Typography>

            {isLoading ? (
                <Box display="flex" justifyContent="center" my={8}>
                    <CircularProgress />
                    <Typography ml={2}>Đang tải yêu cầu hoàn tiền...</Typography>
                </Box>
            ) : requests.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" py={10}>
                    Không có yêu cầu hoàn tiền nào đang chờ xử lý
                </Typography>
            ) : (
                <PrimaryDataGrid<ReturnRequest>
                    rows={requests}
                    columns={columns}
                    getRowId={(row) => row.id}
                />
            )}
        </Box>
    );
}