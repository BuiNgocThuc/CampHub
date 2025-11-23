"use client";

import CategoryList from "./CategoryList";
import ItemCard from "./ItemCard";
import { useState } from "react";

const dummyItems = [
  {
    id: "1",
    name: "Lều 2 người NatureHike",
    price: 120000,
    imageUrl: "/img/items/tent1.jpg",
    ownerId: "user2",
  },
  {
    id: "2",
    name: "Bếp cồn mini du lịch",
    price: 50000,
    imageUrl: "/img/items/stove1.jpg",
    ownerId: "user3",
  },
  {
    id: "3",
    name: "Ghế xếp cắm trại",
    price: 30000,
    imageUrl: "/img/items/chair1.jpg",
    ownerId: "user4",
  },
  {
    id: "4",
    name: "Balo trekking 45L",
    price: 90000,
    imageUrl: "/img/items/backpack1.jpg",
    ownerId: "user5",
  },
];

export default function ItemList() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Sản phẩm cho thuê
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cột trái: Danh mục */}
        <div className="md:col-span-1">
          <CategoryList />
        </div>

        {/* Danh sách sản phẩm */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummyItems.map((item, index) => (
              <ItemCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>

      
    </section>
  );
}
