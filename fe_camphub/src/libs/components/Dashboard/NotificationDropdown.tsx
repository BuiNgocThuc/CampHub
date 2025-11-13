"use client";

import { useEffect, useRef } from "react";

interface NotificationDropdownProps {
  onClose: () => void;
}

const dummyNotifications = [
  {
    id: 1,
    title: "Yêu cầu thuê mới",
    message: "Người dùng An Nguyen muốn thuê Lều NatureHike 2 người.",
    time: "2 giờ trước",
  },
  {
    id: 2,
    title: "Xác nhận trả đồ",
    message: "Bạn cần kiểm tra đơn thuê #123 trước khi hoàn cọc.",
    time: "Hôm qua",
  },
  {
    id: 3,
    title: "Cập nhật hệ thống",
    message: "CampHub sẽ bảo trì vào 0h ngày 1/11.",
    time: "2 ngày trước",
  },
];

export default function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={ref}
      className="absolute top-12 right-0 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 text-sm">Thông báo</h3>
        <button className="text-blue-600 text-sm hover:underline">
          Đánh dấu đã đọc
        </button>
      </div>

      <ul className="max-h-80 overflow-y-auto">
        {dummyNotifications.length > 0 ? (
          dummyNotifications.map((noti) => (
            <li
              key={noti.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
            >
              <p className="text-sm font-medium text-gray-800">{noti.title}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {noti.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">{noti.time}</p>
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
