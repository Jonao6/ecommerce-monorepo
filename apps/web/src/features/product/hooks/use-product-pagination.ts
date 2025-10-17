'use client';

import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS_PAGINATION } from '../api/get-products';
import { Product } from '@/components/product/product-grid';
import { useEffect, useState } from 'react';
import { useProductPaginationContext } from '../context/product-context';

interface ProductsResponse {
	products: Product[];
	currentPage: number;
	totalCount: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	totalPages: number;
}
interface GetProductsData {
	products: ProductsResponse
}

interface GetProductsVariable {
	limit: number;
	offset: number;
}

export function useProductPagination() {
	const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

	const { loading, error, data, fetchMore } = useQuery<
		GetProductsData,
		GetProductsVariable
	>(GET_PRODUCTS_PAGINATION, {
		variables: {
			limit: pageSize,
			offset: (currentPage - 1) * pageSize,
		},
	});

	const productsResponse = data?.products;

	return {
		products: productsResponse?.products || [],
    loading,
    error,
    currentPage: productsResponse?.currentPage || currentPage,
    totalCount: productsResponse?.totalCount || 0,
    hasNextPage: productsResponse?.hasNextPage || false,
    hasPreviousPage: productsResponse?.hasPreviousPage || false,
    totalPages: productsResponse?.totalPages || 0,
    setCurrentPage,
    pageSize,
	};
}
