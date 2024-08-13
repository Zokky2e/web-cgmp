/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000", // specify the port if different
				pathname: "/api/polygon/**",
			},
		],
	},
};

export default nextConfig;
