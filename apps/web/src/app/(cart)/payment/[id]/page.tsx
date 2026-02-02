'use client';

import { useSearchParams } from 'next/navigation';
import { CartPayment } from '@/features/cart/components/cart-payment';
import React, { useEffect, useState } from 'react';

export default function PaymentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const searchParams = useSearchParams();
	const redirectStatus = searchParams.get('redirect_status');
	const { id } = React.use(params);
	const [showPayment, setShowPayment] = useState(false);

	useEffect(() => {
		if (redirectStatus && id) {
			setShowPayment(true);
		}
	}, [redirectStatus, id]);

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
				<CartPayment orderId={id} />
			) : (
				<p>Verificando pagamento...</p>
			)}
		</main>
	);
}
