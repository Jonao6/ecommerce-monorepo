import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { UserOrdersQuery } from '@/gql/graphql';
import { formatDate } from '@/lib/format-date';

type OrderItem = NonNullable<UserOrdersQuery['userOrders']>[number];

interface OrderTableProps {
	orders: OrderItem[];
}

const ENUM_STATUS: Record<string, string> = {
	paid: 'Pago',
	processing: 'Processando',
	pending: 'Pendente',
	card: 'Cartão de Crédito',
};

export const OrderTable = ({ orders }: OrderTableProps) => {
	return (
		<Table>
			<TableCaption>Pedidos do Usuário Autenticado</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Valor total</TableHead>
					<TableHead>Método de Pagamento</TableHead>
					<TableHead>Státus do Pagamento</TableHead>
					<TableHead>Quando foi Pago</TableHead>
					<TableHead>Status da Entrega</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.map((order) => (
					<TableRow key={order.id}>
						<TableCell>{order.id}</TableCell>
						<TableCell>{ENUM_STATUS[order.status]}</TableCell>
						<TableCell>{`R$ ${order.totalAmount}`}</TableCell>
						<TableCell>
							{ENUM_STATUS[order.payment?.paymentMethod ?? 'Status invalido']}
						</TableCell>
						<TableCell>
							{ENUM_STATUS[order.payment?.paymentStatus ?? 'Status invalido']}
						</TableCell>
						<TableCell>
							{order.payment?.paidAt
								? formatDate(order.payment.paidAt)
								: 'Aguardando'}
						</TableCell>
						<TableCell>{order.delivery?.status || 'Pendente'}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
