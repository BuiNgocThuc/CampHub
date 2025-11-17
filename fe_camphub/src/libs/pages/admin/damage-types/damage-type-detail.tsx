"use client";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { DamageType } from "@/libs/core/types";

interface DamageTypeFormProps {
    initialData?: DamageType | null;
    onSave: (data: DamageType) => void;
    onCancel: () => void;
}

export default function DamageTypeForm({ initialData, onSave, onCancel }: DamageTypeFormProps) {
    const [formData, setFormData] = useState<DamageType>(
        initialData || {
            id: "",
            name: "",
            description: "",
            compensationRate: 0,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    );

    const handleChange = (field: keyof DamageType, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name) {
            alert("Tên loại hư tổn không được để trống");
            return;
        }
        onSave({ ...formData, updatedAt: new Date().toISOString() });
    };

    return (
        <div className="space-y-4">
            <TextField
                fullWidth
                label="Tên loại hư tổn"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={2}
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
            />
            <TextField
                fullWidth
                type="number"
                label="Tỷ lệ bồi thường (%)"
                value={formData.compensationRate * 100}
                onChange={(e) =>
                    handleChange("compensationRate", Number(e.target.value) / 100)
                }
            />

            <div className="flex justify-end space-x-3 pt-2">
                <Button variant="outlined" onClick={onCancel}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Lưu
                </Button>
            </div>
        </div>
    );
}
