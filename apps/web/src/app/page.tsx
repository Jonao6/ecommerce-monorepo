import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { categories as categoriesData } from '@/data/ts/category';
import { HeroSection } from '@/features/home/components/hero-section';
import { HomeCategory } from '@/features/home/components/home-category';
import { HomeProductPreview } from '@/features/home/components/home-product-preview';
import { SearchBar } from '@/features/search/components/search-bar';

export default function Home() {
	const { categories } = categoriesData;
	return (
		<main>
				<Header>{<SearchBar />}</Header>
				<HeroSection />
				<HomeCategory categories={categories} />
				<HomeProductPreview />
				<Footer />
		</main>
	);
}
