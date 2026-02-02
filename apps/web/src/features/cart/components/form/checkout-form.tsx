'use client';

import { Button } from '@/components/ui/button';
import { CartItem } from '@/store/cart-store';
import { useOrderStore } from '@/store/order-store';
import { useQuery } from '@apollo/client/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowRight } from 'lucide-react';
import { FormEvent, useState } from 'react';
import type { IbgeState } from '../../action/get-states';
import { FormAddress } from './form-address';
import { FormDeliveryOption } from './form-delivery-option';
import { FormPaymentMethod } from './form-payment';
import { useCreateUserAddress } from '../../hooks/use-create-user-address';
import { useCreatePaymentIntent } from '../../hooks/use-create-payment-intents';
import { MeDocument, MeQuery } from '@/gql/graphql';

interface CheckoutFormProps {
	states: IbgeState[];
	items: CartItem[];
	totalInCents: number;
}
export interface AddressState {
	street: string;
	city: string;
	zap_code: string;
	street_number: string;
	complements: string;
	neighbor: string;
	state: string;
}

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export const CheckoutForm = ({
	states,
	items,
	totalInCents,
}: CheckoutFormProps) => {
	const { orderId } = useOrderStore();

	const [deliveryOption, setDeliveryOption] = useState('standard');
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [address, setAddress] = useState<AddressState>({
		street: '',
		city: '',
		zap_code: '',
		street_number: '',
		complements: '',
		neighbor: '',
		state: '',
	});

	const { createUserAddress } = useCreateUserAddress();
	const { createUserPaymentIntent } = useCreatePaymentIntent();

	const user = useQuery<MeQuery>(MeDocument);
	const userId = user.data?.me?.id;

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setMessage(null);

		if (!userId) {
			setMessage('Usuário não identificado. Faça login novamente.');
			setIsLoading(false);
			return;
		}

		if (!orderId || items.length === 0) {
			setMessage('O pedido está vazio ou inválido.');
			setIsLoading(false);
			return;
		}

		const addressResult = await createUserAddress({
			userId,
			address,
		});

		if (!addressResult.success) {
			setMessage(addressResult.error.message);
			setIsLoading(false);
			return;
		}

		const paymentResult = await createUserPaymentIntent({
			orderId,
			amount: totalInCents,
		});

		if (!paymentResult.success) {
			setMessage(paymentResult.error.message);
			setIsLoading(false);
			return;
		}

		setClientSecret(paymentResult.secret);
		setIsLoading(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			aria-label="Checkout"
			className="lg:col-span-2 space-y-12"
		>
			<FormAddress states={states} address={address} setAddress={setAddress} />
			<FormDeliveryOption
				deliveryOption={deliveryOption}
				setDeliveryOption={setDeliveryOption}
			/>

			{!clientSecret ? (
				<Button
					type="submit"
					size="lg"
					disabled={isLoading}
					className="flex flex-row justify-between px-20 w-1/3 text-base font-barlow-semi-condensed"
				>
					{isLoading
						? 'Inicializando pagamento...'
						: 'Continuar para pagamento'}
					<ArrowRight size={20} />
				</Button>
			) : (
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<FormPaymentMethod />
				</Elements>
			)}
			<ul className="text-foreground font-inter text-sm">
				<li>Successful Payment 4242 4242 4242 4242 </li>
				<li>Requires 3D Secure Authentication 4000 0025 0000 3155 </li>
				<li>Card Declined 4000 0000 0000 0002</li>
				<li>Insufficient Funds 4000 0000 0000 9995</li>
				<li>Expired Card 4000 0000 0000 0069</li>
				<li>Incorrect CVC 4000 0000 0000 0127</li>
			</ul>

			{message && (
				<p className="text-red-500 text-sm font-semibold">{message}</p>
			)}
		</form>
	);
};
