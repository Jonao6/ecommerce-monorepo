'use client';

import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useOrderStore } from '@/store/order-store';

export const FormPaymentMethod = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const { orderId } = useOrderStore()
	const handlePayment = async () => {
		if (!stripe || !elements) return;

		setIsLoading(true);
		setMessage(null);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/payment/${orderId}`,
			},
		});

		if (error) {
			setMessage(error.message || 'Ocorreu um erro inesperado.');
		}
		
		setIsLoading(false);
	};

	return (
		<section>
			<h2 className="text-xl font-semibold mb-3 font-barlow-semi-condensed">
				Pagamento
			</h2>
			<div className="border rounded-lg p-6 mb-4">
				<PaymentElement />
			</div>

			{message && <p className="text-red-500 text-sm font-semibold">{message}</p>}

			<Button
				type="button"
				onClick={handlePayment}
				disabled={isLoading || !stripe || !elements}
				className="flex flex-row justify-between px-10 w-1/3 text-base font-barlow-semi-condensed"
			>
				{isLoading ? 'Processando...' : 'Pagar agora'}
				<ArrowRight size={20} />
			</Button>
		</section>
	);
};
