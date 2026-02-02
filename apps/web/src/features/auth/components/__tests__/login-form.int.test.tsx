import { server } from '@/testing/mocks/server';
import { render, screen, waitFor } from '@/testing/test-utils';
import userEvent from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/features/auth/components/login-form';

describe('Integração: LoginForm', () => {
	beforeEach(() => vi.clearAllMocks());

	it('deve logar com sucesso usando a mutation GraphQL interceptada pelo MSW', async () => {
		server.use(
			graphql.mutation('GetUser', ({ variables }) => {
				const { email } = variables.input;

				if (email === 'teste@email.com') {
					return HttpResponse.json({
						data: {
							getUser: {
								__typename: 'User',
								message: 'Login realizado com sucesso',
								user: { id: '1', name: 'Tester', email: 'teste@email.com' },
							},
						},
					});
				}
				return HttpResponse.json({
					errors: [{ message: 'Erro desconhecido' }],
				});
			}),
		);

		const user = userEvent.setup();

		render(<LoginForm />);

		await user.type(screen.getByLabelText(/email/i), 'teste@email.com');
		await user.type(screen.getByLabelText(/senha/i), '12345678');
		await user.click(screen.getByRole('button', { name: /entrar/i }));

		await waitFor(() => {
			expect(vi.mocked(redirect)).toHaveBeenCalledWith('/');
		});
	});

	it('deve lidar com erro retornado pela API GraphQL', async () => {
		server.use(
			graphql.mutation('LoginUser', () => {
				return HttpResponse.json({
					errors: [{ message: 'Senha incorreta' }],
				});
			}),
		);

		const user = userEvent.setup();
		render(<LoginForm />);

		await user.type(screen.getByLabelText(/email/i), 'teste@email.com');
		await user.click(screen.getByRole('button', { name: /entrar/i }));

		await waitFor(() => {
			expect(vi.mocked(redirect)).not.toHaveBeenCalled();
		});
	});
});
