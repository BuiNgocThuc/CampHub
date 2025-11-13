export interface CartItem {
  id: string;             // UUID
  cartId: string;         // liên kết đến giỏ hàng
  itemId: string;         // ID của sản phẩm thuê
  quantity: number;       // số lượng sản phẩm
  rentalDays: number;     // số ngày thuê
  price: number;          // giá thuê / 1 ngày tại thời điểm thêm
  subtotal: number;       // = price * quantity * rentalDays
}
