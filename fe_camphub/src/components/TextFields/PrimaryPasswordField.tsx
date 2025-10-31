"use client";

import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PrimaryPasswordFieldProps {
  label: string | React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  size?: "small" | "medium";
}

const PrimaryPasswordField: React.FC<PrimaryPasswordFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
  helperText = "",
  size = "medium",
  disabled = false,
  onBlur = () => {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth
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
          color: error ? "red" : "#6b7280",
          marginTop: "4px",
        },
        "& .MuiInputLabel-asterisk": {
          display: "none",
        },
      }}
      size={size}
    >
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        error={error}
        disabled={disabled}
        size={size}
        onBlur={onBlur}
        endAdornment={
          !disabled && (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
        label={label}
      />
      {helperText ? (
        <span
          className="text-[12px] mt-1"
          style={{ color: error ? "red" : "#6b7280", marginLeft: 8 }}
        >
          {helperText}
        </span>
      ) : null}
    </FormControl>
  );
};

export default PrimaryPasswordField;
