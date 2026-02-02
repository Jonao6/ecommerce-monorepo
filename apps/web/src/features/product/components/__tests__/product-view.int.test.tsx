import { createMockProduct } from '@/testing/factory/product';
import { mockProductsQuery } from '@/testing/mocks/handlers.generated';
import { server } from '@/testing/mocks/server';
import { render, screen } from '@/testing/test-utils';
import { HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductView } from '@/features/product/components/product-view';
import userEvent from '@testing-library/user-event';

const setupMock = () => {
	server.use(
		mockProductsQuery(({ variables }) => {
			const offset = variables.offset || 0;
			const isPage1 = offset === 0;

			return HttpResponse.json({
				data: {
					products: {
						currentPage: isPage1 ? 1 : 2,
						hasNextPage: isPage1,
						hasPreviousPage: !isPage1,
						totalCount: 20,
						totalPages: 2,
						products: isPage1
							? [createMockProduct({ id: 'p1', name: 'Produto Página 1' })]
							: [createMockProduct({ id: 'p2', name: 'Produto Página 2' })],
					},
				},
			});
		}),
	);
};

describe('ProductView', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('deve renderizar a lista de produtos com dados da API', async () => {
		setupMock();

		render(<ProductView />);

		const product = await screen.findByText('Produto Página 1');
		expect(product).toBeInTheDocument();

		expect(screen.queryByText('Produto Página 2')).not.toBeInTheDocument();
	});

	it('deve conter o link correto para a página de detalhes', async () => {
		setupMock();
		render(<ProductView />);

		const productLink = await screen.findByRole('link', {
			name: /Produto Página 1/i,
		});

		expect(productLink).toHaveAttribute('href', '/product/p1');
	});

	it('deve carregar novos produtos ao clicar na paginação', async () => {
		setupMock();
		const user = userEvent.setup();
		render(<ProductView />);

		expect(await screen.findByText('Produto Página 1')).toBeInTheDocument();

		const nextButton = screen.getByLabelText('Próxima página');
		await user.click(nextButton);

		const page2Product = await screen.findByText('Produto Página 2');

		expect(page2Product).toBeInTheDocument();
		expect(screen.queryByText('Produto Página 1')).not.toBeInTheDocument();
	});
});
