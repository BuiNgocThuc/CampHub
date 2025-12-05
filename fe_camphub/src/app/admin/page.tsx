import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Bell, Users, ShoppingBag } from "lucide-react";

export default function AdminDashboardPage() {
    const quickLinks = [
        { href: "/admin/items", label: "Quản lý sản phẩm", icon: ShoppingBag, color: "bg-blue-50 text-blue-700 border-blue-200" },
        { href: "/admin/bookings", label: "Quản lý đơn thuê", icon: LayoutDashboard, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        { href: "/admin/return_requests", label: "Hoàn trả & hoàn tiền", icon: ShieldCheck, color: "bg-amber-50 text-amber-700 border-amber-200" },
        { href: "/admin/notifications", label: "Thông báo hệ thống", icon: Bell, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        { href: "/admin/accounts", label: "Tài khoản & vai trò", icon: Users, color: "bg-slate-50 text-slate-700 border-slate-200" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
                    <div className="flex flex-col gap-3">
                        <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-sm font-semibold border border-sky-100">
                            <LayoutDashboard size={16} />
                            Admin CampHub
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Chào mừng quay lại 🎉</h1>
                        <p className="text-slate-600 max-w-2xl">
                            Quản trị tập trung cho sản phẩm, đơn thuê, hoàn trả, khiếu nại và tài khoản. Chọn nhanh khu vực bạn muốn xử lý bên dưới.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        {quickLinks.map(({ href, label, icon: Icon, color }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 p-4 rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md ${color}`}
                            >
                                <div className="p-2 rounded-lg bg-white/70 shadow-sm">
                                    <Icon size={20} />
                                </div>
                                <span className="font-semibold text-sm">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
