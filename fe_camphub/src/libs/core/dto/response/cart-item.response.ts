export interface CartItemResponse {
    id: string;         // UUID
    cartId: string;     // UUID
    itemId: string;     // UUID

    itemName: string;
    itemImage: string;

    depositAmount: number;
    
    quantity: number;
    rentalDays: number;
    price: number;      // BigDecimal -> number
    subtotal: number;   // BigDecimal -> number

    isAvailable: boolean;
}
