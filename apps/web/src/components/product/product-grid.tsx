import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { Spinner } from '../ui/spinner';

type ProductImageProps = {
	src: string;
	alt: string;
	className?: string;
};

interface Category {
	name: string;
}

export type Product = {
	id: string;
	name: string;
	price: number;
	category: Category;
	createdAt?: Date;
	image: string;
	colors?: string[] | null;
	sizes?: number[] | null;
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
				'relative w-full overflow-hidden bg-muted',
				'aspect-5/6 sm:aspect-3/4',
				className,
			)}
		>
			<Image
				src={src}
				fill
				alt={alt}
				fetchPriority="high"
				className="object-cover transition-transform duration-300 group-hover:scale-105"
				priority={false}
				sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
			/>
		</div>
	);
};

const ProductItem = ({ product }: ProductItemProps) => {
	return (
		<Link
			href={`/product/${product.id}`}
			className="
        group block overflow-hidden rounded-2xl bg-card shadow-sm
        ring-1 ring-transparent hover:ring-accent-foreground/40
        transition
      "
		>
			<div id={product.id}>
				<ProductImage src={product.image} alt={product.name} />

				<div className="flex flex-col border-t border-zinc-200 px-3 py-4 sm:px-4 sm:py-5 gap-1">
					<h1 className="font-inter font-bold text-base sm:text-lg text-foreground">
						R$ {product.price}
					</h1>

					<h2 className="font-inter text-sm sm:text-base text-accent-foreground line-clamp-2">
						{product.name}
					</h2>

					<h3 className="font-inter text-xs sm:text-sm text-accent-foreground/80">
						{product.category.name}
					</h3>
				</div>
			</div>
		</Link>
	);
};

const ProductGrid = ({ products, loading }: ProductGridProps) => {
	if (loading)
		return (
			<div className="flex items-center justify-center w-full py-16">
				<Spinner className="size-10" />
			</div>
		);

	return (
		<div
			className="
        w-full
        grid grid-cols-2 gap-4
        sm:gap-6
        md:grid-cols-3
        lg:grid-cols-4
        px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24
        py-6 sm:py-8
      "
		>
			{products.map((product) => (
				<ProductItem key={product.id} product={product} />
			))}
		</div>
	);
};

export { ProductGrid, ProductItem, ProductImage };
