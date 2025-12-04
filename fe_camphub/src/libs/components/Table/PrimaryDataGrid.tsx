// libs/components/PrimaryDataGrid.tsx
"use client";

import { DataGrid, GridColDef, GridRowsProp, GridRowId, GridValidRowModel, GridRowParams } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";

interface PrimaryDataGridProps<T extends GridValidRowModel> {
    rows: GridRowsProp<T>;
    columns: GridColDef<T>[];
    loading?: boolean;
    pageSize?: number;
    rowsPerPageOptions?: number[];
    onRowClick?: (row: T) => void;
    getRowId?: (row: T) => GridRowId;
}

export default function PrimaryDataGrid<T extends GridValidRowModel>({
    rows,
    columns,
    loading = false,
    pageSize = 10,
    rowsPerPageOptions = [10, 20, 50],
    
    onRowClick,
    getRowId,
}: PrimaryDataGridProps<T>) {
    return (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={rowsPerPageOptions}
                    getRowId={getRowId}
                    initialState={{
                        pagination: { paginationModel: { pageSize } },
                    }}
                    onRowClick={(params: GridRowParams<T>) => onRowClick?.(params.row as T)}
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#f5f9ff",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f8fafc",
                            fontWeight: "bold",
                            color: "#1e293b",
                        },
                    }}
                />
            </Box>
        </Paper>
    );
}