"use client";

import { useState } from "react";
import { Chip, IconButton } from "@mui/material";
import { Eye } from "lucide-react";
import { PrimaryTable, PrimaryModal } from "@/libs/components";
import { Dispute, DamageType } from "@/libs/core/types";
import { DisputeStatus } from "@/libs/core/constants";
import { mockDisputes, mockDamageTypes } from "@/libs/utils";

// Chi tiết khiếu nại hiển thị trong modal
function DisputeDetail({ dispute }: { dispute: Dispute | null }) {
    if (!dispute) return <div className="italic text-gray-500">Không có dữ liệu</div>;

    const damageTypeName =
        mockDamageTypes.find((d: DamageType) => d.id === dispute.damageTypeId)?.name ??
        "Không xác định";

    return (
        <div className="space-y-4">
            <p><strong>Mã đơn thuê:</strong> {dispute.bookingId}</p>
            <p><strong>Người báo cáo:</strong> {dispute.reporterId}</p>
            <p><strong>Người bị khiếu nại:</strong> {dispute.defenderId}</p>
            <p><strong>Loại hư hại:</strong> {damageTypeName}</p>
            <p><strong>Trạng thái:</strong> {dispute.status}</p>
            {dispute.description && (
                <p><strong>Mô tả khiếu nại:</strong> {dispute.description}</p>
            )}
            {dispute.compensationAmount !== undefined && (
                <p><strong>Số tiền bồi thường đề xuất:</strong> {dispute.compensationAmount}</p>
            )}
            {dispute.evidences && dispute.evidences.length > 0 && (
                <div>
                    <strong>Minh chứng:</strong>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {dispute.evidences.map((media, idx) => (
                            <div
                                key={idx}
                                className="relative w-full flex flex-col items-center border rounded-lg overflow-hidden shadow-sm bg-gray-50"
                            >
                                {media.type === "VIDEO" ? (
                                    <video
                                        controls
                                        className="w-full h-40 object-cover bg-black"
                                        src={media.url}
                                    />
                                ) : (
                                    <div className="relative w-full h-40">
                                        <img
                                            src={media.url}
                                            alt={`evidence-${idx}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                                {media.description && (
                                    <p className="text-sm text-gray-600 px-2 py-1 text-center bg-white w-full border-t">
                                        {media.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DisputeList() {
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const columns = [
        { field: "id", headerName: "Mã khiếu nại" },
        { field: "reporterId", headerName: "Người báo cáo" },
        { field: "defenderId", headerName: "Người bị khiếu nại" },
        {
            field: "damageTypeId",
            headerName: "Loại hư hại",
            render: (row: Dispute) =>
                mockDamageTypes.find(d => d.id === row.damageTypeId)?.name ?? "Không xác định",
        },
        {
            field: "status",
            headerName: "Trạng thái",
            render: (row: Dispute) => {
                const color =
                    row.status === DisputeStatus.PENDING_REVIEW ? "warning" : "success";
                return <Chip label={row.status} color={color as any} size="small" />;
            },
        },
        {
            field: "createdAt",
            headerName: "Ngày tạo",
            render: (row: Dispute) => new Date(row.createdAt).toLocaleString("vi-VN"),
        },
        {
            field: "actions",
            headerName: "Chi tiết",
            render: (row: Dispute) => (
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDispute(row);
                        setOpenModal(true);
                    }}
                >
                    <Eye size={18} />
                </IconButton>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Danh sách khiếu nại – bồi thường</h2>

            <PrimaryTable columns={columns} rows={mockDisputes} />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Chi tiết khiếu nại"
            >
                <DisputeDetail dispute={selectedDispute} />
            </PrimaryModal>
        </div>
    );
}
