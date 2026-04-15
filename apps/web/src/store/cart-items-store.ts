import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/interfaces/store.interface';

interface CartItemsState {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clear: () => void;
}

export const useCartItemsStore = create<CartItemsState>()(
	persist(
		(set) => ({
			items: [],
			addItem: (item) =>
				set((state) => {
					const exists = state.items.find(
						(i) =>
							i.id === item.id &&
							i.color === item.color &&
							i.size === item.size,
					);
					if (exists) {
						return {
							items: state.items.map((i) =>
								i.id === exists.id
									? { ...i, quantity: i.quantity + item.quantity }
									: i,
							),
						};
					}
					return { items: [...state.items, item] };
				}),
			removeItem: (id) =>
				set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
			updateQuantity: (id, quantity) =>
				set((state) => ({
					items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
				})),
			clear: () => set({ items: [] }),
		}),
		{
			name: 'cart-items-storage',
		},
	),
);

export const useCartItems = () => useCartItemsStore((state) => state.items);
export const useCartCount = () =>
	useCartItemsStore((state) => state.items.length);
export const useAddCartItem = () => useCartItemsStore((state) => state.addItem);
export const useRemoveCartItem = () =>
	useCartItemsStore((state) => state.removeItem);
export const useClearCart = () => useCartItemsStore((state) => state.clear);
