"use client";

import { useEffect, useState } from "react";
import { Box, Avatar, Typography, Stack, Chip, Divider, CircularProgress } from "@mui/material";
import { Bell, KeyRound } from "lucide-react";
import { useAuthStore } from "@/libs/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { changeMyPassword, getAccountById, updateMyAccount } from "@/libs/api/account-api";
import { Account } from "@/libs/core/types";
import { PrimaryButton, OutlineButton, PrimaryTextField, PrimaryModal } from "@/libs/components";
import { toast } from "sonner";

const toCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));

export default function AdminProfile() {
    const { user, fetchMyInfo } = useAuthStore();
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [formData, setFormData] = useState<Account | null>(null);

    useEffect(() => {
        if (!user) {
            fetchMyInfo();
        }
    }, [user, fetchMyInfo]);

    const { data: account, isLoading, refetch } = useQuery<Account | undefined>({
        queryKey: ["admin-profile", user?.id],
        queryFn: () => (user?.id ? getAccountById(user.id) : Promise.resolve(undefined)),
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (account) {
            setFormData(account);
        }
    }, [account]);

    const displayName = account ? `${account.firstname} ${account.lastname}`.trim() || account.username : user?.username;
    const avatar = account?.avatar || user?.avatarUrl;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" sx={{ maxWidth: 960, mx: "auto" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
                    <Avatar
                        src={avatar || undefined}
                        alt={displayName || "Admin"}
                        sx={{ width: 96, height: 96, bgcolor: "#3b82f6", fontSize: 32 }}
                    >
                        {(displayName || "A").slice(0, 1).toUpperCase()}
                    </Avatar>
                    <Box flex={1} width="100%">
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {displayName || "Quản trị viên"}
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
                            <Chip label={`ID: ${account?.id || user?.id || "—"}`} variant="outlined" />
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ my: 4 }} />

                {isLoading ? (
                    <Box display="flex" alignItems="center" gap={2} py={4}>
                        <CircularProgress size={24} />
                        <Typography>Đang tải thông tin tài khoản...</Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight="bold">
                            Thông tin tài khoản
                        </Typography>
                        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PrimaryTextField
                                label="Tên đăng nhập"
                                value={formData?.username || user?.username || ""}
                                disabled
                            />
                            <PrimaryTextField
                                label="Họ"
                                value={formData?.firstname || ""}
                                onChange={(e) => setFormData((prev) => prev ? { ...prev, firstname: e.target.value } : prev)}
                                disabled={!editMode}
                            />
                            <PrimaryTextField
                                label="Tên"
                                value={formData?.lastname || ""}
                                onChange={(e) => setFormData((prev) => prev ? { ...prev, lastname: e.target.value } : prev)}
                                disabled={!editMode}
                            />
                            <PrimaryTextField
                                label="Email"
                                value={formData?.email || ""}
                                onChange={(e) => setFormData((prev) => prev ? { ...prev, email: e.target.value } : prev)}
                                disabled={!editMode}
                            />
                            <PrimaryTextField
                                label="Số điện thoại"
                                value={formData?.phoneNumber || ""}
                                onChange={(e) => setFormData((prev) => prev ? { ...prev, phoneNumber: e.target.value } : prev)}
                                disabled={!editMode}
                            />
                            <PrimaryTextField
                                label="CMND/CCCD"
                                value={formData?.idNumber || ""}
                                onChange={(e) => setFormData((prev) => prev ? { ...prev, idNumber: e.target.value } : prev)}
                                disabled={!editMode}
                            />
                            <PrimaryTextField label="Trạng thái" value={account?.status || "—"} disabled />
                            <PrimaryTextField label="Loại tài khoản" value={account?.userType || "—"} disabled />
                        </Box>
                    </Stack>
                )}

                {/* Nút hành động cập nhật hồ sơ */}
                <Box display="flex" justifyContent="flex-end" mt={4} gap={1.5}>
                    {editMode ? (
                        <>
                            <OutlineButton
                                content="Hủy"
                                onClick={() => {
                                    setFormData(account || null);
                                    setEditMode(false);
                                }}
                            />
                            <PrimaryButton
                                content={saving ? "Đang lưu..." : "Lưu thay đổi"}
                                onClick={async () => {
                                    if (!formData) return;
                                    setSaving(true);
                                    try {
                                        await updateMyAccount({
                                            firstname: formData.firstname,
                                            lastname: formData.lastname,
                                            email: formData.email,
                                            phoneNumber: formData.phoneNumber,
                                            idNumber: formData.idNumber,
                                            avatar: formData.avatar,
                                        });
                                        toast.success("Cập nhật hồ sơ thành công");
                                        await refetch();
                                        setEditMode(false);
                                    } catch (err: any) {
                                        toast.error(err?.response?.data?.message || "Cập nhật hồ sơ thất bại");
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                            />
                        </>
                    ) : (
                        <>
                            <OutlineButton content="Đổi mật khẩu" icon={<KeyRound size={16} />} onClick={() => setOpenPasswordModal(true)} />
                            <PrimaryButton content="Chỉnh sửa hồ sơ" onClick={() => setEditMode(true)} icon={<Bell size={16} />} />
                        </>
                    )}
                </Box>
            </Box>

            {/* Modal đổi mật khẩu */}
            <PrimaryModal
                open={openPasswordModal}
                onClose={() => {
                    if (!changingPassword) setOpenPasswordModal(false);
                }}
                title="Đổi mật khẩu"
                maxWidth="sm"
            >
                <Box className="grid grid-cols-1 gap-4 mt-2">
                    <PrimaryTextField
                        label="Mật khẩu hiện tại"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                    <PrimaryTextField
                        label="Mật khẩu mới"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                    <PrimaryTextField
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                </Box>
                <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
                    <OutlineButton
                        content="Hủy"
                        onClick={() => {
                            if (changingPassword) return;
                            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                            setOpenPasswordModal(false);
                        }}
                    />
                    <PrimaryButton
                        content={changingPassword ? "Đang đổi..." : "Xác nhận"}
                        onClick={async () => {
                            const { currentPassword, newPassword, confirmPassword } = passwordForm;
                            if (!currentPassword || !newPassword || !confirmPassword) {
                                toast.error("Vui lòng nhập đầy đủ mật khẩu");
                                return;
                            }
                            if (newPassword !== confirmPassword) {
                                toast.error("Mật khẩu xác nhận không khớp");
                                return;
                            }
                            if (newPassword.length < 6) {
                                toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
                                return;
                            }
                            setChangingPassword(true);
                            try {
                                await changeMyPassword(currentPassword, newPassword);
                                toast.success("Đổi mật khẩu thành công");
                                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                setOpenPasswordModal(false);
                            } catch (err: any) {
                                toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
                            } finally {
                                setChangingPassword(false);
                            }
                        }}
                        disabled={changingPassword}
                    />
                </Box>
            </PrimaryModal>
        </div>
    );
}
