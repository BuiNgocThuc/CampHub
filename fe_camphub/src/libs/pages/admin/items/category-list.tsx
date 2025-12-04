// app/admin/items/CategoryList.tsx
"use client";

import { useState } from "react";
import { PrimaryDataGrid, PrimaryModal, PrimaryTextField, PrimaryButton, CustomizedButton, OutlineButton } from "@/libs/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "@/libs/api/category-api";
import { Category } from "@/libs/core/types";
import { toast } from "sonner";
import { Box, CircularProgress, Typography } from "@mui/material";

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

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Danh mục sản phẩm</Typography>
        <PrimaryButton
          content="Thêm danh mục"
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        />
      </Box>

      <PrimaryDataGrid<Category>
        rows={categories}
        columns={[
          { field: "name", headerName: "Tên danh mục", width: 300 },
          { field: "description", headerName: "Mô tả", width: 500 },
          {
            field: "actions",
            headerName: "Thao tác",
            width: 200,
            renderCell: (params) => (
              <div className="flex gap-2">
                <PrimaryButton
                  content="Sửa"
                  size="small"
                  onClick={() => {
                    setSelected(params.row);
                    setOpen(true);
                  }}
                />
                <CustomizedButton
                  color="red"
                  content="Xóa"
                  size="small"
                  onClick={() => {
                    if (confirm(`Xóa danh mục "${params.row.name}"?`)) {
                      deleteMutation.mutate(params.row.id);
                    }
                  }}
                />
              </div>
            ),
          },
        ]}
        loading={isLoading}
        getRowId={(r) => r.id}
      />

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