"use client";

import { User, Box, History, Coins, Package } from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { id: "info", label: "Thông tin cá nhân", icon: <User size={18} /> },
  { id: "items", label: "Sản phẩm cho thuê", icon: <Box size={18} /> }, 
  { id: "rental-orders", label: "Đơn cho thuê", icon: <Package size={18} /> },
  { id: "history", label: "Lịch sử thuê đồ", icon: <History size={18} /> },
  { id: "coin", label: "CampHub Xu", icon: <Coins size={18} /> },
];

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  return (
    <aside className="bg-white shadow-md rounded-lg p-4 space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Tài khoản của tôi
      </h2>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              "flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer transition",
              activeTab === item.id
                ? "bg-blue-100 text-blue-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
