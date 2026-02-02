import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

interface SearchInputProps {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	onFocus: () => void;
	onSearch: () => void;
}

export const SearchInput = ({
	value,
	onChange,
	onKeyDown,
	onFocus,
	onSearch,
}: SearchInputProps) => {
	return (
		<div className="flex flex-row bg-zinc-200 rounded-lg text-xs font-inter">
			<Input
				placeholder="Procurar"
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				onFocus={onFocus}
				type="search"
				className="border-0 font-inter"
			/>
			<Button variant={'outline'} onClick={onSearch} className="bg-zinc-200">
				<Search className="text-zinc-900 size-7" />
			</Button>
		</div>
	);
};
