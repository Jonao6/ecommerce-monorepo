'use client';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useAuthStore } from '@/store/auth-store';
import { User } from 'lucide-react';
import Link from 'next/link';

export const UserMenu = () => {
	const { user } = useAuthStore();
	if (!user) return <Link href={'/signin'}>Clique aqui para Entrar</Link>;
	const { name, email } = user;
	return (
		<Popover>
			<PopoverTrigger>
				<User className="size-7 cursor-pointer" />
			</PopoverTrigger>

			<PopoverContent className="w-80 font-inter">
				<p className='text-sm w-full'>{name}</p>
				<p className='text-sm'>{email}</p>
        <h1 className='text-destructive'>EM CONSTRUÇÃO</h1>
			</PopoverContent>
		</Popover>
	);
};
