'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from '@apollo/client/react';
import { FormAddress } from './form-address';
import { FormDeliveryOption } from './form-delivery-option';
import { FormPaymentMethod } from './form-payment';
import type { IbgeState } from '../../action/get-states';
import { CREATE_PAYMENT_INTENT_MUTATION } from '../../api/create-payment';
import { CartItem } from '@/store/cart-store';
import { useOrderStore } from '@/store/order-store';
import { CREATE_ADDRESS } from '../../api/address';
import { GET_USER } from '../../api/get-user';
import { MeData } from '../cart-checkout';

interface CheckoutFormProps {
	states: IbgeState[];
	items: CartItem[];
	totalInCents: number;
}
interface CreatePaymentIntentData {
	createPaymentIntent: { clientSecret: string };
}
interface CreatePaymentIntentVariables {
	input: { orderId: string; amount: number };
}
interface CreateAddressData {
	createAddress: { id: string };
}

interface CreateAddressVariables {
	input: {
		userId: string;
		street: string;
		streetNumber: string
		city: string;
		state: string;
		complements: string;
		neighbor: string;
		postalCode: string;
		country: string;
	};
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
	const [createPaymentIntent, { error: paymentIntentError }] = useMutation<
		CreatePaymentIntentData,
		CreatePaymentIntentVariables
	>(CREATE_PAYMENT_INTENT_MUTATION);

	const [createAddress] = useMutation<
		CreateAddressData,
		CreateAddressVariables
	>(CREATE_ADDRESS);
	const user =  useQuery<MeData>(GET_USER)
	const userId = user.data?.me.id
	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (!orderId || items.length === 0)
			return console.error('Order or Items error');

		setIsLoading(true);
		setMessage(null);

		try {
			const addAddress = await createAddress({
				variables: {
					input: {
						userId: userId as string,
						street: address.street,
						city: address.city,
						postalCode: address.zap_code,
						streetNumber: address.street_number,
						complements: address.complements,
						neighbor: address.neighbor,
						state: address.state,
						country: "Brasil"
					},
				},
			});

			if(!addAddress.data?.createAddress?.id) return;

			const { data } = await createPaymentIntent({
				variables: {
					input: { orderId, amount: totalInCents },
				},
			});

			const secret = data?.createPaymentIntent?.clientSecret;
			if (!secret || paymentIntentError) {
				throw new Error('Não foi possível inicializar o pagamento.');
			}
			setClientSecret(secret);
		} catch (error: any) {
			setMessage(error.message ?? 'Erro ao criar pagamento.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="lg:col-span-2 space-y-12">
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

			{message && (
				<p className="text-red-500 text-sm font-semibold">{message}</p>
			)}
		</form>
	);
};
