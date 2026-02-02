import { z } from 'zod';
import { toast } from 'sonner';
import { CreateUserDocument, CreateUserMutationVariables } from '@/gql/graphql';
import { useMutation } from '@apollo/client/react';

const signupSchema = z.object({
	email: z.email('Email inválido'),
	password: z.string().min(6, 'Senha curta'),
	name: z.string().min(3, 'Nome curto'),
});

export const useRegisterUser = () => {
	const [mutate, { loading }] = useMutation(CreateUserDocument);

	const registerUser = async (input: CreateUserMutationVariables['input']) => {
		const response = await mutate({
			variables: { input },
		});
		return response.data?.createUser;
	};

	const handleRegister = async (formData: FormData) => {
		try {
			const rawData = Object.fromEntries(formData);
			const validData = signupSchema.parse(rawData);

			const user = await registerUser({
				email: validData.email,
				password: validData.password,
				name: validData.name,
			});

			if (user) {
				toast.success(`Bem-vindo, ${user.name}!`);
				return user;
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(error.message);
			} else if (error || error instanceof Error) {
				toast.error(
					error instanceof Error ? error.message : 'Erro no servidor',
				);
			}
		}
	};

	return {
		handleRegister,
		loading,
	};
};
