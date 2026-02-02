export const formatDate = (timestamp: number | string) => {
	const date = new Date(Number(timestamp));

	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date);
};
