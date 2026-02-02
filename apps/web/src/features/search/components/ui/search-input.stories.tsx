import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchInput } from './search-input';
import { fn } from 'storybook/test';

const meta = {
	title: 'Search/Components/ui/SearchInput',
	component: SearchInput,
	tags: ['autodocs'],
	args: {
		onChange: fn(),
		onKeyDown: fn(),
		onFocus: fn(),
		onSearch: fn(),
	},
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
	args: {
		value: '',
	},
} satisfies Story;

export const WithSearchTerm: Story = {
	args: {
		value: 'Nike Air Jordan',
	},
} satisfies Story;
