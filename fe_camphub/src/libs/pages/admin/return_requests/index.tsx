// app/admin/return-requests/page.tsx
"use client";

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
import { getReturnRequests } from "@/libs/api/return-request-api";
import { ReturnRequest } from "@/libs/core/types";
import { ReasonReturnType, ReturnRequestStatus } from "@/libs/core/constants";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

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
        queryKey: ["ReturnRequests"],
        queryFn: getReturnRequests,
    });

    const handleView = (id: string) => {
        // window.open(`/admin/return-requests/${id}`, "_blank");
    };

    const columns: GridColDef<ReturnRequest>[] = [
        {
            field: "id",
            headerName: "Mã yêu cầu",
            width: 130,
            renderCell: (params: GridRenderCellParams<ReturnRequest, string>) => (
                <Typography fontFamily="monospace" color="text.secondary">
                    {params.value ? params.value.slice(0, 8) : "N/A"}
                </Typography>
            ),
        },
        {
            field: "lesseeName",
            headerName: "Người thuê",
            width: 180,
            renderCell: (params: GridRenderCellParams<ReturnRequest, string>) => (
                <Typography fontWeight="medium">{params.value || "N/A"}</Typography>
            ),
        },
        {
            field: "lessorName",
            headerName: "Chủ đồ",
            width: 180,
            renderCell: (params: GridRenderCellParams<ReturnRequest, string>) => (
                <Typography fontWeight="medium">{params.value || "N/A"}</Typography>
            ),
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 220,
            renderCell: (params: GridRenderCellParams<ReturnRequest, string>) => (
                <Typography>{params.value || "N/A"}</Typography>
            ),
        },
        {
            field: "reason",
            headerName: "Lý do",
            width: 200,
            renderCell: (params: GridRenderCellParams<ReturnRequest, ReasonReturnType>) => {
                const reason = params.value;
                if (!reason || !reasonLabels[reason]) {
                    return <Chip label="N/A" variant="outlined" size="small" />;
                }
                return <Chip label={reasonLabels[reason]} variant="outlined" size="small" />;
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: (params: GridRenderCellParams<ReturnRequest, ReturnRequestStatus>) => {
                const status = params.value;
                if (!status || !statusConfig[status]) {
                    return <Chip label="N/A" size="small" sx={{ fontWeight: 600 }} />;
                }
                const config = statusConfig[status];
                return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600 }} />;
            },
        },
        {
            field: "createdAt",
            headerName: "Ngày gửi",
            width: 170,
            renderCell: (params: GridRenderCellParams<ReturnRequest, string>) => {
                if (!params.value) return <Typography>N/A</Typography>;
                try {
                    return <Typography>{new Date(params.value).toLocaleString("vi-VN")}</Typography>;
                } catch {
                    return <Typography>N/A</Typography>;
                }
            },
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams<ReturnRequest>) => (
                <Tooltip title="Xem chi tiết & xử lý">
                    <IconButton color="primary" onClick={() => handleView(params.row.id)}>
                        <Eye size={18} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ maxHeight: "calc(100vh - 120px)", overflow: "auto" }}>
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
        </div>
    );
}