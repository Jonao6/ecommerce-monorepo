import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from 'lucide-react';

interface ProductOptionsProps {
	name: string;
	price: number;
	colors: string[];
	sizes: number[];
	onAddToCart: () => void;
}

export const ProductOptions = ({
	name,
	price,
	colors,
	sizes,
	onAddToCart,
}: ProductOptionsProps) => {
	return (
		<div className="flex flex-col gap-12 w-lg h-full p-8">
			<div className='flex-1'>
				<div>
					<h1 className="font-bold font-inter text-xl">{name.toUpperCase()}</h1>
					<h2 className="font-bold font-inter text-base">{`R$ ${price}`}</h2>
					<p className="font-inter font-light mt-2 mb-12">{`Até 5x R$${price / 5} sem juros`}</p>
				</div>
				<div className="flex flex-col gap-10">
					<div className="flex flex-col gap-2">
						<p className="font-inter text-base font-bold">Cores</p>
						<div>
							{colors.map((color, index) => (
								<Button
									key={index}
									variant="outline"
									className="w-24 h-14 mr-2.5 font-inter font-foreground font-medium text-sm bg-muted border-0"
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
									variant="outline"
									className="w-24 h-14 mr-2.5 font-inter font-medium font-foreground text-sm bg-muted border-0"
								>
									{size}
								</Button>
							))}
						</div>
					</div>
				</div>
			</div>
			<Button
				onClick={onAddToCart}
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
