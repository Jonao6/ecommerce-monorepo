'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSearch } from '../hooks/use-search';
import { SearchInput } from './ui/search-input';
import { SearchResults } from './ui/search-results';

export const SearchBar = () => {
	const router = useRouter();
	const {
		searchTerm,
		setSearchTerm,
		searchRef,
		products,
		loading,
		hasResults,
		shouldShowResults,
		setShowResults,
	} = useSearch();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setSearchTerm(event.target.value);
	};

	const handleSearch = () => {
		if (searchTerm.trim()) {
			router.push(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
			setShowResults(false);
		} else {
			router.push(`/product`);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSearch();
		} else if (event.key === 'Escape') {
			setShowResults(false);
		}
	};

	const handleFocus = () => {
		if (searchTerm.trim().length >= 2 && hasResults) {
			setShowResults(true);
		}
	};

	const handleItemClick = () => {
		setShowResults(false);
	};

	return (
		<div ref={searchRef} className="relative w-7/12">
			<SearchInput
				value={searchTerm}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onSearch={handleSearch}
			/>
			{shouldShowResults && (
				<SearchResults
					products={products}
					loading={loading}
					onItemClick={handleItemClick}
				/>
			)}
		</div>
	);
};
