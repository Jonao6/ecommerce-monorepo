import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '@/testing/mocks/server';
import { redirect } from 'next/navigation';

import { Address, Order, OrderStatus } from '@/gql/graphql';
import { createMockUser } from '@/testing/factory/user';
import { createMockOrder } from '@/testing/factory/orders';
import { createMockAddress } from '@/testing/factory/address';
import {
	mockMeQuery,
	mockUserAddressesQuery,
	mockUserOrdersQuery,
} from '@/testing/mocks/handlers.generated';
import DashboardView from '@/features/dashboard/components/dashboard-view';
import { render, screen } from '@testing-library/react';

type DashboardScenarioOptions = {
	me?: ReturnType<typeof createMockUser> | null;
	orders?: ReturnType<typeof createMockOrder>[] | 'error';
	addresses?: ReturnType<typeof createMockAddress>[];
};

const setupDashboardScenario = ({
	me = createMockUser(),
	orders = [],
	addresses = [],
}: DashboardScenarioOptions = {}) => {
	server.use(
		mockMeQuery(() => {
			return HttpResponse.json({ data: { me } });
		}),

		mockUserOrdersQuery(() => {
			if (orders === 'error') {
				return HttpResponse.json({
					errors: [{ message: 'Erro ao buscar pedidos' }],
				});
			}
			return HttpResponse.json({ data: { userOrders: orders } });
		}),

		mockUserAddressesQuery(() => {
			return HttpResponse.json({ data: { userAddresses: addresses } });
		}),
	);
};

vi.mock('@/features/dashboard/components/order-table', () => ({
	OrderTable: ({ orders }: { orders: Order[] }) => (
		<div data-testid="mock-order-table" data-count={orders?.length ?? 0} />
	),
}));

vi.mock('@/features/dashboard/components/address-table', () => ({
	AddressTable: ({ addresses }: { addresses: Address[] }) => (
		<div data-testid="mock-address-table" data-count={addresses?.length ?? 0} />
	),
}));

describe('Dashboard View', () => {
	afterEach(() => {
		vi.clearAllMocks();
		server.resetHandlers();
	});

	it('Deve renderizar dados consistentes para o usuário logado', async () => {
		const currentUser = createMockUser({ name: 'Ana Tester' });

		const myOrders = [
			createMockOrder({ user: currentUser, totalAmount: 150.0 }),
			createMockOrder({ user: currentUser, status: OrderStatus.Delivered }),
		];

		const myAddresses = [
			createMockAddress({ user: currentUser, city: 'Curitiba' }),
		];

		setupDashboardScenario({
			me: currentUser,
			orders: myOrders,
			addresses: myAddresses,
		});

		const jsx = await DashboardView();
		render(jsx);

		expect(screen.getByTestId('mock-order-table')).toHaveAttribute(
			'data-count',
			'2',
		);
		expect(screen.getByTestId('mock-address-table')).toHaveAttribute(
			'data-count',
			'1',
		);
	});

	it('Deve lidar com lista vazia (Usuário novo)', async () => {
		setupDashboardScenario({
			orders: [],
			addresses: [],
		});

		const jsx = await DashboardView();
		render(jsx);

		expect(screen.getByTestId('mock-order-table')).toHaveAttribute(
			'data-count',
			'0',
		);
		expect(screen.getByTestId('mock-address-table')).toHaveAttribute(
			'data-count',
			'0',
		);
	});

	it('Deve redirecionar se não houver usuário (Me = null)', async () => {
		setupDashboardScenario({ me: null });

		try {
			await DashboardView();
		} catch (e) {
			return e;
		}

		expect(vi.mocked(redirect)).toHaveBeenCalledWith('/');
	});

	it('Deve renderizar endereços mesmo com erro na API de pedidos', async () => {
		setupDashboardScenario({
			orders: 'error',
			addresses: [createMockAddress()],
		});

		const jsx = await DashboardView();
		render(jsx);

		expect(screen.getByTestId('mock-order-table')).toHaveAttribute(
			'data-count',
			'0',
		);
		expect(screen.getByTestId('mock-address-table')).toHaveAttribute(
			'data-count',
			'1',
		);
	});
});
