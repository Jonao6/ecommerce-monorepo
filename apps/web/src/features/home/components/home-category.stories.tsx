import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HomeCategory } from './home-category';
import { categories } from '@/data/ts/category';

const meta = {
	title: 'Home/Components/HomeCategory',
	component: HomeCategory,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof HomeCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop = {
	args: {
		...categories,
	},
} satisfies Story;
