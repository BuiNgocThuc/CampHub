"use client";

import { useState, useMemo } from "react";
import { PrimaryButton, PrimaryTable, PrimaryConfirmation } from "@/libs/components";
import { Package, PencilIcon, PlusCircle, Trash2 } from "lucide-react";
import type { Item } from "@/libs/core/types";
import { ItemStatus } from "@/libs/core/constants";
import { Column } from "@/libs/components/Table/PrimaryTable";
import { useDeleteItem } from "@/libs/hooks";
import ItemModal from "./ItemModal";
import { IconButton, Tooltip } from "@mui/material";
import { toast } from "sonner";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const deleteMut = useDeleteItem();

  // Lọc items: chỉ hiển thị các status được phép
  const allowedStatuses = [
    ItemStatus.PENDING_APPROVAL,
    ItemStatus.AVAILABLE,
    ItemStatus.REJECTED,
    ItemStatus.RENTED,
    ItemStatus.RENTED_PENDING_CONFIRM,
    ItemStatus.RETURN_PENDING_CHECK,
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => allowedStatuses.includes(item.status));
  }, [items]);

  const openCreate = () => {
    setCurrentItem(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openView = (item: Item) => {
    setCurrentItem(item);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (item: Item) => {
    setCurrentItem(item);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation();

    // Chỉ cho phép xóa khi status = AVAILABLE, PENDING_APPROVAL hoặc REJECTED
    const canDelete = [
      ItemStatus.AVAILABLE,
      ItemStatus.PENDING_APPROVAL,
      ItemStatus.REJECTED,
    ].includes(item.status);

    if (!canDelete) {
      toast.error("Chỉ được xóa sản phẩm ở trạng thái 'Đang hiển thị', 'Chờ duyệt' hoặc 'Bị từ chối'");
      return;
    }

    // Mở dialog xác nhận xóa
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMut.mutate(itemToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa sản phẩm thành công");
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Xóa sản phẩm thất bại");
        },
      });
    }
  };

  const columns: Column<Item>[] = [
    {
      field: "stt",
      headerName: "STT",
      width: 80,
      render: (_, i) => <div className="text-center">{i + 1}</div>
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      width: 300,
      render: (i) => <div className="font-medium">{i.name}</div>
    },
    {
      field: "price",
      headerName: "Giá thuê / ngày",
      width: 180,
      render: (i) => (
        <div className="text-center">
          <span className="font-semibold text-blue-600">{i.price.toLocaleString("vi-VN")} ₫</span>
        </div>
      )
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      render: (i) => {
        const s = statusText[i.status];
        return (
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.text}</span>
          </div>
        );
      }
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      render: (item) => (
        <div className="flex gap-2 justify-center items-center">
          <Tooltip title="Sửa">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openEdit(item);
              }}
              className="text-blue-600 hover:bg-blue-50"
            >
              <PencilIcon size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              onClick={(e) => handleDeleteClick(item, e)}
              disabled={deleteMut.isPending}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
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

  if (filteredItems.length === 0 && !loading) {
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
          onClick={openCreate}
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
          onClick={openCreate}
        />
      </div>

      {/* Bảng danh sách */}
      <PrimaryTable
        columns={columns}
        rows={filteredItems}
        onRowClick={openView}
      />

      <ItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={currentItem}
        mode={modalMode}
        onSuccess={() => {
          setModalOpen(false);
          if (modalMode === "create") {
            toast.success("Đăng sản phẩm thành công!");
          } else if (modalMode === "edit") {
            toast.success("Cập nhật sản phẩm thành công!");
          }
        }}
      />

      {/* Dialog xác nhận xóa */}
      <PrimaryConfirmation
        open={deleteConfirmOpen}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${itemToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText={deleteMut.isPending ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        loading={deleteMut.isPending}
      />
    </div>
  );
}