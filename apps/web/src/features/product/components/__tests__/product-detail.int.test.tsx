import { createMockProduct } from '@/testing/factory/product';
import { render, screen } from '@/testing/test-utils';
import { describe, beforeEach, vi, it, expect } from 'vitest';
import { ProductDetail } from '@/features/product/components/product-detail';
import { Product } from '@/components/product/product-grid';
import userEvent from '@testing-library/user-event';

const addItemMock = vi.fn();

vi.mock('@/store/cart-store', () => ({
	useCartStore: () => ({
		addItem: addItemMock,
		items: [],
	}),
}));

describe('ProductDetail', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	const product = createMockProduct({
		name: 'Nike Air',
		price: 599.9,
		description: 'Estilo Urbano',
		colors: ['Azul'],
		sizes: [40],
	}) as Product;

	it('Deve mostrar com Sucesso os Detalhes do Produto', () => {
		render(<ProductDetail product={product} />);

		expect(
			screen.getByRole('heading', { name: /Nike Air/i }),
		).toBeInTheDocument();

		expect(screen.getByText(/599[,.]90/)).toBeInTheDocument();

		const image = screen.getByRole('img', { name: /Nike Air/i });
		expect(image).toBeInTheDocument();
		
		expect(image).toHaveAttribute(
			'src',
			expect.stringContaining(product.image as string),
		);

		expect(
			screen.getByRole('button', { name: /ADICIONAR AO CARRINHO/i }),
		).toBeInTheDocument();
	});
	it('Deve adicionar ao Carrinho com sucesso', async () => {
		const user = userEvent.setup();

		render(<ProductDetail product={product} />);

		await user.click(
			screen.getByRole('button', { name: /ADICIONAR AO CARRINHO/i }),
		);

		await user.click(screen.getByRole('button', { name: /40/i }));

		await user.click(screen.getByRole('button', { name: /Azul/i }));

		expect(addItemMock).toHaveBeenCalledTimes(1);

		expect(addItemMock).toHaveBeenCalledWith(
			expect.objectContaining({
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image,
				quantity: 1,
				size: expect.any(Number),
				color: expect.any(String),
			}),
		);
	});
});
