'use client';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/components/product/product-grid';
import { CartItem, useCartStore } from '@/store/cart-store';

interface ProductOptionsProps {
	product: Product;
}
export const ProductOptions = ({ product }: ProductOptionsProps) => {
	const { id, name, price, colors, sizes, image } = product;
	if (!colors || !sizes) return;
	const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
	const [selectedSize, setSelectedSize] = useState<number>(sizes[0]);
	const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

	const { addItem } = useCartStore();
	const item: CartItem = {
		id: id,
		name: name,
		price: price,
		image: image,
		color: selectedColor,
		size: selectedSize,
		quantity: selectedQuantity,
	};
	return (
		<div className="flex flex-col gap-12 w-lg h-full p-8">
			<div className="h-11/12">
				<div>
					<h1 className="font-bold font-inter text-xl">{name.toUpperCase()}</h1>
					<h2 className="font-bold font-inter text-base">{`R$ ${price}`}</h2>
					<p className="font-inter font-light mt-2 mb-12">{`Até 5x R$${(price / 5).toFixed(2)} sem juros`}</p>
				</div>
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-2">
						<p className="font-inter text-base font-bold">Cores</p>
						<div>
							{colors.map((color, index) => (
								<Button
									key={index}
									onClick={() => setSelectedColor(color)}
									variant="outline"
									className={`w-24 h-14 mr-2.5 font-inter font-medium font-foreground text-sm transition-all ${
										selectedColor === color
											? 'border-primary bg-none'
											: 'border-muted bg-muted '
									}`}
								>
									{color}
								</Button>
							))}
						</div>
					</div>

					<div className="flex gap-2 flex-col">
						<p className="font-inter text-base font-bold">Tamanhos</p>
						<div>
							{sizes.map((size, index) => (
								<Button
									key={index}
									onClick={() => setSelectedSize(size)}
									variant="outline"
									className={`w-24 h-14 mr-2.5 font-inter font-medium font-foreground text-sm transition-all ${
										selectedSize === size
											? 'border-primary bg-none'
											: 'border-muted bg-muted'
									}`}
								>
									{size}
								</Button>
							))}
						</div>
					</div>
					<div className="flex gap-2 flex-col">
						<p className="font-inter text-base font-bold">Quantidade</p>
						<div className="flex flex-row text-center">
							<Button
								onClick={() => setSelectedQuantity(selectedQuantity - 1)}
								disabled={selectedQuantity <= 0}
							>
								<Minus className="text-white" />
							</Button>
							<span className="font-barlow-semi-condensed text-lg text-center bg-muted w-18">
								{selectedQuantity}
							</span>
							<Button
								onClick={() => setSelectedQuantity(selectedQuantity + 1)}
								disabled={selectedQuantity >= 10}
							>
								<Plus className="text-white" />
							</Button>
						</div>
					</div>
				</div>
			</div>
			<Button
				onClick={() => addItem(item)}
				className="w-[425px] h-14 gap-2.5 rounded-md drop-shadow-secondary"
			>
				<span className="font-barlow-semi-condensed text-xl font-medium tracking-wide">
					ADICIONAR AO CARRINHO
				</span>
				<ShoppingCartIcon className="size-6" />
			</Button>
		</div>
	);
};
