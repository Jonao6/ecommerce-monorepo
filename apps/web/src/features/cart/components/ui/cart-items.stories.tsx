import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CartItems } from './cart-items';

const PLACEHOLDER_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const mockItems = [
	{
		id: 'sku-123',
		name: 'Camiseta Algodão Premium - Essential',
		price: 89.9,
		quantity: 2,
		size: 40,
		color: 'Preto',
		image: PLACEHOLDER_IMAGE,
	},
	{
		id: 'sku-456',
		name: 'Calça Jeans Slim Fit',
		price: 199.9,
		quantity: 1,
		size: 42,
		color: 'Azul Lavado',
		image: PLACEHOLDER_IMAGE,
	},
];

const meta = {
	title: 'Cart/Components/CartItem',
	component: CartItems,
	tags: ['autodocs'],
} satisfies Meta<typeof CartItems>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
	args: {
		items: mockItems,
	},
} satisfies Story;

export const Empty = {
	args: {
		items: [],
	},
} satisfies Story;
