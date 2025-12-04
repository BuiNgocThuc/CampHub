// app/admin/accounts/AccountDetail.tsx
"use client";

import { useEffect } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { MediaPreview, PrimaryButton, PrimaryNumberField, PrimaryPasswordField, PrimarySelectField, PrimaryTextField } from "@/libs/components";
import { renderLabelWithAsterisk } from "@/libs/utils";
import { Account } from "@/libs/core/types";

interface AccountDetailProps {
    account?: Account;
    isCreateMode: boolean;
    onSave: (data: any) => void;
    onClose: () => void;
}

const userTypeOptions = [
    { label: "Người dùng", value: "USER" },
    { label: "Quản trị viên", value: "ADMIN" },
];

const statusOptions = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
    { label: "Bị cấm", value: "BANNED" },
];

export default function AccountDetail({
    account,
    isCreateMode,
    onSave,
    onClose,
}: AccountDetailProps) {
    {
        const { control, handleSubmit, reset, formState: { errors } } = useForm({
            defaultValues: {
                username: "",
                password: "",
                firstname: "",
                lastname: "",
                email: "",
                phoneNumber: "",
                idNumber: "",
                avatar: "",
                trustScore: account?.trustScore || 100,
                coinBalance: account?.coinBalance || 0,
                userType: "USER",
                status: "ACTIVE",
            },
        });

        useEffect(() => {
            if (account) {
                reset({
                    username: account.username,
                    firstname: account.firstname,
                    lastname: account.lastname,
                    email: account.email,
                    phoneNumber: account.phoneNumber,
                    idNumber: account.idNumber,
                    avatar: account.avatar,
                    trustScore: account.trustScore,
                    coinBalance: account.coinBalance,
                    userType: account.userType,
                    status: account.status,
                    password: "",
                });
            } else {
                reset();
            }
        }, [account, reset]);

        const onSubmit = (data: any) => {
            const payload = isCreateMode
                ? {
                    username: data.username,
                    password: data.password,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    idNumber: data.idNumber,
                    avatar: data.avatar || null,
                    userType: data.userType,
                }
                : {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phoneNumber: data.phoneNumber,
                    idNumber: data.idNumber,
                    avatar: data.avatar || null,
                    trustScore: Number(data.trustScore),
                    coinBalance: Number(data.coinBalance),
                    status: data.status,
                };

            onSave(payload);
        };

        return (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
                <Grid container spacing={3}>
                    {/* Chỉ hiện password khi tạo mới */}
                    {isCreateMode && (
                        <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: "Bắt buộc" }}
                                    render={({ field }) => (
                                        <PrimaryTextField
                                            label={renderLabelWithAsterisk("Tên đăng nhập", true)}
                                            size="small"
                                            {...field}
                                            error={!!errors.username}
                                            helperText={errors.username?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: "Bắt buộc", minLength: { value: 6, message: "Tối thiểu 6 ký tự" } }}
                                    render={({ field }) => (
                                        <PrimaryPasswordField
                                            label={renderLabelWithAsterisk("Mật khẩu", true)}
                                            size="small"
                                            {...field}
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </>
                    )}

                    {/* Các trường chung */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller name="firstname" control={control} render={({ field }) => <PrimaryTextField label="Họ" size="small" {...field} />} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller name="lastname" control={control} render={({ field }) => <PrimaryTextField label="Tên" size="small" {...field} />} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Bắt buộc" }}
                            render={({ field }) => (
                                <PrimaryTextField
                                    label={renderLabelWithAsterisk("Email", true)}
                                    size="small"
                                    {...field}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller name="phoneNumber" control={control} render={({ field }) => <PrimaryTextField label="Số điện thoại" size="small" {...field} />} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller name="idNumber" control={control} render={({ field }) => <PrimaryTextField label="CMND/CCCD" size="small" {...field} />} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="avatar"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <PrimaryTextField
                                        label="URL ảnh đại diện"
                                        size="small"
                                        {...field}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                    {field.value && (
                                        <Box sx={{ mt: 2 }}>
                                            <MediaPreview url={field.value} size="large" onRemove={() => field.onChange("")} />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        />
                    </Grid>

                    {/* Chỉ admin mới sửa được */}
                    {!isCreateMode && (
                        <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="trustScore"
                                    control={control}
                                    render={({ field }) => (
                                        <PrimaryNumberField
                                            label="Điểm uy tín"
                                            size="small"
                                            {...field}
                                            inputProps={{ min: 0, max: 100 }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="coinBalance"
                                    control={control}
                                    render={({ field }) => (
                                        <PrimaryNumberField
                                            label="Số dư xu"
                                            size="small"
                                            {...field}
                                            inputProps={{ min: 0 }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <PrimarySelectField
                                            label="Trạng thái"
                                            size="small"
                                            options={statusOptions}
                                            {...field}
                                        />
                                    )}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="userType"
                            control={control}
                            render={({ field }) => (
                                <PrimarySelectField
                                    label={renderLabelWithAsterisk("Loại tài khoản", false)}
                                    size="small"
                                    options={userTypeOptions}
                                    disabled={!isCreateMode}
                                    {...field}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Hủy
                    </Button>
                    <PrimaryButton
                        content={isCreateMode ? "Tạo tài khoản" : "Lưu thay đổi"}
                        type="submit"
                    />
                </Box>
            </Box>
        );
    }
}