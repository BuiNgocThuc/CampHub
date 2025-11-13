"use client";

import { useState } from "react";

const categories = [
  "Tất cả",
  "Lều & Phụ kiện",
  "Bếp & Dụng cụ nấu ăn",
  "Balo & Túi",
  "Ghế & Bàn xếp",
  "Đèn & Pin sạc",
  "Đồ ngủ & Túi ngủ",
];

export default function CategoryList() {
  const [active, setActive] = useState("Tất cả");

  return (
    <aside className="bg-white shadow-sm rounded-xl p-4 h-fit">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Danh mục sản phẩm
      </h3>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => setActive(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                active === cat
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
