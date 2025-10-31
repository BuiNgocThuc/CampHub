"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components";

const rentalTabs = [
  "Chờ xác nhận",
  "Chờ giao hàng",
  "Đang thuê",
  "Đang trả",
  "Hoàn thành",
  "Trả hàng / Hoàn tiền",
];

export default function RentalHistory() {
  const [currentTab, setCurrentTab] = useState("Chờ xác nhận");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Lịch sử thuê đồ</h2>
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="flex flex-wrap bg-gray-50 p-1 rounded-lg mb-4">
          {rentalTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="flex-1">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {rentalTabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
              Hiện chưa có đơn hàng trong mục "{tab}".
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
