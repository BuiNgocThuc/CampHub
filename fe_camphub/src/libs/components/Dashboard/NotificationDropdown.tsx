"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getNotificationsByReceiver, markNotificationAsRead, deleteNotification } from "@/libs/api/notification-api";
import { Notification } from "@/libs/core/types";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { getNotificationRoute } from "@/libs/utils/notification-routing";
import { useAuthStore } from "@/libs/stores";

interface NotificationDropdownProps {
  onClose: () => void;
}

// Format thời gian tương đối (ví dụ: "2 giờ trước", "Hôm qua")
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Hôm qua";
  }
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  // Check if user is admin (if pathname starts with /admin, assume admin)
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Fetch notifications khi component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotificationsByReceiver();
        const sorted = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sorted);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Không thể tải thông báo");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Đánh dấu đã đọc
  const handleMarkAsRead = async (id: string) => {
    if (markingAsRead === id) return;

    try {
      setMarkingAsRead(id);
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((noti) => (noti.id === id ? { ...noti, isRead: true } : noti))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Không thể đánh dấu đã đọc");
    } finally {
      setMarkingAsRead(null);
    }
  };

  // Xử lý click vào notification để điều hướng
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    const route = getNotificationRoute(notification, isAdmin);

    if (route) {
      onClose();
      router.push(route);
    }
  };

  // Xóa notification
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((noti) => noti.id !== id));
      toast.success("Đã xóa thông báo");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Không thể xóa thông báo");
    }
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((noti) => !noti.isRead);
    if (unreadNotifications.length === 0) {
      toast.info("Tất cả thông báo đã được đọc");
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map((noti) => markNotificationAsRead(noti.id))
      );
      setNotifications((prev) =>
        prev.map((noti) => ({ ...noti, isRead: true }))
      );
      toast.success("Đã đánh dấu tất cả đã đọc");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Không thể đánh dấu tất cả đã đọc");
    }
  };

  const unreadCount = notifications.filter((noti) => !noti.isRead).length;

  return (
    <div
      ref={ref}
      className="absolute top-12 right-0 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 text-sm">
          Thông báo {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-blue-600 text-sm hover:underline"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>

      <ul className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Đang tải...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((noti) => (
            <li
              key={noti.id}
              className={`px-4 py-3 hover:bg-gray-50 transition relative group cursor-pointer ${!noti.isRead ? "bg-blue-50/50" : ""
                }`}
              onClick={() => handleNotificationClick(noti)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800">
                      {noti.title}
                    </p>
                    {!noti.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {noti.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(noti.createdAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(noti.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600 flex-shrink-0"
                  title="Xóa thông báo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm">
            Không có thông báo mới
          </div>
        )}
      </ul>

      <div className="p-3 text-center border-t border-gray-200">
        <button className="text-blue-600 text-sm hover:underline">
          Xem tất cả
        </button>
      </div>
    </div>
  );
}
