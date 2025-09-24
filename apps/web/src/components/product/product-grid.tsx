import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
type ProductImageProps = {
	src: string;
	alt: string;
	className?: string;
};

interface category {
	name: string
}
export type Product = {
	id: string;
	name: string;
	price: number;
	category: category
	createdAt?: Date;
	image: string;
	colors?: string[];
	sizes?: number[];
};

interface ProductItemProps {
	product: Product;
}

interface ProductGridProps {
	products: Product[];
	loading?: boolean;
}
const ProductImage = ({ src, alt, className }: ProductImageProps) => {
	return (
		<div
			className={clsx(
				'relative w-full flex items-center',
				className,
			)}
		>
			<Image src={src} fill alt={alt} className="object-cover" />
		</div>
	);
};

const ProductItem = ({ product }: ProductItemProps) => {
	return (
		<Link
			href={`product/${product.id}`}
			className="shadow-md rounded-2xl bg-card overflow-hidden hover:ring-1 hover:ring-accent-foreground"
		>
			<div>
				<ProductImage src={product.image} alt={product.name} />
				<div className="flex flex-col border-t border-zinc-300 font-inter px-3.5 py-6 gap-0.5">
					<p className="font-bold text-lg md:text-xl text-foreground">
						${product.price} USD
					</p>
					<p className="font-normal text-sm md:text-base text-accent-foreground">
						{product.name}
					</p>
					<p className="font-light text-xs md:text-sm text-accent-foreground">
						{product.category.name}
					</p>
				</div>
			</div>
		</Link>
	);
};

const ProductGrid = ({ products, loading }: ProductGridProps) => {
	if (loading) return <div>Loading</div>;
	return (
		<div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 gap-10 px-40 py-10 w-full">
			{products.map((product, index) => (
				<ProductItem key={index} product={product} />
			))}
		</div>
	);
};

export { ProductGrid, ProductItem, ProductImage };
