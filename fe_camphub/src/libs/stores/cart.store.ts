// libs/stores/cart.store.ts
import { create } from "zustand";
import { toast } from "sonner";
import {
    addItemToCart,
    getCartItems,
    removeCartItem,
    patchCartItem,
    clearCart,
    getCountOfCartItems,
    validateQuantity,
} from "@/libs/api/cart-api";
import { CartItem } from "@/libs/core/types";
import { useAuthStore } from "./auth.store";

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    isFetching: boolean;
    count: number;

    // Lấy giỏ hàng từ server
    fetchCart: () => Promise<void>;

    // Lấy số lượng items trong cart
    fetchCartCount: () => Promise<void>;

    // Thêm vào giỏ (gọi API thật)
    addToCart: (
        itemId: string,
        rentalDays: number,
        price: number,
        itemName: string,
        itemImage: string,
        quantity?: number
    ) => Promise<void>;

    // Cập nhật số ngày thuê
    updateRentalDays: (cartItemId: string, rentalDays: number) => Promise<void>;

    // Cập nhật số lượng
    updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;

    // Xóa 1 item
    removeFromCart: (cartItemId: string) => Promise<void>;

    // Xóa toàn bộ
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isLoading: false,
    isFetching: false,
    count: 0,

    fetchCart: async () => {
        set({ isFetching: true });
        try {
            const items = await getCartItems();
            set({ items, count: items.length });
            // Không hiển thị toast khi fetch tự động để tránh spam
        } catch (error: any) {
            toast.error("Không thể tải giỏ hàng");
            console.error(error);
        } finally {
            set({ isFetching: false });
        }
    },

    fetchCartCount: async () => {
        try {
            const count = await getCountOfCartItems();
            set({ count });
            // Không cập nhật user để tránh vòng lặp - Header đã lấy cartCount trực tiếp từ cart store
        } catch (error: any) {
            console.error("Failed to fetch cart count:", error);
        }
    },

    addToCart: async (itemId, rentalDays, price, itemName, itemImage, quantity = 1) => {
        set({ isLoading: true });
        try {
            // Gọi API thật - backend sẽ xử lý logic (thêm mới hoặc update nếu đã có)
            const newItem = await addItemToCart({
                itemId,
                quantity: quantity,
                rentalDays,
                price,
            });

            // Dùng response từ API (đã có đầy đủ thông tin từ backend)
            // Backend có thể trả về item mới hoặc item đã update (nếu itemId đã tồn tại)
            set((state) => {
                // Check bằng cả id (nếu backend update item cũ) và itemId (nếu backend tạo mới)
                const existingById = state.items.findIndex((i) => i.id === newItem.id);
                const existingByItemId = state.items.findIndex((i) => i.itemId === newItem.itemId);

                if (existingById >= 0) {
                    // Item đã tồn tại với cùng id, update nó
                    const updatedItems = [...state.items];
                    updatedItems[existingById] = newItem;
                    return { items: updatedItems };
                } else if (existingByItemId >= 0) {
                    // Item với cùng itemId đã tồn tại nhưng id khác (backend update item cũ)
                    // Thay thế item cũ bằng item mới từ backend
                    const updatedItems = [...state.items];
                    updatedItems[existingByItemId] = newItem;
                    return { items: updatedItems };
                } else {
                    // Item mới, thêm vào
                    return { items: [...state.items, newItem] };
                }
            });

            // Cập nhật count sau khi thêm thành công
            await get().fetchCartCount();

            toast.success(`Đã thêm "${itemName}" vào giỏ hàng!`);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Không thể thêm vào giỏ";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateRentalDays: async (cartItemId, rentalDays) => {
        set({ isLoading: true });
        try {
            // Gọi API thật và dùng response từ server
            const updated = await patchCartItem({ rentalDays }, cartItemId);

            // Dùng data từ API response (đã tính toán subtotal từ backend)
            set((state) => ({
                items: state.items.map((i) =>
                    i.id === cartItemId ? updated : i
                ),
            }));
            toast.success("Cập nhật số ngày thành công");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Không thể cập nhật";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateQuantity: async (cartItemId, quantity) => {
        set({ isLoading: true });
        try {
            // Kiểm tra số lượng trước khi cập nhật
            const isValid = await validateQuantity(cartItemId, quantity);
            if (!isValid) {
                toast.error("Số lượng không đủ. Vui lòng chọn số lượng nhỏ hơn.");
                throw new Error("Insufficient item quantity");
            }

            const updated = await patchCartItem({ quantity }, cartItemId);

            // Dùng data từ API response (đã tính toán subtotal từ backend)
            set((state) => ({
                items: state.items.map((i) =>
                    i.id === cartItemId ? updated : i
                ),
            }));
            await get().fetchCartCount();
            toast.success("Cập nhật số lượng thành công");
        } catch (error: any) {
            if (error?.message !== "Insufficient item quantity") {
                const errorMessage = error?.response?.data?.message || error?.message || "Không thể cập nhật số lượng";
                toast.error(errorMessage);
            }
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    removeFromCart: async (cartItemId) => {
        set({ isLoading: true });
        try {
            await removeCartItem(cartItemId);
            set((state) => ({
                items: state.items.filter((i) => i.id !== cartItemId),
            }));
            // Cập nhật count sau khi xóa thành công
            await get().fetchCartCount();
            toast.success("Đã xóa khỏi giỏ hàng");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Không thể xóa";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    clearCart: async () => {
        set({ isLoading: true });
        try {
            await clearCart();
            set({ items: [], count: 0 });
            // Cập nhật count sau khi clear thành công
            await get().fetchCartCount();
            toast.success("Đã làm trống giỏ hàng");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Không thể làm trống giỏ hàng";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));