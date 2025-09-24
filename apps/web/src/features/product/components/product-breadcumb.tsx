import Link from 'next/link';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbItem,
} from '@/components/ui/breadcrumb';

import useBradcrumb from '../hooks/use-breadcrumbs';
import { Fragment } from 'react';

export const ProductBreadcumb = () => {
	const breadcrumbs = useBradcrumb();
	return (
		<Breadcrumb>
			<BreadcrumbList className="text-lg font-barlow-semi-condensed">
				{breadcrumbs.map((link, index) => {
					const isLast = index === breadcrumbs.length - 1;
					return (
						<Fragment key={index}>
							{isLast ? (
								<BreadcrumbPage>{link.name}</BreadcrumbPage>
							) : (
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link href={link.href}>{link.name}</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
							)}
							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
