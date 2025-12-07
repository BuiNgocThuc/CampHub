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
        <Paper elevation={0} sx={{ borderRadius: 0, overflow: "hidden", boxShadow: "none", height: "100%" }}>
            <Box sx={{ height: "100%", width: "100%" }}>
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
                        "& .MuiDataGrid-main": {
                            overflowX: "hidden",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflowX: "hidden !important",
                        },
                        "& .MuiDataGrid-cell": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                        "& .MuiTablePagination-root": {
                            justifyContent: "flex-start !important",
                        },
                        "& .MuiTablePagination-toolbar": {
                            padding: "0",
                            marginTop: "10px",
                        },
                        "& .MuiTablePagination-spacer": {
                            flex: "0 0 auto !important",
                        },
                    }}
                    disableColumnResize
                    disableColumnMenu
                />
            </Box>
        </Paper>
    );
}