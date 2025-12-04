// ItemDetail.tsx
import Image from "next/image";
import { Play, FileVideo } from "lucide-react";
import { Item } from "@/libs/core/types";

interface ItemDetailProps {
    item: Item;
}

export default function ItemDetail({ item }: ItemDetailProps) {
    const images = item.mediaUrls.filter(m => m.type === "IMAGE");
    const videos = item.mediaUrls.filter(m => m.type === "VIDEO");

    return (
        <div className="space-y-8">
            {/* Ảnh + Video */}
            <div>
                <h4 className="font-semibold text-lg mb-4">Hình ảnh & Video</h4>
                {images.length > 0 || videos.length > 0 ? (
                    <div className="space-y-4">
                        {/* Ảnh */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((media, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={media.url}
                                            alt={`${item.name} - ảnh ${idx + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Video */}
                        {videos.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {videos.map((video, idx) => (
                                    <div key={idx} className="relative rounded-xl overflow-hidden bg-black">
                                        <video controls className="w-full aspect-video">
                                            <source src={video.url} type="video/mp4" />
                                            Trình duyệt không hỗ trợ video.
                                        </video>
                                        <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                            <FileVideo size={14} />
                                            Video {idx + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gray-100 border-2 border-dashed rounded-xl h-64 flex items-center justify-center text-gray-400">
                        <Play size={48} />
                        <span className="ml-3">Chưa có hình ảnh hoặc video</span>
                    </div>
                )}
            </div>

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-500">Danh mục</span>
                            <span className="font-medium text-gray-900">{item.categoryName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-500">Giá thuê/ngày</span>
                            <span className="font-bold text-xl text-blue-600">
                                {item.price.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-500">Số lượng</span>
                            <span className="font-medium">{item.quantity} cái</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-500">Tiền đặt cọc</span>
                            <span className="font-medium text-green-600">
                                {item.depositAmount.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Trạng thái</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                                    item.status === "PENDING_APPROVAL" ? "bg-yellow-100 text-yellow-700" :
                                        item.status === "REJECTED" ? "bg-red-100 text-red-700" :
                                            "bg-gray-100 text-gray-600"
                                }`}>
                                {item.status === "AVAILABLE" ? "Đang hiển thị" :
                                    item.status === "PENDING_APPROVAL" ? "Chờ duyệt" :
                                        item.status === "REJECTED" ? "Bị từ chối" : "Khác"}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-3">Mô tả sản phẩm</h4>
                    <div className="bg-gray-50 p-5 rounded-xl text-gray-700 whitespace-pre-wrap min-h-32">
                        {item.description || "Chưa có mô tả"}
                    </div>
                </div>
            </div>
        </div>
    );
}