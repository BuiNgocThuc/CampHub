"use client";

import { useEffect, useRef, useState } from "react";
import { getNotificationsByReceiver, markNotificationAsRead, deleteNotification } from "@/libs/api/notification-api";
import { Notification } from "@/libs/core/types";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReferenceType } from "@/libs/core/constants";

interface AdminNotificationDropdownProps {
  onClose: () => void;
  onNotificationRead?: () => void; // Callback để cập nhật unread count
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

// Hàm điều hướng dựa trên referenceType và referenceId
const getNavigationPath = (referenceType: ReferenceType, referenceId: string): string => {
  switch (referenceType) {
    case ReferenceType.ITEM:
      return `/admin/items?itemId=${referenceId}`;
    case ReferenceType.BOOKING:
      return `/admin/bookings?bookingId=${referenceId}`;
    case ReferenceType.USER:
      return `/admin/accounts?accountId=${referenceId}`;
    case ReferenceType.RETURN_REQUEST:
      return `/admin/return-requests?returnRequestId=${referenceId}`;
    case ReferenceType.EXTENSION_REQUEST:
      return `/admin/extension-requests?extensionRequestId=${referenceId}`;
    case ReferenceType.DISPUTE:
      return `/admin/disputes?disputeId=${referenceId}`;
    case ReferenceType.TRANSACTION:
      return `/admin/transactions?transactionId=${referenceId}`;
    default:
      return "/admin";
  }
};

export default function AdminNotificationDropdown({
  onClose,
  onNotificationRead,
}: AdminNotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  // Fetch notifications khi component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotificationsByReceiver();
        // Sắp xếp theo thời gian mới nhất trước
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

    if (ref.current) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Đánh dấu đã đọc và điều hướng
  const handleNotificationClick = async (noti: Notification) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!noti.isRead) {
      try {
        setMarkingAsRead(noti.id);
        await markNotificationAsRead(noti.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, isRead: true } : n))
        );
        // Gọi callback để cập nhật unread count trong floating button
        onNotificationRead?.();
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Không thể đánh dấu đã đọc");
        return; // Không điều hướng nếu có lỗi
      } finally {
        setMarkingAsRead(null);
      }
    }

    // Điều hướng đến trang tương ứng
    const path = getNavigationPath(noti.referenceType, noti.referenceId);
    router.push(path);
    onClose();
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
      // Gọi callback để cập nhật unread count trong floating button
      onNotificationRead?.();
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
      className="bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden max-h-[500px] flex flex-col w-full"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
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

      <ul className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Đang tải...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((noti) => (
            <li
              key={noti.id}
              className={`px-4 py-3 hover:bg-gray-50 transition relative group cursor-pointer ${
                !noti.isRead ? "bg-blue-50/50" : ""
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
    </div>
  );
}

