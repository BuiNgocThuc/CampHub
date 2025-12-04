// components/CategoryList.tsx
"use client";

import { Category } from "@/libs/core/types";
import {
  Tent, Flame, Backpack, Armchair, Lightbulb, Moon, Package,
  Bed, CookingPot, Utensils, Lamp, Mountain, Wind, ToolCase,
  GlassWater
} from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const getCategoryIcon = (name: string): React.ReactNode => {
  const lowerName = (name || "").toLowerCase().trim();

  if (!lowerName) return <Package size={20} />;

  if (lowerName.includes("lều")) return <Tent size={20} />;
  if (lowerName.includes("túi ngủ") || lowerName.includes("đồ ngủ")) return <Moon size={20} />;
  if (lowerName.includes("bếp") || lowerName.includes("nấu")) return <Flame size={20} />;
  if (lowerName.includes("nồi") || lowerName.includes("chảo") || lowerName.includes("dụng cụ ăn")) return <CookingPot size={20} />;
  if (lowerName.includes("ghế") || lowerName.includes("bàn")) return <Armchair size={20} />;
  if (lowerName.includes("đèn") || lowerName.includes("pin")) return <Lightbulb size={20} />;
  if (lowerName.includes("ba lô") || lowerName.includes("balo") || lowerName.includes("leo núi")) return <Backpack size={20} />;
  if (lowerName.includes("gậy")) return <Mountain size={20} />;
  if (lowerName.includes("nệm") || lowerName.includes("thảm")) return <Bed size={20} />;
  if (lowerName.includes("bình nước") || lowerName.includes("giữ nhiệt")) return <GlassWater size={20} />;
  if (lowerName.includes("máy bơm") || lowerName.includes("bơm hơi")) return <Wind size={20} />;
  if (lowerName.includes("phụ kiện")) return <Utensils size={20} />;

  return <Package size={20} />
};

export default function CategoryList({ categories, selectedId, onSelect }: CategoryListProps) {
  return (
    <aside className="bg-white shadow-xl rounded-3xl p-7 sticky top-24 border border-gray-100">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
        Danh mục sản phẩm
      </h3>

      <ul className="space-y-2">
        {/* Tất cả */}
        <li>
          <button
            onClick={() => onSelect(null)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold text-left group ${selectedId === null
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
              }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition">
              <Package size={22} className={selectedId === null ? "text-white" : "text-blue-600"} />
            </div>
            <span className="text-lg">Tất cả sản phẩm</span>
          </button>
        </li>

        {/* Danh mục từ API */}
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onSelect(cat.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold text-left group ${selectedId === cat.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${selectedId === cat.id ? "bg-white/20" : "bg-gray-100"
                }`}>
                {getCategoryIcon(cat.name)}
              </div>
              <span className="text-lg break-words">{cat.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}