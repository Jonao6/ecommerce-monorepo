module.exports = {
	extends: [
		'next/core-web-vitals',
		'next/typescript',
		'plugin:@tanstack/query/recommended',
		'plugin:prettier/recommended',
		'plugin:storybook/recommended',
	],
	plugins: ['check-file', 'prettier'],
	overrides: [
		{
			files: ['src/**/*'],
			rules: {
				'check-file/filename-naming-convention': [
					'error',
					{
						'**/*.{ts,tsx}': 'KEBAB_CASE',
					},
					{
						ignoreMiddleExtensions: true,
					},
				],
				'check-file/folder-naming-convention': [
					'error',
					{
						'!(src/app)/**/*': 'KEBAB_CASE',
						'!(**/__tests__)/**/*': 'KEBAB_CASE',
					},
				],
				'import/no-restricted-paths': [
					'error',
					{
						zones: [
							{
								target: './src/features/cart',
								from: './src/features',
								except: ['./cart'],
							},
							{
								target: './src/features/products',
								from: './src/features',
								except: ['./products'],
							},
							{
								target: './src/features',
								from: './src/app',
							},
							{
								target: './src/features/search',
								from: './src/features',
								except: ['./search'],
							},
							{
								target: [
									'./src/components',
									'./src/hooks',
									'./src/lib',
									'./src/stores',
									'./src/types',
									'./src/utils',
								],
								from: ['./src/features', './src/app'],
							},
							{
								target: './src/features',
								from: './src/lib/graphql',
								except: ['./products/api', './cart/api'],
							},
						],
					},
				],
			},
		},
	],
};
