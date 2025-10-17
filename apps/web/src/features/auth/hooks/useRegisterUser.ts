import { toast } from 'sonner';
import { CREATE_USER } from '../api/create-user';
import { useMutation } from '@apollo/client/react';
import { z } from 'zod';

const UserSchema = z.object({
	email: z.email({ error: 'Email inválido' }),
	password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
	name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
});

type User = {
	name: string;
	email: string;
	phone: number;
	password: string;
};

export const useRegisterUser = () => {
	const [createUser, { data, loading, error }] = useMutation<{
		createUser: User;
	}>(CREATE_USER);

	const registerUser = async (formData: FormData) => {
		try {
			const rawData = Object.fromEntries(formData);
			const userData = UserSchema.parse(rawData) as User;

			const result = await createUser({
				variables: {
					input: userData,
				},
			});

			if (result.data?.createUser) {
				toast.success('Usuário criado com sucesso!');
				return result.data.createUser;
			}
		} catch (err: any) {
			if (err.errors) {
				toast.error('Dados inválidos: ' + err.errors[0]?.message);
				return;
			}

			if (err.graphQLErrors?.[0]?.extensions?.code === 'USER_ALREADY_EXISTS') {
				toast.error('Este usuário já existe');
			} else {
				toast.error('Erro ao criar usuário');
			}
		}
	};

	return { registerUser, loading, error, data };
};
