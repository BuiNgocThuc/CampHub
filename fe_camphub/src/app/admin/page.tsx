import Link from "next/link";
import {
    Users,
    Package,
    CreditCard,
    Undo2,
    AlertTriangle,
    Wrench,
    ClipboardList,
    CalendarClock,
    LayoutDashboard,
} from "lucide-react";

export default function AdminDashboardPage() {
    const quickLinks = [
        { href: "/admin/accounts", label: "Quản lý tài khoản", icon: Users, color: "bg-slate-50 text-slate-700 border-slate-200" },
        { href: "/admin/items", label: "Quản lý sản phẩm", icon: Package, color: "bg-blue-50 text-blue-700 border-blue-200" },
        { href: "/admin/transactions", label: "Quản lý giao dịch", icon: CreditCard, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        { href: "/admin/bookings", label: "Quản lý đơn thuê", icon: ClipboardList, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        { href: "/admin/extension-requests", label: "Quản lý gia hạn thuê", icon: CalendarClock, color: "bg-orange-50 text-orange-700 border-orange-200" },
        { href: "/admin/return-requests", label: "Trả đồ / Hoàn tiền", icon: Undo2, color: "bg-amber-50 text-amber-700 border-amber-200" },
        { href: "/admin/disputes", label: "Quản lý khiếu nại", icon: AlertTriangle, color: "bg-red-50 text-red-700 border-red-200" },
        { href: "/admin/damage-types", label: "Quản lý loại hư tổn", icon: Wrench, color: "bg-purple-50 text-purple-700 border-purple-200" },
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
