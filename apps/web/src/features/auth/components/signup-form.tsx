import Form from 'next/form';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export const SignupForm = () => {
	return (
		<Form action="">
			<Label>Nome</Label>
			<Input name="name" type="text" />
			<Label>Email</Label>
			<Input name="email" type="email" />
			<Label>Telefone</Label>
			<Input name="phone" type="tel" />
			<Label>Senha</Label>
			<Input name="password" type="password" />
			<Button type="submit"></Button>
		</Form>
	);
};
