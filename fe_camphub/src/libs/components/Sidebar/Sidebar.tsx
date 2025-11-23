"use client";

import {
    Users,
    Package,
    CreditCard,
    Undo2,
    AlertTriangle,
    Wrench,
    ClipboardList,
    CalendarClock
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useAuthStore } from "@/libs/stores";

const menuItems = [
    { label: "Quản lý tài khoản", icon: Users, href: "/admin/accounts" },
    { label: "Quản lý sản phẩm", icon: Package, href: "/admin/items" },
    { label: "Quản lý giao dịch", icon: CreditCard, href: "/admin/transactions" },
    { label: "Quản lý đơn thuê", icon: ClipboardList, href: "/admin/bookings" },
    { label: "Quản lý gia hạn thuê", icon: CalendarClock, href: "/admin/extension-requests" },
    { label: "Trả đồ / Hoàn tiền", icon: Undo2, href: "/admin/refunds" },
    { label: "Quản lý khiếu nại", icon: AlertTriangle, href: "/admin/complaints" },
    { label: "Quản lý loại hư tổn", icon: Wrench, href: "/admin/damage-types" },
];

export default function Sidebar() {
     const user = useAuthStore((s) => s.user);
    return (
        <aside className="w-64 bg-white border-r h-screen sticky top-0 p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-blue-600 text-center">
                CampHub Admin
            </h2>
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <SidebarItem key={item.href} {...item} />
                ))}
            </nav>
        </aside>
    );
}
