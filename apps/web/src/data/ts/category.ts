import { HomeCategoryProps } from '@/features/home/components/home-category';

export const categories: HomeCategoryProps = {
	categories: [
		{
			src: '/home/nike-logo.png',
			alt: 'nike-logo',
			href: '/products?brand=nike',
		},
		{
			src: '/home/converse-logo.png',
			alt: 'converse-logo',
			href: '/products?brand=converse',
		},
		{
			src: '/home/adidas-logo.png',
			alt: 'adidas-logo',
			href: '/products?brand=adidas',
		},
		{
			src: '/home/puma-logo.png',
			alt: 'puma-logo',
			href: '/products?brand=puma',
		},
		{
			src: '/home/fila-logo.png',
			alt: 'fila-logo',
			href: '/products?brand=fila',
		},
	],
};
