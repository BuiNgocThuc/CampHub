export interface Category {
    id: string;             // UUID
    name: string;           // tên danh mục
    description?: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
