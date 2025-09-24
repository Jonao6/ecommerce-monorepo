'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Copy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export const CartPayment = () => {
	const pixCode =
		'00020126580014BR.GOV.BCB.PIX0136exemplo@seudominio.com.br52040000530398654';

	const [buttonText, setButtonText] = useState('COPIAR O CÓDIGO');
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyCode = () => {
		navigator.clipboard.writeText(pixCode).then(() => {
			setButtonText('CÓDIGO COPIADO!');
			setIsCopied(true);

			setTimeout(() => {
				setButtonText('COPIAR O CÓDIGO');
				setIsCopied(false);
			}, 2000);
		});
	};

	return (
		<div className="bg-white font-sans">
			<div className="max-w-3xl mx-auto p-6 md:p-8">
				<section className="border-b pb-6 mb-6">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
						OBRIGADO PELA COMPRA!
					</h1>
					<p className="text-sm text-gray-600">
						Protocolo do pedido:{' '}
						<span className="font-semibold text-gray-700">
							{/* {order.protocol} */}
						</span>
					</p>
					<p className="text-gray-600 mt-4 text-sm leading-relaxed">
						Enviamos um e-mail com os detalhes do seu pedido. Por favor,
						verifique sua caixa de entrada (e também a pasta de spam ou lixo
						eletrônico, se necessário) para acompanhar as instruções e
						atualizações.
					</p>
				</section>

				<section>
					<h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
						PAGAMENTO VIA PIX
					</h2>

					<div className="flex flex-col md:flex-row gap-8 items-start">
						<div className="flex-1 space-y-3 text-gray-600 text-sm">
							<p>
								{/* Como pagar com Pix (código **"copia e cola"** ou **QR Code**): */}
							</p>
							<ol className="list-decimal list-inside space-y-2">
								<li>
									{/* Acesse o aplicativo do seu banco ou instituição financeira de
									preferência. */}
								</li>
								{/* <li>Escolha a opção **"Pagar com Pix"**.</li> */}
								<li>
									{/* Selecione **"Copia e cola"** e insira o código fornecido, ou
									escaneie o QR Code com a câmera do seu celular. */}
								</li>
								<li>
									{/* Verifique atentamente todas as informações antes de confirmar. */}
								</li>
								<li>Autorize o pagamento.</li>
							</ol>
						</div>

						<div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 mx-auto md:mx-0">
							<Image
								src="/pix-qrcode-placeholder.svg"
								alt="QR Code para pagamento via PIX"
								width={192}
								height={192}
								className="rounded-lg"
							/>
						</div>
					</div>

					<div className="mt-6 flex items-start gap-3 bg-red-50 p-4 border-l-4 border-red-400 rounded-r-md">
						<AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
						<p className="text-sm text-red-800">
							<span className="font-bold">Importante:</span> o código Pix ou QR
							Code tem validade de <span className="font-bold">30 minutos</span>
							. Após esse prazo, será necessário gerar um novo.
						</p>
					</div>

					<div className="mt-6 flex flex-col sm:flex-row gap-2">
						<Button
							onClick={handleCopyCode}
							className={`w-full sm:w-auto px-6 h-12 text-sm font-bold transition-colors duration-300 ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
						>
							<Copy className="h-4 w-4 mr-2" />
							{buttonText}
						</Button>
						<div className="flex items-center w-full bg-gray-100 border rounded-md px-4 h-12 text-xs md:text-sm text-gray-700 overflow-x-auto">
							{pixCode}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};
