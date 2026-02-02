import { faker } from '@faker-js/faker';
import { Product, Category } from '@/gql/graphql';

export const createMockCategory = (overrides?: Partial<Category>): Category => {
	return {
		__typename: 'Category',
		id: faker.string.uuid(),
		name: faker.commerce.department(),
		createdAt: faker.date.past().toISOString(),
		products: [],
		...overrides,
	};
};

export const createMockProduct = (overrides?: Partial<Product>): Product => {
	const name = faker.commerce.productName();

	return {
		__typename: 'Product',
		id: faker.string.uuid(),
		name: name,
		description: faker.commerce.productDescription(),
		price: Number(faker.commerce.price({ min: 100, max: 900 })),
		createdAt: faker.date.past().toISOString(),
		image: faker.image.urlPicsumPhotos(),
		url: faker.helpers.slugify(name).toLowerCase(),
		sizes: faker.helpers.arrayElements([38, 39, 40, 41, 42, 43, 44], {
			min: 3,
			max: 6,
		}),
		colors: faker.helpers.arrayElements(
			['Preto', 'Branco', 'Vermelho', 'Azul', 'Cinza'],
			{ min: 1, max: 3 },
		),
		category: createMockCategory(),
		categoryId: faker.string.uuid(),
		...overrides,
	};
};
