'use client';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useAuthStore } from '@/store/auth-store';
import { CircleUser, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button/button';
import { useMutation } from '@apollo/client/react';
import { LOGOUT } from '@/api/graphql/logout';
import { Toaster, toast } from 'sonner';

export const UserMenu = () => {
	const { user, logout } = useAuthStore();
	const [logoutMutation] = useMutation(LOGOUT, {
		onCompleted: async () => {
			logout();
			toast.success('Usuário Desconectado com Sucesso');
		},
		onError: (error) => {
			toast.error('Erro ao desconectar: ' + error.message);
			logout();
		},
	});
	const logoutUser = () => {
		logoutMutation();
	};
	return (
		<Popover>
			<PopoverTrigger aria-label="menu do usuário">
				<User className="size-7 cursor-pointer" />
			</PopoverTrigger>

			<PopoverContent className="flex flex-col justify-center w-80 font-inter items-center">
				{user ? (
					<>
						<div className="flex flex-col justify-center items-center border-b-2 w-full mb-3 ">
							<CircleUser width={55} height={55} />
							<p className="text-base font-medium font-barlow-semi-condensed">
								{user.name}
							</p>
						</div>
						<div className="w-full h-full font-inter">
							<div className="flex flex-col px-1 w-full">
								<Link
									className="text-sm font-medium hover:underline"
									href={'/dashboard'}
								>
									Dashboard
								</Link>
							</div>
							<div className="flex justify-end w-full">
								<Button
									variant={'destructive'}
									size="sm"
									className="mt-6 font-barlow-semi-condensed"
									onClick={logoutUser}
								>
									Desconectar
								</Button>
							</div>
						</div>
					</>
				) : (
					<Button>
						<Link href={'/signin'}>Clique aqui para Entrar</Link>
					</Button>
				)}
				<Toaster />
			</PopoverContent>
		</Popover>
	);
};
