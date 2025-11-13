"use client";

import { useState } from "react";
import { PrimaryTable, PrimaryModal } from "@/libs/components";
import AccountDetail, { AccountFormValues } from "./account-detail";
import { Eye } from "lucide-react";
import { IconButton, Button } from "@mui/material";
import { mockAccounts } from "@/libs/utils";

export default function AccountList() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<AccountFormValues | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);

    // ✅ Thêm ngày tạo giả
    const accountsWithDate = mockAccounts.map((acc, index) => ({
        ...acc,
        created_at: new Date(2024, 5, index + 1).toLocaleDateString("vi-VN"),
    }));

    const columns = [
        { field: "username", headerName: "Tên đăng nhập" },
        { field: "email", headerName: "Email" },
        { field: "user_type", headerName: "Loại" },
        { field: "status", headerName: "Trạng thái" },
        { field: "created_at", headerName: "Ngày tạo" },
        {
            field: "actions",
            headerName: "Thao tác",
            render: (row: AccountFormValues) => (
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccount(row);
                        setIsCreateMode(false);
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
                <h2 className="text-xl font-semibold">Danh sách tài khoản</h2>
                <Button
                    variant="contained"
                    onClick={() => {
                        setSelectedAccount(null);
                        setIsCreateMode(true);
                        setOpenModal(true);
                    }}
                >
                    + Thêm tài khoản
                </Button>
            </div>

            {/*  Bảng dữ liệu chính */}
            <PrimaryTable columns={columns} rows={accountsWithDate} />

            {/* Modal chi tiết tài khoản */}
            <PrimaryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={isCreateMode ? "Tạo tài khoản mới" : "Chi tiết tài khoản"}
                onSave={() => console.log("Saved!")}
            >
                <AccountDetail
                    account={selectedAccount || undefined}
                    isCreateMode={isCreateMode}
                    onClose={() => setOpenModal(false)}
                    onSave={(data) => console.log("Saved data:", data)}
                />
            </PrimaryModal>
        </div>
    );
}
