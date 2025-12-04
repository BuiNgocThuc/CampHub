"use client";

import { useState } from "react";
import { PrimaryButton, CustomizedButton, PrimaryModal } from "@/libs/components";
import { TextField, Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { Upload, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ownerResponse } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface OwnerResponseModalProps {
    open: boolean;
    onClose: () => void;
    bookingId: string;
    itemName: string;
    lesseeName: string;
}

export default function OwnerResponseModal({
    open,
    onClose,
    bookingId,
    itemName,
    lesseeName,
}: OwnerResponseModalProps) {
    const [isAccept, setIsAccept] = useState<boolean | null>(null);
    const [note, setNote] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ownerResponse,
        onSuccess: () => {
            toast.success(isAccept ? "Đã chấp nhận đơn thuê!" : "Đã từ chối đơn thuê!");
            queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
            handleClose();
        },
        onError: (err: any) => {
            toast.error(err.message || "Có lỗi xảy ra");
        },
    });

    const handleClose = () => {
        setIsAccept(null);
        setNote("");
        setFiles([]);
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        if (files.length + newFiles.length > 6) {
            toast.error("Chỉ được upload tối đa 6 ảnh/video");
            return;
        }
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (isAccept === null) {
            toast.error("Vui lòng chọn Đồng ý hoặc Từ chối");
            return;
        }
        if (isAccept && files.length === 0) {
            toast.error("Vui lòng upload ít nhất 1 ảnh/video đóng gói");
            return;
        }
        if (!isAccept && !note.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }

        setUploading(true);
        try {
            // TODO: Upload lên Cloudinary → lấy URL
            // const mediaUrls = await uploadFiles(files);

            const request = {
                bookingId,
                isAccept,
                deliveryNote: isAccept ? note : undefined,
                rejectReason: !isAccept ? note : undefined,
                packagingMediaUrls: isAccept
                    ? files.map(file => ({
                        url: URL.createObjectURL(file), // tạm thời
                        type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
                    }))
                    : undefined,
            };

            await mutation.mutateAsync(request as any);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <PrimaryModal
            open={open}
            title="Phản hồi đơn thuê"
            onClose={handleClose}
        >
            <Box sx={{ p: 3, minWidth: 600 }}>
                {/* Thông tin đơn */}
                <Box sx={{ mb: 4, p: 3, backgroundColor: "#f8f9fa", borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {itemName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Khách thuê: <strong>{lesseeName}</strong>
                    </Typography>
                </Box>

                {/* Chọn hành động */}
                <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mb: 4 }}>
                    <CustomizedButton
                        content="Đồng ý cho thuê"
                        icon={<CheckCircle size={20} />}
                        color="#00C853"
                        size="large"
                        onClick={() => setIsAccept(true)}
                        className={isAccept === true ? "!opacity-100 shadow-lg" : "!opacity-60"}
                    />
                    <CustomizedButton
                        content="Từ chối"
                        icon={<X size={20} />}
                        color="#D32F2F"
                        size="large"
                        onClick={() => setIsAccept(false)}
                        className={isAccept === false ? "!opacity-100 shadow-lg" : "!opacity-60"}
                    />
                </Box>

                {/* Form theo hành động */}
                {isAccept === true && (
                    <Box sx={{ spaceY: 4 }}>
                        <Typography variant="h6" color="success.main" fontWeight="bold" gutterBottom>
                            Chụp ảnh/video đóng gói đồ (bắt buộc)
                        </Typography>

                        <label htmlFor="upload-packaging">
                            <input
                                id="upload-packaging"
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <Box
                                sx={{
                                    border: "2px dashed #00C853",
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    backgroundColor: "#f1fdf6",
                                    "&:hover": { backgroundColor: "#e8f7ee" },
                                }}
                            >
                                <Upload size={48} className="mx-auto text-green-600 mb-2" />
                                <Typography>Click để upload ảnh/video đóng gói (tối đa 6)</Typography>
                            </Box>
                        </label>

                        {files.length > 0 && (
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mt: 3 }}>
                                {files.map((file, i) => (
                                    <Box key={i} sx={{ position: "relative" }}>
                                        {file.type.startsWith("video") ? (
                                            <video src={URL.createObjectURL(file)} controls className="w-full h-32 object-cover rounded-lg" />
                                        ) : (
                                            <img src={URL.createObjectURL(file)} alt="" className="w-full h-32 object-cover rounded-lg" />
                                        )}
                                        <IconButton
                                            onClick={() => removeFile(i)}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                backgroundColor: "rgba(211,47,47,0.8)",
                                                color: "white",
                                                "&:hover": { backgroundColor: "rgba(211,47,47,1)" },
                                            }}
                                        >
                                            <X size={16} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <TextField
                            label="Ghi chú giao hàng (tùy chọn)"
                            placeholder="Ví dụ: Đã đóng gói cẩn thận, giao qua GHTK lúc 14h..."
                            multiline
                            rows={3}
                            fullWidth
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{ mt: 3 }}
                        />
                    </Box>
                )}

                {isAccept === false && (
                    <Box>
                        <Typography variant="h6" color="error.main" fontWeight="bold" gutterBottom>
                            Lý do từ chối (bắt buộc)
                        </Typography>
                        <TextField
                            placeholder="Ví dụ: Sản phẩm đang hỏng, không thể cho thuê lúc này..."
                            multiline
                            rows={5}
                            fullWidth
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            error={!note.trim() && note.length > 0}
                        />
                    </Box>
                )}

                {/* Nút hành động */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 5 }}>
                    <CustomizedButton
                        content="Hủy"
                        color="#9E9E9E"
                        onClick={handleClose}
                    />
                    <PrimaryButton
                        content={uploading || mutation.isPending ? "Đang xử lý..." : isAccept ? "Xác nhận đồng ý" : "Xác nhận từ chối"}
                        onClick={handleSubmit}
                        disabled={uploading || mutation.isPending}
                        icon={uploading || mutation.isPending ? <CircularProgress size={20} /> : undefined}
                        className={isAccept ? "!bg-green-600 hover:!bg-green-700" : "!bg-red-600 hover:!bg-red-700"}
                    />
                </Box>
            </Box>
        </PrimaryModal>
    );
}