import { AddressTable } from '@/features/dashboard/components/address-table';
import { OrderTable } from '@/features/dashboard/components/order-table';
import { getDashboardData } from '@/features/dashboard/api/get-dashboard-data';

export default async function DashboardView() {
	const { orders, addresses } = await getDashboardData();

	return (
		<div className="flex flex-col gap-4">
			<OrderTable orders={orders} />
			<AddressTable addresses={addresses} />
		</div>
	);
}
