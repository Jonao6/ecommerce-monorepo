'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface PaginationContextProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	setTotalPages: (pages: number) => void;
	pageSize: number;
}

const PaginationContext = createContext<PaginationContextProps | undefined>(
	undefined,
);

export function PaginationProvider({ children }: { children: ReactNode }) {
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const pageSize = 12;
	return (
		<PaginationContext.Provider
			value={{
				currentPage,
				totalPages,
				setCurrentPage,
				setTotalPages,
				pageSize,
			}}
		>
			{children}
		</PaginationContext.Provider>
	);
}

export function usePagination() {
	const context = useContext(PaginationContext);
	if (context === undefined) {
		throw new Error('usePagination must be used within a PaginationProvider');
	}
	return context;
}
