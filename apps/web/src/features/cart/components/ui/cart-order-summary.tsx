import { useCartStore } from '@/store/cart-store';
import Image from 'next/image';
interface OrderSummaryProps {
	total: number;
	quantity: number;
	delivery: number;
}
export const OrderSummary = ({
	total,
	quantity,
	delivery,
}: OrderSummaryProps) => {
	const { items } = useCartStore();
	return (
		<div className="border rounded-lg p-6 lg:sticky lg:top-8 font-inter">
			<h2 className="text-lg font-semibold mb-4 text-gray-800 font-barlow-semi-condensed">
				SEU PEDIDO
			</h2>
			<div className="space-y-2 text-sm text-gray-600">
				<div className="flex justify-between">
					<span>{`${quantity} Produtos`}</span>
					<span>{total}</span>
				</div>
				<div className="flex justify-between">
					<span>Entrega</span>
					<span className="font-medium text-green-600">{`${delivery > 0 ? delivery : 'Grátis'}`}</span>
				</div>
			</div>
			<div className="border-t my-4"></div>
			<div className="flex justify-between font-bold text-lg text-gray-900">
				<span>Total</span>
				<span>R$3.000,00</span>
			</div>
			<div className="border-t my-4"></div>
			<div className="flex items-start space-x-4 mt-6">
				<div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0">
					<div className="text-sm">
						<ul>
							{items.map((item) => (
								<li key={item.id} className="flex flex-row">
									<Image src={item.url} fill alt={item.name} />
									<div className="flex flex-col">
										<div>
											<p>{item.name}</p>
											<p>{item.price}</p>
											<p>{item.size}</p>
											<p>{item.quantity}</p>
											<p>{item.color}</p>
										</div>
										<p>{`Tamanho: ${item.size}`}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
