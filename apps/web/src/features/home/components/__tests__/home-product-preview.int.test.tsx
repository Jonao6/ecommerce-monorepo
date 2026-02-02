import { createMockProduct } from '@/testing/factory/product';
import { mockHomeProductsQuery } from '@/testing/mocks/handlers.generated';
import { server } from '@/testing/mocks/server';
import { HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HomeProductPreview } from '@/features/home/components/home-product-preview';
import { render } from '@/testing/test-utils';
import { screen } from '@testing-library/react';

describe('Home-Product-Preview', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('deve renderizar os produtos recebidos pelo GRAPHQL', async () => {
		server.use(
			mockHomeProductsQuery(() => {
				return HttpResponse.json({
					data: {
						products: {
							products: [
								createMockProduct({ name: 'Nike Air' }),
								createMockProduct({ name: 'Adidas Ozweego' }),
							],
						},
					},
				});
			}),
		);

		const jsx = await HomeProductPreview();
		render(jsx);

		expect(
			screen.getByRole('heading', { name: /Nike Air/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('heading', { name: /Adidas Ozweego/i }),
		).toBeInTheDocument();
	});
	it('deve renderizar mensagem de erro quando a API falhar', async () => {
		server.use(
			mockHomeProductsQuery(() => {
				return HttpResponse.json({
					errors: [{ message: 'Falha interna no servidor GraphQL' }],
					data: null,
				});
			}),
		);

		await expect(HomeProductPreview()).rejects.toThrow();
	});
});
