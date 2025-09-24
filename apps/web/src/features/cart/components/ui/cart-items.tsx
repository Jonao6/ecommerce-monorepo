import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CartItem } from '@/store/cart-store';
import Image from 'next/image';

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
		<ul>
			{items.map((item) => (
				<li key={item.id} className="flex flex-row">
					<Image src={item.url} fill alt={item.name} />
					<div className="flex flex-col">
						<div>
							<p>{item.name}</p>
							<p>{item.price}</p>
						</div>
						<p>{`Tamanho: ${item.size}`}</p>

						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Selecione a quantidade" />
							</SelectTrigger>
							<SelectContent>
								<SelectLabel>Quantidade</SelectLabel>
								{Array.from({ length: 8 }, (_, index) => (
									<SelectItem key={index + 1} value={String(index + 1)}>
										{index + 1}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</li>
			))}
		</ul>
	);
};
