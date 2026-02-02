import { render, screen, waitFor } from '@/testing/test-utils';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchBar } from '@/features/search/components/search-bar';
import { server } from '@/testing/mocks/server';
import { HttpResponse } from 'msw';
import { mockProductsBySearchQuery } from '@/testing/mocks/handlers.generated';
import { createMockProduct } from '@/testing/factory/product';

describe('SearchBar', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('Deve exibir resultados da API após o usuário digitar', async () => {
		server.use(
			mockProductsBySearchQuery(() => {
				return HttpResponse.json({
					data: {
						productsBySearch: [createMockProduct({ name: 'Nike Air' })],
					},
				});
			}),
		);
		const user = userEvent.setup();

		render(<SearchBar />);

		const input = screen.getByRole('searchbox');
		await user.type(input, 'Nike Air');

		await waitFor(() => {
			expect(screen.getByText('Nike Air')).toBeInTheDocument();
		});
	});
});
