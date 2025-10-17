"use client"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation/navigation-menu';

import Link from 'next/link';

export interface NavigationLink {
	name: string
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
							<Link href={`/category/${link.name}`}>{link.name.toUpperCase()}</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
};
