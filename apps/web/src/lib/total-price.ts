import { CartItem } from '@/store/cart-store';

export const totalPrice = (items: CartItem[] | undefined | null): number => {
	if (!items || !Array.isArray(items)) return 0;

	return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};
