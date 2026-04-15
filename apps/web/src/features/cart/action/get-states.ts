export interface IbgeState {
	id: number;
	sigla: string;
	nome: string;
}

export default async function getStates(): Promise<IbgeState[]> {
	try {
		const response = await fetch(
			'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
			{
				cache: 'force-cache',
			},
		);

		if (!response.ok) {
			console.error('Erro ao buscar dados do IBGE');
			return [];
		}

		const states: IbgeState[] = await response.json();

		return states;
	} catch (error) {
		console.error('Erro ao buscar dados do IBGE:', error);
		return [];
	}
}
