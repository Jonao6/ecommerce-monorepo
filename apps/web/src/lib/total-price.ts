import { CartItem } from '@/store/cart-store';

export const totalPrice = (items: CartItem[]): number => {
	return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};
