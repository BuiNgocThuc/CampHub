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
    render?: (row: T) => ReactNode; // dùng row kiểu T
}

export interface PrimaryTableProps<T> {
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
                                className="font-semibold"
                                style={{ width: col.width }}
                            >
                                {col.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            hover
                            onClick={() => onRowClick?.(row)}
                            className="cursor-pointer"
                        >
                            {columns.map((col) => (
                                <TableCell key={String(col.field)}>
                                    {col.render
                                        ? col.render(row)
                                        : (row as any)[col.field]} {/* fallback nếu không có render */}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
