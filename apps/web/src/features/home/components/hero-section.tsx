import { Button } from '@/components/ui/button/button';

export const HeroSection = () => {
	return (
		<section
			className="flex flex-col justify-center items-center min-h-screen w-full gap-2"
			style={{
				backgroundImage:
					"url('/home/adidas-ozweego.png'), url('/home/air-jordan.png'), url('/home/all-star.png')",
				backgroundPosition: 'left, center, right',
				backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
				backgroundSize: 'contain',
			}}
		>
			<h1 className="font-barlow-semi-condensed text-5xl text-zinc-50 font-medium italic text-shadow-lg/70">
				&quot;LOJA #1 DE SNEAKERS DO BRASIL – ONDE OS PÉS ENCONTRAM SEU
				ESTILO&quot;
			</h1>
			<h2 className="font-barlow-semi-condensed text-2xl text-zinc-200 font-medium italic text-shadow-lg/70 mb-8">
				&quot;Lançamentos exclusivos, edições limitadas e os clássicos que nunca
				saem de moda.&quot;
			</h2>
			<Button className="px-3.5 py-8 ring-2 drop-shadow-lg/60 ring-zinc-300 bg-red-800 text-xl font-barlow-semi-condensed font-bold hover:transition hover:delay-75 hover:scale-110 hover:bg-red-900">
				COMPRE AGORA
			</Button>
		</section>
	);
};
