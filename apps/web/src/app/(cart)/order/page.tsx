import getStates from '@/features/cart/action/get-states';
import { CartOrder } from '@/features/cart/components/cart-order';

export default async function Cart() {
	const states = await getStates();
	return (
		<main>
			<CartOrder states={states} />
		</main>
	);
}
