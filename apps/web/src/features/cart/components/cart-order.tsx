'use client';

import { totalPrice } from '@/lib/total-price';
import { useCartStore } from '@/store/cart-store';
import type { IbgeState } from '../action/get-states';
import { CheckoutForm } from './form/checkout-form';
import { OrderSummary } from './ui/cart-order-summary';


interface CartOrderProps {
	states: IbgeState[];
}
const DELIVERY_TAXES_PORCENTAGE = 0.03;

export const CartOrder = ({ states }: CartOrderProps) => {
	const { items } = useCartStore();
	const subTotal = totalPrice(items);
	const delivery = items.length > 0 ? subTotal * DELIVERY_TAXES_PORCENTAGE : 0;
	const total = subTotal + delivery;
	const totalInCents = Math.round(total * 100);
	if (items.length === 0) {
		return (
			<div className="text-center py-20">
				<h1 className="text-2xl font-semibold">Seu carrinho está vazio.</h1>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8 font-inter">
			<header className="text-center mb-10">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900 font-barlow-semi-condensed">
					FINALIZAR COMPRA
				</h1>
			</header>
			<div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
					<CheckoutForm
						states={states}
						items={items}
						totalInCents={totalInCents}
						/>
				<aside className="lg-col-span-1">
					<OrderSummary
						total={total}
						quantity={items.length}
						delivery={delivery}
					/>
				</aside>
			</div>
		</div>
	);
};
