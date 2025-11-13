"use client";

import React, { useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
    PrimaryNumberField,
    PrimarySelectField,
    PrimaryTextField,
} from "@/libs/components";
import { renderLabelWithAsterisk, userTypeOptions } from "@/libs/utils";

interface AccountDetailProps {
    // openModal: boolean;
    // onClose?: () => void;
    // onSave: (data: any) => void;
    // selectedId?: string; // nếu có id → mode xem
    // initialData?: any;
    account?: AccountFormValues;       // dữ liệu khi xem (nếu có)
    isCreateMode: boolean;             // chế độ: tạo mới hay xem
    onClose?: () => void;
    onSave: (data: AccountFormValues) => void;
}

export interface AccountFormValues {
    id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    phone_number: string;
    email: string;
    ID_number: string;
    avatar: string;
    trust_score: number;
    coin_balance: number;
    user_type: string;
    status: string;
}

export default function AccountDetail({
    account,
    isCreateMode,
    onClose,
    onSave,
}: AccountDetailProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AccountFormValues>({
        defaultValues: {
            username: "",
            password: "",
            firstname: "",
            lastname: "",
            phone_number: "",
            email: "",
            ID_number: "",
            avatar: "",
            trust_score: 0,
            coin_balance: 0,
            user_type: "USER",
            status: "ACTIVE",
        },
    });

    // Load dữ liệu khi xem chi tiết
    useEffect(() => {
        if (account) {
            reset(account);
        } else {
            reset();
        }
    }, [account, reset]);

    const onSubmit = (data: AccountFormValues) => {
        onSave(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} p={2}>
            <Grid container spacing={2}>
                {/* Username */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: "Tên đăng nhập là bắt buộc" }}
                        render={({ field }) => (
                            <PrimaryTextField
                                label={renderLabelWithAsterisk("Tên đăng nhập", true)}
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                disabled={!isCreateMode}
                            />
                        )}
                    />
                </Grid>

                {/* Password (chỉ khi tạo mới) */}
                {/* {!selectedId && (
                    <Grid size={{ xs: 6 }}>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Mật khẩu là bắt buộc" }}
                            render={({ field }) => (
                                <PrimaryTextField
                                    label={renderLabelWithAsterisk("Mật khẩu", true)}
                                    size="small"
                                    type="password"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            )}
                        />
                    </Grid>
                )} */}

                {/* Firstname */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="firstname"
                        control={control}
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Họ"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Grid>

                {/* Lastname */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="lastname"
                        control={control}
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Tên"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Grid>

                {/* Phone number */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="phone_number"
                        control={control}
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Số điện thoại"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Grid>

                {/* Email */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: "Email là bắt buộc" }}
                        render={({ field }) => (
                            <PrimaryTextField
                                label={renderLabelWithAsterisk("Email", true)}
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                </Grid>

                {/* ID number */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="ID_number"
                        control={control}
                        render={({ field }) => (
                            <PrimaryTextField
                                label="CMND / CCCD"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Grid>

                {/* Avatar */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="avatar"
                        control={control}
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Ảnh đại diện (URL)"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Grid>

                {/* Trust Score */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="trust_score"
                        control={control}
                        render={({ field }) => (
                            <PrimaryNumberField
                                label="Điểm uy tín"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Grid>

                {/* Coin Balance */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="coin_balance"
                        control={control}
                        render={({ field }) => (
                            <PrimaryNumberField
                                label="Số dư xu"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Grid>

                {/* User Type */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="user_type"
                        control={control}
                        render={({ field }) => (
                            <PrimarySelectField
                                label={renderLabelWithAsterisk("Loại người dùng", true)}
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                                options={userTypeOptions}
                                disabled={!isCreateMode}
                            />
                        )}
                    />
                </Grid>

                {/* Status */}
                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <PrimarySelectField
                                label={renderLabelWithAsterisk("Trạng thái", true)}
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                                options={[
                                    { label: "ACTIVE", value: "ACTIVE" },
                                    { label: "BANNED", value: "BANNED" },
                                    { label: "SUSPENDED", value: "SUSPENDED" },
                                ]}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            {/* Buttons */}
            <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button variant="outlined" onClick={onClose}>
                    Hủy
                </Button>
                {isCreateMode && (
                    <Button variant="contained" color="primary" type="submit">
                        Tạo tài khoản
                    </Button>
                )}
            </Box>
        </Box>
    );
}
