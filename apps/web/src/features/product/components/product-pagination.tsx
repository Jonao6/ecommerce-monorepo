import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { usePagination } from '../context/product-context';

export const ProductPagination = () => {
	const { currentPage, totalPages, setCurrentPage } = usePagination();

	const handlePrevious = () => {
		if (totalPages !== 0) {
			setCurrentPage(Math.max(0, currentPage - 1));
		}
	};

	const handleNext = () => {
		if (totalPages < currentPage) {
			setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
		}
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => handlePrevious}
						aria-label="Página anterior"
					/>
				</PaginationItem>
				{Array.from({ length: totalPages }, (_, i) => i).map((page) => (
					<PaginationItem key={page}>
						<PaginationLink
							onClick={() => setCurrentPage(page)}
							isActive={page === currentPage}
						>
							{page + 1}
						</PaginationLink>
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext
						onClick={() => handleNext}
						aria-label="Próxima página"
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
