export interface DamageType {
    id: string;             // UUID
    name: string;           // tên loại hư hại
    description?: string | null;
    compensationRate: number; // tỷ lệ bồi thường
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
