import { render, screen, waitFor } from '@/testing/test-utils';
import userEvent from '@testing-library/user-event';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignupForm } from '@/features/auth/components/signup-form';

const mockSignupFn = vi.fn();

vi.mock('@/features/auth/hooks/use-register-user', () => ({
	useRegisterUser: () => ({
		handleRegister: mockSignupFn,
		loading: false,
		error: null,
	}),
}));

describe('Unit: SignupForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('deve renderizar os campos de email e senha corretamente', () => {
		render(<SignupForm />);
		expect(
			screen.getByRole('heading', { name: /registrar/i }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /registrar/i }),
		).toBeInTheDocument();
	});

	it('deve chamar registerUser com os dados corretos e redirecionar em caso de sucesso', async () => {
		const user = userEvent.setup();
		mockSignupFn.mockResolvedValue({ name: 'Teste', email: 'teste@email.com' });

		render(<SignupForm />);

		await user.type(screen.getByLabelText(/nome/i), 'Teste');
		await user.type(screen.getByLabelText(/email/i), 'teste@email.com');
		await user.type(screen.getByLabelText(/senha/i), '123456');

		const submitButton = screen.getByRole('button', { name: 'REGISTRAR' });
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockSignupFn).toHaveBeenCalledTimes(1);
		});

		const formData = mockSignupFn.mock.calls[0][0] as FormData;
		expect(formData.get('name')).toBe('Teste');
		expect(formData.get('email')).toBe('teste@email.com');
		expect(formData.get('password')).toBe('123456');

		expect(vi.mocked(redirect)).toHaveBeenCalledWith('/signin');
	});
	it('NÃO deve redirecionar se o Registro falhar', async () => {
		const user = userEvent.setup();
		mockSignupFn.mockResolvedValue(null);

		render(<SignupForm />);

		await user.type(screen.getByLabelText(/nome/i), 'Teste Falha');
		await user.type(screen.getByLabelText(/email/i), 'errado@email.com');
		await user.type(screen.getByLabelText(/senha/i), '123456');

		await user.click(screen.getByRole('button', { name: /registrar/i }));

		await waitFor(() => {
			expect(mockSignupFn).toHaveBeenCalled();
		});

		expect(vi.mocked(redirect)).not.toHaveBeenCalled();
	});
});
