// app/admin/accounts/AccountList.tsx
"use client";

import { useState } from "react";
import { PrimaryTable, PrimaryModal, PrimaryButton, PrimaryDataGrid } from "@/libs/components";
import AccountDetail from "./account-detail";
import { Eye, Plus, Lock, Unlock } from "lucide-react";
import { IconButton, Box, Typography, CircularProgress, Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAccounts,
    createAccountForAdmin,
    updateAccountForAdmin,
    patchAccount,
    toggleAccountStatus,
} from "@/libs/api/account-api";
import { toast } from "sonner";
import { Account } from "@/libs/core/types";
import { UserStatus, UserType } from "@/libs/core/constants";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

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

    // Mutation lock/unlock
    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            toggleAccountStatus(id, isActive),
        onSuccess: (_, variables) => {
            toast.success(variables.isActive ? "Đã mở khóa tài khoản!" : "Đã khóa tài khoản!");
            queryClient.invalidateQueries({ queryKey: ["adminAccounts"] });
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

    const columns: GridColDef<Account>[] = [
        {
            field: "stt",
            headerName: "STT",
            width: 60,
            flex: 0,
            renderCell: (params: GridRenderCellParams<Account>) => {
                const index = accounts.findIndex((acc) => acc.id === params.row.id);
                return <Typography>{index + 1}</Typography>;
            },
        },
        { field: "username", headerName: "Tên đăng nhập", width: 150, flex: 1, minWidth: 120 },
        { field: "email", headerName: "Email", width: 200, flex: 1.2, minWidth: 150 },
        {
            field: "fullname",
            headerName: "Họ tên",
            width: 160,
            flex: 1,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams<Account>) => (
                <Typography>{`${params.row.firstname} ${params.row.lastname}`.trim() || "-"}</Typography>
            ),
        },
        {
            field: "userType",
            headerName: "Loại tài khoản",
            width: 130,
            flex: 0.8,
            minWidth: 110,
            renderCell: (params: GridRenderCellParams<Account>) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${params.row.userType === UserType.ADMIN ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}>
                    {userTypeMap[params.row.userType] || params.row.userType}
                </span>
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 130,
            flex: 0.8,
            minWidth: 110,
            renderCell: (params: GridRenderCellParams<Account>) => {
                const status = statusOptions.find(s => s.value === params.row.status);
                const color = params.row.status === UserStatus.ACTIVE ? "bg-green-100 text-green-800" :
                    params.row.status === UserStatus.BANNED ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800";
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                        {status?.label || params.row.status}
                    </span>
                );
            },
        },
        {
            field: "coinBalance",
            headerName: "Số dư (xu)",
            width: 140,
            flex: 0.9,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams<Account>) => (
                <Typography fontSize="0.875rem">
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(Number(params.row.coinBalance) ?? 0)}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 120,
            flex: 0,
            sortable: false,
            renderCell: (params: GridRenderCellParams<Account>) => {
                const isActive = params.row.status === UserStatus.ACTIVE;
                return (
                    <Box display="flex" gap={0.5}>
                        <Tooltip title="Xem chi tiết">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEdit(params.row);
                                }}
                            >
                                <Eye size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
                            <IconButton
                                size="small"
                                color={isActive ? "error" : "success"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStatusMutation.mutate({
                                        id: params.row.id,
                                        isActive: !isActive,
                                    });
                                }}
                                disabled={toggleStatusMutation.isPending}
                            >
                                {isActive ? <Lock size={16} /> : <Unlock size={16} />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
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
            <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 70px)" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý tài khoản ({accounts.length})
                    </Typography>

                    <PrimaryButton
                        content="Thêm tài khoản"
                        icon={<Plus size={16} />}
                        onClick={handleOpenCreate}
                        className="text-sm px-3 py-1.5"
                    />
                </Box>

                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <PrimaryDataGrid<Account>
                        rows={accounts}
                        columns={columns}
                        loading={isLoading}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        onRowClick={handleOpenEdit}
                    />
                </Box>
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