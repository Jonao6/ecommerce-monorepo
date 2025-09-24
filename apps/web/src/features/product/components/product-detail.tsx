'use client';
import { ProductImage } from '@/components/product/product-grid';
import { ProductOptions } from './product-options';
import { Product } from '@/components/product/product-grid';
import { useCartStore } from '@/store/cart-store';

interface ProductDetail {
	product: Product;
}

export const ProductDetail = ({ product }: ProductDetail) => {
	const { addItem } = useCartStore();
	return (
		<div className="flex flex-row gap-4 w-screen h-screen mb-4 p-2.5">
			<div className="w-[65%]">
				<ProductImage
					alt={product.name}
					src={product.image}
					className="drop-shadow-lg"
				/>
			</div>
			<ProductOptions
				name={product.name}
				price={product.price}
				colors={product.colors ? product.colors : ['Error']}
				sizes={product.sizes ? product.sizes : [404]}
				onAddToCart={() => addItem}
			/>
		</div>
	);
};
