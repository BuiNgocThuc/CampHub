"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyDisputes } from "@/libs/api/dispute-api";
import { Dispute } from "@/libs/core/types";
import { DisputeStatus, DisputeDecision } from "@/libs/core/constants";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, XCircle, Clock, Image as ImageIcon, Eye } from "lucide-react";
import { AppImage, PrimaryButton, PrimaryPagination } from "@/libs/components";
import DisputeDetailModal from "./booking-management/DisputeDetailModal";

export default function MyDisputes() {
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const { data: disputes = [], isLoading } = useQuery({
        queryKey: ["myDisputes"],
        queryFn: getMyDisputes,
    });

    const totalPages = Math.ceil(disputes.length / itemsPerPage);
    const paginatedDisputes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return disputes.slice(startIndex, endIndex);
    }, [disputes, currentPage, itemsPerPage]);

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

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                <p className="mt-4 text-gray-600">Đang tải danh sách khiếu nại...</p>
            </div>
        );
    }

    if (disputes.length === 0) {
        return (
            <div className="py-20 text-center bg-gray-50 rounded-3xl">
                <AlertCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-700 mb-3">Chưa có khiếu nại nào</h2>
                <p className="text-gray-500">Bạn chưa gửi khiếu nại nào</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Khiếu nại của tôi ({disputes.length})</h2>

            <div className="space-y-4">
                {paginatedDisputes.map((dispute) => (
                    <div
                        key={dispute.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    Khiếu nại #{dispute.id.slice(0, 8)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Đơn thuê: {dispute.bookingId.slice(0, 8)}...
                                </p>
                            </div>
                            {getStatusBadge(dispute.status, dispute.adminDecision)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Loại hư tổn</p>
                                <p className="font-semibold text-gray-800">{dispute.damageTypeName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Người bị báo cáo</p>
                                <p className="font-semibold text-gray-800">{dispute.defenderName}</p>
                            </div>
                            {dispute.compensationRate && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tỷ lệ bồi thường</p>
                                    <p className="font-semibold text-orange-600">
                                        {(dispute.compensationRate * 100).toFixed(0)}% tiền cọc
                                    </p>
                                </div>
                            )}
                            {dispute.compensationAmount && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Số tiền bồi thường</p>
                                    <p className="font-semibold text-green-600">
                                        {dispute.compensationAmount.toLocaleString("vi-VN")}₫
                                    </p>
                                </div>
                            )}
                        </div>

                        {dispute.description && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Mô tả</p>
                                <p className="text-gray-800 bg-gray-50 rounded-lg p-3">{dispute.description}</p>
                            </div>
                        )}

                        {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                                    <ImageIcon size={16} />
                                    Minh chứng ({dispute.evidenceUrls.length})
                                </p>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                    {dispute.evidenceUrls.map((evidence, idx) => (
                                        <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200">
                                            {evidence.type === "VIDEO" ? (
                                                <video
                                                    src={evidence.url}
                                                    controls
                                                    className="w-full h-24 object-cover"
                                                />
                                            ) : (
                                                <AppImage
                                                    src={evidence.url}
                                                    alt={`Minh chứng ${idx + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="w-full h-24 object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dispute.adminNote && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Ghi chú từ admin</p>
                                <p className="text-gray-800 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    {dispute.adminNote}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                <span>
                                    Tạo lúc: {format(new Date(dispute.createdAt), "dd/MM/yyyy HH:mm")}
                                </span>
                                {dispute.resolvedAt && (
                                    <span className="ml-4">
                                        Giải quyết: {format(new Date(dispute.resolvedAt), "dd/MM/yyyy HH:mm")}
                                    </span>
                                )}
                            </div>
                            <PrimaryButton
                                content="Xem chi tiết"
                                icon={<Eye size={16} />}
                                onClick={() => setSelectedDisputeId(dispute.id)}
                                size="small"
                                className="bg-blue-600 hover:bg-blue-700"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {disputes.length > 0 && (
                <PrimaryPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {selectedDisputeId && (
                <DisputeDetailModal
                    open={!!selectedDisputeId}
                    onClose={() => setSelectedDisputeId(null)}
                    disputeId={selectedDisputeId}
                />
            )}
        </div>
    );
}

