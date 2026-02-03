import { query } from '@/api/apollo';
import {
	MeDocument,
	MeQuery,
	UserAddressesDocument,
	UserAddressesQuery,
	UserOrdersDocument,
	UserOrdersQuery,
} from '@/gql/graphql';
import { redirect } from 'next/navigation';

type DashboardOrders = NonNullable<UserOrdersQuery['userOrders']>;
type DashboardAddresses = NonNullable<UserAddressesQuery['userAddresses']>;

interface DashboardData {
	userId: string;
	orders: DashboardOrders;
	addresses: DashboardAddresses;
}

export async function getDashboardData(): Promise<DashboardData> {
	const { data: meData } = await query<MeQuery>({ query: MeDocument });
	const userId = meData?.me?.id;

	if (!userId) {
		redirect('/');
	}

	const ordersPromise = query<UserOrdersQuery>({
		query: UserOrdersDocument,
	});

	const addressesPromise = query<UserAddressesQuery>({
		query: UserAddressesDocument,
	});

	const [ordersResult, addressesResult] = await Promise.all([
		ordersPromise,
		addressesPromise,
	]);

	return {
		userId,
		orders: ordersResult.data?.userOrders ?? [],
		addresses: addressesResult.data?.userAddresses ?? [],
	};
}
