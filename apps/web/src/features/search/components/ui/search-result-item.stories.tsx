import { StoryObj, Meta } from '@storybook/nextjs-vite';
import { SearchResultItem } from './search-result-item';
import { fn } from 'storybook/test';
import { SearchProduct } from '../../types/product';

const mockProduct: SearchProduct = {
	id: 'produtoTeste-123',
	name: 'Nike Air',
	price: 399.9,
	url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
	category: {
		name: 'Nike',
	},
};

const meta = {
	title: 'Search/Components/ui/SearchResultsItem',
	component: SearchResultItem,
	tags: ['autodocs'],
} satisfies Meta<typeof SearchResultItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
	args: {
		onClick: fn(),
		product: mockProduct,
	},
} satisfies Story;
