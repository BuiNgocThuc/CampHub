// app/admin/accounts/AccountList.tsx
"use client";

import { useState } from "react";
import { PrimaryTable, PrimaryModal, PrimaryButton, PrimaryDataGrid } from "@/libs/components";
import AccountDetail from "./account-detail";
import { Eye, Plus } from "lucide-react";
import { IconButton, Box, Typography, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAccounts,
    createAccountForAdmin,
    updateAccountForAdmin,
    patchAccount,
} from "@/libs/api/account-api";
import { toast } from "sonner";
import { Account } from "@/libs/core/types";
import { UserStatus, UserType } from "@/libs/core/constants";

const statusOptions = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
    { label: "Bị cấm", value: "BANNED" },
];

const userTypeMap: Record<string, string> = {
    ADMIN: "Quản trị viên",
    USER: "Người dùng",
};

export default function AccountList() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);

    const queryClient = useQueryClient();

    // Lấy danh sách tài khoản
    const { data: accounts = [], isLoading } = useQuery({
        queryKey: ["adminAccounts"],
        queryFn: getAccounts,
    });

    // Mutation tạo/sửa
    const mutation = useMutation({
        mutationFn: (data: any) =>
            isCreateMode
                ? createAccountForAdmin(data)
                : updateAccountForAdmin(data, selectedAccount!.id),
        onSuccess: () => {
            toast.success(isCreateMode ? "Tạo tài khoản thành công!" : "Cập nhật thành công!");
            queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
            setOpenModal(false);
            setSelectedAccount(null);
            setIsCreateMode(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Có lỗi xảy ra");
        },
    });

    const handleOpenCreate = () => {
        setIsCreateMode(true);
        setSelectedAccount(null);
        setOpenModal(true);
    };

    const handleOpenEdit = (account: Account) => {
        setIsCreateMode(false);
        setSelectedAccount(account);
        setOpenModal(true);
    };

    const columns = [
        { field: "username", headerName: "Tên đăng nhập", width: 180 },
        { field: "email", headerName: "Email", width: 220 },
        {
            field: "fullname",
            headerName: "Họ tên",
            width: 180,
            render: (row: Account) => `${row.firstname} ${row.lastname}`.trim() || "-",
        },
        {
            field: "userType",
            headerName: "Loại tài khoản",
            width: 140,
            render: (row: Account) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.userType === UserType.ADMIN ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}>
                    {userTypeMap[row.userType] || row.userType}
                </span>
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            render: (row: Account) => {
                const status = statusOptions.find(s => s.value === row.status);
                const color = row.status === UserStatus.ACTIVE ? "bg-green-100 text-green-800" :
                    row.status === UserStatus.BANNED ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800";
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                        {status?.label || row.status}
                    </span>
                );
            },
        },
        {
            field: "coinBalance",
            headerName: "Số dư (xu)",
            width: 120,
            render: (row: Account) => row.coinBalance.toLocaleString(),
        },
        {
            field: "createdAt",
            headerName: "Ngày tạo",
            width: 120,
            render: (row: Account) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 100,
            render: (row: Account) => (
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(row);
                    }}
                >
                    <Eye size={18} />
                </IconButton>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
                <Typography ml={2}>Đang tải danh sách tài khoản...</Typography>
            </Box>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý tài khoản ({accounts.length})
                    </Typography>

                    <PrimaryButton
                        content="Thêm tài khoản"
                        icon={<Plus size={20} />}
                        onClick={handleOpenCreate}
                        size="large"
                    />
                </Box>

                <PrimaryDataGrid<Account>
                    rows={accounts}
                    columns={columns}
                    loading={isLoading}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    onRowClick={handleOpenEdit}
                />
            </Box>

            {/* Modal tạo/sửa */}
            <PrimaryModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedAccount(null);
                    setIsCreateMode(false);
                }}
                title={isCreateMode ? "Tạo tài khoản mới" : "Chi tiết & chỉnh sửa tài khoản"}
            >
                <AccountDetail
                    account={selectedAccount || undefined}
                    isCreateMode={isCreateMode}
                    onSave={(data) => mutation.mutate(data)}
                    onClose={() => setOpenModal(false)}
                />
            </PrimaryModal>
        </div>
    );
}