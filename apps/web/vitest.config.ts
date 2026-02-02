import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		pool: 'forks',
		fileParallelism: false,
		execArgv: [
			'--cpu-prof',
			'--cpu-prof-dir=test-runner-profile',
			'--heap-prof',
			'--heap-prof-dir=test-runner-profile',
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/features/**/*.tsx'],
			exclude: ['src/testing/**', '**/*.d.ts'],
		},
		projects: [
			{
				extends: true,
				test: {
					name: 'int/unit',
					environment: 'happy-dom',
					globals: true,
					setupFiles: [
						'./vitest.setup.tsx',
						'./testing/setup/apollo-rsc-mock.ts',
					],
					exclude: ['node_modules', '.next', 'e2e/**'],
				},
			},
			{
				extends: true,
				plugins: [
					storybookTest({
						configDir: path.join(dirname, '.storybook'),
					}),
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [
							{
								browser: 'chromium',
							},
						],
					},
					setupFiles: ['.storybook/vitest.setup.ts'],
				},
			},
		],
	},
});
