'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '../ui/navigation/navigation';
import { SearchBar } from '../ui/navigation/search-bar';
import { HeaderCart } from '../ui/header-cart';
import { UserMenu } from '../ui/user-menu';
import { useQuery } from '@apollo/client/react';
import { GET_CATEGORIES } from '@/api/graphql/get-categories';

interface GET_CATEGORIES_DATA {
	categories: { name: string }[];
}
export const Header = () => {
	const { data } = useQuery<GET_CATEGORIES_DATA>(GET_CATEGORIES);
	return (
		<header className="grid grid-cols-3 grid-rows-1 items-center gap-6 px-14 border-b">
			<Link href="/">
				<Image alt="SneakLine-Logo" src="/logo.png" width={87} height={45} />
			</Link>
			<div className="flex flex-row justify-center">
				<Navigation links={data?.categories ?? []} />
			</div>
			<div className="flex flex-row justify-end items-center gap-5">
				<SearchBar />
				<UserMenu />
				<HeaderCart />
			</div>
		</header>
	);
};
