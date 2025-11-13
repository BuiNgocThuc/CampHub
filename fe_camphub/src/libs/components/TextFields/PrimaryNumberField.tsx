"use client";
import { TextField } from '@mui/material'
import React from 'react'

interface PrimaryNumberFieldProps {
    label: string | React.ReactNode
    value?: number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
    error?: boolean
    helperText?: string
    className?: string
    disabled?: boolean
    size?: 'small' | 'medium'
    sx?: React.CSSProperties // Uncomment if you want to allow custom styles
}

const PrimaryNumberField: React.FC<PrimaryNumberFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    error = false,
    helperText = '',
    className = '',
    disabled = false,
    size = 'medium',
    sx = {},
}) => {
    return (
        <TextField
            type="number"
            className={`primary-number-field ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            label={label}
            variant="outlined"
            size={size}
            error={error}
            helperText={helperText}
            fullWidth
            slotProps={{
                input: {
                    sx: {
                        "-moz-appearance": "textfield", // Firefox
                        "&::-webkit-outer-spin-button": {
                            "-webkit-appearance": "none",
                            margin: 0,
                        },
                        "&::-webkit-inner-spin-button": {
                            "-webkit-appearance": "none",
                            margin: 0,
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
        />
    );
}

export default PrimaryNumberField
