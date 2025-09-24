'use server';

export async function handleSubmit(formData: FormData) {
	const data = Object.fromEntries(formData.entries());

	if (Object.keys(data).length === 0) {
		console.error(
			"ERRO: FormData está vazio. Verifique os atributos 'name' no seu HTML.",
		);
	}
	console.log('SUCESSO: ', data);
	// ... sua lógica para salvar no banco de dados ...
}
