import { SearchProduct } from '../../types/product';
import { SearchResultItem } from './search-result-item';

interface SearchResultsProps {
	products: SearchProduct[];
	loading: boolean;
	onItemClick: () => void;
}

export const SearchResults = ({
	products,
	loading,
	onItemClick,
}: SearchResultsProps) => {
	return (
		<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
			{loading ? (
				<div className="p-4 text-center text-zinc-600 font-inter">
					Procurando...
				</div>
			) : products.length > 0 ? (
				<div className="py-2">
					{products.map((product) => (
						<SearchResultItem
							key={product.id}
							product={product}
							onClick={onItemClick}
						/>
					))}
				</div>
			) : (
				<div className="p-4 text-center text-zinc-600">
					Nenhum produto encontrado
				</div>
			)}
		</div>
	);
};
