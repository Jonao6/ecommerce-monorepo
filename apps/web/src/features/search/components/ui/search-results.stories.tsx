import { StoryObj, Meta } from '@storybook/nextjs-vite';
import { SearchResults } from './search-results';
import { fn } from 'storybook/test';
import { SearchProduct } from '../../types/product';

const mockProduct: SearchProduct[] = [
	{
		id: 'produtoTeste-123',
		name: 'Nike Air',
		price: 399.9,
		url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
		category: {
			name: 'Nike',
		},
	},
];

const meta = {
	title: 'Search/Components/ui/SearchResults',
	component: SearchResults,
	tags: ['autodocs'],
} satisfies Meta<typeof SearchResults>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
	args: {
		products: mockProduct,
		onItemClick: fn(),
		loading: false,
	},
} satisfies Story;

export const NotFound = {
	args: {
		products: [],
		onItemClick: fn(),
		loading: false,
	},
} satisfies Story;

export const Loading = {
	args: {
		products: [],
		onItemClick: fn(),
		loading: true,
	},
} satisfies Story;
