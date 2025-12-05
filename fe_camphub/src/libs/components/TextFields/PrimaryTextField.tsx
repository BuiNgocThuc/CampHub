"use client";

import { TextField } from '@mui/material';
import React from 'react'

interface PrimaryTextFieldProps {
  label: string | React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  slotProps?: {};
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  type?: string;
}

const PrimaryTextField: React.FC<PrimaryTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
  helperText = "",
  className = "",
  disabled = false,
  multiline = false,
  size = "medium",
  slotProps = {},
  onBlur = () => {},
  type = "text",
}) => {
  // Only allow "small" or "medium" for MUI TextField
  return (
    <TextField
      size={size}
      className={className}
      required={required}
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      disabled={disabled}
      slotProps={slotProps}
      onBlur={onBlur}
      multiline={multiline}
      type={type}
      sx={{
        // marginBottom: "1.5rem",
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
          position: "absolute",
          top: "-2.5rem", // adjust as needed
          left: 0,
          color: error ? "red" : "#6b7280",
          margin: 0,
          fontSize: "0.75rem",
        },
        "& .MuiInputLabel-asterisk": {
          display: "none",
        },
      }}
    />
  );
};

export default PrimaryTextField;
