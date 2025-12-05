"use client";

import React from "react";
import { TextField, MenuItem } from "@mui/material";

interface PrimarySelectFieldProps {
    label: string | React.ReactNode;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options: { value: string; label: string; disabled?: boolean }[];
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string | React.ReactNode;
    size?: "small" | "medium";
    sx?: React.CSSProperties; // Uncomment if you want to allow custom styles
}

const PrimarySelectField: React.FC<PrimarySelectFieldProps> = ({
    label,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    error = false,
    helperText = "",
    size = "medium",
}) => {
    if (!options) {
        throw new Error("Options is required for select field");
    }

    return (
        <TextField
            select
            required={required}
            label={label}
            variant="outlined"
            fullWidth
            size={size}
            value={value}
            onChange={onChange}
            disabled={disabled}
            error={error}
            helperText={helperText}
            slotProps={{
                select: {
                    MenuProps: {
                        PaperProps: {
                            sx: {
                                maxHeight: 200,
                                overflowY: "auto",
                                marginTop: 1,
                            },
                        },
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                        },
                    },
                },
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: error ? "red" : disabled ? "#e5e7eb" : "#d1d5db",
                    },
                    "&:hover fieldset": {
                        borderColor: error ? "red" : disabled ? "#e5e7eb" : "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: error ? "red" : disabled ? "#e5e7eb" : "#3b82f6",
                    },
                    "&.Mui-disabled fieldset": {
                        borderColor: error ? "red" : "#e5e7eb",
                    },
                },
                "& .MuiInputLabel-root": {
                    color: error ? "red" : disabled ? "#D6D6D6" : "#6b7280",
                    "&.Mui-disabled": {
                        color: error ? "red" : "#D6D6D6",
                    },
                },
                "& .MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                    color: error ? "red" : disabled ? "#9ca3af" : "#3b82f6",
                },
                "& .MuiFormHelperText-root": {
                    color: error ? "red" : "#6b7280",
                    marginTop: "4px",
                },
                "& .MuiInputLabel-asterisk": {
                    display: "none",
                },
            }}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default PrimarySelectField;
