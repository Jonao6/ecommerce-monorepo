import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OrderSummary } from './cart-order-summary';
import { useCartStore } from '@/store/cart-store';

const PLACEHOLDER_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const mockItems = [
	{
		id: 'sku-123',
		name: 'Camiseta Algodão Premium - Essential',
		price: 89.9,
		quantity: 2,
		size: 'M',
		color: 'Preto',
		image: PLACEHOLDER_IMAGE,
	},
	{
		id: 'sku-456',
		name: 'Calça Jeans Slim Fit',
		price: 199.9,
		quantity: 1,
		size: '42',
		color: 'Azul Lavado',
		image: PLACEHOLDER_IMAGE,
	},
];

const meta = {
	title: 'Cart/Components/OrderSummary',
	component: OrderSummary,
	parameters: {
		layout: 'centered',
		backgrounds: { default: 'light' },
	},
	decorators: [
		(Story, context) => {
			useCartStore.setState({ items: [] });

			const itemsToLoad = context.parameters?.cartState?.items;
			if (itemsToLoad) {
				useCartStore.setState({ items: itemsToLoad });
			}

			return (
				<div className="w-100 p-4 bg-gray-50">
					<Story />
				</div>
			);
		},
	],
	tags: ['autodocs'],
} satisfies Meta<typeof OrderSummary>;

export default meta;
type Story = StoryObj<typeof OrderSummary>;
export const DefaultComFrete = {
	args: {
		quantity: 3,
		total: 89.9 * 2 + 199.9,
		delivery: 25.0,
	},
	parameters: {
		cartState: {
			items: mockItems,
		},
	},
} satisfies Story;

export const FreteGratis = {
	args: {
		quantity: 3,
		total: 379.7,
		delivery: 0,
	},
	parameters: {
		cartState: {
			items: mockItems,
		},
	},
} satisfies Story;

export const CarrinhoVazio = {
	args: {
		quantity: 0,
		total: 0,
		delivery: 0,
	},
	parameters: {
		cartState: {
			items: [],
		},
	},
} satisfies Story;
