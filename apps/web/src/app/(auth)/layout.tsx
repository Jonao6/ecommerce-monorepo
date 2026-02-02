import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex flex-col items-center h-screen w-full">
			<header className="flex justify-center items-center gap-6 w-full border-b mb-20">
				<Link href="/">
					<Image alt="SneakLine-Logo" src="/logo.png" width={100} height={60} />
				</Link>
			</header>
			{children}
		</main>
	);
}
