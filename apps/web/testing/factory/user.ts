import { faker } from '@faker-js/faker';
import { User } from '@/gql/graphql';

export const createMockUser = (overrides?: Partial<User>): User => {
	return {
		__typename: 'User',
		id: faker.string.uuid(),
		addresses: [],
		createdAt: faker.date.past().toISOString(),
		email: faker.internet.email(),
		name: faker.internet.username(),
		orders: [],

		...overrides,
	};
};
