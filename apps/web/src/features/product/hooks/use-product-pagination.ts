'use client';

import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS } from '@/api/graphql/get-products';
import { usePagination } from '../context/product-context';
import { Product } from '@/components/product/product-grid';

interface GetProductsData {
	products: Product[];
	productsCount: number;
}

interface GetProductsVariable {
	limit: number;
	offset: number;
}

export function useProductPagination() {
	const { currentPage, pageSize, setTotalPages } = usePagination();

	const { loading, error, data } = useQuery<
		GetProductsData,
		GetProductsVariable
	>(GET_PRODUCTS, {
		variables: {
			limit: pageSize,
			offset: currentPage * pageSize,
		},
	});

	const totalCount = data?.productsCount || 0;
	const calculatedTotalPages = Math.ceil(totalCount / pageSize);
	setTotalPages(calculatedTotalPages);

	const products = data?.products || [];

	return {
		products,
		loading,
		error,
		currentPage,
		pageSize,
	};
}
