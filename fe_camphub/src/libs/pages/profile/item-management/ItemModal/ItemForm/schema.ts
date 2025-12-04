import {z} from "zod";

export const ItemSchema = z.object({
  name: z.string().min(5, "Tên ít nhất 5 ký tự").max(100),
  description: z.string().max(2000).optional(),
  price: z.number().positive("Giá phải > 0").max(10_000_000),
  quantity: z.number().int().min(1).max(999),
  depositAmount: z.number().min(0).max(50_000_000),
  categoryId: z.string().uuid("Danh mục không hợp lệ"),
  mediaUrls: z.array(z.object({ url: z.string().url(), type: z.enum(["IMAGE", "VIDEO"]) }))
    .min(1, "Phải có ít nhất 1 ảnh/video")
    .max(10, "Tối đa 10 ảnh/video"),
});

export type ItemFormValues = z.infer<typeof ItemSchema>;