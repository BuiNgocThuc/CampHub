"use client";

import {
    Users,
    Package,
    CreditCard,
    Undo2,
    AlertTriangle,
    Wrench,
    ClipboardList,
    CalendarClock,
    CircleUserRound,
    ChevronDown,
    User,
    LogOut,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useAuthStore } from "@/libs/stores";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getNotificationsByReceiver } from "@/libs/api/notification-api";
import { Notification } from "@/libs/core/types";

const menuItems = [
    { label: "Quản lý tài khoản", icon: Users, href: "/admin/accounts" },
    { label: "Quản lý sản phẩm", icon: Package, href: "/admin/items" },
    { label: "Quản lý giao dịch", icon: CreditCard, href: "/admin/transactions" },
    { label: "Quản lý đơn thuê", icon: ClipboardList, href: "/admin/bookings" },
    { label: "Quản lý gia hạn thuê", icon: CalendarClock, href: "/admin/extension-requests" },
    { label: "Trả đồ / Hoàn tiền", icon: Undo2, href: "/admin/return-requests" },
    { label: "Quản lý khiếu nại", icon: AlertTriangle, href: "/admin/disputes" },
    { label: "Quản lý loại hư tổn", icon: Wrench, href: "/admin/damage-types" },
];

export default function Sidebar() {
    const user = useAuthStore((s) => s.user);
    const fetchMyInfo = useAuthStore((s) => s.fetchMyInfo);
    const logout = useAuthStore((s) => s.logout);
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch user info nếu chưa có
    useEffect(() => {
        if (!user) {
            fetchMyInfo();
        }
    }, [user, fetchMyInfo]);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleProfileClick = () => {
        router.push("/admin/profile");
        setShowDropdown(false);
    };

    return (
        <aside className="w-64 bg-white border-r h-screen sticky top-0 p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-blue-600 text-center">
                CampHub Admin
            </h2>
            <nav className="flex flex-col gap-2 flex-1">
                {menuItems.map((item) => (
                    <SidebarItem key={item.href} {...item} />
                ))}
            </nav>

            {/* Admin Profile Section */}
            <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="relative">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <CircleUserRound size={32} className="text-gray-700" />
                            )}
                            
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                {user?.username || "Admin"}
                                {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-gray-500">Quản trị viên</p>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-[100]">
                            <button
                                onClick={handleProfileClick}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                            >
                                <User size={16} />
                                <span>Thông tin cá nhân</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 text-sm text-red-600 transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
