import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [new URL('https://res.cloudinary.com/djlxsef4y/**')],
	},
};

export default nextConfig;
