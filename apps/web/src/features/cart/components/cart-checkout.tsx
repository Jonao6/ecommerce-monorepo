'use client';
import { Button } from '@/components/ui/button';
import { totalPrice } from '@/lib/total-price';
import { useCartStore } from '@/store/cart-store';
import { DollarSign, LucideBadgeEuro } from 'lucide-react';
import { CartItems } from './ui/cart-items';

const DELIVERY_TAXES_PORCENTAGE = 0.03;

export const CartCheckout = () => {
	const { items } = useCartStore();
	const subTotal = totalPrice(items);
	const delivery = items.length > 0 ? DELIVERY_TAXES_PORCENTAGE * subTotal : 0;
	const total = subTotal + delivery;

	return (
		<div className="flex flex-row">
			<div className="flex-col">
				<h1>SEU CARRINHO</h1>
				<CartItems items={items} />
			</div>
			<div className="flex flex-col">
				<h2>Resumo do pedido</h2>
				<ul>
					<li>
						<h3>Produtos</h3>
						<h3>{items.length}</h3>
					</li>
					<li>
						<h3>Entrega</h3>
						<h3>{delivery}</h3>
					</li>
					<li>
						<h3>Total</h3>
						<h3>{`R$${total}`}</h3>
					</li>
				</ul>
				<Button>
					<span>FINALIZAR</span>
					<DollarSign size={7} />
				</Button>
				<div>
					<h4>Métodos de pagamento aceitos</h4>
					<LucideBadgeEuro />
				</div>
			</div>
		</div>
	);
};
