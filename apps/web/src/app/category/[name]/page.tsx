'use client';

import { GET_PRODUCT_BY_CATEGORY } from '@/api/graphql/get-product-by-category';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductHeader } from '@/features/product/components/product-header';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Product } from '@/components/product/product-grid';

interface GET_PRODUCT_BY_CATEGORY_DATA {
	category: {
		products: Product[];
	} | null;
}

interface GET_PRODUCT_BY_CATEGORY_VARIABLE {
	name: string;
}

export default function CategoryPage({
	params,
}: {
	params: Promise<{ name: string }>;
}) {
	const router = useRouter();
	const { name } = React.use(params);

	const { data, loading, error } = useQuery<
		GET_PRODUCT_BY_CATEGORY_DATA,
		GET_PRODUCT_BY_CATEGORY_VARIABLE
	>(GET_PRODUCT_BY_CATEGORY, {
		variables: { name },
		skip: !name,
	});

	useEffect(() => {
		if (!loading && (error || !data?.category)) {
			router.push('/');
		}
	}, [loading, data, error, router]);

	if (loading)
		return (
			<main>
				<ProductHeader />
				<div className="flex justify-center items-center min-h-64">
					<p>Loading products...</p>
				</div>
			</main>
		);

	if (error)
		return (
			<main>
				<ProductHeader />
				<div className="flex justify-center items-center min-h-64">
					<p className="text-red-500">
						Error loading category: {error.message}
					</p>
				</div>
			</main>
		);

	if (!data?.category) {
		return null;
	}

	return (
		<main>
			<ProductHeader />
			<ProductGrid products={data.category.products ?? []} />
		</main>
	);
}
