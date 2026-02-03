import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SearchBar } from '@/features/search/components/search-bar';

export default function CartLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header>
				<SearchBar />
			</Header>
			{children}
			<Footer />
		</>
	);
}
