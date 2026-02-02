import { useCartStore } from '@/store/cart-store';
import Image from 'next/image';

interface OrderSummaryProps {
	total: number;
	quantity: number;
	delivery: number;
}

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};

export const OrderSummary = ({
	total,
	quantity,
	delivery,
}: OrderSummaryProps) => {
	const { items } = useCartStore();

	const finalTotal = total + delivery;

	return (
		<div className="border rounded-lg p-6 lg:sticky lg:top-8 font-inter bg-white shadow-sm">
			<h2 className="text-lg font-semibold mb-4 text-gray-800 font-barlow-semi-condensed">
				SEU PEDIDO
			</h2>
			<div className="space-y-2 text-sm text-gray-600">
				<div className="flex justify-between">
					<span>{`${quantity} Produtos`}</span>
					<span>{formatCurrency(total)}</span>
				</div>
				<div className="flex justify-between">
					<span>Entrega</span>
					<span
						className={`font-medium ${delivery === 0 ? 'text-green-600' : 'text-gray-800'}`}
					>
						{delivery > 0 ? formatCurrency(delivery) : 'Grátis'}
					</span>
				</div>
			</div>

			<div className="border-t my-4"></div>

			<div className="flex justify-between font-bold text-lg text-gray-900">
				<span>Total</span>
				<span>{formatCurrency(finalTotal)}</span>
			</div>

			<div className="border-t my-4"></div>

			<div className="mt-6">
				<h3 className="text-sm font-medium text-gray-500 mb-3">
					Itens no carrinho
				</h3>
				<ul className="space-y-4">
					{items.map((item) => (
						<li
							key={`${item.id}-${item.size}-${item.color}`}
							className="flex items-start space-x-4"
						>
							<div className="relative w-20 h-20 bg-gray-100 rounded-md shrink-0 overflow-hidden border border-gray-200">
								<Image
									src={item.image}
									fill
									alt={item.name}
									className="object-cover"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>

							<div className="flex flex-col flex-1 gap-1">
								<div className="flex justify-between items-start">
									<p className="font-medium text-sm text-gray-900 line-clamp-2">
										{item.name}
									</p>
									<p className="font-semibold text-sm text-gray-900 ml-2">
										{formatCurrency(item.price)}
									</p>
								</div>

								<div className="text-xs text-gray-500 space-y-0.5">
									<p>Cor: {item.color}</p>
									<p>Tamanho: {item.size}</p>
									<p>Qtd: {item.quantity}</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
