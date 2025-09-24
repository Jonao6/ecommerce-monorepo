import Form from 'next/form';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export const LoginForm = () => {
	return (
		<Form action="">
			<Label>Email</Label>
			<Input name="email" type="email" />
			<Label>Senha</Label>
			<Input name="password" type="password" />
			<Button type="submit"></Button>
		</Form>
	);
};
