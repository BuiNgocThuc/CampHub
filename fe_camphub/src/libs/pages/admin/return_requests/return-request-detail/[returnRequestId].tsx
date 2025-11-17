"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button, Chip, Divider } from "@mui/material";
import type { NextPage } from "next";
import { mockReturnRequests } from "@/libs/utils";
import { ReasonReturnType, ReturnRequestStatus } from "@/libs/core/constants";

const ReturnRequestDetail: NextPage = () => {
    const router = useRouter();
    const params = useParams();
    const { returnRequestId } = params as { returnRequestId: string };

    const request = mockReturnRequests.find((r) => r.id === returnRequestId);

    if (!request) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Chi tiết yêu cầu</h2>
                <p className="text-gray-500 italic">Không tìm thấy yêu cầu.</p>
                <Button className="mt-4" onClick={() => router.back()}>
                    Quay lại
                </Button>
            </div>
        );
    }

    const handleApprove = () => {
        alert("✅ Đã chấp nhận yêu cầu hoàn tiền.");
    };

    const handleReject = () => {
        alert("❌ Đã từ chối yêu cầu hoàn tiền.");
    };

    const reasonLabel =
        {
            [ReasonReturnType.MISSING_PARTS]: "Giao thiếu đồ",
            [ReasonReturnType.WRONG_DESCRIPTION]: "Không đúng mô tả",
            [ReasonReturnType.NO_NEEDED_ANYMORE]: "Không còn nhu cầu sử dụng",
        }[request.reason] ?? "Không xác định";

    const statusColor =
        request.status === ReturnRequestStatus.APPROVED
            ? "success"
            : request.status === ReturnRequestStatus.REJECTED
                ? "error"
                : "warning";

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                    Yêu cầu hoàn tiền #{request.id}
                </h2>
                <Button variant="outlined" onClick={() => router.back()}>
                    ← Quay lại
                </Button>
            </div>

            {/* Thông tin chung */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                <p>
                    <strong>Người thuê:</strong> {request.lesseeId}
                </p>
                <p>
                    <strong>Chủ thuê:</strong> {request.lessorId}
                </p>
                <p>
                    <strong>Đơn thuê:</strong> {request.bookingId}
                </p>
                <p>
                    <strong>Lý do trả đồ:</strong> {reasonLabel}
                </p>
                <p>
                    <strong>Ngày gửi yêu cầu:</strong>{" "}
                    {new Date(request.createdAt).toLocaleString("vi-VN")}
                </p>
                <p>
                    <strong>Trạng thái:</strong>{" "}
                    <Chip label={request.status} color={statusColor} size="small" />
                </p>
            </div>

            {/* Ghi chú người thuê */}
            {request.note && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="font-semibold mb-1">Ghi chú từ người thuê:</p>
                    <p className="text-gray-700 whitespace-pre-line">{request.note}</p>
                </div>
            )}

            {/* Minh chứng */}
            {request.evidenceUrls && request.evidenceUrls.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="font-semibold mb-2">Ảnh / Video minh chứng:</p>
                    <div className="grid grid-cols-3 gap-4">
                        {request.evidenceUrls.map((media, idx) => (
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
                                        <Image
                                            src={media.url}
                                            alt={`evidence-${idx}`}
                                            fill
                                            className="object-cover"
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

            <Divider />

            {/* Ghi chú admin */}
            {request.adminNote && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="font-semibold mb-1">Ghi chú của quản trị viên:</p>
                    <p className="text-gray-700 whitespace-pre-line">
                        {request.adminNote}
                    </p>
                </div>
            )}

            {/* Nút hành động */}
            {request.status === ReturnRequestStatus.PENDING && (
                <div className="flex gap-3">
                    <Button variant="contained" color="success" onClick={handleApprove}>
                        Chấp nhận
                    </Button>
                    <Button variant="contained" color="error" onClick={handleReject}>
                        Từ chối
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ReturnRequestDetail;
