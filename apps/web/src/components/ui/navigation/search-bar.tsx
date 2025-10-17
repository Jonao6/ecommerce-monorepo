'use client';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../button/button';
import { Input } from '../input';
import { useRouter } from 'next/navigation';
export const SearchBar = () => {
	const [product, setProduct] = useState('');
	const router = useRouter();
	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault();

		setProduct(event.target.value);
	}

	function handleSearch() {
		router.push(`/product`)
	}
	
	return (
		<div className="flex flex-row bg-zinc-200 rounded-lg text-xs">
			<Input
				placeholder="Procurar"
				value={product}
				onChange={handleInputChange}
				className="border-0 font-inter "
			/>
			<Button variant={'outline'} onClick={handleSearch} className="bg-zinc-200">
				<Search className="text-zinc-900 size-7" />
			</Button>
		</div>
	);
};
