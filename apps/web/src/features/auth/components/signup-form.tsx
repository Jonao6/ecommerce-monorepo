'use client';
import Form from 'next/form';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterUser } from '../hooks/useRegisterUser';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
export const SignupForm = () => {
	const { registerUser } = useRegisterUser();

	const handleSubmit = async (formData: FormData) => {
		const user = await registerUser(formData);

		if (user) {
			redirect('/');
		}
	};
	return (
		<div>
			<Form action={handleSubmit}>
				<Label>Nome</Label>
				<Input name="name" type="text" />
				<Label>Email</Label>
				<Input name="email" type="email" />
				<Label>Senha</Label>
				<Input name="password" type="password" />
				<Button type="submit"></Button>
			</Form>
			<Toaster />
		</div>
	);
};
