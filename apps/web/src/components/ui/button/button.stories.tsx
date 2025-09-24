import { Button } from './button';
import { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Button> = {
	component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: 'Button',
		variant: 'default',
	},
};
