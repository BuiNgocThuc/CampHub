"use client";

import { ExtensionRequest } from "@/libs/core/types";
import { mockAccounts, mockBookings } from "@/libs/utils/mock-data";

interface ExtensionDetailModalProps {
    request: ExtensionRequest;
}

export default function ExtensionDetailModal({ request }: ExtensionDetailModalProps) {
    const booking = mockBookings.find((b) => b.id === request.bookingId);
    const lessee = mockAccounts.find((a) => a.id === request.lesseeId);
    const lessor = mockAccounts.find((a) => a.id === request.lessorId);

    return (
        <div className="space-y-5 text-sm">
            {/* Thông tin yêu cầu */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Thông tin yêu cầu</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    <p><strong>Mã yêu cầu:</strong> {request.id}</p>
                    <p><strong>Mã đơn thuê:</strong> {request.bookingId}</p>
                    <p><strong>Trạng thái:</strong> {request.status}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                </div>
            </section>

            {/* Thời gian gia hạn */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Thời gian gia hạn</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    <p><strong>Ngày cũ:</strong> {request.oldEndDate || "(Chưa có)"}</p>
                    <p><strong>Ngày đề xuất mới:</strong> {request.requestedNewEndDate}</p>
                    <p><strong>Phí bổ sung:</strong> {request.additionalFee.toLocaleString()}₫</p>
                </div>
            </section>

            {/* Thông tin người thuê và chủ thuê */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Người liên quan</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    <p><strong>Người thuê:</strong> {lessee ? `${lessee.firstname} ${lessee.lastname}` : "(Không xác định)"}</p>
                    <p><strong>Chủ thuê:</strong> {lessor ? `${lessor.firstname} ${lessor.lastname}` : "(Không xác định)"}</p>
                </div>
            </section>

            {/* Thông tin đơn thuê */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Thông tin đơn thuê</h2>
                {booking ? (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                        <p><strong>Mã đơn thuê:</strong> {booking.id}</p>
                        <p><strong>Trạng thái đơn:</strong> {booking.status}</p>
                        <p><strong>Ngày bắt đầu:</strong> {booking.startDate}</p>
                        <p><strong>Ngày kết thúc:</strong> {booking.endDate}</p>
                    </div>
                ) : (
                    <p>(Không tìm thấy thông tin đơn thuê)</p>
                )}
            </section>

            {/* Ghi chú */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Ghi chú</h2>
                <p>{request.note || "(Không có ghi chú)"}</p>
            </section>
        </div>
    );
}
