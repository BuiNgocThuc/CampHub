"use client";

import { useState } from "react";
import { CustomizedButton, PrimaryButton, PrimaryModal, PrimaryTable } from "@/libs/components";
import { Package, PencilIcon, PlusCircle, Trash2 } from "lucide-react";
import type { Item } from "@/libs/core/types"; // điều chỉnh path
import { ItemStatus } from "@/libs/core/constants";
import ItemDetail from "./OwnedItemDetai";
import { Column } from "@/libs/components/Table/PrimaryTable";

interface OwnedItemsProps {
  items: Item[];
  loading?: boolean;
}

const statusText: Record<ItemStatus, { text: string; color: string }> = {
  AVAILABLE: { text: "Đang hiển thị", color: "bg-green-100 text-green-700" },
  BANNED: { text: "Tạm ẩn", color: "bg-gray-100 text-gray-600" },
  PENDING_APPROVAL: { text: "Chờ duyệt", color: "bg-yellow-100 text-yellow-700" },
  REJECTED: { text: "Bị từ chối", color: "bg-red-100 text-red-700" },
  RENTED: { text: "Đang cho thuê", color: "bg-blue-100 text-blue-700" },
  RETURN_PENDING_CHECK: { text: "Đang trả về", color: "bg-purple-100 text-purple-700" },
  RENTED_PENDING_CONFIRM: { text: "Chờ xác nhận thuê", color: "bg-indigo-100 text-indigo-700" },
  DELETED: { text: "Đã xóa", color: "bg-gray-200 text-gray-500" },
  MISSING: { text: "Mất tích", color: "bg-red-100 text-red-700" },
};

export default function OwnedItems({ items = [], loading = false }: OwnedItemsProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (item: Item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const columns: Column<Item>[] = [
  {
    field: "stt",
    headerName: "STT",
    width: 70,
    render: (_, index) => (
      <span className="font-medium text-gray-700">{index + 1}</span>
    ),
  },
  {
    field: "name",
    headerName: "Tên sản phẩm",
    render: (item) => (
      <div className="font-medium text-gray-900">{item.name}</div>
    ),
  },
  {
    field: "price",
    headerName: "Giá thuê / ngày",
    render: (item) => (
      <span className="font-semibold text-blue-600">
        {item.price.toLocaleString("vi-VN")} ₫
      </span>
    ),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    render: (item) => {
      const config = statusText[item.status];
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
          {config.text}
        </span>
      );
    },
  },
  {
    field: "actions",
    headerName: "Thao tác",
    render: (item) => (
      <div className="flex gap-2 justify-center">
        <PrimaryButton
          content="Sửa"
          size="small"
          icon={<PencilIcon size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            alert(`Sửa: ${item.name}`);
          }}
        />
        <CustomizedButton
          content="Xóa"
          size="small"
          color="#EF4444"
          icon={<Trash2 size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Xóa "${item.name}"?`)) {
              // TODO: xóa
            }
          }}
        />
      </div>
    ),
  },
  ];
  
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải sản phẩm của bạn...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Package size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Bạn chưa có sản phẩm nào
        </h3>
        <p className="text-gray-500 mb-6">
          Hãy đăng đồ cho thuê để bắt đầu kiếm tiền!
        </p>
        <PrimaryButton
          content="Đăng đồ cho thuê"
          icon={<PlusCircle size={18} />}
          onClick={() => alert("Mở form đăng sản phẩm")}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sản phẩm của bạn</h2>
        <PrimaryButton
          content="Đăng đồ cho thuê"
          icon={<PlusCircle size={18} />}
          onClick={() => alert("Mở form đăng sản phẩm mới")}
        />
      </div>

      {/* Bảng danh sách */}
      <PrimaryTable
        columns={columns}
        rows={items}
        onRowClick={handleRowClick}
      />

      {/* Modal chi tiết */}
      <PrimaryModal
        open={modalOpen}
        title="Chi tiết sản phẩm"
        onClose={() => setModalOpen(false)}
      >
        {selectedItem && <ItemDetail item={selectedItem} />}
      </PrimaryModal>
    </div>
  );
}