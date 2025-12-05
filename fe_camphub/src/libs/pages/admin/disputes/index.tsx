// app/admin/disputes/page.tsx
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
import { PrimaryDataGrid, PrimaryModal, PrimarySelectField } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getAllDisputes } from "@/libs/api/dispute-api";
import DisputeDetailModal from "./dispute-detail";
import { Dispute } from "@/libs/core/types";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DisputeStatus } from "@/libs/core/constants";

const statusConfig: Record<DisputeStatus, { label: string; color: "warning" | "success" }> = {
    PENDING_REVIEW: { label: "Chờ xử lý", color: "warning" },
    RESOLVED: { label: "Đã xử lý", color: "success" },
};

export default function DisputeList() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
    const [statusFilter, setStatusFilter] = useState<DisputeStatus | "">("");

    const { data: disputes = [], isLoading } = useQuery({
        queryKey: ["AllDisputes"],
        queryFn: getAllDisputes,
    });

    const filteredDisputes = disputes.filter((dispute) => {
        if (!statusFilter) return true;
        return dispute.status === statusFilter;
    });

    const handleView = (dispute: Dispute) => {
        setSelectedDispute(dispute);
        setOpenModal(true);
    };


    const columns: GridColDef<Dispute>[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Dispute>) => {
                const index = filteredDisputes.findIndex((dispute) => dispute.id === params.row.id);
                return <Typography>{index + 1}</Typography>;
            },
        },
        {
            field: "defenderName",
            headerName: "Chủ thuê",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Dispute>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.defenderName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "reporterName",
            headerName: "Khách thuê",
            width: 180,
            flex: 1.2,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Dispute>) => (
                <Typography fontSize="0.875rem" fontWeight="medium">
                    {params.row.reporterName || "N/A"}
                </Typography>
            ),
        },
        {
            field: "itemName",
            headerName: "Tên sản phẩm",
            width: 200,
            flex: 1.5,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Dispute>) => {
                // Nếu không có itemName trong dispute, có thể lấy từ booking hoặc hiển thị bookingId
                const itemName = (params.row as any).itemName || params.row.bookingId?.slice(0, 8) || "N/A";
                return (
                    <Tooltip title={itemName}>
                        <Typography fontSize="0.875rem" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                            {itemName}
                        </Typography>
                    </Tooltip>
                );
            },
        },
        {
            field: "damageTypeName",
            headerName: "Loại hư hại",
            width: 200,
            flex: 1.3,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<Dispute>) => (
                <Typography fontSize="0.875rem">
                    {params.row.damageTypeName || "N/A"}
                </Typography>
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
            renderCell: (params: GridRenderCellParams<Dispute>) => {
                const status = params.row.status as DisputeStatus;
                const config = statusConfig[status];
                if (!config) {
                    return <Chip label="N/A" size="small" sx={{ fontWeight: 600 }} />;
                }
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
            renderCell: (params: GridRenderCellParams<Dispute>) => (
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
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý khiếu nại & bồi thường hư hỏng ({filteredDisputes.length})
                    </Typography>

                    <Box minWidth={200}>
                        <PrimarySelectField
                            size="small"
                            label="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as DisputeStatus | "")}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                ...Object.entries(statusConfig).map(([key, config]) => ({
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
                        <Typography ml={2}>Đang tải khiếu nại...</Typography>
                    </Box>
                ) : filteredDisputes.length === 0 ? (
                    <Box textAlign="center" py={10}>
                        <Typography color="text.secondary">
                            {statusFilter ? "Không có khiếu nại nào phù hợp" : "Không có khiếu nại nào đang chờ xử lý"}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <PrimaryDataGrid<Dispute>
                            rows={filteredDisputes}
                            columns={columns}
                            getRowId={(row) => row.id}
                            onRowClick={(dispute: Dispute) => handleView(dispute)}
                        />
                    </Box>
                )}
            </Box>

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={selectedDispute ? `Khiếu nại #${selectedDispute.id.slice(0, 8)}` : "Chi tiết"}
                maxWidth="lg"
            >
                {selectedDispute && (
                    <DisputeDetailModal dispute={selectedDispute} onClose={() => setOpenModal(false)} />
                )}
            </PrimaryModal>
        </div>
    );
}