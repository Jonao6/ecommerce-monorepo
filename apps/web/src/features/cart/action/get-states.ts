'use server';
export interface IbgeState {
	id: number;
	sigla: string;
	nome: string;
}

export default async function getStates(): Promise<IbgeState[]> {
	const response = await fetch(
		'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
	);

	if (!response.ok) {
		throw new Error('Error ao buscar dados do IBGE');
	}
	const states: IbgeState[] = await response.json();

	return states;
}
