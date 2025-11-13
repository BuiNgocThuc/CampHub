"use client";

import { Booking } from "@/libs/types";
import { mockItems, mockAccounts } from "@/libs/utils/mock-data";

interface BookingDetailModalProps {
    booking: Booking;
}

export default function BookingDetailModal({ booking }: BookingDetailModalProps) {
    const item = mockItems.find((i) => i.id === booking.itemId);
    const lessee = mockAccounts.find((a) => a.id === booking.lesseeId);
    const lessor = mockAccounts.find((a) => a.id === booking.lessorId);

    return (
        <div className="space-y-5 text-sm">
            {/* Thông tin chung */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Thông tin chung</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    <p><strong>Mã đơn:</strong> {booking.id}</p>
                    <p><strong>Trạng thái:</strong> {booking.status}</p>
                    <p><strong>Ngày bắt đầu:</strong> {booking.startDate}</p>
                    <p><strong>Ngày kết thúc:</strong> {booking.endDate}</p>
                    <p><strong>Số lượng:</strong> {booking.quantity}</p>
                    <p><strong>Đặt cọc:</strong> {booking.depositAmount.toLocaleString()}₫</p>
                    <p><strong>Giá thuê/ngày:</strong> {booking.pricePerDay.toLocaleString()}₫</p>
                </div>
            </section>

            {/* Thông tin sản phẩm */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Sản phẩm thuê</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    <p><strong>Mã sản phẩm:</strong> {item?.id ?? "(Không xác định)"}</p>
                    <p><strong>Tên sản phẩm:</strong> {item?.name ?? "(Không xác định)"}</p>
                </div>
            </section>

            {/* Thông tin người thuê và chủ thuê */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Người tham gia</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                    <p><strong>Người thuê:</strong> {lessee ? `${lessee.firstname} ${lessee.lastname}` : "(Không xác định)"}</p>
                    <p><strong>Chủ thuê:</strong> {lessor ? `${lessor.firstname} ${lessor.lastname}` : "(Không xác định)"}</p>
                </div>
            </section>

            {/* Ghi chú */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Ghi chú</h2>
                <p>{booking.note || "(Không có ghi chú)"}</p>
            </section>
        </div>
    );
}
