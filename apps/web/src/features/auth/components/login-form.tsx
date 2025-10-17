'use client';
import Form from 'next/form';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginUser } from '../hooks/useLoginUser';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';

export const LoginForm = () => {
	const { loginUser } = useLoginUser();

	const handleSubmit = async (formData: FormData) => {
		const user = await loginUser(formData);

		if (user) {
			redirect('/');
		}
	};
	return (
		<div>
			<Form action={handleSubmit}>
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
