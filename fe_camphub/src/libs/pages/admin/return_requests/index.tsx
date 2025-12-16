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
import { PrimaryAlert, PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getReturnRequests } from "@/libs/api";
import { ReturnRequest } from "@/libs/core/types";
import { ReturnRequestStatus } from "@/libs/core/constants";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import ReturnRequestDetailModal from "./return-request-detail-modal";

const statusConfig: Record<string, { label: string; color: "warning" | "success" | "error" }> = {
    // numeric enum values
    [ReturnRequestStatus.PENDING]: { label: "Chờ xác nhận", color: "warning" },
    [ReturnRequestStatus.PROCESSING]: { label: "Chờ xử lý", color: "warning" },
    [ReturnRequestStatus.APPROVED]: { label: "Đã hoàn tiền", color: "success" },
    [ReturnRequestStatus.REJECTED]: { label: "Bị từ chối", color: "error" },
    [ReturnRequestStatus.AUTO_REFUNDED]: { label: "Tự hoàn tiền (hết hạn)", color: "success" },
    [ReturnRequestStatus.RESOLVED]: { label: "Đã hoàn tất", color: "success" },
    [ReturnRequestStatus.CLOSED_BY_DISPUTE]: { label: "Đã chuyển sang khiếu nại", color: "warning" },
    // string values from API
    PENDING: { label: "Chờ xác nhận", color: "warning" },
    PROCESSING: { label: "Chờ xử lý", color: "warning" },
    APPROVED: { label: "Đã hoàn tiền", color: "success" },
    REJECTED: { label: "Bị từ chối", color: "error" },
    AUTO_REFUNDED: { label: "Tự hoàn tiền (hết hạn)", color: "success" },
    RESOLVED: { label: "Đã hoàn tất", color: "success" },
    CLOSED_BY_DISPUTE: { label: "Đã chuyển sang khiếu nại", color: "warning" },
};

export default function ReturnRequestList() {
    const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [alert, setAlert] = useState<{ visible: boolean; content: string; type: "success" | "error" | "warning" | "info"; duration?: number }>({
        visible: false,
        content: "",
        type: "success",
        duration: 3000,
    });

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["ReturnRequests"],
        queryFn: getReturnRequests,
    });

    const handleView = (request: ReturnRequest) => {
        setSelectedRequest(request);
        setOpenModal(true);
    };

    const columns: GridColDef<ReturnRequest>[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ReturnRequest>) => {
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
            renderCell: (params: GridRenderCellParams<ReturnRequest>) => (
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
            renderCell: (params: GridRenderCellParams<ReturnRequest>) => (
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
            renderCell: (params: GridRenderCellParams<ReturnRequest>) => (
                <Tooltip title={params.row.itemName}>
                    <Typography fontSize="0.875rem" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                        {params.row.itemName || "N/A"}
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
            renderCell: (params: GridRenderCellParams<ReturnRequest>) => {
                const rawStatus = params.row.status as unknown as string | number;
                const normalizedKey = typeof rawStatus === "string" ? rawStatus.toUpperCase() : String(rawStatus);
                const config = statusConfig[normalizedKey] || statusConfig[String(rawStatus)];

                if (!rawStatus || !config) {
                    return <Chip label="N/A" size="small" sx={{ fontWeight: 600 }} />;
                }
                return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600 }} />;
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
            renderCell: (params: GridRenderCellParams<ReturnRequest>) => (
                <Tooltip title="Xem chi tiết & xử lý">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(params.row);
                        }}
                    >
                        <Eye size={16} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {alert.visible && (
                <PrimaryAlert
                    content={alert.content}
                    type={alert.type}
                    duration={alert.duration ?? 3000}
                    onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
                />
            )}
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý yêu cầu trả đồ & hoàn tiền ({requests.length})
                    </Typography>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress />
                        <Typography ml={2}>Đang tải yêu cầu hoàn tiền...</Typography>
                    </Box>
                ) : requests.length === 0 ? (
                    <Box textAlign="center" py={10}>
                        <Typography color="text.secondary">
                            Không có yêu cầu hoàn tiền nào đang chờ xử lý
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <PrimaryDataGrid<ReturnRequest>
                            rows={requests}
                            columns={columns}
                            getRowId={(row) => row.id}
                            onRowClick={(request: ReturnRequest) => handleView(request)}
                        />
                    </Box>
                )}
            </Box>

            <PrimaryModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedRequest(null);
                }}
                title={selectedRequest ? `Yêu cầu hoàn tiền #${selectedRequest.id.slice(0, 8)}` : "Chi tiết yêu cầu"}
                maxWidth="lg"
            >
                {selectedRequest && (
                    <ReturnRequestDetailModal
                        request={selectedRequest}
                        onResult={(message) => {
                            setAlert({ visible: true, content: message, type: "success", duration: 3000 });
                        }}
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedRequest(null);
                        }}
                    />
                )}
            </PrimaryModal>
        </div>
    );
}