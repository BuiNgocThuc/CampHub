'use client'

import { Button } from "@mui/material";
import React from "react";

interface CustomizedBtnProps {
  content: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  sx?: React.CSSProperties;
  size?: "small" | "medium" | "large";
  color?: string;
}

const CustomizedButton: React.FC<CustomizedBtnProps> = ({
  content,
  type = "button",
  onClick,
  disabled = false,
  icon = null,
  className = "",
  sx = {},
  size = "medium",
  color = "#2962FF",
}) => {
  const sizeStyles = {
    small: {
      minWidth: "100px",
      height: "32px",
      fontSize: "14px",
      padding: "4px 12px",
    },
    medium: {
      minWidth: "120px",
      height: "40px",
      fontSize: "16px",
      padding: "6px 16px",
    },
    large: {
      minWidth: "140px",
      height: "48px",
      fontSize: "18px",
      padding: "8px 20px",
    },
  };

  return (
    <Button
      variant="contained"
      type={type}
      onClick={onClick}
      disabled={disabled}
      startIcon={icon}
      className={className}
      sx={{
        textTransform: "none",
        backgroundColor: color,
        ":hover": {
          opacity: 0.8,
        },
        ...sizeStyles[size],
        ...sx,
      }}
    >
      {content}
    </Button>
  );
};

export default CustomizedButton;
