export interface CartItemResponse {
    id: string;         // UUID
    cartId: string;     // UUID
    itemId: string;     // UUID

    itemName: string;
    itemImage: string;
    
    quantity: number;
    rentalDays: number;
    price: number;      // BigDecimal -> number
    subtotal: number;   // BigDecimal -> number
}
