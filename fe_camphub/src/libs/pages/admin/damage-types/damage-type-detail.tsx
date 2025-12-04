// app/admin/damage-types/DamageTypeForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button, TextField, Box, CircularProgress } from "@mui/material";
import { DamageType } from "@/libs/core/types";

interface DamageTypeFormProps {
  initialData?: DamageType | null;
  onSave: (data: DamageType) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DamageTypeForm({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
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
    }
  }, [initialData]);

  const handleChange = (field: keyof DamageType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên loại hư tổn");
      return;
    }
    if (formData.compensationRate < 0 || formData.compensationRate > 1) {
      alert("Tỷ lệ bồi thường phải từ 0% đến 100%");
      return;
    }
    onSave(formData);
  };

  return (
    <Box sx={{ minWidth: 500 }}>
      <Box component="form" sx={{ spaceY: 3 }}>
        <TextField
          fullWidth
          label="Tên loại hư tổn"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Mô tả (tùy chọn)"
          multiline
          rows={3}
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          type="number"
          label="Tỷ lệ bồi thường (%)"
          value={formData.compensationRate * 100}
          onChange={(e) =>
            handleChange("compensationRate", Number(e.target.value) / 100)
          }
          InputProps={{
            inputProps: { min: 0, max: 100, step: 5 },
          }}
          helperText="Nhập từ 0 đến 100%"
          disabled={isLoading}
        />

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}