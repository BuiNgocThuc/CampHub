// PrimaryTable.tsx
"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { ReactNode } from "react";

export interface Column<T> {
    field: keyof T | string;
    headerName: string;
    width?: number;
    // Cho phép render nhận cả index (rất cần cho STT)
    render?: (row: T, index: number) => ReactNode;
}

export interface PrimaryTableProps<T extends { id: string | number }> {
    columns: Column<T>[];
    rows: T[];
    onRowClick?: (row: T) => void;
}

export default function PrimaryTable<T extends { id: string | number }>({
    columns,
    rows,
    onRowClick,
}: PrimaryTableProps<T>) {
    return (
        <TableContainer component={Paper} className="rounded-xl shadow-sm">
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={String(col.field)}
                                className="font-semibold text-gray-700"
                                style={{ width: col.width }}
                                align="center"
                            >
                                {col.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={row.id}
                            hover
                            onClick={() => onRowClick?.(row)}
                            className="cursor-pointer transition-colors"
                        >
                            {columns.map((col) => (
                                <TableCell key={String(col.field)} align="center">
                                    {col.render
                                        ? col.render(row, index)
                                        : (row as any)[col.field]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}