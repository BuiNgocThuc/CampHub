// app/admin/bookings/BookingDetail.tsx
"use client";

import { Box, Typography, Divider, Chip, Grid } from "@mui/material";
import { Calendar, Package, Users} from "lucide-react";
import { Booking } from "@/libs/core/types";
import { format } from "date-fns";
import { bookingStatusConfig } from ".";

interface BookingDetailProps {
    booking: Booking;
}

export default function BookingDetail({ booking }: BookingDetailProps) {
    const StatusIcon = bookingStatusConfig[booking.status]?.icon || Package;

    return (
        <Box sx={{ minWidth: 700, p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    Chi tiết đơn thuê
                </Typography>
                <Chip
                    icon={<StatusIcon size={16} />}
                    label={bookingStatusConfig[booking.status]?.label || booking.status}
                    className={bookingStatusConfig[booking.status]?.color || "bg-gray-100"}
                    size="small"
                />
            </Box>

            <Grid container spacing={4}>
                {/* Thông tin chung */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography fontWeight="bold" color="primary" gutterBottom>
                        Thông tin đơn thuê
                    </Typography>
                    <Box sx={{ spaceY: 2 }}>
                        <div className="flex justify-between"><span>Mã đơn:</span> <strong>{booking.id}</strong></div>
                        <div className="flex justify-between"><span>Ngày tạo:</span> <span>{format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm")}</span></div>
                        <div className="flex justify-between">
                            <span>Thời gian thuê:</span>
                            <span className="flex items-center gap-1">
                                <Calendar size={16} />
                                {format(new Date(booking.startDate), "dd/MM")} → {format(new Date(booking.endDate), "dd/MM/yyyy")}
                            </span>
                        </div>
                        <div className="flex justify-between"><span>Số lượng:</span> <strong>{booking.quantity}</strong></div>
                    </Box>
                </Grid>

                {/* Sản phẩm */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography fontWeight="bold" color="primary" gutterBottom>
                        Sản phẩm thuê
                    </Typography>
                    <Box sx={{ backgroundColor: "#f8f9fa", p: 2, borderRadius: 2 }}>
                        <Typography fontWeight="bold">{booking.itemName}</Typography>
                        <div className="text-sm text-gray-600 mt-1">
                            Giá thuê/ngày: <strong>{booking.pricePerDay.toLocaleString()}₫</strong>
                        </div>
                    </Box>
                </Grid>

                {/* Tài chính */}
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight="bold" color="primary" gutterBottom>
                        Tài chính
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ p: 3, backgroundColor: "#fff3cd", borderRadius: 2, textAlign: "center" }}>
                                <Typography variant="h6" color="orange">Đặt cọc</Typography>
                                <Typography variant="h5" fontWeight="bold">{booking.depositAmount.toLocaleString()}₫</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ p: 3, backgroundColor: "#d1ecf1", borderRadius: 2, textAlign: "center" }}>
                                <Typography variant="h6" color="info.main">Tiền thuê</Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {(booking.totalAmount - booking.depositAmount).toLocaleString()}₫
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box sx={{ p: 3, backgroundColor: "#d4edda", borderRadius: 2, textAlign: "center" }}>
                                <Typography variant="h6" color="success.main">Tổng thanh toán</Typography>
                                <Typography variant="h5" fontWeight="bold" color="success.main">
                                    {booking.totalAmount.toLocaleString()}₫
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Người tham gia */}
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight="bold" color="primary" gutterBottom>
                        Người tham gia
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Users size={40} className="text-blue-600" />
                                <div>
                                    <Typography fontWeight="bold">Người thuê</Typography>
                                    <Typography>{booking.lesseeName}</Typography>
                                </div>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Users size={40} className="text-green-600" />
                                <div>
                                    <Typography fontWeight="bold">Chủ đồ</Typography>
                                    <Typography>{booking.lessorName}</Typography>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Ghi chú */}
                {booking.note && (
                    <Grid size={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography fontWeight="bold" color="primary" gutterBottom>
                            Ghi chú từ người thuê
                        </Typography>
                        <Box sx={{ p: 2, backgroundColor: "#f8f9fa", borderRadius: 2 }}>
                            <Typography>{booking.note}</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}