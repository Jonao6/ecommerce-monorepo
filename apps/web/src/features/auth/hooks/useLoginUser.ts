import { toast } from 'sonner';
import { GET_USER } from '../api/get-user';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { useAuthStore } from '@/store/auth-store';
const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

interface LoginResponse {
	getUser: {
		message: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export const useLoginUser = () => {
	const [getUser, { data, loading, error }] = useMutation<LoginResponse>(
		GET_USER,
		{
			fetchPolicy: 'no-cache',
		},
	);
	const { setUser } = useAuthStore();
	const loginUser = async (formData: FormData) => {
		try {
			const rawData = Object.fromEntries(formData);
			const loginData = LoginSchema.parse(rawData);

			const result = await getUser({
				variables: {
					input: loginData,
				},
			});
			const user = result?.data?.getUser?.user

			if (user) {
				toast.success(result.data!.getUser.message);
				setUser(user)
				return user;
			}
		} catch (err: any) {
			toast.error(error?.message)
		}
	};

	return { loginUser, loading, error, data };
};
