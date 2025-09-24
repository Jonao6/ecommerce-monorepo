"use client"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
	id: string;
	name: string;
	price: number;
	url: string;
	quantity: number;
	size: number;
	color: string;
}

export interface CartState {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (id: string) => void;
	clear: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			items: [],
			addItem: (item) =>
				set((state) => {
					const exists = state.items.find((i) => i.id === item.id);
					if (exists) {
						return {
							items: state.items.map((i) =>
								i.id === item.id
									? { ...i, quantity: i.quantity + item.quantity }
									: i,
							),
						};
					}
					return { items: [...state.items, item] };
				}),
			removeItem: (id) =>
				set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
			clear: () => set({ items: [] }),
		}),
		{
			name: 'cart-storage',
		},
	),
);
