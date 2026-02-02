import { createMockUser } from '@/testing/factory/user';
import { mockCreateUserMutation } from '@/testing/mocks/handlers.generated';
import { server } from '@/testing/mocks/server';
import { render, screen, waitFor, act } from '@/testing/test-utils';
import userEvent from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignupForm } from '@/features/auth/components/signup-form';

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
	Toaster: () => null,
}));

describe('Integração: SignForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('Deve Registrar com sucesso usando mutation GraphQL', async () => {
		server.use(
			mockCreateUserMutation(({ variables }) => {
				const { email } = variables.input;
				return HttpResponse.json({
					data: {
						createUser: createMockUser({
							email,
						}),
					},
				});
			}),
		);
		const user = userEvent.setup();

		render(<SignupForm />);

		await user.type(screen.getByLabelText(/nome/i), 'Usuário Teste');
		await user.type(screen.getByLabelText(/email/i), 'teste@email.com');
		await user.type(screen.getByLabelText(/senha/i), '123456');
		await user.click(screen.getByRole('button', { name: /REGISTRAR/i }));

		await waitFor(() => {
			expect(vi.mocked(redirect)).toHaveBeenCalledTimes(1);
			expect(vi.mocked(redirect)).toHaveBeenCalledWith('/signin');
		});
	});

	it('deve lidar com o erro retornado pela API GraphQL', async () => {
		server.use(
			graphql.mutation('CreateUser', () => {
				return HttpResponse.json({
					errors: [
						{
							message: 'Credenciais inválidas ou usuário já existente',
							extensions: { code: 'BAD_USER_INPUT' },
						},
					],
				});
			}),
		);
		const user = userEvent.setup();
		act(() => render(<SignupForm />));

		await user.type(screen.getByLabelText(/email/i), 'teste@email.com');
		await user.click(screen.getByRole('button', { name: /REGISTRAR/i }));

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				expect.stringMatching(/Senha curta/i),
			);
			expect(vi.mocked(redirect)).not.toHaveBeenCalled();
		});
	});
});
