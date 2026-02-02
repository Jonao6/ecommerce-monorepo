import fs from 'node:fs';
import { graphql, HttpResponse } from 'msw';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import type { ExecutionResult } from 'graphql';
import type { ObjMap } from 'graphql/jsutils/ObjMap';
import { execute, parse } from 'graphql';
import { createMockProduct } from '../factory/product';
import { createMockAddress } from '../factory/address';
import { createMockOrder } from '../factory/orders';

const schemaString = fs.readFileSync('./schema.graphql', 'utf8');
const schema = makeExecutableSchema({ typeDefs: schemaString });

const autoMockSchema = addMocksToSchema({
	schema,
	mocks: {
		Product: () => createMockProduct(),
		Address: () => createMockAddress(),
		Order: () => createMockOrder(),
		Date: () => new Date().toISOString(),
	},
	preserveResolvers: false,
});

export const handlers = [
	graphql.operation<ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>>(
		async ({ query, variables }) => {
			const result = await execute({
				document: parse(query),
				schema: autoMockSchema,
				variableValues: variables,
			});
			return HttpResponse.json(result);
		},
	),
];
