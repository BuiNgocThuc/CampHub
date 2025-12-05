"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import AdminNotificationDropdown from "../Sidebar/AdminNotificationDropdown";
import { getNotificationsByReceiver } from "@/libs/api/notification-api";
import { Notification } from "@/libs/core/types";

export default function AdminNotificationFloating() {
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchUnread = async () => {
        try {
            const notifications = await getNotificationsByReceiver();
            const unread = notifications.filter((n: Notification) => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Error fetching unread notifications:", error);
        }
    };

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
            <button
                onClick={() => {
                    fetchUnread();
                    setOpen((prev) => !prev);
                }}
                className="relative w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute bottom-16 right-0 w-80">
                    <AdminNotificationDropdown
                        onClose={() => {
                            setOpen(false);
                            fetchUnread();
                        }}
                        onNotificationRead={fetchUnread}
                    />
                </div>
            )}
        </div>
    );
}

