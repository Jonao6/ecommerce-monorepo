import { useEffect, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { ProductsBySearchDocument, ProductsBySearchQuery } from '@/gql/graphql';

export const useSearch = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [showResults, setShowResults] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	const [searchProducts, { data, loading }] =
		useLazyQuery<ProductsBySearchQuery>(ProductsBySearchDocument, {
			fetchPolicy: 'network-only',
		});

	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchTerm.trim().length >= 2) {
				searchProducts({ variables: { term: searchTerm.trim() } });
				setShowResults(true);
			} else {
				setShowResults(false);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm, searchProducts]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowResults(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const products = data?.productsBySearch || [];
	const hasResults = products.length > 0;
	const shouldShowResults = showResults && searchTerm.trim().length >= 2;

	return {
		searchTerm,
		setSearchTerm,
		showResults,
		setShowResults,
		searchRef,
		products,
		loading,
		hasResults,
		shouldShowResults,
	};
};
