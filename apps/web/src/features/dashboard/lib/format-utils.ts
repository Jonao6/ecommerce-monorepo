import { Address } from '../components/address-table';

export const formatFullAddress = (address: Address) => {
	const parts = [
		address.street,
		address.streetNumber,
		address.complements,
	].filter(Boolean);

	return parts.join(', ');
};

export const formatLocation = (address: Address) => {
	return `${address.city}, ${address.state} - CEP: ${address.postalCode}`;
};
