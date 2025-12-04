"use client";
interface ItemDescriptionProps {
  description: string;
  depositAmount: number;
}

export default function ItemDescription({
  description,
  depositAmount,
}: ItemDescriptionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <h2 className="text-lg font-semibold">Mô tả sản phẩm</h2>
      <p className="text-gray-700">{description}</p>
      <div className="text-gray-600">
        <span className="font-medium">Tiền cọc:</span>{" "}
        {depositAmount.toLocaleString()}đ
      </div>
    </div>
  );
}
