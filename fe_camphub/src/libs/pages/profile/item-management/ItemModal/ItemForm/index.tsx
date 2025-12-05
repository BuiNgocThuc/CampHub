// app/profile/owned-items/ItemModal/ItemForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Upload, X, Video, AlertCircle } from "lucide-react";
import { PrimaryButton, CustomizedButton, PrimaryAlert } from "@/libs/components";
import { useCloudinaryUpload, useCreateItem, useUpdateItem } from "@/libs/hooks";
import { Item } from "@/libs/core/types";
import { ItemSchema, ItemFormValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaType } from "@/libs/core/constants";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/libs/api/category-api";
import type { Category } from "@/libs/core/types";
import PrimaryTextField from "@/libs/components/TextFields/PrimaryTextField";
import PrimarySelectField from "@/libs/components/TextFields/PrimarySelectField";
import { useState } from "react";
import { uploadMultipleToCloudinary } from "@/libs/services";

interface ItemFormProps {
    item?: Item;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ItemForm({ item, onSuccess, onCancel }: ItemFormProps) {
    const { uploads, uploadFile } = useCloudinaryUpload();
    const createMut = useCreateItem();
    const updateMut = useUpdateItem();
    const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });
    const [isUploading, setIsUploading] = useState(false);

    const [alert, setAlert] = useState<{
        content: string;
        type: "success" | "error" | "warning" | "info";
        duration: number;
    } | null>(null);

    const showAlert = (
        content: string,
        type: "success" | "error" | "warning" | "info",
        duration = 2000
    ) => setAlert({ content, type, duration });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        trigger,
        control,
    } = useForm<ItemFormValues>({
        resolver: zodResolver(ItemSchema),
        defaultValues: item
            ? {
                name: item.name,
                description: item.description || "",
                price: item.price,
                quantity: item.quantity,
                depositAmount: item.depositAmount,
                categoryId: item.categoryId,
                mediaUrls: item.mediaUrls || [],
            }
            : {
                quantity: 1,
                depositAmount: 0,
                mediaUrls: [],
            },
    });

    const mediaUrls = watch("mediaUrls");
    const uploadingCount = Object.values(uploads).filter(u => u.uploading).length;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        if (mediaUrls.length + files.length > 10) {
            toast.error("Tối đa 10 ảnh/video");
            return;
        }

        setIsUploading(true);
        toast.loading("Đang upload lên Cloudinary...", { id: "cloudinary" });

        uploadMultipleToCloudinary(files)
            .then(results => {
                const newMedia = results.map(r => ({
                    url: r.url,
                    type: r.type as MediaType
                }));
                setValue("mediaUrls", [...mediaUrls, ...newMedia], { shouldValidate: true });
                toast.success(`Upload thành công ${results.length} file!`, { id: "cloudinary" });
            })
            .catch(err => {
                toast.error("Upload thất bại: " + (err.message || "Lỗi mạng"), { id: "cloudinary" });
            })
            .finally(() => setIsUploading(false));
    };

    const removeMedia = (index: number) => {
        setValue(
            "mediaUrls",
            mediaUrls.filter((_, i) => i !== index),
            { shouldValidate: true }
        );
    };

    const onSubmit = async (data: ItemFormValues) => {
        try {
            const mutation = item ? updateMut : createMut;
            await mutation.mutateAsync({ ...data, id: item?.id } as Item);
            showAlert(
                item ? "Cập nhật sản phẩm thành công!" : "Đăng sản phẩm thành công!",
                "success"
            );
            onSuccess();
        } catch (err) {
            showAlert("Có lỗi xảy ra. Vui lòng thử lại.", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Upload ảnh/video */}
            <div>
                <label className="block text-sm font-medium mb-3">
                    Hình ảnh & Video <span className="text-red-500">*</span> (tối đa 10)
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {mediaUrls.map((m, i) => (
                        <div key={i} className="relative group">
                            {m.type === MediaType.IMAGE ?
                                <img src={m.url} className="w-full aspect-square object-cover rounded-lg border" /> :
                                <video src={m.url} className="w-full aspect-square object-cover rounded-lg border" controls />
                            }
                            <button type="button" onClick={() => removeMedia(i)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100">
                                <X size={16} />
                            </button>
                        </div>
                    ))}

                    {isUploading && (
                        <div className="aspect-square border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                            <span className="text-xs mt-2">Đang upload...</span>
                        </div>
                    )}

                    {mediaUrls.length < 10 && !isUploading && (
                        <label className="cursor-pointer">
                            <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                            <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-blue-500">
                                <Upload size={32} />
                                <span className="text-xs mt-2">Thêm</span>
                            </div>
                        </label>
                    )}
                </div>
                {errors.mediaUrls && <p className="text-red-500 text-sm mt-2">{errors.mediaUrls.message}</p>}
            </div>

            {/* Các field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Tên sản phẩm *"
                                placeholder="Nhập tên sản phẩm"
                                required
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />
                </div>

                <div>
                    <Controller
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Giá thuê/ngày (₫) *"
                                required
                                type="number"
                                value={
                                    field.value === undefined || field.value === null
                                        ? ""
                                        : String(field.value)
                                }
                                onChange={(e) =>
                                    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                error={!!errors.price}
                                helperText={errors.price?.message}
                                slotProps={{
                                    input: { min: 0 },
                                }}
                            />
                        )}
                    />
                </div>

                <div>
                    <Controller
                        control={control}
                        name="quantity"
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Số lượng *"
                                required
                                type="number"
                                value={
                                    field.value === undefined || field.value === null
                                        ? ""
                                        : String(field.value)
                                }
                                onChange={(e) =>
                                    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                error={!!errors.quantity}
                                helperText={errors.quantity?.message}
                                slotProps={{
                                    input: { min: 1 },
                                }}
                            />
                        )}
                    />
                </div>

                <div>
                    <Controller
                        control={control}
                        name="depositAmount"
                        render={({ field }) => (
                            <PrimaryTextField
                                label="Tiền đặt cọc (₫)"
                                type="number"
                                value={
                                    field.value === undefined || field.value === null
                                        ? ""
                                        : String(field.value)
                                }
                                onChange={(e) =>
                                    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                error={!!errors.depositAmount}
                                helperText={errors.depositAmount?.message}
                                slotProps={{
                                    input: { min: 0 },
                                }}
                            />
                        )}
                    />
                </div>

                <div className="md:col-span-2">
                    <Controller
                        control={control}
                        name="categoryId"
                        render={({ field }) => (
                            <PrimarySelectField
                                label="Danh mục *"
                                required
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                disabled={loadingCategories}
                                error={!!errors.categoryId}
                                helperText={errors.categoryId?.message}
                                options={[
                                    {
                                        value: "",
                                        label: loadingCategories ? "Đang tải danh mục..." : "Chọn danh mục",
                                        disabled: true,
                                    },
                                    ...(
                                        loadingCategories
                                            ? []
                                            : categories.map((category) => ({
                                                value: category.id,
                                                label: category.name,
                                            }))
                                    ),
                                ]}
                            />
                        )}
                    />
                </div>
            </div>

            <div>
                <textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Mô tả sản phẩm (tối đa 2000 ký tự)"
                    className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
                <CustomizedButton content="Hủy" color="#6b7280" onClick={onCancel} type="button" />
                <PrimaryButton
                    type="submit"
                    disabled={isSubmitting || uploadingCount > 0}
                    className="min-w-40"
                    content={
                        item ? (
                            "Cập nhật sản phẩm"
                        ) : (
                            "Đăng sản phẩm"
                        )}
                />

            </div>

            {alert && (
                <PrimaryAlert
                    content={alert.content}
                    type={alert.type}
                    duration={alert.duration}
                    onClose={() => setAlert(null)}
                />
            )}
        </form >
    );
}