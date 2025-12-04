export interface CartItem {
    id: string;         // UUID
    cartId: string;     // UUID
    itemId: string;     // UUID

    itemName: string;
    itemImage: string;

    depositAmount: number;
    isAvailable: boolean;
    
    quantity: number;
    rentalDays: number;
    price: number;      // BigDecimal -> number
    subtotal: number;   // BigDecimal -> number
}
