import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductGrid, type Product } from './product-grid';

const meta = {
	title: 'Components/Product/ProductGrid',
	component: ProductGrid,
	args: {
		loading: false,
	},
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof ProductGrid>;

export default meta;

type Story = StoryObj<typeof ProductGrid>;

const productsMock: Product[] = [
	{
		id: '1',
		name: 'Nike Air Jordan 1 Retro High',
		price: 1299.9,
		category: { name: 'Jordan' },
		image: 'https://picsum.photos/seed/jordan/800/1000',
		colors: ['red', 'black'],
		sizes: [38, 39, 40, 41],
	},
	{
		id: '2',
		name: 'Adidas Ozweego',
		price: 699.9,
		category: { name: 'Adidas' },
		image: 'https://picsum.photos/seed/ozweego/800/1000',
	},
	{
		id: '3',
		name: 'Converse Chuck Taylor All Star',
		price: 299.9,
		category: { name: 'Converse' },
		image: 'https://picsum.photos/seed/allstar/800/1000',
	},
	{
		id: '4',
		name: 'New Balance 550',
		price: 799.9,
		category: { name: 'New Balance' },
		image: 'https://picsum.photos/seed/nb550/800/1000',
	},
	{
		id: '5',
		name: 'Puma Suede Classic',
		price: 399.9,
		category: { name: 'Puma' },
		image: 'https://picsum.photos/seed/puma/800/1000',
	},
	{
		id: '6',
		name: 'Vans Old Skool',
		price: 349.9,
		category: { name: 'Vans' },
		image: 'https://picsum.photos/seed/vans/800/1000',
	},
];

export const Default: Story = {
	args: {
		products: productsMock,
		loading: false,
	},
} satisfies Story;

export const Loading = {
	args: {
		products: [],
		loading: true,
	},
} satisfies Story;
