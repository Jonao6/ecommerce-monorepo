import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LoginForm } from '@/features/auth/components/login-form';
import { redirect } from 'next/navigation';
import { render, screen, waitFor } from '@/testing/test-utils';

const mockLoginUserFn = vi.fn();
vi.mock('@/features/auth/hooks/use-login-user', () => ({
	useLoginUser: () => ({
		loginUser: mockLoginUserFn,
	}),
}));

describe('Unit: LoginForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deve renderizar os campos de email e senha corretamente', () => {
		render(<LoginForm />);

		expect(
			screen.getByRole('heading', { name: /entrar/i }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
	});

	it('deve chamar loginUser com os dados corretos e redirecionar em caso de sucesso', async () => {
		const user = userEvent.setup();

		mockLoginUserFn.mockResolvedValue({ id: 1, name: 'Teste' });

		render(<LoginForm />);

		await user.type(screen.getByLabelText(/email/i), 'teste@email.com');
		await user.type(screen.getByLabelText(/senha/i), '123456');
		await user.click(screen.getByRole('button', { name: /entrar/i }));

		await waitFor(() => {
			expect(mockLoginUserFn).toHaveBeenCalledTimes(1);
		});

		const formData = mockLoginUserFn.mock.calls[0][0] as FormData;
		expect(formData.get('email')).toBe('teste@email.com');
		expect(formData.get('password')).toBe('123456');

		expect(vi.mocked(redirect)).toHaveBeenCalledWith('/');
	});

	it('NÃO deve redirecionar se o login falhar (retornar null/undefined)', async () => {
		const user = userEvent.setup();

		mockLoginUserFn.mockResolvedValue(null);

		render(<LoginForm />);

		await user.type(screen.getByLabelText(/email/i), 'errado@email.com');
		await user.click(screen.getByRole('button', { name: /entrar/i }));

		await waitFor(() => {
			expect(mockLoginUserFn).toHaveBeenCalled();
		});

		expect(vi.mocked(redirect)).not.toHaveBeenCalled();
	});
});
