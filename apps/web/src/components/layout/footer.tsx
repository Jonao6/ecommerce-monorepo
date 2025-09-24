import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';
import Link from 'next/link';
import { InstagramIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
interface FooterProps {
	className?: ClassNameValue;
}

export const Footer = ({ className }: FooterProps) => {
	return (
		<footer
			className={cn(
				'w-full bg-background text-foreground px-6 py-10 border-t-2',
				className,
			)}
			aria-label="footer"
		>
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
					<div className="space-y-4">
						<h2 className="text-xl font-bold tracking-wider">
							<span className="sr-only">Sneakline</span>
							SNEAKLINE
						</h2>
						<p className="text-sm text-muted-foreground">
							Loja #1 de sneakers do Brasil
						</p>
					</div>
					<div className="space-y-4">
						<h3 className="text-base font-semibold">Ajuda</h3>
						<ul className="space-y-2">
							{[
								['Trocas & Devoluções', '#'],
								['Rastreamento', '#'],
								['Fale Conosco', '#'],
							].map(([label, href]) => (
								<li key={label}>
									<Link
										href={href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="text-base font-semibold">Sobre</h3>
						<ul className="space-y-2">
							{[
								['Nossa História', '#'],
								['Lojas parceiras', '#'],
								['Trabalhe Conosco', '#'],
							].map(([label, href]) => (
								<li key={label}>
									<Link
										href={href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="text-base font-semibold">Siga-nos</h3>
						<div className="flex flex-row gap-3">
							<Link
								href={'https://x.com/jonao66'}
								target="_blank"
								rel="noopener noreferrer"
							>
								<TwitterIcon className="text-sky-500" />
							</Link>
							<Link
								href={'https://www.instagram.com/jonao66/'}
								target="_blank"
								rel="noopener noreferrer"
							>
								<InstagramIcon className="text-pink-600" />
							</Link>
							<Link
								href={'https://www.linkedin.com/in/jonatas-eduardo/'}
								target="_blank"
								rel="noopener noreferrer"
							>
								<LinkedinIcon className="text-blue-700" />
							</Link>
						</div>
						<p className="text-sm text-muted-foreground">@sneakline.oficial</p>
					</div>
				</div>
				<div className="border-t border-muted pt-6 text-center text-sm text-muted-foreground">
					<p>© 2025 Sneakline. Todos os direitos reservados.</p>
					<div className="flex justify-center gap-4 mt-2">
						<Link
							href="#"
							className="hover:underline"
							aria-label="Política de Privacidade"
						>
							Política de Privacidade
						</Link>
						<Link
							href="#"
							className="hover:underline"
							aria-label="Termos de Uso"
						>
							Termos de Uso
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};
