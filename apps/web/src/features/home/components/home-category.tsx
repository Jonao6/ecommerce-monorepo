'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
		<Swiper
			spaceBetween={16}
			slidesPerView={1.2}
			breakpoints={{
				640: { slidesPerView: 2 },
				768: { slidesPerView: 3 },
				1024: { slidesPerView: 5 },
			}}
		>
			{categories.map((category, index) => (
				<SwiperSlide key={`${category.alt}-${index}`}>
					<Link href={category.href}>
						<div className="relative pb-[100%]">
							<Image
								src={category.src}
								alt={category.alt}
								fill
								sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
								className="object-cover rounded-lg"
							/>
						</div>
					</Link>
				</SwiperSlide>
			))}
		</Swiper>
	);
};
