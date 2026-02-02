import { faker } from '@faker-js/faker';
import { Address } from '@/gql/graphql';
import { createMockUser } from './user';

export const createMockAddress = (overrides?: Partial<Address>): Address => {
	return {
		__typename: 'Address',
		id: faker.string.uuid(),
		city: faker.location.city(),
		state: faker.location.state({ abbreviated: true }),
		street: faker.location.street(),
		streetNumber: faker.location.buildingNumber(),
		postalCode: faker.location.zipCode(),
		complements: faker.helpers.arrayElement([
			'Bloco 3',
			'Casa',
			'Poste Laranja',
		]),
		country: 'Brasil',
		neighbor: faker.location.country(),
		createdAt: faker.date.past().toISOString(),
		user: {
			__typename: 'User',
			id: faker.string.uuid(),
			email: faker.internet.email(),
			name: faker.internet.username(),
		} as any,

		...overrides,
	};
};
