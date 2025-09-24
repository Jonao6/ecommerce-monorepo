'use client';

import { PaymentElement } from '@stripe/react-stripe-js';

export const FormPaymentMethod = () => {
	return (
		<section>
			<h2 className="text-xl font-semibold mb-3 font-barlow-semi-condensed">
				PAGAMENTO
			</h2>
			<div className="border rounded-lg p-6">
				<PaymentElement />
			</div>
		</section>
	);
};
