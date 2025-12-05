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
import { PrimaryDataGrid, PrimaryModal } from "@/libs/components";
import { useQuery } from "@tanstack/react-query";
import { getAllDisputes, getPendingDisputes } from "@/libs/api/dispute-api";
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

    const { data: disputes = [], isLoading } = useQuery({
        queryKey: ["AllDisputes"],
        queryFn: getAllDisputes,
    });

    const handleView = (dispute: Dispute) => {
        setSelectedDispute(dispute);
        setOpenModal(true);
    };


    const columns: GridColDef<Dispute>[] = [
        {
            field: "id",
            headerName: "Mã khiếu nại",
            width: 130,
            renderCell: (params) => (
                <Typography fontFamily="monospace" color="text.secondary">
                    {(params.value as string).slice(0, 8)}
                </Typography>
            ),
        },
        {
            field: "reporterName",
            headerName: "Người báo cáo",
            width: 180,
            renderCell: (params) => (
                <Typography fontWeight="medium">{params.value as string}</Typography>
            ),
        },
        {
            field: "defenderName",
            headerName: "Người bị báo cáo",
            width: 180,
            renderCell: (params) => (
                <Typography fontWeight="medium">{params.value as string}</Typography>
            ),
        },
        {
            field: "damageTypeName",
            headerName: "Loại hư hại",
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2">{params.value as string}</Typography>
            ),
        },
        {
            field: "compensationRate",
            headerName: "Tỷ lệ bồi thường",
            width: 140,
            renderCell: (params) => {
                const rate = params.value as number | null;
                return rate != null ? `${(rate * 100).toFixed(0)}%` : "—";
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: (params) => {
                const status = params.value as DisputeStatus;
                const config = statusConfig[status];
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
            headerName: "Ngày tạo",
            width: 170,
            renderCell: (params) => (
                <Typography variant="body2">
                    {new Date(params.value as string).toLocaleString("vi-VN")}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Xem chi tiết & xử lý">
                    <IconButton
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(params.row);
                        }}
                    >
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
                    Quản lý khiếu nại & bồi thường hư hỏng
                </Typography>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" my={8}>
                        <CircularProgress />
                        <Typography ml={2}>Đang tải khiếu nại...</Typography>
                    </Box>
                ) : disputes.length === 0 ? (
                    <Typography textAlign="center" color="text.secondary" py={10}>
                        Không có khiếu nại nào đang chờ xử lý
                    </Typography>
                ) : (
                    <PrimaryDataGrid<Dispute>
                        rows={disputes}
                        columns={columns}
                        getRowId={(row) => row.id}
                        onRowClick={(dispute: Dispute) => handleView(dispute)}
                    />
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