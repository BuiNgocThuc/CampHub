"use client";

import { CustomizedButton, PrimaryButton } from "@/libs/components";
import { PencilIcon, PlusCircle, Trash2 } from "lucide-react";

const mockItems = [
  {
    id: 1,
    name: "Lều 2 người NatureHike",
    price: 120000,
    status: "Đang hiển thị",
  },
  {
    id: 2,
    name: "Bếp ga mini du lịch",
    price: 50000,
    status: "Tạm ẩn",
  },
];

export default function OwnedItems() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sản phẩm của bạn</h2>
        {/* <Button className="flex items-center gap-2">
          <PlusCircle size={18} />
          Đăng đồ cho thuê
        </Button> */}
        <PrimaryButton
          content="Đăng đồ cho thuê"
          icon={<PlusCircle size={18} />}
          className=""
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Tên sản phẩm</th>
              <th className="p-3">Giá thuê / ngày</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">{item.price.toLocaleString()} đ</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3 text-center space-x-2">
                  {/* Update Button */}
                  <PrimaryButton
                    content="Cập nhật"
                    size="small"
                    icon={<PencilIcon size={16} />}
                  />

                  {/* Delete Button */}
                  <CustomizedButton
                    content="Xóa"
                    size="small"
                    color="red" // red color for delete
                    icon={
                      <Trash2 size={16} />
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
