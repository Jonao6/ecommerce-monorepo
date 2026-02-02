import Image from 'next/image';
import Link from 'next/link';
import { SearchProduct } from '../../types/product';

interface SearchResultItemProps {
	product: SearchProduct;
	onClick: () => void;
}

export const SearchResultItem = ({
	product,
	onClick,
}: SearchResultItemProps) => {
	return (
		<Link
			href={`/product/${product.id}`}
			onClick={onClick}
			className="flex items-center gap-3 p-3 hover:bg-zinc-100 transition-colors border-b border-zinc-200 last:border-b-0"
		>
			<div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden">
				<Image
					src={product.image || 'default.jpg'}
					alt={product.name}
					fill
					className="object-cover"
					sizes="64px"
				/>
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-sm text-zinc-900 truncate">
					{product.name}
				</p>
				<p className="text-xs text-zinc-600">{product.category.name}</p>
				<p className="font-bold text-sm text-zinc-900 mt-1">
					R$ {product.price}
				</p>
			</div>
		</Link>
	);
};
