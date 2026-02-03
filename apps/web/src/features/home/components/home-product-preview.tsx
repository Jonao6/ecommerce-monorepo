import { Product, ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { getProducts } from '../api/get-products';

export const HomeProductPreview = async () => {
	const response = await getProducts({ limit: 12 });
	if (!response.success) {
		return (
			<section className="flex flex-col items-center bg-zinc-300 py-10 px-4">
				<p className="text-zinc-600">Não foi possível carregar os produtos.</p>
			</section>
		);
	}
	const rawProducts = response.data?.products?.products ?? [];

	const products: Product[] = rawProducts.map((product) => ({
		id: product.id,
		name: product.name,
		price: product.price,
		image: product.image ?? '/placeholder-image.png',
		description: product.description ?? '',
		category: product.category,
	}));

	return (
		<section className="flex flex-col items-center bg-zinc-300 py-10 px-4">
			<ProductGrid products={products} />
			<Button
				asChild
				size="lg"
				className="mt-6 h-12 w-52 text-xl font-medium font-barlow-semi-condensed tracking-wide"
			>
				<Link href="/product" className="flex items-center gap-2">
					<ArrowDown />
					<span>Mais produtos</span>
				</Link>
			</Button>
		</section>
	);
};
