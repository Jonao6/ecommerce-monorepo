'use client';

import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { totalPrice } from '@/lib/total-price';
import { useCartStore } from '@/store/cart-store';
import { ShoppingBag, Trash } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';

export const HeaderCart = () => {
	const { items, clear, removeItem } = useCartStore();
	const total = totalPrice(items);

	return (
		<Popover>
			<PopoverTrigger>
				<ShoppingBag className="size-7 cursor-pointer" />
			</PopoverTrigger>

			<PopoverContent className="w-80">
				{items.length === 0 ? (
					<p className="text-sm text-gray-500">Seu carrinho está vazio</p>
				) : (
					<>
						<ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
							{items.map((item) => (
								<li key={item.id} className="flex items-center gap-3">
									<div className="relative w-12 h-12">
										<Image
											fill
											src={item.url}
											alt={item.name}
											className="object-cover rounded-md"
										/>
									</div>
									<div className="flex-1">
										<Label className="block">{item.name}</Label>
										<p className="text-sm text-gray-500">
											{item.quantity}x R$ {item.price.toFixed(2)}
										</p>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeItem(item.id)}
										aria-label={`Remover ${item.name}`}
									>
										<Trash className="h-4 w-4"></Trash>
									</Button>
								</li>
							))}
						</ul>

						<div className="mt-4 border-t pt-2 flex justify-between font-semibold">
							<span>Total:</span>
							<span>R$ {total.toFixed(2)}</span>
						</div>
						<div className="mt-2 flex justify-end">
							<Button variant="destructive" size="sm" onClick={clear}>
								Limpar carrinho
							</Button>
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	);
};
