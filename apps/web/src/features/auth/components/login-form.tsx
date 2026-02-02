'use client';
import Form from 'next/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginUser } from '@/features/auth/hooks/use-login-user';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';

export const LoginForm = () => {
	const { loginUser } = useLoginUser();

	const handleSubmit = async (formData: FormData) => {
		const user = await loginUser(formData);

		if (user) {
			redirect('/');
		}
	};
	return (
		<div className="flex flex-col justify-center gap-4 w-5/12 px-30 py-30">
			<h1 className="text-xl font-normal font-inter tracking-widest">Entrar</h1>
			<Form action={handleSubmit} className="flex flex-col gap-5">
				<div className="px-3">
					<Label htmlFor="email" className="text-sm font-inter mb-2">
						Email
					</Label>
					<Input id="email" placeholder="Email" name="email" type="email" />
				</div>
				<div className="px-3">
					<Label htmlFor="password" className="text-sm font-inter mb-2">
						Senha
					</Label>
					<Input
						id="password"
						placeholder="Senha"
						name="password"
						type="password"
					/>
				</div>
				<div className="w-full flex justify-center">
					<Button
						className="font-barlow-semi-condensed text-sm font-medium rounded-2xl px-10 py-5 w-4/12"
						type="submit"
					>
						ENTRAR
					</Button>
				</div>
			</Form>
			<Link
				className="text-xs font-inter hover:underline w-full text-center"
				href={'/signup'}
			>
				Ainda não tem Conta?
			</Link>
			<Toaster />
		</div>
	);
};
