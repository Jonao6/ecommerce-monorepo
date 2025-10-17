import { ProductImage } from '@/components/product/product-grid';
import { ProductOptions } from './product-options';
import { Product } from '@/components/product/product-grid';

interface ProductDetail {
	product: Product;
}

export const ProductDetail = ({ product }: ProductDetail) => {
	return (
		<div className="flex flex-row gap-4 w-screen h-screen mb-4 p-2.5">
				<ProductImage
					alt={product.name}
					src={product.image}
					className="drop-shadow-lg h-12/12"
				/>
			<ProductOptions
				product={product}
			/>
		</div>
	);
};
