import { createMockOrder } from '@/testing/factory/orders';
import { mockOrderQuery } from '@/testing/mocks/handlers.generated';
import { server } from '@/testing/mocks/server';
import { HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartPayment } from '../cart-payment';
import { render, screen, waitFor } from '@/testing/test-utils';
import { PaymentStatus } from '@/gql/graphql';

const { mockClearCart, mockClearOrder } = vi.hoisted(() => {
	return {
		mockClearCart: vi.fn(),
		mockClearOrder: vi.fn(),
	};
});

vi.mock('@/store/cart-store', () => ({
	useCartStore: () => ({
		clear: mockClearCart,
	}),
}));

vi.mock('@/store/order-store', () => ({
	useOrderStore: () => ({
		clearOrder: mockClearOrder,
	}),
}));

describe('CartPayment', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('deve exibir mensagem de sucesso e limpar o carrinho quando status for Paid', async () => {
		server.use(
			mockOrderQuery(() => {
				return HttpResponse.json({
					data: {
						order: createMockOrder({
							payment: { paymentStatus: PaymentStatus.Paid },
						}),
					},
				});
			}),
		);

		render(<CartPayment orderId={'order-test-id'} />);

		const successMessage = await screen.findByText(/OBRIGADO PELA COMPRA!/i);

		expect(successMessage).toBeInTheDocument();

		await waitFor(() => {
			expect(mockClearCart).toHaveBeenCalledTimes(1);
			expect(mockClearOrder).toHaveBeenCalledTimes(1);
		});
	});
	it('deve exibir mensagem de erro e não limpar o carrinho quando status for Failed', async () => {
		server.use(
			mockOrderQuery(() => {
				return HttpResponse.json({
					data: {
						order: createMockOrder({
							payment: { paymentStatus: PaymentStatus.Failed },
						}),
					},
				});
			}),
		);

		render(<CartPayment orderId={'order-test-id'} />);

		const failedMessage = await screen.findByText(
			/FALHA AO VALIDAR A COMPRA!/i,
		);

		expect(failedMessage).toBeInTheDocument();

		await waitFor(() => {
			expect(mockClearCart).not.toHaveBeenCalled();
			expect(mockClearOrder).not.toHaveBeenCalled();
		});
	});
});
