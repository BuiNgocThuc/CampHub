// components/booking/BookingList.tsx
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Package, User, Calendar, Clock, CheckCircle2, Truck, RotateCcw, AlertCircle, MessageSquare, XCircle } from "lucide-react";
import { Booking } from "@/libs/core/types";
import { BookingStatus } from "@/libs/core/constants";

interface BookingListProps {
    bookings: Booking[];
    role: "lessee" | "lessor";
    renderActions?: (booking: Booking) => React.ReactNode;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING_CONFIRM: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
    PAID_REJECTED: { label: "Bị từ chối", color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" /> },
    WAITING_DELIVERY: { label: "Chờ giao hàng", color: "bg-blue-100 text-blue-800", icon: <Truck className="w-4 h-4" /> },
    IN_USE: { label: "Đang thuê", color: "bg-green-100 text-green-800", icon: <Package className="w-4 h-4" /> },
    DUE_FOR_RETURN: { label: "Sắp đến hạn trả", color: "bg-orange-100 text-orange-800", icon: <Calendar className="w-4 h-4" /> },
    RETURNED_PENDING_CHECK: { label: "Chờ kiểm tra", color: "bg-purple-100 text-purple-800", icon: <RotateCcw className="w-4 h-4" /> },
    RETURN_REFUND_REQUESTED: { label: "Yêu cầu hoàn tiền", color: "bg-red-100 text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
    RETURN_REFUND_PROCESSING: { label: "Đang xử lý hoàn tiền", color: "bg-indigo-100 text-indigo-800", icon: <Clock className="w-4 h-4" /> },
    WAITING_REFUND: { label: "Chờ hoàn tiền", color: "bg-cyan-100 text-cyan-800", icon: <Clock className="w-4 h-4" /> },
    COMPLETED: { label: "Hoàn thành", color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle2 className="w-4 h-4" /> },
    COMPENSATION_COMPLETED: { label: "Đã bồi thường", color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle2 className="w-4 h-4" /> },
    DISPUTE_PENDING_REVIEW: { label: "Khiếu nại", color: "bg-red-200 text-red-900", icon: <MessageSquare className="w-4 h-4" /> },
    LATE_RETURN: { label: "Trả trễ", color: "bg-red-100 text-red-800", icon: <AlertCircle className="w-4 h-4" /> },
    OVERDUE: { label: "Quá hạn", color: "bg-red-200 text-red-900", icon: <AlertCircle className="w-4 h-4" /> },
    DAMAGED_ITEM: { label: "Hỏng đồ", color: "bg-red-200 text-red-900", icon: <AlertCircle className="w-4 h-4" /> },
    FORFEITED: { label: "Bị tịch thu", color: "bg-black text-white", icon: <AlertCircle className="w-4 h-4" /> },
};

const formatDate = (d: string) => format(new Date(d), "dd/MM/yyyy", { locale: vi });

export default function BookingList({ bookings, role, renderActions }: BookingListProps) {
    if (bookings.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {bookings.map((booking) => {
                const statusInfo = statusConfig[booking.status];
                const isLessee = role === "lessee";

                return (
                    <div key={booking.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow transition">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{booking.itemName}</h3>
                                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                    <User size={16} />
                                    {isLessee ? "Chủ đồ:" : "Khách thuê:"}{" "}
                                    <span className="font-medium">{isLessee ? booking.lessorName : booking.lesseeName}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </span>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                            <div>
                                <p className="text-gray-500">Thời gian thuê</p>
                                <p className="font-medium text-gray-900">
                                    {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Số lượng</p>
                                <p className="font-medium">{booking.quantity} cái</p>
                            </div>
                            <div>
                                <p className="text-gray-500">{isLessee ? "Giá thuê/ngày" : "Tiền cọc"}</p>
                                <p className="font-medium text-blue-600">
                                    {(isLessee ? booking.pricePerDay : booking.depositAmount).toLocaleString()} ₫
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Tổng tiền</p>
                                <p className="font-bold text-lg text-green-600">{booking.totalAmount.toLocaleString()} ₫</p>
                            </div>
                        </div>

                        {/* Ghi chú */}
                        {booking.note && (
                            <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Ghi chú:</span> {booking.note}
                                </p>
                            </div>
                        )}

                        {/* Hành động */}
                        {renderActions && <div className="mt-6 pt-5 border-t">{renderActions(booking)}</div>}

                        {/* Footer */}
                        <div className="mt-5 text-xs text-gray-500">
                            Mã đơn: <span className="font-medium">{booking.id}</span> • Đặt lúc{" "}
                            {format(new Date(booking.createdAt), "HH:mm, dd/MM/yyyy", { locale: vi })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}