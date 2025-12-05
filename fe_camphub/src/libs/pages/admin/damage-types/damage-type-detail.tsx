// app/admin/damage-types/DamageTypeForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Chip, Stack, Divider } from "@mui/material";
import { DamageType } from "@/libs/core/types";
import { PrimaryButton, OutlineButton, PrimaryTextField, PrimaryNumberField } from "@/libs/components";

interface DamageTypeFormProps {
  initialData?: DamageType | null;
  onSave: (data: DamageType) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isCreate?: boolean;
}

export default function DamageTypeForm({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  isCreate = false,
}: DamageTypeFormProps) {
  const [formData, setFormData] = useState<DamageType>({
    id: "",
    name: "",
    description: "",
    compensationRate: 0.5, // mặc định 50%
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        compensationRate: 0.5,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof DamageType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return;
    }
    if (formData.compensationRate < 0 || formData.compensationRate > 1) {
      return;
    }
    onSave(formData);
  };

  const isViewMode = !isCreate && !!initialData;

  return (
    <Box sx={{ minWidth: 500, maxWidth: 600 }}>
      <Stack spacing={3}>
        {/* Tên loại hư tổn */}
        <Box>
          <PrimaryTextField
            label="Tên loại hư tổn"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
            required
            disabled={isLoading || isViewMode}
            placeholder="Ví dụ: Hư hỏng nhẹ, Hư hỏng nặng..."
          />
        </Box>

        {/* Mô tả */}
        <Box>
          <PrimaryTextField
            label="Mô tả (tùy chọn)"
            value={formData.description || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("description", e.target.value)}
            disabled={isLoading || isViewMode}
            multiline
            placeholder="Mô tả chi tiết về loại hư tổn này..."
            slotProps={{
              input: {
                rows: 3,
              },
            }}
          />
        </Box>

        {/* Tỷ lệ bồi thường */}
        <Box>
          <PrimaryNumberField
            label="Tỷ lệ bồi thường (%)"
            value={String((formData.compensationRate || 0) * 100)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("compensationRate", Number(e.target.value) / 100)
            }
            disabled={isLoading || isViewMode}
            inputProps={{ min: 0, max: 100, step: 5 }}
            helperText="Nhập từ 0 đến 100%"
          />
          {isViewMode && (
            <Box mt={1.5} display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ hiện tại:
              </Typography>
              <Chip
                label={`${((formData.compensationRate || 0) * 100).toFixed(0)}%`}
                color="primary"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Box>
          )}
        </Box>

        {/* Lưu ý khi xem */}
        {isViewMode && (
          <>
            <Divider />
            <Box
              p={2.5}
              bgcolor="warning.light"
              borderRadius={2}
              border="1px solid"
              borderColor="warning.main"
            >
              <Typography variant="body2" color="warning.dark" fontWeight="medium">
                ⚠️ Lưu ý: Loại hư tổn này không thể chỉnh sửa nếu đã được sử dụng trong khiếu nại.
              </Typography>
            </Box>
          </>
        )}

        {/* Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <OutlineButton
            content="Đóng"
            onClick={onCancel}
            disabled={isLoading}
          />
          {!isViewMode && (
            <PrimaryButton
              content={isLoading ? "Đang lưu..." : "Lưu"}
              onClick={handleSubmit}
              disabled={isLoading || !formData.name.trim()}
              icon={isLoading ? <CircularProgress size={20} /> : undefined}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}