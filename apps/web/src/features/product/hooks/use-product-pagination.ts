'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ProductsDocument, ProductsQuery } from '@/gql/graphql';

export function useProductPagination() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 12;

	const { data, loading, error } = useQuery<ProductsQuery>(ProductsDocument, {
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
