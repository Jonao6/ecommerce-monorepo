import Image from 'next/image';
import Link from 'next/link';
import { HeaderCart } from '@/components/ui/header-cart';

export default function CartLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<header className="flex flex-row justify-between items-center gap-6 px-60 w-full border-b">
				<Link href="/">
					<Image alt="SneakLine-Logo" src="/logo.png" width={90} height={45} />
				</Link>
				<HeaderCart />
			</header>
			{children}
		</>
	);
}
