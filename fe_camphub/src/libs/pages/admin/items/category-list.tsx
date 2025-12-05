// app/admin/items/CategoryList.tsx
"use client";

import { useState } from "react";
import { PrimaryDataGrid, PrimaryModal, PrimaryTextField, PrimaryButton, OutlineButton } from "@/libs/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "@/libs/api/category-api";
import { Category } from "@/libs/core/types";
import { toast } from "sonner";
import { Box, CircularProgress, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export default function CategoryList() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Mutation cho tạo/sửa
  const mutation = useMutation({
    mutationFn: (category: Category) => selected ? updateCategory(category) : createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(selected ? "Cập nhật thành công!" : "Tạo danh mục thành công!");
      setOpen(false);
      setSelected(null);
    },
    onError: () => toast.error("Có lỗi xảy ra!"),
  });

  // Mutation cho xóa
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Xóa danh mục thành công!");
    },
    onError: () => toast.error("Không thể xóa danh mục đang có sản phẩm!"),
  });

  const columns: GridColDef<Category>[] = [
    { field: "name", headerName: "Tên danh mục", width: 250, flex: 1.2, minWidth: 200 },
    { field: "description", headerName: "Mô tả", width: 400, flex: 2, minWidth: 300 },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 120,
      flex: 0,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Category>) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="Sửa">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(params.row);
                setOpen(true);
              }}
            >
              <Edit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Xóa danh mục "${params.row.name}"?`)) {
                  deleteMutation.mutate(params.row.id);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box className="bg-white rounded-2xl shadow-lg p-6" sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
          <Typography variant="h5" fontWeight="bold">Danh mục sản phẩm ({categories.length})</Typography>
          <PrimaryButton
            content="Thêm danh mục"
            className="text-sm px-3 py-1.5"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <PrimaryDataGrid<Category>
            rows={categories}
            columns={columns}
            loading={isLoading}
            getRowId={(r) => r.id}
          />
        </Box>
      </Box>

      <PrimaryModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        title={selected ? "Sửa danh mục" : "Tạo danh mục mới"}
      >
        <CategoryForm
          category={selected || { name: "", description: "" }}
          isLoading={mutation.isPending}
          onSave={(data) => {
            const payload = selected
              ? { ...data, id: selected.id } as Category
              : data as Category;
            mutation.mutate(payload);
          }}
          onCancel={() => {
            setOpen(false);
            setSelected(null);
          }}
        />
      </PrimaryModal>
    </>
  );
}

function CategoryForm({
  category,
  isLoading,
  onSave,
  onCancel,
}: {
  category: Partial<Category>;
  isLoading: boolean;
  onSave: (data: Partial<Category>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: category.name || "",
    description: category.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục!");
      return;
    }
    onSave(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <PrimaryTextField
          label="Tên danh mục *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Lều cắm trại, Bếp nướng,..."
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <PrimaryTextField
          label="Mô tả (tùy chọn)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          multiline
          placeholder="Mô tả ngắn về danh mục này..."
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <OutlineButton
          content="Hủy"
          onClick={onCancel}
          type="button"
        />
        <PrimaryButton
          content={category.id ? "Lưu thay đổi" : "Tạo danh mục"}
          type="submit"
          disabled={isLoading || !form.name.trim()}
          icon={isLoading ? <CircularProgress size={20} /> : undefined}
        />
      </Box>
    </Box>
  );
}