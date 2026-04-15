import getStates from '@/features/cart/action/get-states';
import { CartOrder } from '@/features/cart/components/cart-order';

export default async function Cart() {
	const states = await getStates();
	return (
		<main>
			<CartOrder
				states={
					states.length > 0
						? states
						: [
								{ id: 1, sigla: 'SP', nome: 'São Paulo' },
								{ id: 2, sigla: 'RJ', nome: 'Rio de Janeiro' },
								{ id: 3, sigla: 'MG', nome: 'Minas Gerais' },
								{ id: 4, sigla: 'BA', nome: 'Bahia' },
								{ id: 5, sigla: 'RS', nome: 'Rio Grande do Sul' },
								{ id: 6, sigla: 'PR', nome: 'Paraná' },
								{ id: 7, sigla: 'SC', nome: 'Santa Catarina' },
								{ id: 8, sigla: 'CE', nome: 'Ceará' },
								{ id: 9, sigla: 'PE', nome: 'Pernambuco' },
								{ id: 10, sigla: 'GO', nome: 'Goiás' },
							]
				}
			/>
		</main>
	);
}
