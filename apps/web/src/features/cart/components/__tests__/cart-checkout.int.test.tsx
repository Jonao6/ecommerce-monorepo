import { createMockOrder } from '@/testing/factory/orders';
import {
	mockCreateOrderMutation,
	mockMeQuery,
} from '@/testing/mocks/handlers.generated';
import { server } from '@/testing/mocks/server';
import { render, screen, waitFor } from '@/testing/test-utils';
import { HttpResponse } from 'msw';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { CartCheckout } from '@/features/cart/components/cart-checkout';
import { createMockProduct } from '@/testing/factory/product';
import userEvent from '@testing-library/user-event';

const { mockSetOrderId, mockItems } = vi.hoisted(() => {
	return {
		mockSetOrderId: vi.fn(),
		mockItems: vi.fn().mockReturnValue([]),
	};
});

vi.mock('@/store/cart-store', () => ({
	useCartStore: () => ({
		items: mockItems(),
	}),
}));

vi.mock('@/store/order-store', () => ({
	useOrderStore: () => ({
		setOrderId: mockSetOrderId,
	}),
}));

describe('CartCheckout', () => {
	afterEach(() => {
		vi.clearAllMocks();
		mockItems.mockReturnValue([]);
	});

	it('deve retornar os dados do pedido criado com sucesso', async () => {
		server.use(
			mockCreateOrderMutation(() => {
				return HttpResponse.json({
					data: {
						createOrder: createMockOrder({ id: 'order-test-id' }),
					},
				});
			}),

			mockMeQuery(() => {
				return HttpResponse.json({
					data: {
						me: {
							id: 'user-id-123',
						},
					},
				});
			}),
		);
		mockItems.mockReturnValue([createMockProduct()]);

		const user = userEvent.setup();
		render(<CartCheckout />);

		const button = await screen.findByRole('button', { name: /FINALIZAR/i });

		expect(button).toBeEnabled();

		await user.click(button);

		await waitFor(() => {
			expect(mockSetOrderId).toHaveBeenCalledTimes(1);
			expect(mockSetOrderId).toHaveBeenCalledWith('order-test-id');
		});
	});

	it('deve desabilitar o botão se o carrinho estiver vazio', async () => {
		server.use(
			mockMeQuery(() => {
				return HttpResponse.json({
					data: {
						me: {
							id: 'user-id-123',
						},
					},
				});
			}),
		);
		mockItems.mockReturnValue([]);

		render(<CartCheckout />);

		const button = await screen.findByRole('button', { name: /FINALIZAR/i });

		expect(button).toBeDisabled();
	});
});
