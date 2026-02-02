'use client';

import {
	PaginationProvider,
	useProductPaginationContext,
} from '../context/product-context';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductPagination } from './product-pagination';
export const ProductView = () => {
	return (
		<PaginationProvider>
			<ProductContent />
		</PaginationProvider>
	);
};

const ProductContent = () => {
	const { products, loading } = useProductPaginationContext();
	return (
		<div className="mb-6">
			<ProductGrid products={products} loading={loading} />
			<ProductPagination />
		</div>
	);
};
