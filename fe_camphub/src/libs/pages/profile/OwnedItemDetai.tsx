// ItemDetail.tsx
import Image from "next/image";
import type { Item } from "@/libs/core/types";

interface ItemDetailProps {
    item: Item;
}

export default function ItemDetail({ item }: ItemDetailProps) {
    return (
        <div className="space-y-6">
            {/* Hình ảnh */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {item.mediaUrls.length > 0 ? (
                    item.mediaUrls.map((media, idx) => (
                        <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden border"
                        >
                            <Image
                                src={media.url}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-gray-100 border-2 border-dashed rounded-xl h-64 flex items-center justify-center text-gray-400">
                        Chưa có hình ảnh
                    </div>
                )}
            </div>

            {/* Thông tin chính */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-lg mb-3">{item.name}</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="text-gray-500">Danh mục:</span>{" "}
                            <span className="font-medium">{item.categoryName}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Giá thuê/ngày:</span>{" "}
                            <span className="font-bold text-blue-600">
                                {item.price.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Số lượng:</span>{" "}
                            <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Tiền đặt cọc:</span>{" "}
                            <span className="font-medium">
                                {item.depositAmount.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Mô tả sản phẩm</h4>
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {item.description || "Chưa có mô tả"}
                    </p>
                </div>
            </div>
        </div>
    );
}