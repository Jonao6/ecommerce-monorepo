'use client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CartItems } from '@/features/cart/components/ui/cart-items';
import { MeDocument, MeQuery } from '@/gql/graphql';
import { totalPrice } from '@/lib/total-price';
import { useCartStore } from '@/store/cart-store';
import { useOrderStore } from '@/store/order-store';
import { useQuery } from '@apollo/client/react';
import { DollarSign, LucideBadgeEuro } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import { useCreateOrder } from '../hooks/use-create-order';

export interface MeData {
	me: {
		id: string;
	};
}

export const CartCheckout = () => {
	const { items } = useCartStore();
	const { setOrderId } = useOrderStore();
	const { createOrder, loading: orderLoading } = useCreateOrder();
	const { data: userData, loading: userLoading } =
		useQuery<MeQuery>(MeDocument);
	const userId = userData?.me?.id;

	if (!userId) {
		toast.error('Falha ao achar o usuário');
		return;
	}

	const total = totalPrice(items);
	const handleCheckout = async () => {
		if (!userId) {
			toast.error('Usuário não identificado. Aguarde ou faça login.');
			return;
		}

		if (items.length === 0) {
			toast.error('Seu carrinho está vazio.');
			return;
		}

		const orderResult = await createOrder({
			userId,
			items,
			total,
		});

		if (!orderResult.success) {
			toast.error(orderResult.error.message);
			return;
		}

		setOrderId(orderResult.orderId);
		toast.success('Pedido criado com sucesso!');
	};

	const isCartEmpty = items.length === 0;
	const isSubmitDisabled = orderLoading || userLoading || isCartEmpty;

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
						<h3>{(items || []).length}</h3>
					</li>
					<li className="flex flex-row justify-between">
						<h3>Total</h3>
						<h3>{`R$${Number(total || 0).toFixed(2)}`}</h3>
					</li>
				</ul>
				<Button
					className="text-xl mt-20 h-11 w-full px-2"
					onClick={handleCheckout}
					disabled={isSubmitDisabled}
					aria-disabled={isSubmitDisabled}
				>
					<Link
						href={'/order'}
						className=" flex flex-row justify-between items-center w-full px-6"
					>
						{orderLoading ? (
							<>
								<Spinner className="mr-2" />
							</>
						) : (
							<>
								<span className="font-barlow-semi-condensed text-xl">
									FINALIZAR
								</span>
								<DollarSign size={24} />
							</>
						)}
					</Link>
				</Button>
				<div className="mt-3.5">
					<h4 className="font-barlow-semi-condensed text-base">
						Métodos de pagamento aceitos
					</h4>
					<LucideBadgeEuro />
				</div>
			</div>
			<Toaster />
		</div>
	);
};
