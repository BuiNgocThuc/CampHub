"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button, Chip, Divider, TextField } from "@mui/material";
import { useState } from "react";
import { DisputeDecision, DisputeStatus } from "@/libs/constants";
import { mockDamageTypes, mockDisputes } from "@/libs/utils";

export default function DisputeDetailPage() {
    const router = useRouter();
    const { disputeId } = useParams() as { disputeId: string };
    const dispute = mockDisputes.find((d) => d.id === disputeId);
    const [adminNote, setAdminNote] = useState("");

    if (!dispute) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Chi tiết khiếu nại</h2>
                <p className="text-gray-500 italic">Không tìm thấy khiếu nại.</p>
                <Button className="mt-4" onClick={() => router.back()}>
                    Quay lại
                </Button>
            </div>
        );
    }

    const damageType = mockDamageTypes.find(d => d.id === dispute.damageTypeId);
    const compensation = damageType ? damageType.compensationRate * 100 : null;

    const handleDecision = (decision: DisputeDecision) => {
        alert(
            `✅ Khiếu nại #${dispute.id} đã được ${
                decision === DisputeDecision.APPROVED ? "chấp nhận" : "từ chối"
            }.`
        );
        // TODO: gọi API PUT /api/admin/disputes/{id}/decision
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Chi tiết khiếu nại #{dispute.id}</h2>
                <Button variant="outlined" onClick={() => router.back()}>
                    ← Quay lại
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                <p><strong>Chủ thuê:</strong> {dispute.reporterId}</p>
                <p><strong>Người thuê:</strong> {dispute.defenderId}</p>
                <p><strong>Đơn thuê:</strong> {dispute.bookingId}</p>
                <p><strong>Loại hư tổn:</strong> {damageType?.name ?? "Không xác định"}</p>
                <p><strong>Tỷ lệ bồi thường:</strong> {compensation ? `${compensation}%` : "—"}</p>
                <p><strong>Trạng thái:</strong> <Chip
                    label={
                        dispute.status === DisputeStatus.PENDING_REVIEW
                            ? "Chờ xử lý"
                            : "Đã xử lý"
                    }
                    color={
                        dispute.status === DisputeStatus.PENDING_REVIEW
                            ? "warning"
                            : "success"
                    }
                    size="small"
                /></p>
                <p><strong>Ngày tạo:</strong> {new Date(dispute.createdAt).toLocaleString("vi-VN")}</p>
            </div>

            {dispute.description && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="font-semibold mb-1">Mô tả của chủ thuê:</p>
                    <p className="text-gray-700">{dispute.description}</p>
                </div>
            )}

            {dispute.evidences && dispute.evidences.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="font-semibold mb-2">Minh chứng hư hỏng:</p>
                    <div className="grid grid-cols-3 gap-4">
                        {dispute.evidences.map((media, idx) => (
                            <div key={idx} className="relative w-full flex flex-col items-center border rounded-lg overflow-hidden shadow-sm bg-gray-50">
                                {media.type === "VIDEO" ? (
                                    <video controls className="w-full h-40 object-cover bg-black" src={media.url} />
                                ) : (
                                    <div className="relative w-full h-40">
                                        <Image src={media.url} alt={`evidence-${idx}`} fill className="object-cover" />
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

            <Divider />

            {/* Admin ghi chú & hành động */}
            {dispute.status === DisputeStatus.PENDING_REVIEW ? (
                <div className="space-y-3">
                    <TextField
                        fullWidth
                        label="Ghi chú của quản trị viên"
                        multiline
                        rows={3}
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                    />
                    <div className="flex gap-3">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleDecision(DisputeDecision.APPROVED)}
                        >
                            Chấp nhận
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDecision(DisputeDecision.REJECTED)}
                        >
                            Từ chối
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p><strong>Kết quả:</strong> {dispute.adminDecision === "ACCEPTED" ? "Chấp nhận bồi thường" : "Từ chối"}</p>
                    {dispute.adminNote && <p><strong>Ghi chú admin:</strong> {dispute.adminNote}</p>}
                </div>
            )}
        </div>
    );
}
