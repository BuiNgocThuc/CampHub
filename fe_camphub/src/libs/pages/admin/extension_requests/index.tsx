// app/admin/extension-requests/page.tsx
"use client";

import { useState } from "react";
import {
    Chip,
    IconButton,
    Tooltip,
    Box,
    Typography,
    CircularProgress,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getAllExtensionRequests } from "@/libs/api/extension-request-api";
import ExtensionDetailModal from "./extension-detail";
import { ExtensionRequest } from "@/libs/core/types";
import type { GridColDef } from "@mui/x-data-grid";
import { ExtensionStatus } from "@/libs/core/constants";

const statusLabels: Record<ExtensionStatus, { label: string; color: "success" | "warning" | "error" | "default" }> = {
    PENDING: { label: "Đang chờ duyệt", color: "warning" },
    APPROVED: { label: "Đã duyệt", color: "success" },
    REJECTED: { label: "Bị từ chối", color: "error" },
    CANCELLED: { label: "Đã hủy", color: "default" },
    EXPIRED: { label: "Hết hạn", color: "default" },
};

export default function ExtensionManagementPage() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ExtensionRequest | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["extensionRequests", { status: statusFilter || undefined }],
        queryFn: () => getAllExtensionRequests({ status: statusFilter || undefined }),
    });

    const handleView = (request: ExtensionRequest) => {
        setSelectedRequest(request);
        setOpenModal(true);
    };

    const columns: GridColDef<ExtensionRequest>[] = [
        {
            field: "id",
            headerName: "Mã yêu cầu",
            width: 130,
            renderCell: (params) => (
                <Typography fontFamily="monospace" fontSize="0.875rem" color="text.secondary">
                    {(params.value as string).slice(0, 8)}
                </Typography>
            ),
        },
        {
            field: "lesseeName",
            headerName: "Người thuê",
            width: 180,
            renderCell: (params) => (
                <Typography fontWeight="medium">{params.value as string}</Typography>
            ),
        },
        {
            field: "lessorName",
            headerName: "Chủ đồ",
            width: 180,
            renderCell: (params) => (
                <Typography fontWeight="medium">{params.value as string}</Typography>
            ),
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 220,
            renderCell: (params) => (
                <Typography variant="body2">{params.value as string}</Typography>
            ),
        },
        {
            field: "additionalFee",
            headerName: "Phí gia hạn",
            width: 140,
            renderCell: (params) => (
                <Typography fontWeight="bold" color="primary">
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(Number(params.value) ?? 0)}
                </Typography>
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            renderCell: (params) => {
                const status = params.value as ExtensionStatus;
                const config = statusLabels[status];
                return (
                    <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{ fontWeight: 600, minWidth: 100 }}
                    />
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Thời gian",
            width: 160,
            renderCell: (params) => (
                <Typography variant="body2">
                    {new Date(params.value as string).toLocaleDateString("vi-VN")}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(params.row);
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ maxHeight: "calc(100vh - 120px)", overflow: "auto" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight="bold">
                    Quản lý yêu cầu gia hạn thuê
                </Typography>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Trạng thái"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="PENDING">Đang chờ duyệt</MenuItem>
                        <MenuItem value="APPROVED">Đã duyệt</MenuItem>
                        <MenuItem value="REJECTED">Bị từ chối</MenuItem>
                        <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                        <MenuItem value="EXPIRED">Hết hạn</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading ? (
                <Box display="flex" justifyContent="center" my={10}>
                    <CircularProgress />
                    <Typography ml={2}>Đang tải yêu cầu gia hạn...</Typography>
                </Box>
            ) : requests.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <Typography color="text.secondary">
                        {statusFilter ? "Không có yêu cầu nào phù hợp" : "Chưa có yêu cầu gia hạn nào"}
                    </Typography>
                </Box>
            ) : (
                <PrimaryDataGrid<ExtensionRequest>
                    rows={requests}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row) => row.id}
                    onRowClick={(exr: ExtensionRequest) => handleView(exr)}
                />
            )}
            </Box>

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={selectedRequest ? `Yêu cầu gia hạn #${selectedRequest.id.slice(0, 8)}` : "Chi tiết"}
            >
                {selectedRequest && <ExtensionDetailModal request={selectedRequest} />}
            </PrimaryModal>
        </div>
    );
}