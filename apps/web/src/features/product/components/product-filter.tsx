'use client';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { useQuery } from '@apollo/client/react';
import { GET_CATEGORIES } from '../api/get-categories';
import { Button } from '@/components/ui/button';
import { CategoryQuery, Category } from '../types/category';

export const ProductFilter = () => {
	const { data, loading } = useQuery<CategoryQuery>(GET_CATEGORIES);
	if (loading) return <h1>Wait</h1>;
	return (
		<Sheet>
			<SheetTrigger className="font-barlow-semi-condensed text-lg text-secondary bg-foreground py-3 px-20">
				FILTRAR
			</SheetTrigger>
			<SheetContent side="right" className="px-8">
				<SheetHeader>
					<SheetTitle>Filtrar</SheetTitle>
				</SheetHeader>
				{data?.categories.map((category: Category) => (
					<Button variant={'outline'} key={category.id}>
						{category.name}
					</Button>
				))}
				<Button variant={'default'}>Continuar</Button>
				<SheetClose>Fechar</SheetClose>
			</SheetContent>
		</Sheet>
	);
};
