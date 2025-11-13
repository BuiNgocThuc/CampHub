"use client";

import { useState } from "react";
import { Chip, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {PrimaryTable, PrimaryModal} from "@/libs/components";
import ExtensionDetailModal from "./extension-detail";
import { mockExtensionRequests, mockAccounts } from "@/libs/utils/mock-data";
import { ExtensionStatus } from "@/libs/constants";
import { ExtensionRequest } from "@/libs/types";

export default function ExtensionManagementPage() {
    const [selectedRequest, setSelectedRequest] = useState<ExtensionRequest | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleView = (req: ExtensionRequest) => {
        setSelectedRequest(req);
        setOpenModal(true);
    };

    const getAccountName = (id: string) => {
        const acc = mockAccounts.find((a) => a.id === id);
        return acc ? `${acc.firstname} ${acc.lastname}` : "(Không xác định)";
    };

    const getStatusChip = (status: ExtensionStatus) => {
        let color: "default" | "success" | "warning" | "error" | "info" = "default";
        let label = "";
        switch (status) {
            case ExtensionStatus.PENDING:
                label = "Đang chờ duyệt";
                color = "warning";
                break;
            case ExtensionStatus.APPROVED:
                label = "Đã chấp thuận";
                color = "success";
                break;
            case ExtensionStatus.REJECTED:
                label = "Bị từ chối";
                color = "error";
                break;
            case ExtensionStatus.CANCELLED:
                label = "Đã hủy";
                color = "default";
                break;
            case ExtensionStatus.EXPIRED:
                label = "Hết hạn";
                color = "default";
                break;
        }
        return <Chip label={label} color={color} size="small" />;
    };

    const columns = [
        { field: "id", headerName: "Mã yêu cầu" },
        {
            field: "lesseeId",
            headerName: "Người thuê",
            render: (row: ExtensionRequest) => getAccountName(row.lesseeId),
        },
        {
            field: "lessorId",
            headerName: "Chủ thuê",
            render: (row: ExtensionRequest) => getAccountName(row.lessorId),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            render: (row: ExtensionRequest) => getStatusChip(row.status),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            render: (row: ExtensionRequest) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton color="primary" onClick={() => handleView(row)}>
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách yêu cầu gia hạn thuê</h1>

            <PrimaryTable columns={columns} rows={mockExtensionRequests} />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={selectedRequest ? `Chi tiết yêu cầu ${selectedRequest.id}` : "Chi tiết yêu cầu"}
            >
                {selectedRequest && <ExtensionDetailModal request={selectedRequest} />}
            </PrimaryModal>
        </div>
    );
}
