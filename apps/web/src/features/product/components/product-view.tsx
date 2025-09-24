'use client';

import { PaginationProvider } from '../context/product-context';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductPagination } from './product-pagination';
import { useProductPagination } from '../hooks/use-product-pagination';
export const ProductView = () => {
	return (
		<PaginationProvider>
			<ProductContent />
		</PaginationProvider>
	);
};

const ProductContent = () => {
	const { products, loading } = useProductPagination();
	return (
		<>
			<ProductGrid products={products} loading={loading} />
			<ProductPagination />
		</>
	);
};
