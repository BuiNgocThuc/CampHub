// libs/components/PrimaryNumberField.tsx
"use client";

import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

interface PrimaryNumberFieldProps extends Omit<TextFieldProps, 'variant'> {
    label: string | React.ReactNode;
    // Cho phép truyền min, max, step như cũ
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const PrimaryNumberField: React.FC<PrimaryNumberFieldProps> = ({
    label,
    inputProps,
    slotProps,
    sx,
    ...rest
}) => {
    return (
        <TextField
            type="number"
            label={label}
            variant="outlined"
            fullWidth
            slotProps={{
                input: {
                    sx: {
                        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                        },
                        "&[type=number]": {
                            MozAppearance: "textfield",
                        },
                    },
                    ...(inputProps || {}),
                    ...(slotProps?.input || {}),
                } as any, 
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: rest.error ? "red" : "#d1d5db" },
                    "&:hover fieldset": { borderColor: rest.error ? "red" : "#9ca3af" },
                    "&.Mui-focused fieldset": { borderColor: rest.error ? "red" : "#3b82f6" },
                },
                ...sx,
            }}
            {...rest}
        />
    );
};

export default PrimaryNumberField;