import { usePathname } from 'next/navigation';
type Breadcrumb = {
	name: string;
	href: string;
};

export default function useBreadcrumb(): Breadcrumb[] {
	const pathName = usePathname();

	const pathSegments = pathName.split('/').filter(Boolean);

	const breadcumbs = pathSegments.map((segment, index) => {
		const path = `${pathSegments.slice(0, index + 1).join('')}`;

		const formattedName = segment
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());

		return {
			name: formattedName,
			href: path,
		};
	});
	return [{ name: 'Home', href: '/' }, ...breadcumbs];
}
