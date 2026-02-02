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
import Link from 'next/link';

export const HeaderCart = () => {
	const { items, clear, removeItem } = useCartStore();
	const total = totalPrice(items);

	return (
		<Popover>
			<PopoverTrigger aria-label="Abrir carrinho">
				<ShoppingBag className="size-7 cursor-pointer" />
			</PopoverTrigger>

			<PopoverContent className="w-80">
				{items.length === 0 ? (
					<p className="text-sm text-gray-500">Seu carrinho está vazio</p>
				) : (
					<>
						<ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
							{items.map((item) => (
								<li
									key={`${item.id}-${item.size}-${item.color}`}
									className="flex items-center gap-3"
								>
									<div className="relative w-12 h-12">
										<Image
											fill
											src={item.image}
											alt={item.name}
											className="object-cover rounded-md"
										/>
									</div>
									<div className="flex-1">
										<Link
											href={`/product/${item.id}`}
											className=" hover:text-zinc-500"
										>
											<Label className="block cursor-pointer">
												{item.name}
											</Label>
										</Link>
										<p className="text-sm text-gray-600">
											{item.quantity}x R$ {item.price}
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

						<div className="mt-4 border-t pt-2 flex justify-between font-semibold font-barlow-semi-condensed  text-lg">
							<span>Total:</span>
							<span className="tracking-wider">R$ {total.toFixed(2)}</span>
						</div>
						<div className="mt-2 flex justify-between font-barlow-semi-condensed">
							<Button variant="default" size="sm">
								<Link href={'/checkout'}>Continuar a compra</Link>
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={clear}
								className="cursor-pointer"
							>
								Limpar carrinho
							</Button>
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	);
};
