import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL('https://res.cloudinary.com/djlxsef4y/**')],
	},
};

export default nextConfig;
