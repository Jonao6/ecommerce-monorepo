'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useProductPagination } from '../hooks/use-product-pagination';

type ProductPaginationContextType = ReturnType<typeof useProductPagination>;

const ProductPaginationContext =
	createContext<ProductPaginationContextType | null>(null);

export const PaginationProvider = ({ children }: { children: ReactNode }) => {
	const pagination = useProductPagination();
	return (
		<ProductPaginationContext.Provider value={pagination}>
			{children}
		</ProductPaginationContext.Provider>
	);
};

export const useProductPaginationContext = () => {
	const context = useContext(ProductPaginationContext);
	if (!context) {
		throw new Error(
			'useProductPaginationContext must be used within a PaginationProvider',
		);
	}
	return context;
};
