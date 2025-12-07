"use client";

import React, { useEffect } from "react";
import { Alert as MuiAlert, LinearProgress } from "@mui/material";

interface AlertProps {
  content: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration: number; // Duration in milliseconds
}

const Alert: React.FC<AlertProps> = ({ content, type, onClose, duration }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose]);

  const animationDuration = `${duration / 1000}s`; // Convert milliseconds to seconds
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1500,
        transform: "translateX(100%)",
        animation: "slideIn 0.3s forwards",
      }}
    >
      <MuiAlert
        severity={type}
        sx={{
          marginBottom: "2px",
          borderRadius: "8px",
          minWidth: "300px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {content}
      </MuiAlert>
      <LinearProgress
        variant="determinate"
        value={100}
        color={type}
        sx={{
          width: "100px",
          animation: `progress ${animationDuration} linear forwards`,
          borderRadius: "0 0 8px 8px",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      />
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes progress {
            from { width: 100%; }
            to { width: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default Alert;
