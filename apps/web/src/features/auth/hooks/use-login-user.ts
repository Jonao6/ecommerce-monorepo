import { toast } from 'sonner';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { useAuthStore } from '@/store/auth-store';
import {
	GetUserDocument,
	GetUserMutation,
	GetUserMutationVariables,
} from '@/gql/graphql';
const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});
export const useLoginUser = () => {
	const [getUser, { loading, error, data }] = useMutation<
		GetUserMutation,
		GetUserMutationVariables
	>(GetUserDocument, {
		fetchPolicy: 'network-only',
	});
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
			const user = result?.data?.getUser?.user;

			if (user) {
				toast.success(result.data?.getUser.message);
				setUser(user);
				return user;
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error?.message);
			}
		}
	};

	return { loginUser, loading, error, data };
};
