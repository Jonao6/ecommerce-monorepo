'use client';
import { ProductFilter } from './product-filter';
import { ProductBreadcumb } from './product-breadcumb';

export const ProductHeader = () => {
	return (
		<div className="flex flex-col px-26">
			<ProductBreadcumb />
			<div className="flex flex-row justify-between">
				<h1 className="font-barlow-semi-condensed font-bold text-6xl">
					SNEAKERS
				</h1>
				<ProductFilter />
			</div>
		</div>
	);
};
