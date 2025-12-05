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
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { PrimaryDataGrid, PrimaryModal, PrimarySelectField } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getAllExtensionRequests } from "@/libs/api/extension-request-api";
import ExtensionDetailModal from "./extension-detail";
import { ExtensionRequest } from "@/libs/core/types";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
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
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ExtensionRequest>) => {
                const index = requests.findIndex((req) => req.id === params.row.id);
                return <Typography>{index + 1}</Typography>;
            },
        },
        {
            field: "lesseeName",
            headerName: "Người thuê",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ExtensionRequest>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.lesseeName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "lessorName",
            headerName: "Chủ đồ",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ExtensionRequest>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.lessorName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "itemName",
            headerName: "Sản phẩm",
            width: 200,
            flex: 1.5,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ExtensionRequest>) => (
                <Tooltip title={params.row.itemName}>
                    <Typography fontSize="0.875rem" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                        {params.row.itemName}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            flex: 1.1,
            minWidth: 130,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ExtensionRequest>) => {
                const status = params.row.status as ExtensionStatus;
                const config = statusLabels[status];
                return (
                    <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                );
            },
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            flex: 0,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ExtensionRequest>) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(params.row);
                        }}
                    >
                        <Visibility fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý yêu cầu gia hạn thuê ({requests.length})
                    </Typography>

                    <Box minWidth={200}>
                        <PrimarySelectField
                            size="small"
                            label="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                ...Object.entries(statusLabels).map(([key, config]) => ({
                                    value: key,
                                    label: config.label,
                                })),
                            ]}
                        />
                    </Box>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
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
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <PrimaryDataGrid<ExtensionRequest>
                            rows={requests}
                            columns={columns}
                            loading={isLoading}
                            getRowId={(row) => row.id}
                            onRowClick={(exr: ExtensionRequest) => handleView(exr)}
                        />
                    </Box>
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