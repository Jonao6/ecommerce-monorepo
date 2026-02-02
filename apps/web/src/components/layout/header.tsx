'use client';
import { useQuery } from '@apollo/client/react';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderCart } from '../ui/header-cart';
import { Navigation } from '../ui/navigation/navigation';
import { UserMenu } from '../ui/user-menu';
import { CategoriesDocument, CategoriesQuery } from '@/gql/graphql';

export const Header = ({ children }: { children: React.ReactNode }) => {
	const { data } = useQuery<CategoriesQuery>(CategoriesDocument);

	return (
		<header className="grid grid-cols-3 grid-rows-1 items-center gap-6 px-14 border-b">
			<Link href="/">
				<Image alt="SneakLine-Logo" src="/logo.png" width={87} height={45} />
			</Link>
			<div className="flex flex-row justify-center">
				<Navigation links={data?.categories ?? []} />
			</div>
			<div className="flex flex-row justify-end items-center gap-5">
				{children}
				<UserMenu />
				<HeaderCart />
			</div>
		</header>
	);
};
