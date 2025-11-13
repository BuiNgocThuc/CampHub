"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CartItem {
  id: number;
  name: string;
  pricePerDay: number;
  days: number;
  imageUrl: string;
}

interface CartItemListProps {
  onSelectionChange: (selectedItems: CartItem[]) => void;
}

const dummyCartItems: CartItem[] = [
  {
    id: 1,
    name: "Lều 2 người NatureHike",
    pricePerDay: 120000,
    days: 3,
    imageUrl: "/img/items/tent1.jpg",
  },
  {
    id: 2,
    name: "Ghế gấp du lịch siêu nhẹ",
    pricePerDay: 30000,
    days: 2,
    imageUrl: "/img/items/chair1.jpg",
  },
];

export default function CartItemList({ onSelectionChange }: CartItemListProps) {
  const [cart, setCart] = useState(dummyCartItems);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Gửi danh sách item được chọn ra ngoài cho CartSummary
  useEffect(() => {
    const selectedItems = cart.filter((item) => selectedIds.includes(item.id));
    onSelectionChange(selectedItems);
  }, [selectedIds, cart, onSelectionChange]);

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((item) => item.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDaysChange = (id: number, newDays: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, days: Math.max(1, newDays) } : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b bg-gray-50 rounded-t-2xl">
        <input
          type="checkbox"
          checked={selectedIds.length === cart.length && cart.length > 0}
          onChange={toggleSelectAll}
          className="mr-3 accent-blue-600 w-4 h-4"
        />
        <span className="font-medium text-gray-700">Chọn tất cả</span>
      </div>

      {/* Item list */}
      {cart.map((item) => (
        <div
          key={item.id}
          className="p-4 flex items-center gap-4 hover:bg-gray-50 transition"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => toggleSelect(item.id)}
            className="accent-blue-600 w-4 h-4"
          />

          <Image
            src={item.imageUrl}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500">
              Giá thuê / ngày:{" "}
              <span className="font-medium text-blue-600">
                {item.pricePerDay.toLocaleString()}₫
              </span>
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-gray-500">Số ngày thuê:</span>
              <input
                type="number"
                value={item.days}
                onChange={(e) =>
                  handleDaysChange(item.id, parseInt(e.target.value) || 1)
                }
                className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center"
                min={1}
              />
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-2">
            <p className="font-semibold text-gray-800 mb-1">
              {(item.pricePerDay * item.days).toLocaleString()}₫
            </p>
            <Trash2
              size={18}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
              onClick={() => handleRemove(item.id)}
            />
          </div>
        </div>
      ))}

      {cart.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          Giỏ hàng của bạn đang trống.
        </div>
      )}
    </div>
  );
}
