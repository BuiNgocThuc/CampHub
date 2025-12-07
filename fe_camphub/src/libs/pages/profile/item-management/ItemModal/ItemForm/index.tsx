// app/profile/owned-items/ItemModal/ItemForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { PrimaryButton, CustomizedButton, PrimaryAlert, PrimaryTextField, PrimarySelectField } from "@/libs/components";
import { useCloudinaryUpload, useCreateItem, useUpdateItem } from "@/libs/hooks";
import { Item } from "@/libs/core/types";
import { ItemSchema, ItemFormValues } from "./schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaType } from "@/libs/core/constants";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/libs/api";
import type { Category } from "@/libs/core/types";
import { useState, useEffect } from "react";
import { uploadMultipleToCloudinary } from "@/libs/services";
import { CircularProgress, Box } from "@mui/material";

interface ItemFormProps {
    item?: Item;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ItemForm({ item, onSuccess, onCancel }: ItemFormProps) {
    const { uploads } = useCloudinaryUpload();
    const createMut = useCreateItem();
    const updateMut = useUpdateItem();
    const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });
    const [isUploading, setIsUploading] = useState(false);

    // Debug: Log item data khi edit
    if (item) {
        console.log("📦 Item data for edit:", {
            id: item.id,
            name: item.name,
            mediaUrls: item.mediaUrls,
            mediaUrlsLength: item.mediaUrls?.length || 0,
        });
    }

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

    // Tạo schema động: khi edit cho phép min(0), khi create yêu cầu min(1)
    const isEditMode = !!item;
    const DynamicItemSchema = ItemSchema.extend({
        mediaUrls: isEditMode
            ? z.array(z.object({ url: z.string().url(), type: z.enum(["IMAGE", "VIDEO"]) }))
                .min(0) // Khi edit, cho phép rỗng (sẽ validate custom trong onSubmit)
                .max(10, "Tối đa 10 ảnh/video")
            : z.array(z.object({ url: z.string().url(), type: z.enum(["IMAGE", "VIDEO"]) }))
                .min(1, "Phải có ít nhất 1 ảnh/video")
                .max(10, "Tối đa 10 ảnh/video"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        control,
    } = useForm<ItemFormValues>({
        resolver: zodResolver(DynamicItemSchema),
        defaultValues: item
            ? {
                name: item.name,
                description: item.description || "",
                price: item.price,
                quantity: item.quantity,
                depositAmount: item.depositAmount,
                categoryId: item.categoryId,
                mediaUrls: item.mediaUrls && item.mediaUrls.length > 0 ? item.mediaUrls : [],
            }
            : {
                quantity: 1,
                depositAmount: 0,
                mediaUrls: [],
            },
    });

    // Debug: Log defaultValues sau khi khởi tạo
    useEffect(() => {
        console.log("📋 Form defaultValues:", {
            hasItem: !!item,
            mediaUrls: item?.mediaUrls,
            mediaUrlsLength: item?.mediaUrls?.length || 0,
        });
    }, [item]);

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
        console.log("Form submitted! Data:", data);

        // Validate custom: nếu đang edit và xóa hết mediaUrls thì báo lỗi
        const isUpdate = !!item;
        if (isUpdate && (!data.mediaUrls || data.mediaUrls.length === 0)) {
            const errorMessage = "Vui lòng giữ lại ít nhất 1 hình ảnh hoặc video, hoặc thêm mới";
            toast.error(errorMessage);
            showAlert(errorMessage, "error");
            return;
        }

        try {
            const mutation = isUpdate ? updateMut : createMut;

            const itemData: Item = {
                ...data,
                ...(isUpdate && { id: item.id }),
            } as Item;

            console.log("Submitting item:", { isUpdate, itemData });

            const result = await mutation.mutateAsync(itemData);

            console.log("API call successful:", result);

            toast.success(
                isUpdate ? "Cập nhật sản phẩm thành công!" : "Đăng sản phẩm thành công!"
            );

            onSuccess();
        } catch (err: any) {
            console.error("API call failed:", err);
            const errorMessage = err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            toast.error(errorMessage);
            showAlert(errorMessage, "error");
        }
    };

    const isLoading = isSubmitting || createMut.isPending || updateMut.isPending || uploadingCount > 0;

    // Format validation errors để hiển thị cho người dùng
    const formatValidationErrors = (errors: any): string => {
        const errorMessages: string[] = [];

        if (errors.name) {
            errorMessages.push(`Tên sản phẩm: ${errors.name.message || "Không được để trống"}`);
        }
        if (errors.price) {
            errorMessages.push(`Giá thuê: ${errors.price.message || "Không hợp lệ"}`);
        }
        if (errors.quantity) {
            errorMessages.push(`Số lượng: ${errors.quantity.message || "Không hợp lệ"}`);
        }
        if (errors.categoryId) {
            errorMessages.push(`Danh mục: ${errors.categoryId.message || "Vui lòng chọn danh mục"}`);
        }
        if (errors.mediaUrls) {
            // Khi edit, message khác với khi create
            const mediaErrorMsg = item
                ? "Vui lòng giữ lại ít nhất 1 hình ảnh hoặc video, hoặc thêm mới"
                : "Vui lòng thêm ít nhất 1 hình ảnh hoặc video";
            errorMessages.push(`Hình ảnh/Video: ${errors.mediaUrls.message || mediaErrorMsg}`);
        }
        if (errors.description) {
            errorMessages.push(`Mô tả: ${errors.description.message || "Không hợp lệ"}`);
        }
        if (errors.depositAmount) {
            errorMessages.push(`Tiền đặt cọc: ${errors.depositAmount.message || "Không hợp lệ"}`);
        }

        return errorMessages.length > 0
            ? `Vui lòng kiểm tra lại:\n${errorMessages.join("\n")}`
            : "Vui lòng kiểm tra lại các trường bắt buộc";
    };

    return (
        <form
            onSubmit={handleSubmit(
                (data) => {
                    console.log("handleSubmit called with data:", data);
                    onSubmit(data);
                },
                (errors) => {
                    console.log("Form validation failed:", errors);
                    const errorMessage = formatValidationErrors(errors);
                    toast.error(errorMessage);
                    showAlert(errorMessage, "error", 5000);
                }
            )}
            className="space-y-6"
        >
            {/* Hiển thị lý do từ chối nếu có */}
            {item?.rejectionReason && item.status === "REJECTED" && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-semibold text-red-800 mb-1">
                                Sản phẩm đã bị từ chối
                            </h3>
                            <p className="text-sm text-red-700">
                                <strong>Lý do:</strong> {item.rejectionReason}
                            </p>
                            <p className="text-xs text-red-600 mt-2">
                                Vui lòng chỉnh sửa sản phẩm theo lý do trên và gửi lại để được duyệt.
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                <CustomizedButton
                    content="Hủy"
                    color="#6b7280"
                    onClick={onCancel}
                    type="button"
                    disabled={isLoading}
                />
                <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                    className="min-w-40"
                    icon={
                        isLoading ? (
                            <CircularProgress size={16} sx={{ color: "white" }} />
                        ) : undefined
                    }
                    content={
                        item
                            ? (isLoading ? "Đang cập nhật..." : "Cập nhật sản phẩm")
                            : (isLoading ? "Đang đăng..." : "Đăng sản phẩm")
                    }
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