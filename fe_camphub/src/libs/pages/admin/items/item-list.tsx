"use client";

import { useState } from "react";
import { PrimaryTable, PrimaryModal } from "@/libs/components";
import { Button, IconButton, Chip } from "@mui/material";
import { Eye } from "lucide-react";

// 👉 mock data tạm thời
const mockItems = [
    {
        id: "1",
        name: "Lều cắm trại NatureHike 2 người",
        ownerName: "Nguyễn Văn A",
        pricePerDay: 120000,
        depositAmount: 500000,
        status: "PENDING_APPROVAL",
        mediaUrls: [
            "https://images.unsplash.com/photo-1504280390368-3971a158a76b",
            "https://images.unsplash.com/photo-1470246973918-29a93221c455",
        ],
    },
    {
        id: "2",
        name: "Bếp gas mini du lịch",
        ownerName: "Trần Thị B",
        pricePerDay: 50000,
        depositAmount: 100000,
        status: "AVAILABLE",
        mediaUrls: [
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        ],
    },
];

export default function ItemList() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    const columns = [
        { field: "name", headerName: "Tên sản phẩm" },
        { field: "ownerName", headerName: "Chủ thuê" },
        {
            field: "pricePerDay",
            headerName: "Giá/ngày",
            render: (row: any) => `${row.pricePerDay.toLocaleString()}đ`,
        },
        {
            field: "depositAmount",
            headerName: "Tiền cọc",
            render: (row: any) => `${row.depositAmount.toLocaleString()}đ`,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            render: (row: any) => (
                <Chip
                    label={statusLabel(row.status)}
                    color={statusColor(row.status)}
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            render: (row: any) => (
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(row);
                        setOpenModal(true);
                    }}
                >
                    <Eye size={18} />
                </IconButton>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
            </div>
            <PrimaryTable columns={columns} rows={mockItems} />

            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Chi tiết sản phẩm"
                onSave={() => console.log("saved")}
            >
                {selectedItem ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                        <div className="flex gap-2 overflow-x-auto">
                            {selectedItem.mediaUrls?.map((url: string, idx: number) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={selectedItem.name}
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <p>
                                <strong>Chủ thuê:</strong> {selectedItem.ownerName}
                            </p>
                            <p>
                                <strong>Giá thuê/ngày:</strong>{" "}
                                {selectedItem.pricePerDay.toLocaleString()}đ
                            </p>
                            <p>
                                <strong>Tiền cọc:</strong>{" "}
                                {selectedItem.depositAmount.toLocaleString()}đ
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                {statusLabel(selectedItem.status)}
                            </p>
                        </div>

                        {/* ✅ Nút thao tác */}
                        <div className="flex justify-end gap-2 mt-4">
                            {selectedItem.status === "PENDING_APPROVAL" && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() =>
                                            handleAction("approve", selectedItem.id)
                                        }
                                    >
                                        Duyệt
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() =>
                                            handleAction("reject", selectedItem.id)
                                        }
                                    >
                                        Từ chối
                                    </Button>
                                </>
                            )}

                            {selectedItem.status === "AVAILABLE" && (
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => handleAction("lock", selectedItem.id)}
                                >
                                    Khóa sản phẩm
                                </Button>
                            )}

                            {selectedItem.status === "INACTIVE" && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAction("unlock", selectedItem.id)}
                                >
                                    Mở khóa
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Không có sản phẩm nào được chọn</p>
                )}
            </PrimaryModal>
        </div>
    );
}

// 🔹 Helper: hiển thị màu và label
function statusLabel(status: string) {
    switch (status) {
        case "PENDING_APPROVAL":
            return "Chờ duyệt";
        case "AVAILABLE":
            return "Đang hiển thị";
        case "RENTED":
            return "Đang được thuê";
        case "INACTIVE":
            return "Bị khóa";
        case "BANNED":
            return "Bị cấm";
        default:
            return status;
    }
}

function statusColor(status: string): any {
    switch (status) {
        case "PENDING_APPROVAL":
            return "warning";
        case "AVAILABLE":
            return "success";
        case "INACTIVE":
            return "default";
        case "BANNED":
            return "error";
        default:
            return "info";
    }
}

// 🔹 Mock action handler
function handleAction(type: string, id: string) {
    console.log(`Action: ${type} on item ${id}`);
}
