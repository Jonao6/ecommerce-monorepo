import { query } from '@/api/apollo';
import { GET_PRODUCT_BY_ID } from '@/api/graphql/get-product';
import { ProductDetail } from '@/features/product/components/product-detail';
interface category {
	id: string;
	name: string;
}
interface Product {
	id: string;
	name: string;
	price: number;
	category: category;
	createdAt?: Date;
	url: string;
	image: string;
	colors?: string[];
	sizes?: number[];
}

interface GetProductData {
	product: Product;
}

interface GetProductVariables {
	id: string;
}

export default async function ProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const { data } = await query<GetProductData, GetProductVariables>({
		query: GET_PRODUCT_BY_ID,
		variables: {
			id: id,
		},
	});

	if (!data || !data.product) {
		return <div>Produto não encontrado.</div>;
	}

	const product = data.product;
	return (
		<div>
			<ProductDetail product={product} />
		</div>
	);
}
