import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroSection } from './hero-section';

const meta = {
	title: 'Home/Components/HeroSection',
	component: HeroSection,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop = {} satisfies Story;
