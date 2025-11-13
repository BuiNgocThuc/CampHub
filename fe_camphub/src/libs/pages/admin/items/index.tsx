"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/libs/components";
import ItemList from "./item-list";
import CategoryList from "./category-list";
import ItemHistory from "./item-history";

export default function ItemManagement() {
    const [activeTab, setActiveTab] = useState("items");

    return (
        <div className="p-6">

            <Tabs  value={activeTab} onValueChange={setActiveTab} >
                <TabsList>
                    <TabsTrigger value="items">Sản phẩm</TabsTrigger>
                    <TabsTrigger value="categories">Danh mục</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử thay đổi</TabsTrigger>
                </TabsList>

                <TabsContent value="items">
                    <ItemList />
                </TabsContent>

                <TabsContent value="categories">
                    <CategoryList />
                </TabsContent>

                <TabsContent value="history">
                    <ItemHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
}
