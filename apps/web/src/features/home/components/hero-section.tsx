import Image from 'next/image';

export const HeroSection = () => {
	return (
		<section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-zinc-900">
			<div className="absolute inset-0 hidden xl:grid grid-cols-3 place-items-center">
				{[
					{ src: '/home/adidas-ozweego.png', alt: 'Adidas Ozweego' },
					{ src: '/home/air-jordan.png', alt: 'Air Jordan' },
					{ src: '/home/all-star.png', alt: 'All Star' },
				].map((img) => (
					<div
						key={img.src}
						className="
              relative w-full h-full
              aspect-3/4
              overflow-hidden
              shadow-2xl
            "
					>
						<Image
							src={img.src}
							alt={img.alt}
							fill
							priority
							className="object-cover"
						/>
					</div>
				))}
			</div>

			<div className="absolute inset-0 xl:hidden bg-[url('/home/air-jordan.png')] bg-center bg-cover bg-no-repeat" />

			<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/35 to-black/75" />

			<div className="relative z-10 max-w-5xl text-center px-6 py-16">
				<h1 className="font-barlow-semi-condensed text-3xl md:text-5xl text-zinc-50 font-semibold italic drop-shadow-lg">
					&quot;LOJA #1 DE SNEAKERS DO BRASIL – ONDE OS PÉS ENCONTRAM SEU
					ESTILO&quot;
				</h1>

				<h2 className="font-barlow-semi-condensed text-lg md:text-2xl text-zinc-200 font-medium italic mt-4 drop-shadow-md">
					&quot;Lançamentos exclusivos, edições limitadas e os clássicos que
					nunca saem de moda.&quot;
				</h2>
			</div>
		</section>
	);
};
