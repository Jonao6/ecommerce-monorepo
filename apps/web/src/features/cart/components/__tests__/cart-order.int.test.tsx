import { fireEvent, render, screen, waitFor } from '@/testing/test-utils';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';
import { describe, expect, it, vi, beforeEach, beforeAll } from 'vitest';
import { CartOrder } from '../cart-order';
import { server } from '@/testing/mocks/server';
import {
	mockCreateAddressMutation,
	mockCreatePaymentIntentMutation,
	mockMeQuery,
} from '@/testing/mocks/handlers.generated';
import { createMockAddress } from '@/testing/factory/address';
import { createMockProduct } from '@/testing/factory/product';

const { mockItems, mockOrderId } = vi.hoisted(() => ({
	mockItems: vi.fn().mockReturnValue([]),
	mockOrderId: vi.fn().mockReturnValue('order-123'),
}));

vi.mock('@stripe/stripe-js', () => ({
	loadStripe: vi.fn().mockResolvedValue({
		elements: vi.fn(),
		createToken: vi.fn(),
		createPaymentMethod: vi.fn(),
	}),
}));

vi.mock('@stripe/react-stripe-js', () => {
	const MockElement = () => <div data-testid="stripe-mock-input" />;
	return {
		Elements: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="stripe-elements">{children}</div>
		),
		PaymentElement: MockElement,
		LinkAuthenticationElement: MockElement,
		CardElement: MockElement,
		useStripe: () => ({ confirmPayment: vi.fn() }),
		useElements: () => ({ getElement: vi.fn() }),
	};
});

vi.mock('@/features/cart/components/form/form-payment', () => ({
	FormPaymentMethod: () => (
		<div data-testid="mock-payment-form">Formulário Stripe Carregado</div>
	),
}));

vi.mock('@/store/cart-store', () => ({
	useCartStore: () => ({ items: mockItems() || [] }),
}));

vi.mock('@/store/order-store', () => ({
	useOrderStore: () => ({ orderId: mockOrderId() }),
}));

const mockStates = [
	{ id: 1, sigla: 'SP', nome: 'São Paulo' },
	{ id: 2, sigla: 'RJ', nome: 'Rio de Janeiro' },
];

function createMockPointerEvent(
	type: string,
	props: PointerEventInit = {},
): PointerEvent {
	const event = new Event(type, props) as PointerEvent;
	Object.assign(event, {
		button: props.button ?? 0,
		ctrlKey: props.ctrlKey ?? false,
		pointerType: props.pointerType ?? 'mouse',
	});
	return event;
}

async function fillForm(user: UserEvent) {
	await user.type(screen.getByPlaceholderText(/Rua/i), 'Rua das Flores');
	await user.type(screen.getByPlaceholderText(/Número/i), '123');
	await user.type(screen.getByPlaceholderText(/Cidade/i), 'São Paulo');
	await user.type(screen.getByPlaceholderText(/CEP/i), '12345-000');
	await user.type(screen.getByPlaceholderText(/Bairro/i), 'Centro');
	await user.type(
		screen.getByPlaceholderText(/Informações Adicionais/i),
		'Arvore',
	);
	await user.click(screen.getByRole('combobox'));
	const option = await screen.findByRole('option', { name: 'São Paulo' });
	await user.click(option);
}

describe('CartOrder', () => {
	const user = userEvent.setup();

	beforeAll(() => {
		window.PointerEvent =
			createMockPointerEvent as unknown as typeof PointerEvent;
		Object.assign(window.HTMLElement.prototype, {
			scrollIntoView: vi.fn(),
			releasePointerCapture: vi.fn(),
			hasPointerCapture: vi.fn(),
		});
		global.ResizeObserver = class ResizeObserver {
			observe() {}
			unobserve() {}
			disconnect() {}
		};
	});

	beforeEach(() => {
		vi.clearAllMocks();
		mockItems.mockReturnValue([]);
	});

	it('deve mostrar mensagem de carrinho vazio', () => {
		mockItems.mockReturnValue([]);
		render(<CartOrder states={mockStates} />);
		expect(screen.getByText(/Seu carrinho está vazio/i)).toBeInTheDocument();
	});

	it('deve realizar o fluxo completo: Preencher Endereço -> Gerar Intent -> Mostrar Stripe', async () => {
		mockItems.mockReturnValue([
			createMockProduct({
				price: 100,
				name: 'Produto Teste',
			}),
		]);

		server.use(
			mockMeQuery(() =>
				HttpResponse.json({ data: { me: { id: 'user-test-id' } } }),
			),
			mockCreateAddressMutation(() =>
				HttpResponse.json({
					data: { createAddress: createMockAddress({ id: 'addr-123' }) },
				}),
			),
			mockCreatePaymentIntentMutation(() =>
				HttpResponse.json({
					data: { createPaymentIntent: { clientSecret: 'pi_secret_12345' } },
				}),
			),
		);

		render(<CartOrder states={mockStates} />);

		await fillForm(user);

		fireEvent.submit(screen.getByRole('form', { name: /checkout/i }));

		await waitFor(() => {
			expect(screen.getByTestId('mock-payment-form')).toBeInTheDocument();
		});

		expect(
			screen.queryByText(/Continuar para pagamento/i),
		).not.toBeInTheDocument();
	});

	it('deve exibir erro se a criação do pagamento falhar', async () => {
		mockItems.mockReturnValue([createMockProduct()]);

		server.use(
			mockMeQuery(() =>
				HttpResponse.json({ data: { me: { id: 'user-test-id' } } }),
			),
			mockCreateAddressMutation(() =>
				HttpResponse.json({
					data: { createAddress: createMockAddress({ id: 'addr-ok' }) },
				}),
			),
			mockCreatePaymentIntentMutation(() =>
				HttpResponse.json({
					errors: [{ message: 'Erro no Stripe' }],
				}),
			),
		);

		render(<CartOrder states={mockStates} />);

		await fillForm(user);

		fireEvent.submit(screen.getByRole('form', { name: /checkout/i }));

		await waitFor(() => {
			expect(screen.getByText(/Erro no Stripe/i)).toBeInTheDocument();
		});
	});
});
