import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation/navigation-menu';

import Link from 'next/link';
import { UrlObject } from 'url';

export interface NavigationLink {
	href: string | UrlObject;
	label: string;
}

interface NavigationProps {
	links: NavigationLink[];
}
export const Navigation = ({ links }: NavigationProps) => {
	return (
		<NavigationMenu className="font-barlow-semi-condensed text-foreground tracking-wide">
			<NavigationMenuList className="gap-10">
				{links.map((link, index) => (
					<NavigationMenuItem key={index}>
						<NavigationMenuLink asChild>
							<Link href={link.href}>{link.label.toUpperCase()}</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
};
