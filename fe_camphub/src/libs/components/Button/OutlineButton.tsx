"use client";

import { Button } from "@mui/material";

interface OutlineBtnProps {
    content: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
    sx?: React.CSSProperties;
    size?: "small" | "medium" | "large";
}

const OutlineButton: React.FC<OutlineBtnProps> = ({
    content,
    type = "button",
    onClick,
    disabled = false,
    icon = null,
    className = "",
    sx = {},
    size = "medium",
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
            variant="outlined"
            type={type}
            onClick={onClick}
            disabled={disabled}
            startIcon={icon}
            className={className}
            sx={{
                textTransform: "none",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                color: "#2962FF",
                border: "1px solid #2962FF",
                fontWeight: 600,
                ":hover": {
                    opacity: 0.7,
                },
                ...sizeStyles[size],
                ...sx,
            }}
        >
            {content}
        </Button>
    );
};

export default OutlineButton;
