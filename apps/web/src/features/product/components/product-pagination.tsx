import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { useProductPaginationContext } from '../context/product-context';

export const ProductPagination = () => {
	const {
		currentPage,
		totalPages,
		setCurrentPage,
		hasNextPage,
		hasPreviousPage,
	} = useProductPaginationContext();
	const handlePrevious = () => {
		if (hasPreviousPage) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (hasNextPage) {
			setCurrentPage(currentPage + 1);
		}
	};

	if (totalPages <= 1) return null;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={handlePrevious}
						aria-label="Página anterior"
					/>
				</PaginationItem>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
					<PaginationItem key={page}>
						<PaginationLink
							onClick={() => setCurrentPage(page)}
							isActive={page === currentPage}
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext onClick={handleNext} aria-label="Próxima página" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
