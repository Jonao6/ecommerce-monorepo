import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation, NavigationLink } from '../ui/navigation/navigation';
import { SearchBar } from '../ui/navigation/search-bar';
import { HeaderCart } from '../ui/header-cart';
const testNavigation: NavigationLink[] = [
	{ href: '/product/nike', label: 'Nike' },
	{ href: '/product/adidas', label: 'Adidas' },
	{ href: '/product/puma', label: 'Puma' },
	{ href: '/product/fila', label: 'Fila' },
	{ href: '/product/converse', label: 'converse' },
];
export const Header = () => {
	return (
		<header className="grid grid-cols-3 grid-rows-1 items-center gap-6 px-14 border-b">
			<Link href="/">
				<Image alt="SneakLine-Logo" src="/logo.png" width={87} height={45} />
			</Link>
			<div className="flex flex-row justify-center">
				<Navigation links={testNavigation} />
			</div>
			<div className="flex flex-row justify-end items-center gap-5">
				<SearchBar />
				<User className="size-7" />
				<HeaderCart />
			</div>
		</header>
	);
};
