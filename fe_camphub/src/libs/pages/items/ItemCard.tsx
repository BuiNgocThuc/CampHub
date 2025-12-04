"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { AppImage, PrimaryAlert } from "@/libs/components";
import { useCartStore } from "@/libs/stores/cart.store";

interface ItemCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

export default function ItemCard({ id, name, price, imageUrl }: ItemCardProps) {
  const router = useRouter();
  const { addToCart, isLoading } = useCartStore();
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => setAlert({ content, type, duration });

  const handleClick = () => {
    router.push(`/CampHub/items/${id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn không cho navigate khi click button

    try {
      await addToCart(
        id,
        1, // Số ngày thuê mặc định: 1 ngày
        price,
        name,
        imageUrl || "/placeholder.jpg"
      );

      // Hiển thị alert thành công
      showAlert(`Đã thêm "${name}" vào giỏ hàng!`, "success");
    } catch (error) {
      // Hiển thị alert lỗi
      showAlert("Không thể thêm vào giỏ hàng. Vui lòng thử lại!", "error");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <div className="relative w-full h-56 bg-gray-50 flex-shrink-0">
        <AppImage
          src={imageUrl}
          alt={name}
          width={400}
          height={224}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Tên sản phẩm - cố định chiều cao 2 dòng */}
        <div className="h-[3rem] flex items-center justify-center">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 text-center group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </div>

        {/* Giá - cố định vị trí */}
        <div className="mt-2 h-[2rem] flex items-center justify-center">
          <p className="text-blue-600 font-extrabold text-xl text-center">
            {price.toLocaleString("vi-VN")}₫ <span className="text-sm font-medium text-gray-600">/ ngày</span>
          </p>
        </div>

        {/* Button - cố định vị trí ở cuối */}
        <div className="mt-4 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            {isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
        </div>
      </div>

      {/* Alert thông báo */}
      {alert && (
        <PrimaryAlert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}