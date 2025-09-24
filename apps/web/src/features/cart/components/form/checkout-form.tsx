'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client/react';

import { FormAddress } from './form-address';
import { FormDeliveryOption } from './form-delivery-option';
import { FormPaymentMethod } from './form-payment';
import type { IbgeState } from '../../action/get-states';

import { CREATE_ORDER_MUTATION } from '../../api/create-order';
import { CREATE_PAYMENT_INTENT_MUTATION } from '../../api/create-payment';
import { CartItem } from '@/store/cart-store';

interface CheckoutFormProps {
	states: IbgeState[];
	items: CartItem[];
	totalInCents: number;
}
interface CreateOrderData {
	createOrder: {
		id: string;
	};
}

interface CreateOrderVariables {
	input: {
		items: { productId: string; quantity: number }[];
		totalAmount: number;
		shippingAddress: object;
		deliveryOption: string;
	};
}

interface CreatePaymentIntentData {
	createPaymentIntent: {
		clientSecret: string;
	};
}

interface CreatePaymentIntentVariables {
	input: {
		orderId: string;
		amount: number;
	};
}
export const CheckoutForm = ({
	states,
	items,
	totalInCents,
}: CheckoutFormProps) => {
	const stripe = useStripe();
	const elements = useElements();

	const [deliveryOption, setDeliveryOption] = useState('standard');
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [createOrder, { error: orderError }] = useMutation<
		CreateOrderData,
		CreateOrderVariables
	>(CREATE_ORDER_MUTATION);
	const [createPaymentIntent, { error: paymentIntentError }] = useMutation<
		CreatePaymentIntentData,
		CreatePaymentIntentVariables
	>(CREATE_PAYMENT_INTENT_MUTATION);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (!stripe || !elements || items.length === 0) {
			return;
		}

		setIsLoading(true);
		setMessage(null);

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
			const addressData = {
				name: formData.get('name') as string,
				secondName: formData.get('second_name') as string,
				address: formData.get('address') as string,
				zipCode: formData.get('zap_code') as string,
				streetNumber: formData.get('street_number') as string,
				complements: formData.get('complements') as string,
				neighborhood: formData.get('neighbor') as string,
				city: formData.get('city') as string,
				state: formData.get('state') as string,
				phone: formData.get('phone') as string,
				cpf: formData.get('CPF') as string,
			};

			const orderResponse = await createOrder({
				variables: {
					input: {
						items: items.map((item) => ({
							productId: item.id,
							quantity: item.quantity,
						})),
						totalAmount: totalInCents,
						shippingAddress: addressData,
						deliveryOption: deliveryOption,
					},
				},
			});

			if (!orderResponse.data) {
				throw new Error('Falha ao receber o pedido. Tente novamente.');
			}
			const orderId = orderResponse.data.createOrder?.id;
			if (!orderId || orderError) {
				throw new Error('Falha ao criar o pedido. Tente novamente.');
			}

			const paymentIntentResponse = await createPaymentIntent({
				variables: {
					input: {
						orderId: orderId,
						amount: totalInCents,
					},
				},
			});

			const clientSecret =
				paymentIntentResponse.data?.createPaymentIntent?.clientSecret;
			if (!clientSecret || paymentIntentError) {
				throw new Error('Não foi possível inicializar o pagamento.');
			}

			const { error: stripeError } = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					return_url: `${window.location.origin}/order/confirmation`,
				},
			});
			if (stripeError) {
				setMessage(stripeError.message || 'Ocorreu um erro inesperado.');
			}
		} catch (error: unknown) {
			let finalMessage = 'Ocorreu um erro. Por favor, verifique seus dados.';

			if (
				typeof error === 'object' &&
				error !== null &&
				'message' in error &&
				typeof error.message === 'string'
			) {
				finalMessage = (error as { message: string }).message;
			}

			setMessage(finalMessage);
		}
	};
	return (
		<form onSubmit={handleSubmit} className="lg:col-span-2 space-y-12">
			<FormAddress states={states} />
			<FormDeliveryOption
				deliveryOption={deliveryOption}
				setDeliveryOption={setDeliveryOption}
			/>
			<FormPaymentMethod />

			{message && (
				<p className="text-red-500 text-sm font-semibold">{message}</p>
			)}

			<Button
				type="submit"
				size="lg"
				disabled={isLoading || !stripe || !elements}
				className="flex flex-row justify-between px-20 w-1/3 text-base font-barlow-semi-condensed"
			>
				{isLoading ? 'PROCESSANDO...' : 'FINALIZAR O PEDIDO'}
				<ArrowRight size={20} />
			</Button>
		</form>
	);
};
