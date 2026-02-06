import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL('https://res.cloudinary.com/djlxsef4y/**')],
	},
	async rewrites() {
		return [
			{
				source: '/api/me',
				destination:
					process.env.AUTHORIZATION_URI || 'http://localhost:4000/me',
			},
			{
				source: '/api/graphql',
				destination: process.env.GRAPHQL_URI || 'http://localhost:4000/graphql',
			},
		];
	},
};

export default nextConfig;
