'use client';

import { Product, ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button/button';
import { GET_PRODUCTS } from '@/features/home/api/get-products';
import { useQuery } from '@apollo/client/react';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface GetProductsData {
	products: {
		products: Product[];
	};
}
interface GetProductsVariables {
	limit: number;
}

export const HomeProductPreview = () => {
	const { data } = useQuery<GetProductsData, GetProductsVariables>(
		GET_PRODUCTS,
		{
			variables: {
				limit: 9,
			},
		},
	);

	const products: Product[] = data?.products.products || [];

	console.log(products);
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
