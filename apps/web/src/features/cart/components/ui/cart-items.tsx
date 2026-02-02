import { ProductImage } from '@/components/product/product-grid';
import { CartItem } from '@/store/cart-store';
interface CartItemsProps {
	items: CartItem[];
}
export const CartItems = ({ items }: CartItemsProps) => {
	if (!items || items.length === 0) {
		return (
			<div>
				<h1>Seu carrinho está vazio </h1>
			</div>
		);
	}

	return (
		<ul className="flex flex-col w-full gap-8">
			{items.map((item) => (
				<li
					key={`${item.id}-${item.size}-${item.color}`}
					className="flex flex-row border drop-shadow-xs"
				>
					<div className="w-80 h-48">
						<ProductImage
							src={item.image}
							alt={item.name}
							className="w-full h-full border-r"
						/>
					</div>
					<div className="flex flex-col font-inter w-full h-full px-12 py-8">
						<div className="flex flex-row justify-between w-full">
							<p>{item.name}</p>
							<p>{`R$${Number(item.price || 0).toFixed(2)}`}</p>
						</div>
						<p className="mb-5">{`Tamanho: ${item.size}`}</p>
						<p> {`Quantidade: ${item.quantity}`}</p>
					</div>
				</li>
			))}
		</ul>
	);
};
