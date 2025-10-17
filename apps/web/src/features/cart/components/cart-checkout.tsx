'use client';
import { Button } from '@/components/ui/button';
import { totalPrice } from '@/lib/total-price';
import { useCartStore } from '@/store/cart-store';
import { DollarSign, LucideBadgeEuro } from 'lucide-react';
import { CartItems } from './ui/cart-items';
import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_ORDER_MUTATION } from '../api/create-order';
import { useOrderStore } from '@/store/order-store';
import { GET_USER } from '../api/get-user';

interface CreateOrderData {
	createOrder: {
		id: string;
	};
}

interface CreateOrderVariables {
	input: {
		userId: string;
		items: {
			productId: string;
			quantity: number;
			color: string;
			size: number;
		}[];
		totalAmount: number;
		shippingAddress?: object;
		deliveryOption?: string;
	};
}

export interface MeData {
  me: {
    id: string;
  };
}

export const CartCheckout = () => {
	const { items } = useCartStore();
	const { data } =  useQuery<MeData>(GET_USER)
	const userId = data?.me?.id
	const total = totalPrice(items);
	const { setOrderId } = useOrderStore();
	const [createOrder, { loading }] = useMutation<
		CreateOrderData,
		CreateOrderVariables
	>(CREATE_ORDER_MUTATION);
	const handleCheckout = async () => {
		if(items.length <= 0) return;
		const { data } = await createOrder({
			variables: {
				input: {
					userId: userId as string,
					items: items.map((item) => ({
						productId: item.id,
						quantity: item.quantity,
						color: item.color,
						size: item.size,
					})),
					totalAmount: total,
				},
			},
		});
		if(data?.createOrder.id) {
			setOrderId(data.createOrder.id)
		}
	};
	return (
		<div className="flex flex-row w-full h-full justify-between px-96 py-12 self-stretch gap-15">
			<div className="flex-col w-full">
				<h1 className="font-barlow-semi-condensed text-4xl font-bold mb-16">
					SEU CARRINHO
				</h1>
				<CartItems items={items} />
			</div>
			<div className="w-full font-inter text-lg font-normal tracking-wide w-ful px-12 py-20">
				<h2 className="font-barlow-semi-condensed font-bold text-2xl text-left mb-5">
					Resumo do pedido
				</h2>
				<ul className="flex flex-col gap-3">
					<li className="flex flex-row justify-between">
						<h3>Produtos</h3>
						<h3>{items.length}</h3>
					</li>
					<li className="flex flex-row justify-between">
						<h3>Total</h3>
						<h3>{`R$${total.toFixed(2)}`}</h3>
					</li>
				</ul>
				<Button
					className="text-xl mt-20 h-11 w-full px-2"
					onClick={handleCheckout}
					disabled={loading}
				>
					<Link
						href={'/order'}
						className=" flex flex-row justify-between items-center w-full px-6"
					>
						<span className="font-barlow-semi-condensed text-xl">
							FINALIZAR
						</span>
						<DollarSign size={24} />
					</Link>
				</Button>
				<div className="mt-3.5">
					<h4 className="font-barlow-semi-condensed text-base">
						Métodos de pagamento aceitos
					</h4>
					<LucideBadgeEuro />
				</div>
			</div>
		</div>
	);
};
