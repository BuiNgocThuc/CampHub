"use client";

import { useQuery } from "@tanstack/react-query";
import { PrimaryModal } from "@/libs/components";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { getDisputeById } from "@/libs/api/dispute-api";
import { DisputeStatus, DisputeDecision } from "@/libs/core/constants";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, Image as ImageIcon, X } from "lucide-react";
import { AppImage } from "@/libs/components";

interface DisputeDetailModalProps {
    open: boolean;
    onClose: () => void;
    disputeId: string;
}

export default function DisputeDetailModal({ open, onClose, disputeId }: DisputeDetailModalProps) {
    const { data: dispute, isLoading } = useQuery({
        queryKey: ["dispute", disputeId],
        queryFn: () => getDisputeById(disputeId),
        enabled: open && !!disputeId,
    });

    const getStatusBadge = (status: DisputeStatus, decision?: DisputeDecision) => {
        if (status === DisputeStatus.PENDING_REVIEW) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    <Clock size={14} />
                    Đang chờ xử lý
                </span>
            );
        }
        if (status === DisputeStatus.RESOLVED) {
            if (decision === DisputeDecision.APPROVED) {
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle2 size={14} />
                        Đã chấp nhận
                    </span>
                );
            }
            if (decision === DisputeDecision.REJECTED) {
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <XCircle size={14} />
                        Đã từ chối
                    </span>
                );
            }
        }
        return null;
    };

    return (
        <PrimaryModal open={open} onClose={onClose} title="Chi tiết khiếu nại">
            <Box sx={{ p: 3, minWidth: 800, maxWidth: 1000 }}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : dispute ? (
                    <div className="space-y-6">
                        {/* Header với status */}
                        <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                    Khiếu nại #{dispute.id.slice(0, 8)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Đơn thuê: {dispute.bookingId}
                                </p>
                            </div>
                            {getStatusBadge(dispute.status, dispute.adminDecision)}
                        </div>

                        {/* Thông tin cơ bản */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Loại hư tổn</p>
                                <p className="font-semibold text-gray-800 text-lg">{dispute.damageTypeName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Người bị báo cáo</p>
                                <p className="font-semibold text-gray-800 text-lg">{dispute.defenderName}</p>
                            </div>
                            {dispute.compensationRate && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tỷ lệ bồi thường</p>
                                    <p className="font-semibold text-orange-600 text-lg">
                                        {(dispute.compensationRate * 100).toFixed(0)}% tiền cọc
                                    </p>
                                </div>
                            )}
                            {dispute.compensationAmount && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Số tiền bồi thường</p>
                                    <p className="font-semibold text-green-600 text-lg">
                                        {dispute.compensationAmount.toLocaleString("vi-VN")}₫
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Mô tả */}
                        {dispute.description && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Mô tả</p>
                                <p className="text-gray-800 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {dispute.description}
                                </p>
                            </div>
                        )}

                        {/* Minh chứng - Ảnh lớn */}
                        {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <ImageIcon size={18} />
                                    Minh chứng ({dispute.evidenceUrls.length})
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {dispute.evidenceUrls.map((evidence, idx) => (
                                        <div
                                            key={idx}
                                            className="relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors group"
                                        >
                                            {evidence.type === "VIDEO" ? (
                                                <video
                                                    src={evidence.url}
                                                    controls
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="relative">
                                                    <AppImage
                                                        src={evidence.url}
                                                        alt={`Minh chứng ${idx + 1}`}
                                                        width={300}
                                                        height={200}
                                                        className="w-full h-48 object-cover cursor-pointer"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold">
                                                            Click để xem lớn
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ghi chú từ admin */}
                        {dispute.adminNote && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Ghi chú từ admin</p>
                                <p className="text-gray-800 bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    {dispute.adminNote}
                                </p>
                            </div>
                        )}

                        {/* Thông tin admin xử lý */}
                        {dispute.adminName && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Admin xử lý</p>
                                <p className="font-semibold text-gray-800">{dispute.adminName}</p>
                            </div>
                        )}

                        {/* Thời gian */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-500">
                            <span>
                                <strong>Tạo lúc:</strong> {format(new Date(dispute.createdAt), "dd/MM/yyyy HH:mm")}
                            </span>
                            {dispute.resolvedAt && (
                                <span>
                                    <strong>Giải quyết:</strong> {format(new Date(dispute.resolvedAt), "dd/MM/yyyy HH:mm")}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                        <Typography color="error">Không tìm thấy khiếu nại</Typography>
                    </Box>
                )}
            </Box>
        </PrimaryModal>
    );
}

