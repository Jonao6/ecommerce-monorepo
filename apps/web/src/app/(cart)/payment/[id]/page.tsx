'use client';

import { useSearchParams } from 'next/navigation';
import { CartPayment } from '@/features/cart/components/cart-payment';
import { useEffect, useState } from 'react';

export default function PaymentPage({ params }: { params: { id: string } }) {
	const searchParams = useSearchParams();
	const redirectStatus = searchParams.get('redirect_status');
	const orderId = params.id;
	const [showPayment, setShowPayment] = useState(false);

	useEffect(() => {
		if (redirectStatus === 'succeeded' && orderId) {
			setShowPayment(true);
		} else if (redirectStatus && redirectStatus !== 'succeeded') {
			setShowPayment(true);
		}
	}, [redirectStatus, orderId]);

	if (!redirectStatus) {
		return (
			<main className="flex items-center justify-center h-screen">
				<p>Carregando status do pagamento...</p>
			</main>
		);
	}

	return (
		<main>
			{showPayment ? (
				<CartPayment orderId={orderId ?? ''} />
			) : (
				<p>Verificando pagamento...</p>
			)}
		</main>
	);
}
