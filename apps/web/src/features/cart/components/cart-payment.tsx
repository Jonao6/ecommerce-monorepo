'use client';

import { useCartStore } from '@/store/cart-store';
import { useOrderStore } from '@/store/order-store';
import { useQuery } from '@apollo/client/react';
import { CircleCheck, CircleX } from 'lucide-react';
import { useEffect } from 'react';
import { OrderDocument, OrderQuery, OrderQueryVariables } from '@/gql/graphql';

type CartPaymentProps = {
	orderId: string;
};

export const CartPayment = ({ orderId }: CartPaymentProps) => {
	const { clear } = useCartStore();
	const { clearOrder } = useOrderStore();
	const { data, loading } = useQuery<OrderQuery, OrderQueryVariables>(
		OrderDocument,
		{
			variables: { orderId },
			fetchPolicy: 'network-only',
		},
	);

	const isPaid: boolean = data?.order?.payment?.paymentStatus === 'paid';
	const success: boolean = Boolean(isPaid && orderId);

	useEffect(() => {
		if (success) {
			clear();
			clearOrder();
		}
	}, [success, clear, clearOrder]);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-4" />
				<p className="text-gray-600 text-sm">
					Carregando status do pagamento...
				</p>
			</div>
		);
	}

	const title = success
		? 'OBRIGADO PELA COMPRA!'
		: 'FALHA AO VALIDAR A COMPRA!';
	const Icon = success ? CircleCheck : CircleX;
	const iconColor = success ? '#2ced52' : '#d01616';
	const message = success
		? 'Enviamos um e-mail com os detalhes do seu pedido. Por favor, verifique sua caixa de entrada (e também a pasta de spam ou lixo eletrônico, se necessário) para acompanhar as instruções e atualizações.'
		: 'Enviamos um e-mail com os detalhes do seu pedido. Verifique sua caixa de entrada (inclusive o spam) e, se necessário, entre em contato com o suporte.';
	return (
		<div className="bg-white font-sans">
			<div className="max-w-3xl mx-auto p-6 md:p-8">
				<section className="border-b pb-6 mb-6 text-center">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
						{title}
					</h1>
					<div className="flex justify-center my-4">
						<Icon color={iconColor} width={80} height={80} />
					</div>
					<p className="text-sm text-gray-600">
						Protocolo do pedido:{' '}
						<span className="font-semibold text-gray-700">{orderId}</span>
					</p>
					<p className="text-gray-600 mt-4 text-sm leading-relaxed">
						{message}
					</p>
				</section>
			</div>
		</div>
	);
};
