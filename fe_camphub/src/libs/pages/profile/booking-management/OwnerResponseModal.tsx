"use client";

import { useState } from "react";
import { PrimaryButton, CustomizedButton, PrimaryModal, PrimaryAlert } from "@/libs/components";
import { TextField, Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { Upload, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ownerResponse, validateImageHash } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OwnerConfirmationRequest } from "@/libs/core/dto/request";
import { MediaType } from "@/libs/core/constants";
import { calculateFileHash, isFileSizeValid, isFileTypeAllowed, uploadMedia } from "@/libs/utils";
import { set } from "zod";

interface PendingFile {
    file: File;
    hash: string;
    preview: string;
    type: "IMAGE" | "VIDEO";
}

interface OwnerResponseModalProps {
    open: boolean;
    onClose: () => void;
    bookingId: string;
    itemId: string;
    itemName: string;
    lesseeName: string;
    onSuccess?: (isAccept: boolean) => void;
}

export default function OwnerResponseModal({
    open,
    onClose,
    bookingId,
    itemId,
    itemName,
    lesseeName,
    onSuccess,
}: OwnerResponseModalProps) {
    const [isAccept, setIsAccept] = useState<boolean | null>(null);
    const [note, setNote] = useState("");
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState<{
        content: string;
        type: "success" | "error" | "warning" | "info";
        duration: number;
    } | null>(null);

    const showAlert = (
        content: string,
        type: "success" | "error" | "warning" | "info",
        duration = 2000
    ) => {
        setAlert({ content, type, duration });
    };

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ownerResponse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessorBookings"] });
            handleClose();
            // Gọi callback để hiển thị alert ở parent component
            if (onSuccess && isAccept !== null) {
                onSuccess(isAccept);
            }
        },
        onError: (err: any) => {
            toast.error(err.message || "Có lỗi xảy ra");
        },
    });

    const handleClose = () => {
        setIsAccept(null);
        setNote("");
        setPendingFiles([]);
        onClose();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

        const newFiles: PendingFile[] = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            if (!isFileTypeAllowed(file)) {
                showAlert(`File ${file.name} không đúng định dạng ảnh/video`, "error");
                setUploading(false);
                continue;
            }
            if (!isFileSizeValid(file, 10)) { // Max 10MB
                showAlert(`File ${file.name} quá lớn (Max 10MB)`, "error");
                setUploading(false);
                continue;
            }

            try {
                const hash = await calculateFileHash(file);

                const isDuplicateLocal = pendingFiles.some(f => f.hash === hash) || newFiles.some(f => f.hash === hash);
                if (isDuplicateLocal) {
                    showAlert(`Ảnh ${file.name} đã được chọn rồi.`, "warning");
                    setUploading(false);
                    continue;
                }

                const isValid = await validateImageHash(hash);

                if (!isValid) {
                    showAlert(`Ảnh ${file.name} đã tồn tại trong lịch sử của sản phẩm này.`, "error");
                    setUploading(false);
                    continue; // Bỏ qua, không add vào list
                }

                newFiles.push({
                    file,
                    hash,
                    preview: URL.createObjectURL(file),
                    type: file.type.startsWith("video") ? "VIDEO" : "IMAGE"
                });
            } catch (error) {
                console.error("Lỗi xử lý file:", error);
                showAlert("Không thể xử lý file " + file.name, "error");
            } finally {
                setUploading(false);
            }
        }

        if (newFiles.length > 0) {
            setPendingFiles(prev => [...prev, ...newFiles]);
        }
        event.target.value = "";
    };

    const removeFile = (index: number) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (isAccept === null) {
            showAlert("Vui lòng chọn Đồng ý hoặc Từ chối", "info");
            return;
        }

        // Nếu đồng ý nhưng không có ảnh/video đóng gói
        if (isAccept && pendingFiles.length === 0) {
            showAlert("Vui lòng upload ít nhất 1 ảnh/video đóng gói", "error");
            return;
        }

        // Nếu từ chối nhưng không có lý do
        if (!isAccept && !note.trim()) {
            showAlert("Vui lòng nhập lý do từ chối", "error");
            return;
        }

        setUploading(true);
        try {
            const uploadedResources = await Promise.all(
                pendingFiles.map(async (pf) => {
                    const result = await uploadMedia(pf.file);
                    return {
                        url: result.url,
                        type: result.type as MediaType,
                        fileHash: pf.hash,
                    };
                })
            );

            const request: OwnerConfirmationRequest = {
                bookingId,
                isAccepted: isAccept,
                deliveryNote: isAccept ? note : undefined,
                packagingMediaUrls: uploadedResources
            };

            await mutation.mutateAsync(request);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {/* Alert */}
            {alert && (
                <PrimaryAlert
                    content={alert.content}
                    type={alert.type}
                    duration={alert.duration}
                    onClose={() => setAlert(null)}
                />
            )}

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

                            {pendingFiles.length > 0 && (
                                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mt: 3 }}>
                                    {pendingFiles.map((pf, i) => (
                                        <Box key={i} sx={{ position: "relative" }}>
                                            {pf.type === "VIDEO" ? (
                                                <video src={pf.preview} controls className="w-full h-32 object-cover rounded-lg" />
                                            ) : (
                                                <img src={pf.preview} alt="" className="w-full h-32 object-cover rounded-lg" />
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
        </>
    );
}