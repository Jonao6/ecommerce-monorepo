import { faker } from '@faker-js/faker';
import {
	DeliveryStatus,
	Order,
	OrderItem,
	OrderStatus,
	PaymentStatus,
} from '@/gql/graphql';
import { createMockProduct } from './product';
import { createMockUser } from './user';
import { createMockAddress } from './address';

// 1. CORREÇÃO DO DEEP PARTIAL (ROBUSTO)
// Esse tipo lida corretamente com Arrays e evita transformar primitivos em objetos
type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

const createMockOrderItem = (): OrderItem => {
	return {
		__typename: 'OrderItem',
		id: faker.string.uuid(),
		product: createMockProduct(),
		price: Number(faker.commerce.price()),
		quantity: faker.number.int({ min: 1, max: 3 }),
	};
};

export const createMockOrder = (overrides?: DeepPartial<Order>): Order => {
	const orderId = overrides?.id || faker.string.uuid();

	// 2. ESTRATÉGIA DE SEPARAÇÃO
	// Primeiro, criamos o objeto COMPLETO com os dados padrão.
	// Isso garante que todas as propriedades obrigatórias existam.
	const defaultOrder: Order = {
		__typename: 'Order',
		id: orderId,
		status: OrderStatus.Pending,
		totalAmount: Number(faker.finance.amount()),
		createdAt: faker.date.past().toISOString(),

		// Tratamento de Arrays: Se vier no override, usa o do override. Senão, cria default.
		items: overrides?.items
			? (overrides.items as OrderItem[])
			: [createMockOrderItem()],

		payment: {
			__typename: 'Payment',
			id: faker.string.uuid(),
			order: { id: orderId } as any,
			paidAt: faker.date.past().toISOString(),
			paymentMethod: 'card',
			paymentStatus: PaymentStatus.Paid,
			amount: Number(faker.finance.amount()),
		},

		delivery: {
			__typename: 'Delivery',
			id: faker.string.uuid(),
			trackingNumber: faker.string.alphanumeric(10).toUpperCase(),
			deliveredAt: faker.date.future().toISOString(),
			status: DeliveryStatus.Preparing,
			order: { id: orderId } as any,
		},

		user: createMockUser(),
		address: createMockAddress(),
	};

	// 3. A MESCLAGEM FINAL (O PULO DO GATO 🐱)
	// Fazemos o merge manualmente apenas nas chaves que importam e usamos
	// 'as any' no override para forçar o TS a aceitar a sobrescrita parcial.
	return {
		...defaultOrder,
		...(overrides as any), // Sobrescreve campos da raiz (status, totalAmount, etc)

		payment: {
			...defaultOrder.payment,
			...(overrides?.payment as any), // Sobrescreve campos do payment (paymentStatus)
		},

		delivery: {
			...defaultOrder.delivery,
			...(overrides?.delivery as any), // Sobrescreve campos do delivery
		},

		// Se você tiver User e Address mocks aceitando overrides, faça assim:
		// user: createMockUser(overrides?.user),
	};
};
