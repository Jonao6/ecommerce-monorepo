import Image from 'next/image';
import Link from 'next/link';

export type Category = {
	src: string;
	alt: string;
	href: string;
};

export type HomeCategoryProps = {
	categories: Category[];
};

export const HomeCategory = ({ categories }: HomeCategoryProps) => {
	return (
		<div
			className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 grid-rows-1`}
		>
			{categories.map((category, index) => (
				<div
					key={`${category.alt}-${index}`}
					className="w-full h-full transition-transform hover:scale-95"
				>
					<Link href={category.href}>
						<div className="relative pb-[100%]">
							<Image
								src={category.src}
								alt={category.alt}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
								className="object-cover"
							/>
						</div>
					</Link>
				</div>
			))}
		</div>
	);
};
