"use client";

import Image from "next/image";
import { Divider } from "@mui/material";
import { ItemLog } from "@/libs/types";

interface ItemLogDetailProps {
    log?: ItemLog;
}

export default function ItemLogDetail({ log }: ItemLogDetailProps) {
    if (!log) {
        return <div className="text-gray-500 italic">Không có dữ liệu log.</div>;
    }

    return (
        <div className="space-y-4">
            {/* 🧾 Thông tin cơ bản */}
            <div className="space-y-1">
                <p>
                    <strong>Mã sản phẩm:</strong> {log.itemId}
                </p>
                <p>
                    <strong>Người thực hiện:</strong> {log.accountId}
                </p>
                <p>
                    <strong>Thời gian:</strong>{" "}
                    {new Date(log.createdAt).toLocaleString("vi-VN")}
                </p>
                <p>
                    <strong>Hành động:</strong>{" "}
                    <span className="font-semibold text-blue-600">{log.action}</span>
                </p>
            </div>

            <Divider />

            {/* 🔄 Thay đổi trạng thái */}
            {(log.previousStatus || log.currentStatus) && (
                <div>
                    <p className="font-semibold mb-1">Trạng thái thay đổi:</p>
                    <p>
                        {log.previousStatus ?? "—"} →{" "}
                        <span className="text-blue-600 font-semibold">
                            {log.currentStatus ?? "—"}
                        </span>
                    </p>
                </div>
            )}

            {/* 📝 Ghi chú */}
            {log.note && (
                <div>
                    <p className="font-semibold mb-1">Ghi chú:</p>
                    <p className="text-gray-700 whitespace-pre-line">{log.note}</p>
                </div>
            )}

            {/* 📸 Minh chứng */}
            {Array.isArray(log.evidenceUrls) && log.evidenceUrls.length > 0 && (
                <div>
                    <p className="font-semibold mb-2">Minh chứng:</p>
                    <div className="grid grid-cols-3 gap-3">
                        {log.evidenceUrls.map((media, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="relative w-full h-28">
                                    <Image
                                        src={media.url}
                                        alt={media.description || `evidence-${idx}`}
                                        fill
                                        className="object-cover rounded-md shadow-sm"
                                    />
                                </div>
                                {media.description && (
                                    <p className="text-xs text-gray-600 text-center">
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
