import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from '@/testing/mocks/server';
import React from 'react';

type NextFormProps = {
	children?: React.ReactNode;
	action: (formData: FormData) => void | Promise<void>;
	className?: string;
};

vi.mock('next/form', () => ({
	default: ({ children, action, className }: NextFormProps) => (
		<form
			action={action}
			className={className}
			onSubmit={(e) => {
				e.preventDefault();
				action(new FormData(e.currentTarget));
			}}
		>
			{children}
		</form>
	),
}));

vi.mock('next/navigation', () => ({
	redirect: vi.fn(),
	useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: any) => {
		return React.createElement('img', {
			src: props.src || '',
			alt: props.alt || '',
			'data-testid': 'mock-image',
			style: props.fill
				? {
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}
				: props.style,
		});
	},
}));

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
	server.resetHandlers();
});

afterAll(() => server.close());
