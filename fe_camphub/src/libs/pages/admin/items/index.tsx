// app/admin/items/ItemManagement.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/libs/components";
import ItemList from "./item-list";
import CategoryList from "./category-list";
import ItemHistory from "./item-history";
import { Package, FolderOpen, History } from "lucide-react";

export default function ItemManagement() {
    const [activeTab, setActiveTab] = useState("items");

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="items" className="flex items-center gap-2">
                        <Package size={18} />
                        Sản phẩm
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="flex items-center gap-2">
                        <FolderOpen size={18} />
                        Danh mục
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History size={18} />
                        Lịch sử thay đổi
                    </TabsTrigger>
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